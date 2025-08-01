from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new user"""
    try:
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # Validate input
        if not username or not email or not password:
            return jsonify({'error': 'جميع الحقول مطلوبة'}), 400
        
        if len(username) < 3:
            return jsonify({'error': 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'البريد الإلكتروني غير صحيح'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'اسم المستخدم موجود بالفعل'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'البريد الإلكتروني موجود بالفعل'}), 400
        
        # Create new user
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Set session
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'تم إنشاء الحساب بنجاح',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'اسم المستخدم وكلمة المرور مطلوبان'}), 400
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == username) | (User.email == username)
        ).first()
        
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'اسم المستخدم أو كلمة المرور غير صحيحة'}), 401
        
        # Set session
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'تم تسجيل الدخول بنجاح',
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'تم تسجيل الخروج بنجاح'})

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current logged in user"""
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'غير مسجل الدخول'}), 401
    
    user = User.query.get(user_id)
    if not user:
        session.clear()
        return jsonify({'error': 'المستخدم غير موجود'}), 404
    
    return jsonify({'user': user.to_dict()})

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    """Check if user is logged in"""
    user_id = session.get('user_id')
    return jsonify({
        'logged_in': user_id is not None,
        'user_id': user_id
    })

