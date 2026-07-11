"use client";

import { useState } from "react";
import { LogOut, User as UserIcon, Crown, Loader2 } from "lucide-react";
import { useUser } from "./user-provider";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { user, profile, loading, signOut, promptLogin } = useUser();
  const [portalLoading, setPortalLoading] = useState(false);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return <div className="h-8 w-20 animate-pulse rounded-md bg-secondary" />;
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={promptLogin}>
        <UserIcon className="h-4 w-4" /> Log ind
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {profile?.is_pro ? (
        <button
          onClick={openPortal}
          disabled={portalLoading}
          className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[10px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          title="Manage subscription"
        >
          {portalLoading ? (
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
          ) : (
            <Crown className="h-2.5 w-2.5" />
          )}
          Pro
        </button>
      ) : null}
      <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline">
        {user.email}
      </span>
      <Button variant="ghost" size="icon-sm" onClick={signOut} aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
