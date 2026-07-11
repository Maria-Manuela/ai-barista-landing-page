"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  CupSoda,
  Flame,
  MessageCircle,
  Sparkles,
  RefreshCw,
  Heart,
  Moon,
  Lock,
  BookOpen,
} from "lucide-react";
import { SignupPromptModal } from "./signup-prompt-modal";
import { useUser } from "@/components/auth/user-provider";
import { useCupSelection, freeCups } from "./cup-selection";
const premiumCups = ["love", "roast", "fortune"] as const;
type CupType = (typeof freeCups)[number] | (typeof premiumCups)[number];

const FREE_DAILY_LIMIT = 3;
const GUEST_USAGE_KEY = "barista_guest_usage";

interface CupConfig {
  name: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  badgeBg: string;
  premium?: boolean;
  intros: string[];
}

const cupConfig: Record<CupType, CupConfig> = {
  wisdom: {
    name: "Cup of Wisdom",
    tagline: "Deep but sassy life advice",
    icon: <Sparkles className="w-5 h-5" />,
    color: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-400/40",
    badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    intros: [
      "Wham! You got a Cup of Wisdom! Drop everything and listen...",
      "Hold up — Cup of Wisdom incoming. Put the coffee down.",
      "Bing bong! Your Cup of Wisdom is ready. The world can wait.",
    ],
  },
  gossip: {
    name: "Cup of Gossip",
    tagline: "Funny, fictional Herning drama",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-400/40",
    badgeBg: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    intros: [
      "Boom! Cup of Gossip — lean in, this is juicy...",
      "Oh. My. God. Cup of Gossip. MCH has never seen drama like this.",
      "Shhh! Come closer... your Cup of Gossip is served.",
    ],
  },
  fuel: {
    name: "Read Your Cup",
    tagline: "A message written just for you",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-400/40",
    badgeBg: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    intros: [
      "Your cup has been read. Here's what it says...",
      "The grounds have spoken — Read Your Cup:",
      "Slow down. Sip this. Read Your Cup:",
    ],
  },
  love: {
    name: "Cup of Love",
    tagline: "Bold dating advice",
    icon: <Heart className="w-5 h-5" />,
    color: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-400/40",
    badgeBg: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    premium: true,
    intros: [
      "Ah, love! Your Cup of Love is ready — sit down, darling...",
      "Cupid called. It's a Cup of Love. Listen carefully.",
      "Heart alarm! Your Cup of Love is served.",
    ],
  },
  roast: {
    name: "Cup of Roast",
    tagline: "Get savagely teased (lovingly)",
    icon: <Flame className="w-5 h-5" />,
    color: "text-red-600 dark:text-red-400",
    borderColor: "border-red-500/40",
    badgeBg: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    premium: true,
    intros: [
      "Uh oh. You ordered a Cup of Roast. Hope you can take the heat...",
      "Dark roast, extra brutal. Your Cup of Roast is brewing...",
      "You asked for it — Cup of Roast, no milk to soften it.",
    ],
  },
  fortune: {
    name: "Cup of Fortune",
    tagline: "Your future in the grounds",
    icon: <Moon className="w-5 h-5" />,
    color: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-400/40",
    badgeBg: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    premium: true,
    intros: [
      "I see something in the grounds... your Cup of Fortune reveals itself.",
      "The crystal ball is a coffee cup today — Cup of Fortune, coming up.",
      "Fate calls from Birk Centerpark... your Cup of Fortune awaits.",
    ],
  },
};

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getGuestUsage(): number {
  try {
    const raw = localStorage.getItem(GUEST_USAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date: string; count: number };
    return parsed.date === todayKey() ? parsed.count : 0;
  } catch {
    return 0;
  }
}

function incrementGuestUsage(): void {
  const count = getGuestUsage() + 1;
  localStorage.setItem(
    GUEST_USAGE_KEY,
    JSON.stringify({ date: todayKey(), count })
  );
}

export function DailyCup() {
  const { user, profile, loading: userLoading, isMember, refreshProfile, promptSignup } =
    useUser();
  const { selectedCup } = useCupSelection();

  const [activeCup, setActiveCup] = useState<CupType | null>(null);
  const [intro, setIntro] = useState<string>("");
  const [serveCount, setServeCount] = useState(0);
  const [guestUsed, setGuestUsed] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<"limit" | "premium">("premium");

  const memberUsed = profile?.cups_used_today ?? 0;
  const usedToday = isMember ? memberUsed : guestUsed;
  const remaining = isMember
    ? null
    : Math.max(0, FREE_DAILY_LIMIT - usedToday);
  const limitReached = !isMember && (remaining ?? 0) <= 0;

  // Hydrate guest usage from localStorage on mount.
  useEffect(() => {
    setGuestUsed(getGuestUsage());
  }, []);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/daily-cup",
    onFinish: () => {
      if (isMember) void refreshProfile();
      else {
        incrementGuestUsage();
        setGuestUsed(getGuestUsage());
      }
    },
    onError: (err) => {
      const msg = err.message ?? "";

      // Try to parse JSON error from the API response body.
      try {
        const payload = JSON.parse(msg) as { error?: string; message?: string };
        if (payload.error === "signup_required" || payload.error === "premium_locked") {
          setModalReason("premium");
          setModalOpen(true);
          return;
        }
        if (payload.error === "limit_reached") {
          setModalReason("limit");
          setModalOpen(true);
          return;
        }
        if (payload.error === "ai_quota" || payload.error === "ai_credits") {
          toast.error(
            payload.message ??
              "AI quota reached. Wait a minute and try again."
          );
          return;
        }
        if (payload.error === "ai_not_configured") {
          toast.error("AI not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local");
          return;
        }
        if (payload.message) {
          toast.error(payload.message);
          return;
        }
      } catch {
        /* not JSON — check plain text */
      }

      if (/quota|RESOURCE_EXHAUSTED|429|rate.?limit/i.test(msg)) {
        toast.error("Gemini free-tier limit reached. Wait ~1 minute and try again.");
      } else if (/500|failed|error/i.test(msg)) {
        toast.error("Could not brew your cup. Check the server logs or your AI API key.");
      } else {
        toast.error("Something went wrong brewing your cup. Try again.");
      }
    },
  });

  const brew = useCallback(
    async (cup: CupType) => {
      const config = cupConfig[cup];
      setActiveCup(cup);
      setIntro(pickRandom(config.intros));
      setServeCount((c) => c + 1);
      await complete("serve", { body: { cupType: cup } });
    },
    [complete]
  );

  const serveSelected = useCallback(() => {
    if (cupConfig[selectedCup].premium && !isMember) {
      setModalReason("premium");
      setModalOpen(true);
      return;
    }
    if (limitReached) {
      setModalReason("limit");
      setModalOpen(true);
      return;
    }
    brew(selectedCup);
  }, [selectedCup, isMember, limitReached, brew]);

  const servePremium = useCallback(
    (cup: CupType) => {
      if (!isMember) {
        setModalReason("premium");
        setModalOpen(true);
        return;
      }
      brew(cup);
    },
    [isMember, brew]
  );

  const config = activeCup ? cupConfig[activeCup] : null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Status bar */}
      <div className="flex items-center justify-between text-xs">
        {userLoading ? (
          <span className="h-6 w-32 animate-pulse rounded-full bg-secondary" />
        ) : isMember ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
            <CupSoda className="h-3.5 w-3.5" /> Member — unlimited cups
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium text-muted-foreground">
            <CupSoda className="h-3.5 w-3.5" />
            {remaining} of {FREE_DAILY_LIMIT} free cups left today
          </span>
        )}
      </div>

      {/* Serve button */}
      <button
        onClick={serveSelected}
        disabled={isLoading}
        aria-label="Serve my cup"
        className="group relative w-full rounded-2xl bg-primary text-primary-foreground font-semibold text-lg py-5 px-8 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/30"
      >
        <CupSoda
          className={`w-6 h-6 transition-transform duration-500 ${isLoading ? "animate-bounce" : "group-hover:rotate-12"}`}
        />
        <span>
          {isLoading
            ? "Brewing your cup..."
            : limitReached
            ? "Daily limit reached — sign up free"
            : serveCount === 0
            ? "Serve My Cup"
            : "Serve Another Cup"}
        </span>
        {isLoading && (
          <RefreshCw className="w-4 h-4 animate-spin ml-1 opacity-70" />
        )}
      </button>

      {/* Members-only secret menu */}
      <div className="rounded-2xl border border-border bg-secondary/30 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Secret menu — members only
          </span>
          {!isMember && (
            <button
              type="button"
              onClick={() => {
                setModalReason("premium");
                setModalOpen(true);
              }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Sign up to unlock
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {premiumCups.map((cup) => {
            const c = cupConfig[cup];
            return (
              <button
                key={cup}
                type="button"
                onClick={() => servePremium(cup)}
                disabled={isLoading}
                className="group relative flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-primary/40 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {!isMember && (
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Lock className="h-3 w-3" />
                  </span>
                )}
                <span className={c.color}>{c.icon}</span>
                <span className="text-xs font-semibold leading-tight">
                  {c.name.replace("Cup of ", "")}
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  {c.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Output card */}
      {activeCup && config && (completion || isLoading) && (
        <div
          key={serveCount}
          className={`rounded-2xl border-2 ${config.borderColor} bg-card text-card-foreground p-6 flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${config.badgeBg}`}
            >
              <span className={config.color}>{config.icon}</span>
              {config.name}
            </span>
            {config.premium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                Members only
              </span>
            )}
            <span className="text-xs text-muted-foreground">{config.tagline}</span>
          </div>

          <p className={`text-sm font-semibold leading-snug ${config.color}`}>
            {intro}
          </p>

          <div className="text-base leading-relaxed text-foreground min-h-12">
            {completion || (
              <span className="inline-flex gap-1 items-center text-muted-foreground text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </span>
            )}
          </div>
        </div>
      )}

      <SignupPromptModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        reason={modalReason}
        onSignup={() => promptSignup("signup")}
      />
    </div>
  );
}
