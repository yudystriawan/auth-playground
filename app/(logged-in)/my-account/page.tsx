import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/data/users";
import TwoFactorAuthButton from "./_components/two-factor-auth-form";

const MyAccount = async () => {
  const user = await getCurrentUser();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className="text-muted-foreground">{user!.email}</div>
        <TwoFactorAuthButton twoFactorEnabled={user!.twoFactorEnabled} />
      </CardContent>
    </Card>
  );
};

export default MyAccount;
