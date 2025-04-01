"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUserSchema } from "@/validation/login-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { loginWithCredentials } from "../actions";

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    const response = await loginWithCredentials(data);

    if (!response.success) {
      toast.error(response.message ?? "Something went wrong");
      return;
    }

    toast.success(response.message ?? "Login successful");
    form.reset();
    router.push("/my-account");
  };

  const email = form.watch("email");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset
              className="flex flex-col gap-4"
              disabled={form.formState.isSubmitting}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} type="email" />
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
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {form.formState.isSubmitting && (
                  <Loader2Icon className="animate-spin" />
                )}
                Login
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Don&#39;t have an account?{" "}
          <Link href="/register" className="font-semibold underline">
            Register
          </Link>
        </div>
        <div className="text-muted-foreground text-sm">
          Forgot password?{" "}
          <Link
            href={`/forgot-password${
              email ? `?email=${encodeURIComponent(email)}` : ""
            }`}
            className="font-semibold underline"
          >
            Reset my password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
