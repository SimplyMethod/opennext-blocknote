"use client";

import { Bell, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="hidden md:flex md:w-1/3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex-1 md:hidden" />
        <h1 className="hidden text-lg font-semibold md:block">
          Welcome back, Admin
        </h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  2
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-sm">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Post Created</p>
                        <p className="text-sm text-muted-foreground">
                          A new post has been added to the system
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">System Update</p>
                        <p className="text-sm text-muted-foreground">
                          System update completed successfully
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Yesterday
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative"
                aria-label="Profile"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">Admin User</p>
                    <p className="text-sm text-muted-foreground">admin@example.com</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Profile Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Account Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive">
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 
