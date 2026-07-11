"use client";

import { useState } from "react";
import { Loader2, UserPlus, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Mode = "signup" | "signin";

export function SignupDialog({
  open,
  onOpenChange,
  defaultMode = "signup",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reset = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const supabase = createClient();
    if (!supabase) {
      setErrorMsg("Supabase is not configured.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
        setStatus("error");
        return;
      }
      // With "Confirm email" disabled in Supabase, the user is signed in immediately.
      onOpenChange(false);
      reset();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Sign up for unlimited cups and the secret menu."
              : "Sign in to pick up where you left off."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : mode === "signup" ? (
              <>
                <UserPlus className="h-4 w-4" /> Sign up
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Sign in
              </>
            )}
          </Button>

          {status === "error" && errorMsg && (
            <p className="text-xs text-destructive">{errorMsg}</p>
          )}
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => { setMode("signin"); reset(); }}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => { setMode("signup"); reset(); }}
              >
                Create an account
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
