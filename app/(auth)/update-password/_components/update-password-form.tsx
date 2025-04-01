"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordConfirmationSchema } from "@/validation/password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updatePassword } from "../actions";

const UpadtePasswordForm = (props: { token: string }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof passwordConfirmationSchema>>({
    resolver: zodResolver(passwordConfirmationSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof passwordConfirmationSchema>
  ) => {
    const response = await updatePassword({
      password: data.password,
      confirmPassword: data.confirmPassword,
      token: props.token,
    });

    if (!response.success) {
      toast.error(response.message ?? "Something went wrong");
      return;
    }

    toast.success("Password updated successfully");
    router.push("/login");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          className="flex flex-col gap-2"
          disabled={form.formState.isSubmitting}
        >
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="new password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="confirm password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update</Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default UpadtePasswordForm;
