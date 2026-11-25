"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { SignupDialog } from "./signup-dialog";

export interface Profile {
  id: string;
  email: string | null;
  is_pro: boolean;
  cups_used_today: number;
  usage_date: string;
}

interface UserContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isMember: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  promptSignup: (mode?: "signup" | "signin") => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupMode, setSignupMode] = useState<"signup" | "signin">("signup");

  const isMember = !!user && !user.is_anonymous;

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, is_pro, cups_used_today, usage_date")
        .eq("id", userId)
        .single();
      if (active) setProfile((data as Profile) ?? null);
    };

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      if (data.user) await loadProfile(data.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        await loadProfile(nextUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    const supabase = createClient();
    if (!supabase || !user) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, email, is_pro, cups_used_today, usage_date")
      .eq("id", user.id)
      .single();
    setProfile((data as Profile) ?? null);
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase?.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const promptSignup = (mode: "signup" | "signin" = "signup") => {
    setSignupMode(mode);
    setSignupOpen(true);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        isMember,
        refreshProfile,
        signOut,
        promptSignup,
      }}
    >
      {children}
      <SignupDialog
        open={signupOpen}
        onOpenChange={setSignupOpen}
        defaultMode={signupMode}
      />
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
