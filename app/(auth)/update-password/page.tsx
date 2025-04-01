import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";
import { redirect } from "next/navigation";
import UpadtePasswordForm from "./_components/update-password-form";
import { validateTokenResetPassword } from "./actions";

const UpdatePasswordPage = async (props: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchParams = await props.searchParams;
  const token = searchParams.token as string | null;

  if (!token) redirect("/");

  const isValidToken = await validateTokenResetPassword(token);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {isValidToken
            ? "Update Password"
            : "Your password reset link is invalid or has expired"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isValidToken ? (
          <UpadtePasswordForm token={token} />
        ) : (
          <div className="underline ">
            <Link href="/forgot-password">
              Request another password reset link
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordPage;
