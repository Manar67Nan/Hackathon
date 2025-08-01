import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Heart, 
  HeartOff, 
  MessageCircle, 
  TrendingUp, 
  Users,
  Star,
  ThumbsUp,
  ThumbsDown,
  BarChart3
} from 'lucide-react';

const VotingSystem = ({ opportunity, user, onVoteUpdate }) => {
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (user && opportunity) {
      fetchUserVote();
      fetchComments();
    }
  }, [user, opportunity]);

  const fetchUserVote = async () => {
    // In a real implementation, this would fetch the user's existing vote
    // For now, we'll simulate it
    setUserVote(null);
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/opportunities/${opportunity.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Use sample comments for demonstration
      setComments([
        {
          id: 1,
          username: 'أحمد المالكي',
          content: 'مشروع رائع ومناسب للمنطقة، أتمنى له النجاح',
          created_at: '2024-01-20T10:30:00Z'
        },
        {
          id: 2,
          username: 'فاطمة العسيري',
          content: 'فكرة مبتكرة وستساهم في تطوير السياحة في أبها',
          created_at: '2024-01-21T14:15:00Z'
        }
      ]);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      alert('يجب تسجيل الدخول أولاً للتصويت');
      return;
    }

    setIsVoting(true);
    try {
      const response = await fetch(`/api/opportunities/${opportunity.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          vote_type: voteType
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserVote(voteType);
        if (onVoteUpdate) {
          onVoteUpdate({
            likes_count: data.likes_count,
            community_acceptance: data.community_acceptance
          });
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Simulate successful vote for demonstration
      setUserVote(voteType);
      if (onVoteUpdate) {
        onVoteUpdate({
          likes_count: opportunity.likes_count + (voteType === 'like' ? 1 : 0),
          community_acceptance: opportunity.community_acceptance + (voteType === 'like' ? 2 : -1)
        });
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/opportunities/${opportunity.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          content: newComment.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Simulate successful comment for demonstration
      const newCommentObj = {
        id: Date.now(),
        username: user.username,
        content: newComment.trim(),
        created_at: new Date().toISOString()
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAcceptanceColor = (acceptance) => {
    if (acceptance >= 80) return 'text-green-600';
    if (acceptance >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAcceptanceIcon = (acceptance) => {
    if (acceptance >= 80) return <TrendingUp className="h-4 w-4" />;
    if (acceptance >= 60) return <BarChart3 className="h-4 w-4" />;
    return <ThumbsDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Voting Section */}
      <Card className="afaq-card border-0 afaq-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Users className="h-5 w-5" />
            <span>التقييم المجتمعي</span>
          </CardTitle>
          <CardDescription>
            شارك رأيك في هذا المشروع وساعد المجتمع في تقييمه
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Community Acceptance Score */}
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 flex items-center justify-center space-x-2 rtl:space-x-reverse ${getAcceptanceColor(opportunity.community_acceptance)}`}>
                {getAcceptanceIcon(opportunity.community_acceptance)}
                <span>{opportunity.community_acceptance}%</span>
              </div>
              <p className="text-sm text-gray-600">مؤشر القبول المجتمعي</p>
            </div>

            {/* Likes Count */}
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2 flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Heart className="h-6 w-6" />
                <span>{opportunity.likes_count}</span>
              </div>
              <p className="text-sm text-gray-600">إعجاب</p>
            </div>

            {/* Comments Count */}
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2 flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <MessageCircle className="h-6 w-6" />
                <span>{opportunity.comments_count}</span>
              </div>
              <p className="text-sm text-gray-600">تعليق</p>
            </div>
          </div>

          {/* Voting Buttons */}
          <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">
            <Button
              onClick={() => handleVote('like')}
              disabled={isVoting}
              variant={userVote === 'like' ? 'default' : 'outline'}
              className={userVote === 'like' ? 'bg-primary' : ''}
            >
              {userVote === 'like' ? (
                <Heart className="mr-2 h-4 w-4 fill-current" />
              ) : (
                <Heart className="mr-2 h-4 w-4" />
              )}
              أعجبني
            </Button>
            
            <Button
              onClick={() => handleVote('dislike')}
              disabled={isVoting}
              variant={userVote === 'dislike' ? 'destructive' : 'outline'}
            >
              {userVote === 'dislike' ? (
                <HeartOff className="mr-2 h-4 w-4 fill-current" />
              ) : (
                <HeartOff className="mr-2 h-4 w-4" />
              )}
              لا يعجبني
            </Button>
          </div>

          {!user && (
            <p className="text-center text-sm text-gray-500 mt-4">
              يجب تسجيل الدخول للتصويت والتعليق
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="afaq-card border-0 afaq-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <MessageCircle className="h-5 w-5" />
              <span>التعليقات ({comments.length})</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? 'إخفاء' : 'عرض'} التعليقات
            </Button>
          </div>
        </CardHeader>

        {showComments && (
          <CardContent>
            {/* Add Comment Form */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="اكتب تعليقك هنا..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows="3"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="afaq-gradient"
                  >
                    {isSubmittingComment ? 'جاري الإرسال...' : 'إرسال'}
                  </Button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  لا توجد تعليقات بعد. كن أول من يعلق!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {comment.username.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{comment.username}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Community Insights */}
      <Card className="afaq-card border-0 afaq-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <BarChart3 className="h-5 w-5" />
            <span>رؤى المجتمع</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">مستوى القبول</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ممتاز (80%+)</span>
                  <span className="text-green-600">
                    {opportunity.community_acceptance >= 80 ? '✓' : ''}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>جيد (60-79%)</span>
                  <span className="text-yellow-600">
                    {opportunity.community_acceptance >= 60 && opportunity.community_acceptance < 80 ? '✓' : ''}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>يحتاج تحسين (&lt;60%)</span>
                  <span className="text-red-600">
                    {opportunity.community_acceptance < 60 ? '✓' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">التفاعل</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>إجمالي التفاعل:</span>
                  <span className="font-medium">
                    {opportunity.likes_count + opportunity.comments_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>نسبة التعليقات:</span>
                  <span className="font-medium">
                    {opportunity.likes_count > 0 
                      ? Math.round((opportunity.comments_count / opportunity.likes_count) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VotingSystem;

