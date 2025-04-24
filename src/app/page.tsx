import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, User, AlertCircle } from "lucide-react";
import { getDb } from "@/lib/db";
import { posts } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";

// Default author information
const defaultAuthor = {
  name: "Admin",
  image: "/placeholder-avatar.jpg"
};

// Estimate reading time (based on content length)
function getReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Extract summary from markdown content
function getExcerpt(content: string, maxLength = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/#+\s+(.*)/g, '$1') // Headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // Images
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/\n/g, ' ') // Replace line breaks with spaces
    .trim();
  
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
}

// Extract tags from markdown content
function getTags(content: string): string[] {
  // This is a simple implementation, may need adjustment based on project requirements
  const defaultTags = ["BlockNote", "Next.js", "Blog"];
  
  // Add corresponding tags if content contains specific keywords
  const tags = [...defaultTags];
  if (content.toLowerCase().includes('react')) tags.push('React');
  if (content.toLowerCase().includes('css')) tags.push('CSS');
  if (content.toLowerCase().includes('tailwind')) tags.push('Tailwind');
  
  // Ensure tag uniqueness
  return [...new Set(tags)].slice(0, 3);
}

export default async function Home() {
  // Get posts from database
  const db = await getDb();
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
  
  // Handle case when there are no posts
  const hasNoPosts = allPosts.length === 0;
  
  // Process posts into the format needed by the frontend
  const formattedPosts = allPosts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: getExcerpt(post.content),
    content: post.content,
    date: format(new Date(Number(post.createdAt)), 'yyyy-MM-dd'),
    readTime: getReadTime(post.content),
    author: defaultAuthor,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    tags: getTags(post.content)
  }));
  
  // Get featured article and recent articles
  const featuredPost = formattedPosts[0];
  const recentPosts = formattedPosts.slice(1, 4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">BlockNote Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore the latest technologies and insights in web development, React ecosystem, and modern content editing
        </p>
      </header>

      {/* Display empty state when there are no posts */}
      {hasNoPosts ? (
        <div className="text-center py-20">
          <div className="inline-flex bg-muted p-5 rounded-full mb-5">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Posts Available Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            There are no blog posts published yet. Check back soon or create your first post!
          </p>
          <Button asChild>
            <Link href="/admin/posts/new">Create Your First Post</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredPost && (
            <section className="mb-16">
              <div className="relative overflow-hidden rounded-xl">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <Image 
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    fill
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex gap-2 mb-3">
                    {featuredPost.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    <Link href={`/posts/${featuredPost.slug}`} className="hover:underline decoration-2 underline-offset-4">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground mb-4 max-w-3xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={featuredPost.author.image} alt={featuredPost.author.name} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{featuredPost.author.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Recent Articles */}
          {recentPosts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Recent Articles</h2>
                <Button variant="outline" asChild>
                  <Link href="/posts">View All Articles</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                    <div className="relative aspect-video">
                      <Image 
                        src={post.coverImage}
                        alt={post.title}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex gap-2 mb-2">
                        {post.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl">
                        <Link href={`/posts/${post.slug}`} className="hover:underline decoration-2 underline-offset-4">
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {/* Space for excerpt */}
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Simple CTA Area */}
      <section className="mt-16 mb-8 bg-muted rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Subscribe to Our Latest Articles</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Get the latest development tips, tutorials, and insights delivered straight to your inbox
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow px-4 py-2 rounded-lg border border-input bg-background"
          />
          <Button>Subscribe</Button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
        <div className="flex justify-center gap-6 mb-6">
          <Link href="#" className="hover:text-foreground">About Us</Link>
          <Link href="#" className="hover:text-foreground">Contact</Link>
          <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
        </div>
        <p className="text-sm">© 2023 BlockNote Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}
