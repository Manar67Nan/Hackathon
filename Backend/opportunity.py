from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import hashlib
import json

db = SQLAlchemy()

class Opportunity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)  # Location within Asir region
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    sector = db.Column(db.String(50), nullable=False)  # tourism, agriculture, real estate, etc.
    budget_required = db.Column(db.Float, nullable=False)
    expected_roi = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(20), default='active')  # active, pending, approved, rejected
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # IP Protection fields
    ip_hash = db.Column(db.String(64), nullable=False)  # SHA-256 hash for IP protection
    ip_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_protected = db.Column(db.Boolean, default=True)
    
    # Community engagement
    likes_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    community_acceptance = db.Column(db.Float, default=0.0)  # 0-100 scale
    
    # Relationships
    owner = db.relationship('User', backref=db.backref('opportunities', lazy=True))
    votes = db.relationship('Vote', backref='opportunity', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='opportunity', lazy=True, cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        super(Opportunity, self).__init__(**kwargs)
        self.generate_ip_hash()

    def generate_ip_hash(self):
        """Generate IP protection hash"""
        content = {
            'title': self.title,
            'description': self.description,
            'owner_id': self.owner_id,
            'timestamp': self.ip_timestamp.isoformat() if self.ip_timestamp else datetime.utcnow().isoformat()
        }
        content_str = json.dumps(content, sort_keys=True)
        self.ip_hash = hashlib.sha256(content_str.encode()).hexdigest()

    def calculate_community_acceptance(self):
        """Calculate community acceptance score based on votes"""
        if not self.votes:
            return 0.0
        
        total_votes = len(self.votes)
        positive_votes = sum(1 for vote in self.votes if vote.vote_type == 'like')
        
        if total_votes == 0:
            return 0.0
        
        acceptance = (positive_votes / total_votes) * 100
        self.community_acceptance = round(acceptance, 2)
        return self.community_acceptance

    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'title': self.title,
            'location': self.location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'sector': self.sector,
            'budget_required': self.budget_required,
            'expected_roi': self.expected_roi,
            'status': self.status,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'likes_count': self.likes_count,
            'comments_count': self.comments_count,
            'community_acceptance': self.community_acceptance,
            'ip_timestamp': self.ip_timestamp.isoformat(),
            'is_protected': self.is_protected
        }
        
        if include_sensitive:
            data['description'] = self.description
            data['ip_hash'] = self.ip_hash
        else:
            # Only show partial description for protected content
            data['description'] = self.description[:100] + "..." if len(self.description) > 100 else self.description
            
        return data

    def __repr__(self):
        return f'<Opportunity {self.title}>'


class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunity.id'), nullable=False)
    vote_type = db.Column(db.String(10), nullable=False)  # 'like' or 'dislike'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure one vote per user per opportunity
    __table_args__ = (db.UniqueConstraint('user_id', 'opportunity_id', name='unique_user_opportunity_vote'),)
    
    user = db.relationship('User', backref=db.backref('votes', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'opportunity_id': self.opportunity_id,
            'vote_type': self.vote_type,
            'created_at': self.created_at.isoformat()
        }


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunity.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('comments', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'opportunity_id': self.opportunity_id,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'username': self.user.username if self.user else 'Unknown'
        }


class NDAAcceptance(db.Model):
    """Track NDA acceptances for IP protection"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunity.id'), nullable=False)
    accepted_at = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45), nullable=True)  # Store IP for legal purposes
    
    # Ensure one NDA acceptance per user per opportunity
    __table_args__ = (db.UniqueConstraint('user_id', 'opportunity_id', name='unique_user_opportunity_nda'),)
    
    user = db.relationship('User', backref=db.backref('nda_acceptances', lazy=True))
    opportunity = db.relationship('Opportunity', backref=db.backref('nda_acceptances', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'opportunity_id': self.opportunity_id,
            'accepted_at': self.accepted_at.isoformat(),
            'ip_address': self.ip_address
        }

