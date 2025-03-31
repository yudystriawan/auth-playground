import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-screen-sm w-xs">{children}</div>
    </div>
  );
};

export default Layout;
