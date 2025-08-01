from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.opportunity import Opportunity, Vote, Comment
import random

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    """Get AI-powered recommendations for a user"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Get user's voting history to understand preferences
        user_votes = Vote.query.filter_by(user_id=user_id, vote_type='like').all()
        voted_opportunity_ids = [vote.opportunity_id for vote in user_votes]
        
        # Get user's budget preference from query params
        max_budget = request.args.get('max_budget', type=float)
        preferred_sectors = request.args.getlist('sectors')
        preferred_locations = request.args.getlist('locations')
        
        # Build query for recommendations
        query = Opportunity.query.filter_by(status='active')
        
        # Exclude already voted opportunities
        if voted_opportunity_ids:
            query = query.filter(~Opportunity.id.in_(voted_opportunity_ids))
        
        # Apply filters
        if max_budget:
            query = query.filter(Opportunity.budget_required <= max_budget)
        
        if preferred_sectors:
            query = query.filter(Opportunity.sector.in_(preferred_sectors))
            
        if preferred_locations:
            query = query.filter(Opportunity.location.in_(preferred_locations))
        
        opportunities = query.all()
        
        # Simple AI scoring algorithm
        scored_opportunities = []
        for opp in opportunities:
            score = calculate_recommendation_score(opp, user_votes, max_budget)
            scored_opportunities.append({
                'opportunity': opp.to_dict(include_sensitive=False),
                'score': score,
                'reasons': get_recommendation_reasons(opp, user_votes, max_budget)
            })
        
        # Sort by score and return top recommendations
        scored_opportunities.sort(key=lambda x: x['score'], reverse=True)
        top_recommendations = scored_opportunities[:10]
        
        return jsonify({
            'recommendations': top_recommendations,
            'total_analyzed': len(opportunities),
            'user_preferences': {
                'max_budget': max_budget,
                'preferred_sectors': preferred_sectors,
                'preferred_locations': preferred_locations,
                'voting_history_count': len(user_votes)
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_recommendation_score(opportunity, user_votes, max_budget=None):
    """Calculate recommendation score for an opportunity"""
    score = 0
    
    # Base score from community acceptance
    score += opportunity.community_acceptance * 0.3
    
    # Score from likes ratio
    if opportunity.likes_count > 0:
        score += min(opportunity.likes_count * 2, 20)
    
    # Score from expected ROI
    if opportunity.expected_roi:
        score += min(opportunity.expected_roi, 25)
    
    # Budget compatibility score
    if max_budget and opportunity.budget_required <= max_budget:
        budget_ratio = opportunity.budget_required / max_budget
        score += (1 - budget_ratio) * 15  # Higher score for lower budget usage
    
    # Sector preference based on user's voting history
    if user_votes:
        user_sectors = []
        for vote in user_votes:
            voted_opp = Opportunity.query.get(vote.opportunity_id)
            if voted_opp:
                user_sectors.append(voted_opp.sector)
        
        if opportunity.sector in user_sectors:
            score += 20  # Bonus for preferred sector
    
    # Randomness factor to ensure variety
    score += random.uniform(0, 10)
    
    return round(score, 2)

def get_recommendation_reasons(opportunity, user_votes, max_budget=None):
    """Get reasons why this opportunity is recommended"""
    reasons = []
    
    if opportunity.community_acceptance >= 80:
        reasons.append("قبول مجتمعي عالي")
    
    if opportunity.expected_roi and opportunity.expected_roi >= 20:
        reasons.append("عائد استثماري مرتفع")
    
    if opportunity.likes_count >= 30:
        reasons.append("إعجاب كبير من المجتمع")
    
    if max_budget and opportunity.budget_required <= max_budget * 0.8:
        reasons.append("ضمن الميزانية المحددة")
    
    # Check if user has shown interest in this sector before
    if user_votes:
        user_sectors = []
        for vote in user_votes:
            voted_opp = Opportunity.query.get(vote.opportunity_id)
            if voted_opp:
                user_sectors.append(voted_opp.sector)
        
        if opportunity.sector in user_sectors:
            reasons.append("يتماشى مع اهتماماتك السابقة")
    
    if not reasons:
        reasons.append("فرصة واعدة في منطقة عسير")
    
    return reasons

@ai_bp.route('/trending', methods=['GET'])
def get_trending_opportunities():
    """Get trending opportunities based on recent activity"""
    try:
        # Get opportunities with high recent activity
        opportunities = Opportunity.query.filter_by(status='active').all()
        
        trending_opportunities = []
        for opp in opportunities:
            # Calculate trending score based on recent votes and comments
            trending_score = calculate_trending_score(opp)
            if trending_score > 0:
                trending_opportunities.append({
                    'opportunity': opp.to_dict(include_sensitive=False),
                    'trending_score': trending_score
                })
        
        # Sort by trending score
        trending_opportunities.sort(key=lambda x: x['trending_score'], reverse=True)
        
        return jsonify({
            'trending_opportunities': trending_opportunities[:5],
            'total_analyzed': len(opportunities)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_trending_score(opportunity):
    """Calculate trending score based on recent activity"""
    score = 0
    
    # Base score from community metrics
    score += opportunity.likes_count * 2
    score += opportunity.comments_count * 3
    score += opportunity.community_acceptance * 0.5
    
    # Bonus for high engagement ratio
    if opportunity.likes_count > 0:
        engagement_ratio = opportunity.comments_count / opportunity.likes_count
        score += engagement_ratio * 10
    
    return round(score, 2)

@ai_bp.route('/insights/<int:opportunity_id>', methods=['GET'])
def get_opportunity_insights(opportunity_id):
    """Get AI insights for a specific opportunity"""
    try:
        opportunity = Opportunity.query.get_or_404(opportunity_id)
        
        insights = {
            'market_potential': analyze_market_potential(opportunity),
            'risk_assessment': analyze_risk_factors(opportunity),
            'success_factors': identify_success_factors(opportunity),
            'similar_opportunities': find_similar_opportunities(opportunity),
            'investment_advice': generate_investment_advice(opportunity)
        }
        
        return jsonify({
            'opportunity_id': opportunity_id,
            'insights': insights
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def analyze_market_potential(opportunity):
    """Analyze market potential for the opportunity"""
    potential = "متوسط"
    factors = []
    
    if opportunity.sector == 'سياحة':
        potential = "عالي"
        factors.append("منطقة عسير وجهة سياحية مهمة")
        factors.append("نمو مستمر في قطاع السياحة")
    elif opportunity.sector == 'زراعة':
        potential = "عالي"
        factors.append("مناخ مناسب للزراعة في عسير")
        factors.append("طلب متزايد على المنتجات العضوية")
    elif opportunity.sector == 'تقنية':
        potential = "عالي جداً"
        factors.append("توجه الحكومة نحو التحول الرقمي")
        factors.append("نقص في الخدمات التقنية بالمنطقة")
    
    return {
        'level': potential,
        'factors': factors
    }

def analyze_risk_factors(opportunity):
    """Analyze risk factors for the opportunity"""
    risk_level = "منخفض"
    factors = []
    
    if opportunity.budget_required > 20000000:
        risk_level = "متوسط"
        factors.append("استثمار كبير يتطلب دراسة جدوى دقيقة")
    
    if opportunity.community_acceptance < 70:
        risk_level = "متوسط إلى عالي"
        factors.append("قبول مجتمعي منخفض قد يؤثر على النجاح")
    
    if not factors:
        factors.append("مخاطر محدودة مع التخطيط الجيد")
    
    return {
        'level': risk_level,
        'factors': factors
    }

def identify_success_factors(opportunity):
    """Identify key success factors"""
    factors = []
    
    if opportunity.community_acceptance >= 80:
        factors.append("دعم مجتمعي قوي")
    
    if opportunity.expected_roi and opportunity.expected_roi >= 15:
        factors.append("عائد استثماري جذاب")
    
    if opportunity.location in ['أبها', 'خميس مشيط']:
        factors.append("موقع استراتيجي في مدينة رئيسية")
    
    factors.append("خبرة فريق العمل")
    factors.append("دراسة السوق المحلي")
    factors.append("التسويق الفعال")
    
    return factors

def find_similar_opportunities(opportunity):
    """Find similar opportunities for comparison"""
    similar = Opportunity.query.filter(
        Opportunity.sector == opportunity.sector,
        Opportunity.id != opportunity.id,
        Opportunity.status == 'active'
    ).limit(3).all()
    
    return [opp.to_dict(include_sensitive=False) for opp in similar]

def generate_investment_advice(opportunity):
    """Generate AI-powered investment advice"""
    advice = []
    
    if opportunity.community_acceptance >= 85:
        advice.append("فرصة ممتازة مع دعم مجتمعي قوي")
    elif opportunity.community_acceptance >= 70:
        advice.append("فرصة جيدة تستحق الدراسة")
    else:
        advice.append("يُنصح بدراسة أسباب انخفاض القبول المجتمعي")
    
    if opportunity.expected_roi and opportunity.expected_roi >= 20:
        advice.append("عائد استثماري مرتفع ومجزي")
    
    if opportunity.budget_required > 30000000:
        advice.append("استثمار كبير يتطلب شراكات استراتيجية")
    
    advice.append("التواصل مع صاحب المشروع لمناقشة التفاصيل")
    advice.append("إجراء دراسة جدوى مستقلة")
    
    return advice

