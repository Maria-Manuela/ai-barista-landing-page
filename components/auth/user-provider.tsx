"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { LoginDialog } from "./login-dialog";

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
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  promptLogin: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false); // Supabase not configured yet — act as logged out.
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

  const promptLogin = () => setLoginOpen(true);

  return (
    <UserContext.Provider
      value={{ user, profile, loading, refreshProfile, signOut, promptLogin }}
    >
      {children}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
