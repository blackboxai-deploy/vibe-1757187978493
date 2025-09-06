'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Post, Comment, LocalDatabase } from '@/lib/database';
import { CATEGORIES, EMOJI_REACTIONS, VOTING_TYPES, ANONYMOUS_NAME } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
  showComments?: boolean;
  showReactions?: boolean;
  showVoting?: boolean;
  compact?: boolean;
}

export default function PostCard({ 
  post, 
  onUpdate,
  showComments = false,
  showReactions = false, 
  showVoting = false,
  compact = false 
}: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVote, setUserVote] = useState<string | null>(null);

  const category = Object.values(CATEGORIES).find(cat => cat.id === post.category);
  
  useEffect(() => {
    if (showComments) {
      loadComments();
    }
    if (showReactions) {
      loadReactions();
    }
    if (showVoting && post.isVoting) {
      loadVotes();
    }
  }, [post.id, showComments, showReactions, showVoting]);

  const loadComments = () => {
    const postComments = LocalDatabase.getCommentsByPostId(post.id);
    setComments(postComments);
  };

  const loadReactions = () => {
    const reactionCounts = LocalDatabase.getReactionCounts(post.id);
    const userReactionData = LocalDatabase.getUserReactionForPost(post.id);
    setReactions(reactionCounts);
    setUserReaction(userReactionData?.type || null);
  };

  const loadVotes = () => {
    const voteCounts = LocalDatabase.getVoteCounts(post.id);
    const userVoteData = LocalDatabase.getUserVoteForPost(post.id);
    setVotes(voteCounts);
    setUserVote(userVoteData?.optionId || null);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    LocalDatabase.createComment({
      postId: post.id,
      content: newComment.trim(),
      authorName: isAnonymousComment ? undefined : commentAuthor.trim() || undefined,
      isAnonymous: isAnonymousComment
    });

    setNewComment('');
    setCommentAuthor('');
    setIsAnonymousComment(false);
    setShowAddComment(false);
    loadComments();
    onUpdate?.();
  };

  const handleReaction = (reactionType: string) => {
    LocalDatabase.toggleReaction(post.id, reactionType as any);
    loadReactions();
    onUpdate?.();
  };

  const handleVote = (optionId: string) => {
    LocalDatabase.createVote(post.id, optionId);
    loadVotes();
    onUpdate?.();
  };

  const getVotingOptions = () => {
    if (!post.votingType) return [];
    return VOTING_TYPES[post.votingType.toUpperCase() as keyof typeof VOTING_TYPES].options;
  };

  const getTotalVotes = () => {
    return Object.values(votes).reduce((sum, count) => sum + count, 0);
  };

  const getVotePercentage = (optionId: string) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round(((votes[optionId] || 0) / total) * 100);
  };

  return (
    <Card className={`
      group hover:shadow-xl transition-all duration-300 border-0 shadow-lg
      bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm
      hover:transform hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/30
      ${compact ? 'p-4' : 'p-6'}
    `}>
      <CardHeader className={compact ? 'p-0 pb-3' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {category && (
                <Badge 
                  className={`
                    px-3 py-1 text-sm font-medium rounded-full
                    bg-gradient-to-r from-emerald-100 to-teal-100 
                    text-emerald-700 border-0 hover:scale-105 transition-transform duration-200
                  `}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Badge>
              )}
              
              {post.isVoting && (
                <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0">
                  🗳️ Voting
                </Badge>
              )}
            </div>
            
            <h3 className={`
              font-poppins font-semibold text-gray-800 leading-tight
              ${compact ? 'text-lg' : 'text-xl mb-2'}
              group-hover:text-emerald-700 transition-colors duration-300
            `}>
              {post.title}
            </h3>
            
            {post.target && (
              <div className="mb-2">
                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                  📍 {post.target}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'p-0 py-2' : 'py-4'}>
        <p className={`
          text-gray-700 leading-relaxed
          ${compact ? 'text-sm line-clamp-2' : 'text-base mb-4'}
        `}>
          {post.content}
        </p>

        {/* Voting Section */}
        {showVoting && post.isVoting && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              🗳️ Voting: {post.votingType === 'binary' ? 'Setuju/Tidak Setuju' : 'Skala 1-5'}
            </h4>
            
            <div className="space-y-3">
              {getVotingOptions().map((option) => {
                const voteCount = votes[option.id] || 0;
                const percentage = getVotePercentage(option.id);
                const isSelected = userVote === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    className={`
                      w-full p-3 rounded-xl text-left transition-all duration-300
                      border-2 hover:scale-[1.02] hover:shadow-md
                      ${isSelected 
                        ? 'border-blue-400 bg-blue-100 text-blue-800 shadow-md transform scale-[1.02]' 
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{option.emoji}</span>
                        <span className="font-medium">{option.label}</span>
                        {isSelected && <span className="text-blue-600">✓</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        {voteCount} ({percentage}%)
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 text-center text-sm text-gray-600">
              Total: {getTotalVotes()} suara
            </div>
          </div>
        )}

        {/* Reactions Section */}
        {showReactions && (
          <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
            <div className="flex flex-wrap gap-2">
              {Object.entries(EMOJI_REACTIONS).map(([key, reaction]) => {
                const count = reactions[reaction.name] || 0;
                const isSelected = userReaction === reaction.name;
                
                return (
                  <button
                    key={key}
                    onClick={() => handleReaction(reaction.name)}
                    className={`
                      flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium
                      transition-all duration-300 hover:scale-110
                      ${isSelected 
                        ? 'bg-pink-200 text-pink-800 shadow-md transform scale-110' 
                        : 'bg-white text-gray-700 hover:bg-pink-100'
                      }
                    `}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className={`${compact ? 'p-0 pt-3' : 'pt-4'} border-t border-gray-100/50`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              👤 {post.isAnonymous ? ANONYMOUS_NAME : (post.authorName || ANONYMOUS_NAME)}
            </span>
            <span className="flex items-center">
              🕒 {formatDistanceToNow(new Date(post.createdAt), { 
                addSuffix: true,
                locale: id 
              })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {showComments && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddComment(!showAddComment)}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                💬 {comments.length}
              </Button>
            )}
          </div>
        </div>

        {/* Add Comment Form */}
        {showAddComment && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
            <Textarea
              placeholder="Tulis komentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border-gray-200 focus:border-emerald-400"
            />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="anonymous-comment"
                  checked={isAnonymousComment}
                  onCheckedChange={(checked) => setIsAnonymousComment(checked as boolean)}
                />
                <label htmlFor="anonymous-comment" className="text-sm text-gray-600">
                  Anonim
                </label>
              </div>
              
              {!isAnonymousComment && (
                <Input
                  placeholder="Nama (opsional)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="max-w-xs border-gray-200 focus:border-emerald-400"
                />
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddComment(false)}
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Kirim
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {showComments && comments.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-gray-700">Komentar ({comments.length})</h4>
            {comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    👤 {comment.isAnonymous ? ANONYMOUS_NAME : (comment.authorName || ANONYMOUS_NAME)}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt), { 
                      addSuffix: true,
                      locale: id 
                    })}
                  </span>
                </div>
              </div>
            ))}
            {comments.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{comments.length - 3} komentar lainnya
              </p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}