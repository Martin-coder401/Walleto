import os
from datetime import datetime, timedelta
from decimal import Decimal

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
database_url = os.getenv('DATABASE_URL', 'sqlite:///walleto.db')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-this-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
db = SQLAlchemy(app)
JWTManager(app)
frontend_origins = [origin.strip() for origin in os.getenv(
    'FRONTEND_ORIGIN',
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174',
).split(',') if origin.strip()]
CORS(app, origins=frontend_origins)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    budgets = db.relationship('Budget', backref='owner', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', backref='owner', cascade='all, delete-orphan')


class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(80), nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    spent = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)

    def as_dict(self):
        return {'id': self.id, 'category': self.category, 'amount': float(self.amount), 'spent': float(self.spent)}


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(160), nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    occurred_on = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)

    def as_dict(self):
        return {'id': self.id, 'description': self.description, 'amount': float(self.amount),
                'category': self.category, 'occurred_on': self.occurred_on.isoformat()}


def current_user_id():
    return int(get_jwt_identity())


def guest_user_id():
    guest = User.query.filter_by(email='guest@walleto.local').first()
    if not guest:
        guest = User(email='guest@walleto.local', password_hash=generate_password_hash(os.urandom(32).hex()))
        db.session.add(guest)
        db.session.commit()
    return guest.id


@app.get('/api/health')
def health():
    return jsonify({'status': 'ok'})


@app.get('/')
def index():
    return jsonify({'name': 'Walleto API', 'status': 'running', 'health': '/api/health'})


@app.post('/api/auth/register')
def register():
    payload = request.get_json(silent=True) or {}
    email = payload.get('email', '').strip().lower()
    password = payload.get('password', '')
    if not email or len(password) < 8:
        return jsonify({'error': 'A valid email and password of at least 8 characters are required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with that email already exists'}), 409
    user = User(email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({'token': create_access_token(identity=str(user.id)), 'email': user.email}), 201


@app.post('/api/auth/login')
def login():
    payload = request.get_json(silent=True) or {}
    user = User.query.filter_by(email=payload.get('email', '').strip().lower()).first()
    if not user or not check_password_hash(user.password_hash, payload.get('password', '')):
        return jsonify({'error': 'Invalid email or password'}), 401
    return jsonify({'token': create_access_token(identity=str(user.id)), 'email': user.email})


@app.route('/api/budgets', methods=['GET', 'POST'])
@jwt_required(optional=True)
def budgets():
    user_id = current_user_id() if get_jwt_identity() else guest_user_id()
    if request.method == 'GET':
        return jsonify([budget.as_dict() for budget in Budget.query.filter_by(user_id=user_id).order_by(Budget.id)])
    payload = request.get_json(silent=True) or {}
    try:
        budget = Budget(category=payload['category'].strip(), amount=Decimal(str(payload['amount'])),
                        spent=Decimal(str(payload.get('spent', 0))), user_id=user_id)
    except (KeyError, ValueError, TypeError):
        return jsonify({'error': 'category and numeric amount are required'}), 400
    db.session.add(budget)
    db.session.commit()
    return jsonify(budget.as_dict()), 201


@app.route('/api/budgets/<int:budget_id>', methods=['PATCH', 'DELETE'])
@jwt_required(optional=True)
def budget_detail(budget_id):
    user_id = current_user_id() if get_jwt_identity() else guest_user_id()
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first_or_404()
    if request.method == 'DELETE':
        db.session.delete(budget)
    else:
        payload = request.get_json(silent=True) or {}
        if 'category' in payload:
            budget.category = payload['category'].strip()
        if 'amount' in payload:
            budget.amount = Decimal(str(payload['amount']))
        if 'spent' in payload:
            budget.spent = Decimal(str(payload['spent']))
    db.session.commit()
    return ('', 204) if request.method == 'DELETE' else jsonify(budget.as_dict())


@app.route('/api/transactions', methods=['GET', 'POST'])
@jwt_required(optional=True)
def transactions():
    user_id = current_user_id() if get_jwt_identity() else guest_user_id()
    if request.method == 'GET':
        return jsonify([item.as_dict() for item in Transaction.query.filter_by(user_id=user_id).order_by(Transaction.occurred_on.desc())])
    payload = request.get_json(silent=True) or {}
    try:
        transaction = Transaction(description=payload['description'].strip(), category=payload['category'].strip(),
                                  amount=Decimal(str(payload['amount'])), user_id=user_id)
        if payload.get('occurred_on'):
            transaction.occurred_on = datetime.fromisoformat(payload['occurred_on']).date()
    except (KeyError, ValueError, TypeError):
        return jsonify({'error': 'description, category, and numeric amount are required'}), 400
    db.session.add(transaction)
    db.session.commit()
    return jsonify(transaction.as_dict()), 201


@app.route('/api/transactions/<int:transaction_id>', methods=['PATCH', 'DELETE'])
@jwt_required(optional=True)
def transaction_detail(transaction_id):
    user_id = current_user_id() if get_jwt_identity() else guest_user_id()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first_or_404()
    if request.method == 'DELETE':
        db.session.delete(transaction)
    else:
        payload = request.get_json(silent=True) or {}
        for field in ('description', 'category'):
            if field in payload:
                setattr(transaction, field, payload[field].strip())
        if 'amount' in payload:
            transaction.amount = Decimal(str(payload['amount']))
        if 'occurred_on' in payload:
            transaction.occurred_on = datetime.fromisoformat(payload['occurred_on']).date()
    db.session.commit()
    return ('', 204) if request.method == 'DELETE' else jsonify(transaction.as_dict())


with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5000')), debug=os.getenv('FLASK_DEBUG', '0') == '1')