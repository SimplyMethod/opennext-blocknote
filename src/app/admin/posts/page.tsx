import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Eye, Plus, Trash } from "lucide-react";

// Sample post data
const posts = [
  {
    id: 1,
    title: "Getting Started with BlockNote",
    status: "Published",
    date: "2023-09-15",
    views: 245,
  },
  {
    id: 2,
    title: "Advanced BlockNote Features",
    status: "Published",
    date: "2023-09-10",
    views: 1245,
  },
  {
    id: 3,
    title: "BlockNote Tips and Tricks",
    status: "Draft",
    date: "2023-09-05",
    views: 0,
  },
  {
    id: 4,
    title: "Integrating BlockNote with React",
    status: "Published",
    date: "2023-08-28",
    views: 897,
  },
  {
    id: 5,
    title: "BlockNote vs Other Editors",
    status: "Draft",
    date: "2023-08-20",
    views: 0,
  },
];

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            A list of all your published and draft posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      post.status === "Published" 
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {post.status}
                    </div>
                  </TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell className="text-right">{post.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
