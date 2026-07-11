"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

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
  signingIn: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Signs the visitor in as an anonymous guest (no email required). */
  signInAsGuest: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const signingInRef = useRef(false);

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

  const signInAsGuest = async () => {
    if (signingInRef.current || user) return;
    const supabase = createClient();
    if (!supabase) return;
    signingInRef.current = true;
    setSigningIn(true);
    try {
      await supabase.auth.signInAnonymously();
      // onAuthStateChange picks up the new session and loads the profile.
    } finally {
      signingInRef.current = false;
      setSigningIn(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        signingIn,
        refreshProfile,
        signOut,
        signInAsGuest,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
