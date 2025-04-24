import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { posts, type NewPost } from '@/drizzle/schema';
import { nanoid } from 'nanoid';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const db = await getDb();
    
    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    
    const formattedPosts = allPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      status: "Published", 
      views: 0, 
      date: new Date(Number(post.createdAt)).toISOString().split('T')[0]
    }));
    
    return NextResponse.json({ 
      posts: formattedPosts
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      title: string;
      slug: string;
      content: string;
      featuredImage?: string;
    };
    const { title, slug, content } = body;
    
    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // Check if slug already exists
    const existingPost = await db.select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.slug, slug))
      .get();
    
    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }
    
    // Create post
    const postId = nanoid();
    
    const newPost: NewPost = {
      id: postId,
      title,
      content,
      slug,
    };
    
    const result = await db.insert(posts).values(newPost).returning().get();
    
    return NextResponse.json({ 
      success: true, 
      post: result
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the post' },
      { status: 500 }
    );
  }
} 
