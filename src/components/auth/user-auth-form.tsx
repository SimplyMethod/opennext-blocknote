"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { PasswordInput } from "@/components/auth/password-input";
import {
  SignInData,
  signInSchema,
  SignUpData,
  signUpSchema,
  userAuthData,
} from "@/components/auth/schema";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isSignup = type === "register";
  const router = useRouter();

  const form = useForm<userAuthData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    resolver: zodResolver(isSignup ? signUpSchema : signInSchema),
  });

  const onSubmit = async (values: userAuthData) => {
    if (isSignup) {
      await authClient.signUp.email(values as SignUpData, {
        onRequest: () => setIsLoading(true),
        onResponse: () => setIsLoading(false),
        onError: (ctx) => {
          toast("Sign up failed", {
            description: ctx.error.message,
          });
        },
        onSuccess: () => {
          toast("Account created", {
            description: "Account created successfully",
          });
          router.push("/");
        },
      });
    } else {
      await authClient.signIn.email(values as SignInData, {
        onRequest: () => setIsLoading(true),
        onResponse: () => setIsLoading(false),
        onError: (ctx) => {
          toast("Authentication failed", {
            description: ctx.error.message,
          });
        },
        onSuccess: async () => {
          router.push("/");
        },
      });
    }
  };


  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {isSignup && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(isLoading && "opacity-50")}
                      placeholder="Your Name"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="name"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(isLoading && "opacity-50")}
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {type === "register"
                ? "Sign Up with Email"
                : "Sign In with Email"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
