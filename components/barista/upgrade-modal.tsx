"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Loader2, Sparkles, Heart, Flame, Moon } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "limit" | "premium";
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

const perks = [
  { icon: <Sparkles className="w-4 h-4" />, text: "Unlimited daily cups — brew whenever du vil" },
  { icon: <Heart className="w-4 h-4" />, text: "Cup of Love — bold Danglish dating advice" },
  { icon: <Flame className="w-4 h-4" />, text: "Cup of Roast — get savagely teased (lovingly)" },
  { icon: <Moon className="w-4 h-4" />, text: "Cup of Fortune — your future in the coffee grounds" },
];

export function UpgradeModal({
  open,
  onOpenChange,
  reason = "premium",
  isLoggedIn,
  onRequireLogin,
}: UpgradeModalProps) {
  const [status, setStatus] = useState<"idle" | "redirecting" | "error">("idle");

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      onOpenChange(false);
      onRequireLogin();
      return;
    }
    setStatus("redirecting");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Stripe-hosted Checkout (test mode)
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (status === "redirecting" ? null : onOpenChange(o))}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
            <Crown className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center text-xl">
            {reason === "limit"
              ? "Din gratis kande er tom!"
              : "Unlock the Barista Pro menu"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {reason === "limit"
              ? "You've sipped all your free cups for today. Go Pro for unlimited brews og de hemmelige flavors."
              : "This is a premium flavor. Go Pro to unlock the full secret menu."}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-xl border border-border bg-secondary/40 p-4">
          <div className="mb-3 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">29 kr</span>
            <span className="text-sm text-muted-foreground">/ måned</span>
          </div>
          <ul className="flex flex-col gap-2.5">
            {perks.map((perk) => (
              <li key={perk.text} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-foreground/90">{perk.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={handleUpgrade}
          disabled={status === "redirecting"}
          size="lg"
          className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
        >
          {status === "redirecting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sender dig til kassen...
            </>
          ) : (
            <>
              <Crown className="h-4 w-4" />
              {isLoggedIn ? "Go Pro — Upgrade now" : "Log ind for at opgradere"}
            </>
          )}
        </Button>

        {status === "error" && (
          <p className="text-center text-xs text-destructive">
            Kunne ikke starte checkout. Check your Stripe config and try again.
          </p>
        )}

        <p className="text-center text-[11px] text-muted-foreground">
          Stripe test mode — brug kort 4242 4242 4242 4242, enhver fremtidig dato og CVC.
        </p>
      </DialogContent>
    </Dialog>
  );
}
