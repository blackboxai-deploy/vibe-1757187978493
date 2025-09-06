import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostsByCategory, createPost, updatePostReaction, updatePostVote } from '@/lib/database';
import { PostFormData, PostCategory, ApiResponse, Post } from '@/lib/types';

// GET /api/posts - Get all posts or filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as PostCategory;
    
    let posts: Post[];
    
    if (category) {
      posts = await getPostsByCategory(category);
    } else {
      posts = await getAllPosts();
    }
    
    const response: ApiResponse<Post[]> = {
      success: true,
      data: posts
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch posts'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body: PostFormData = await request.json();
    
    // Validation
    if (!body.content || body.content.trim().length < 10) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Content must be at least 10 characters long'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    if (!body.isAnonymous && (!body.author || body.author.trim().length < 2)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name is required for non-anonymous posts'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    // Create post data
    const postData = {
      category: body.category,
      title: body.title?.trim(),
      content: body.content.trim(),
      author: body.isAnonymous ? 'Anonim' : body.author.trim(),
      isAnonymous: body.isAnonymous,
      target: body.target?.trim() || (body.category === 'kritik-saran' ? 'Ke Pengurus' : undefined)
    };
    
    const newPost = await createPost(postData);
    
    const response: ApiResponse<Post> = {
      success: true,
      data: newPost,
      message: 'Post created successfully'
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create post'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PATCH /api/posts - Update post reactions or votes
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, action, emoji, voteType } = body;
    
    if (!postId || !action) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'postId and action are required'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    let updatedPost: Post | null = null;
    
    if (action === 'reaction' && emoji) {
      updatedPost = await updatePostReaction(postId, emoji, true);
    } else if (action === 'vote' && voteType) {
      updatedPost = await updatePostVote(postId, voteType);
    } else {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid action or missing parameters'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    if (!updatedPost) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Post not found'
      };
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: ApiResponse<Post> = {
      success: true,
      data: updatedPost,
      message: 'Post updated successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating post:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update post'
    };
    return NextResponse.json(response, { status: 500 });
  }
}