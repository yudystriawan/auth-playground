import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "./_components/login-form";

const LoginPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
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
          <Link href={`/forgot-password`} className="font-semibold underline">
            Reset my password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
