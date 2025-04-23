import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, User } from "lucide-react";

// Sample blog post data
const featuredPost = {
  id: 1,
  title: "Create Modern Content Editing Experience with BlockNote",
  excerpt: "BlockNote is a powerful block editor providing a Notion-like experience. This article will show you how to integrate BlockNote into your Next.js project.",
  date: "2023-11-15",
  readTime: "6 min read",
  author: {
    name: "Jane Smith",
    image: "/placeholder-avatar.jpg"
  },
  coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
  tags: ["React", "Editor", "Next.js"]
};

const recentPosts = [
  {
    id: 2,
    title: "New Features and Improvements in Next.js 15",
    excerpt: "Explore the new features and performance improvements in Next.js 15, and learn how to upgrade your projects.",
    date: "2023-10-28",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1576444356170-66073046b1bc?q=80&w=2070",
    tags: ["Next.js", "React", "Web Development"]
  },
  {
    id: 3,
    title: "Building Responsive Interfaces with Tailwind CSS",
    excerpt: "Learn how to leverage Tailwind CSS utility classes to quickly build beautiful and responsive user interfaces.",
    date: "2023-10-15",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031",
    tags: ["CSS", "Tailwind", "Design"]
  },
  {
    id: 4,
    title: "Best Practices for High-Performance React Applications",
    excerpt: "Dive deep into optimizing React application performance and avoid common pitfalls and mistakes.",
    date: "2023-10-05",
    readTime: "7 min read",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
    tags: ["React", "Performance", "JavaScript"]
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">BlockNote Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore the latest technologies and insights in web development, React ecosystem, and modern content editing
        </p>
      </header>

      {/* Featured Article */}
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
              <Link href={`/posts/${featuredPost.id}`} className="hover:underline decoration-2 underline-offset-4">
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

      {/* Recent Articles */}
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
                  <Link href={`/posts/${post.id}`} className="hover:underline decoration-2 underline-offset-4">
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
