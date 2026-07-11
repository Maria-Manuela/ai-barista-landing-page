"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Heart, Flame, Moon, UserPlus } from "lucide-react";

interface SignupPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "limit" | "premium";
  onSignup: () => void;
}

const perks = [
  { icon: <Sparkles className="w-4 h-4" />, text: "Unlimited daily cups" },
  { icon: <Heart className="w-4 h-4" />, text: "Cup of Love — bold dating advice" },
  { icon: <Flame className="w-4 h-4" />, text: "Cup of Roast — lovingly savage teasing" },
  { icon: <Moon className="w-4 h-4" />, text: "Cup of Fortune — your future in the grounds" },
];

export function SignupPromptModal({
  open,
  onOpenChange,
  reason = "premium",
  onSignup,
}: SignupPromptModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {reason === "limit"
              ? "You've had your 3 free cups today"
              : "Members-only flavor"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {reason === "limit"
              ? "Sign up for a free account to keep brewing — unlimited cups and the secret menu."
              : "This cup is part of the secret menu. Create a free account to unlock it."}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-xl border border-border bg-secondary/40 p-4">
          <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
            Free account — no payment required
          </p>
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
          onClick={() => {
            onOpenChange(false);
            onSignup();
          }}
          size="lg"
          className="w-full"
        >
          <UserPlus className="h-4 w-4" /> Create free account
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          Takes 10 seconds. Email and password only.
        </p>
      </DialogContent>
    </Dialog>
  );
}
