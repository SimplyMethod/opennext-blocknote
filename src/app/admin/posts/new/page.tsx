"use client";

import { useState } from "react";
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

// Dynamically import the BlockNote editor to avoid server-side rendering issues
const DynamicEditor = dynamic(() => import("@/components/DynamicEditor"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full border rounded-md bg-muted flex items-center justify-center">Loading editor...</div>,
});

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  featuredImage: z.string().optional(),
});

export default function NewPostPage() {
  const [editorContent, setEditorContent] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      featuredImage: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({
      ...values,
      content: editorContent,
    });
    
    toast.success("Post created successfully!");
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
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)}>
          <Save className="mr-2 h-4 w-4" />
          Save Post
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                Write your post content using the rich text editor below
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
                      <DynamicEditor onChange={setEditorContent} />
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
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={form.handleSubmit(onSubmit)}>Publish</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
