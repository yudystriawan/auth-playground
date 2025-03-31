"use client";

import { logout } from "@/app/(auth)/actions";
import { Button } from "./ui/button";

const LogoutButton = () => {
  return (
    <Button onClick={() => logout()} variant="outline">
      Logout
    </Button>
  );
};

export default LogoutButton;
