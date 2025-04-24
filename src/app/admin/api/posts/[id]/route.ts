import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { posts } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;

    if (!id) {
      return NextResponse.json({error: 'Missing post ID'}, {status: 400});
    }

    const db = await getDb();

    // Get the post
    const post = await db.select().from(posts).where(eq(posts.id, id)).get();

    if (!post) {
      return NextResponse.json({error: 'Post not found'}, {status: 404});
    }

    return NextResponse.json(
      {
        post,
      },
      {status: 200}
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      {error: 'An error occurred while fetching the post'},
      {status: 500}
    );
  }
}
