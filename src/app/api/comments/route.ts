import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByPostId, createComment, updateCommentReaction } from '@/lib/database';
import { CommentFormData, ApiResponse, Comment } from '@/lib/types';

// GET /api/comments - Get comments by post ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'postId is required'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const comments = await getCommentsByPostId(postId);
    
    const response: ApiResponse<Comment[]> = {
      success: true,
      data: comments
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching comments:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch comments'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/comments - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body: CommentFormData = await request.json();
    
    // Validation
    if (!body.postId || !body.content || body.content.trim().length < 5) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Valid postId and content (min 5 characters) are required'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    if (!body.isAnonymous && (!body.author || body.author.trim().length < 2)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name is required for non-anonymous comments'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    // Create comment data
    const commentData = {
      postId: body.postId,
      content: body.content.trim(),
      author: body.isAnonymous ? 'Anonim' : body.author.trim(),
      isAnonymous: body.isAnonymous
    };
    
    const newComment = await createComment(commentData);
    
    const response: ApiResponse<Comment> = {
      success: true,
      data: newComment,
      message: 'Comment created successfully'
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create comment'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PATCH /api/comments - Update comment reactions
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, emoji, increment = true } = body;
    
    if (!commentId || !emoji) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'commentId and emoji are required'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const updatedComment = await updateCommentReaction(commentId, emoji, increment);
    
    if (!updatedComment) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Comment not found'
      };
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: ApiResponse<Comment> = {
      success: true,
      data: updatedComment,
      message: 'Comment updated successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating comment:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update comment'
    };
    return NextResponse.json(response, { status: 500 });
  }
}