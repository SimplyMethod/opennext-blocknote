import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { posts } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// DELETE endpoint for deleting posts
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing post ID' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // Check if the post exists
    const post = await db.select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, id))
      .get();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete the post
    await db.delete(posts).where(eq(posts.id, id)).run();
    
    return NextResponse.json({ 
      success: true,
      message: 'Post deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the post' },
      { status: 500 }
    );
  }
}

// PATCH endpoint for updating posts
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as {
      title?: string;
      content?: string;
      slug?: string;
    };
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing post ID' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // Check if the post exists
    const post = await db.select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, id))
      .get();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // If a new slug is provided, check if it already exists
    if (body.slug) {
      const existingPost = await db.select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, body.slug))
        .get();
      
      if (existingPost && existingPost.id !== id) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update the post
    const updateData: Partial<typeof posts.$inferInsert> = {};
    
    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.slug) updateData.slug = body.slug;
    
    const updatedPost = await db.update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning()
      .get();
    
    return NextResponse.json({ 
      success: true,
      post: updatedPost
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the post' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving post details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing post ID' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // Get the post
    const post = await db.select()
      .from(posts)
      .where(eq(posts.id, id))
      .get();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      post
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the post' },
      { status: 500 }
    );
  }
} 
