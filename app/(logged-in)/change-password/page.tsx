import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePasswordForm from "./_components/change-password-form";

const ChangePasswordPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
};

export default ChangePasswordPage;
