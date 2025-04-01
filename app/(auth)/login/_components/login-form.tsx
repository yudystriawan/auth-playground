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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { loginUserSchema } from "@/validation/login-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { loginWithCredentials, preLoginCheck } from "../actions";

const LoginForm = () => {
  const router = useRouter();

  const [has2fa, setHas2fa] = useState<boolean>(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const preLoginCheckResponse = await preLoginCheck(data);

    if (!preLoginCheckResponse.success) {
      toast.error(preLoginCheckResponse.message ?? "Something went wrong");
      setIsSubmitting(false);
      return;
    }

    const twoFactorEnabled = preLoginCheckResponse?.twoFactorEnabled ?? false;
    setHas2fa(twoFactorEnabled);

    if (!twoFactorEnabled) {
      const response = await loginWithCredentials(data);

      setIsSubmitting(false);

      if (!response.success) {
        toast.error(response.message ?? "Something went wrong");
        return;
      }

      toast.success(response.message ?? "Login successful");
      form.reset();
      router.push("/my-account");
    }

    setIsSubmitting(false);
  };

  const onOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const response = await loginWithCredentials({ ...form.getValues(), otp });

    setIsSubmitting(false);

    if (!response.success) {
      toast.error(response.message ?? "Something went wrong");
      return;
    }

    toast.success(response.message ?? "Login successful");
    form.reset();
    router.push("/my-account");
  };

  if (has2fa) {
    return (
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          Enter the 6-digit OTP displayed in your Authenticator app.
        </p>
        <form className="flex flex-col gap-4" onSubmit={onOTPSubmit}>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" disabled={otp.length !== 6 || isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Verify OTP
          </Button>
        </form>
      </div>
    );
  }

  return (
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
                  <Input placeholder="Password" {...field} type="password" />
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
  );
};

export default LoginForm;
