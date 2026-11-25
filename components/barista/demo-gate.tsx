"use client";

import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DailyCup } from "@/components/barista/daily-cup";

const DEMO_EMAIL = "demo@herningkaffe.dk";
const DEMO_PASSWORD = "kaffe1234";

export function DemoGate() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      email.trim().toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      setError(null);
      setSignedIn(true);
      return;
    }
    setError("Hmm, det passer ikke. Use the demo credentials shown below.");
  }

  function handleLogout() {
    setSignedIn(false);
    setError(null);
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  if (signedIn) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
          <span className="flex items-center gap-2 min-w-0">
            <UserRound className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate text-muted-foreground">
              Logged in as <span className="text-foreground font-medium">Demo Guest</span>
            </span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="shrink-0"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Log out
          </Button>
        </div>
        <DailyCup />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
      aria-labelledby="demo-login-title"
    >
      <div className="flex flex-col gap-1.5">
        <span className="self-start text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
          Demo login
        </span>
        <h2 id="demo-login-title" className="text-xl font-semibold tracking-tight">
          Log ind for din Daily Cup
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is a demo. No real account is created and nothing is stored.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-email">Email</Label>
        <Input
          id="demo-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-base"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-password">Password</Label>
        <Input
          id="demo-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-base"
          required
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full">
        Log ind
      </Button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Demo credentials are pre-filled:
        <br />
        <span className="font-mono">{DEMO_EMAIL}</span> /{" "}
        <span className="font-mono">{DEMO_PASSWORD}</span>
      </p>
    </form>
  );
}
