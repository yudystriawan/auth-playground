import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!!session?.user?.id) redirect("/my-account");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-screen-sm w-xs">{children}</div>
    </div>
  );
};

export default Layout;
