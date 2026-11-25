"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import { useUser } from "./user-provider";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { user, loading, signOut, promptSignup } = useUser();

  if (loading) {
    return <div className="h-8 w-24 animate-pulse rounded-md bg-secondary" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" onClick={() => promptSignup("signin")}>
          Sign in
        </Button>
        <Button variant="outline" size="sm" onClick={() => promptSignup("signup")}>
          <UserIcon className="h-4 w-4" /> Sign up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground sm:inline">
        {user.email}
      </span>
      <Button variant="ghost" size="icon-sm" onClick={signOut} aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
