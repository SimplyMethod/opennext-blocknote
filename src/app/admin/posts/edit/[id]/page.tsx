"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";

// Dynamically import the BlockNote editor to avoid server-side rendering issues
const DynamicEditor = dynamic(() => import("@/components/DynamicEditor"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full border rounded-md bg-muted flex items-center justify-center">Loading editor...</div>,
});

// Define Post interface
interface Post {
  title: string;
  slug: string;
  content: string;
  [key: string]: string | number | boolean | object | null; // 更具體的類型定義
}

interface PostResponse {
  post: Post;
  error?: string;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  featuredImage: z.string().optional(),
});

export default function EditPostPage() {
  const [editorContent, setEditorContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      featuredImage: "",
    },
  });

  // Load post data
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/admin/api/posts/${postId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json() as PostResponse;
        
        // Set form default values
        form.reset({
          title: data.post.title,
          slug: data.post.slug,
          featuredImage: "", // May be added in the future
        });
        
        // Set editor content
        setEditorContent(data.post.content);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
        router.push('/admin/posts');
      }
    }
    
    fetchPost();
  }, [postId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!editorContent) {
      toast.error("Post content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/admin/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          content: editorContent,
        }),
      });
      
      const data = await response.json() as PostResponse;
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }
      
      toast.success("Post updated successfully!");
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/posts">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        </div>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Post
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                Edit your post content using the rich text editor below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Post" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <div className="h-[400px] border rounded-md">
                      <DynamicEditor onChange={setEditorContent} initialContent={editorContent} />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <CardDescription>
                Configure post metadata and publishing options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-8">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="my-awesome-post" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/posts')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Update Post"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 
