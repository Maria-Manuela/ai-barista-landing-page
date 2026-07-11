"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useCallback, useEffect } from "react";
import {
  CupSoda,
  Flame,
  MessageCircle,
  Sparkles,
  RefreshCw,
  Heart,
  Moon,
  Lock,
  Crown,
  LogIn,
} from "lucide-react";
import { UpgradeModal } from "./upgrade-modal";
import { useUser } from "@/components/auth/user-provider";

const freeCups = ["wisdom", "gossip", "fuel"] as const;
const premiumCups = ["love", "roast", "fortune"] as const;
type CupType = (typeof freeCups)[number] | (typeof premiumCups)[number];

const FREE_DAILY_LIMIT = 3;

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
      "Wham! You got a Cup of Wisdom! Drop the løber, listen here...",
      "HOLD UP! Det er: Cup of Wisdom! Sæt kaffen ned og hør efter...",
      "Bing bong! Your Daily Cup is: Cup of Wisdom! Gågaden can wait...",
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
      "Boom! Your Daily Cup is: Cup of Gossip! High hair, low glass, listen to this...",
      "OH. MIT. GOD. Det er: Cup of Gossip! MCH har ikke set drama som dette...",
      "SHHH! Kom tættere på, for this is JUICY... Din Cup of Gossip er klar!",
    ],
  },
  fuel: {
    name: "Cup of Fuel",
    tagline: "Aggressive, funny motivation",
    icon: <Flame className="w-5 h-5" />,
    color: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-400/40",
    badgeBg: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    intros: [
      "LET'S GO! Your Daily Cup is: Cup of Fuel! Spænd seletøjet, for now we GRIND...",
      "BRRR! Det er: Cup of Fuel! El-løbehjul energy, ACTIVATE!",
      "GAME ON! Your Daily Cup is: Cup of Fuel! Herning did not raise a quitter...",
    ],
  },
  love: {
    name: "Cup of Love",
    tagline: "Bold Danglish dating advice",
    icon: <Heart className="w-5 h-5" />,
    color: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-400/40",
    badgeBg: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    premium: true,
    intros: [
      "Ahh, l'amour! Din Cup of Love er klar — sæt dig ned, skat...",
      "Cupid tog el-løbehjulet! It's a Cup of Love, listen carefully...",
      "Hjerte-alarm! Your Cup of Love is served, kæreste...",
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
      "Uh oh. Du bestilte en Cup of Roast. Håber du kan tåle varmen...",
      "Dark roast, ekstra brutal! Your Cup of Roast is brewing...",
      "You asked for it — Cup of Roast, ingen mælk til at blødgøre det...",
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
      "Jeg ser noget i grumset... din Cup of Fortune afsløres nu...",
      "Krystalkuglen er en kaffekop i dag — Cup of Fortune, kommer nu...",
      "Skæbnen kalder fra Birk Centerpark... your Cup of Fortune awaits...",
    ],
  },
};

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function DailyCup() {
  const { user, profile, loading: userLoading, refreshProfile, promptLogin } = useUser();

  const [activeCup, setActiveCup] = useState<CupType | null>(null);
  const [intro, setIntro] = useState<string>("");
  const [serveCount, setServeCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<"limit" | "premium">("premium");

  const isPro = !!profile?.is_pro;
  const usedToday = profile?.cups_used_today ?? 0;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - usedToday);
  const limitReached = !!user && !isPro && remaining <= 0;

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/daily-cup",
    onFinish: () => {
      void refreshProfile();
    },
    onError: (err) => {
      // Server-side gate fired (defense in depth). Parse the reason and react.
      try {
        const payload = JSON.parse(err.message) as { error?: string };
        if (payload.error === "unauthenticated") {
          promptLogin();
          return;
        }
        if (payload.error === "premium_locked") {
          setModalReason("premium");
          setModalOpen(true);
          return;
        }
        if (payload.error === "limit_reached") {
          setModalReason("limit");
          setModalOpen(true);
          return;
        }
      } catch {
        /* non-JSON error — ignore */
      }
      void refreshProfile();
    },
  });

  // After returning from Stripe Checkout, sync the (webhook-updated) profile.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      void refreshProfile();
      const t = setTimeout(() => void refreshProfile(), 2500);
      window.history.replaceState({}, "", window.location.pathname);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const serveRandomFree = useCallback(() => {
    if (!user) {
      promptLogin();
      return;
    }
    if (limitReached) {
      setModalReason("limit");
      setModalOpen(true);
      return;
    }
    brew(pickRandom(freeCups));
  }, [user, limitReached, brew, promptLogin]);

  const servePremium = useCallback(
    (cup: CupType) => {
      if (!user) {
        promptLogin();
        return;
      }
      if (!isPro) {
        setModalReason("premium");
        setModalOpen(true);
        return;
      }
      brew(cup);
    },
    [user, isPro, brew, promptLogin]
  );

  const config = activeCup ? cupConfig[activeCup] : null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Status bar: Pro badge / free counter / login state */}
      <div className="flex items-center justify-between text-xs">
        {userLoading ? (
          <span className="h-6 w-32 animate-pulse rounded-full bg-secondary" />
        ) : !user ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium text-muted-foreground">
            <LogIn className="h-3.5 w-3.5" /> Log ind for din daglige kop
          </span>
        ) : isPro ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 font-semibold text-white shadow-sm">
            <Crown className="h-3.5 w-3.5" /> Barista Pro — unlimited
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium text-muted-foreground">
            <CupSoda className="h-3.5 w-3.5" />
            {remaining} of {FREE_DAILY_LIMIT} free cups left today
          </span>
        )}
      </div>

      {/* Serve button (random free cup) */}
      <button
        onClick={serveRandomFree}
        disabled={isLoading}
        aria-label="Serve me a Daily Cup"
        className="group relative w-full rounded-2xl bg-primary text-primary-foreground font-semibold text-lg py-5 px-8 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/30"
      >
        <CupSoda
          className={`w-6 h-6 transition-transform duration-500 ${isLoading ? "animate-bounce" : "group-hover:rotate-12"}`}
        />
        <span>
          {isLoading
            ? "Brewing your cup..."
            : !user
            ? "Log ind for din daglige kop"
            : limitReached
            ? "Daily limit reached — Go Pro"
            : serveCount === 0
            ? "Serve Me My Daily Cup"
            : "Serve Another Cup"}
        </span>
        {isLoading && (
          <RefreshCw className="w-4 h-4 animate-spin ml-1 opacity-70" />
        )}
      </button>

      {/* Premium secret menu */}
      <div className="rounded-2xl border border-border bg-secondary/30 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Crown className="h-3.5 w-3.5 text-amber-500" /> Secret Pro menu
          </span>
          {!isPro && (
            <button
              onClick={() => {
                if (!user) return promptLogin();
                setModalReason("premium");
                setModalOpen(true);
              }}
              className="text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
            >
              Unlock all
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {premiumCups.map((cup) => {
            const c = cupConfig[cup];
            return (
              <button
                key={cup}
                onClick={() => servePremium(cup)}
                disabled={isLoading}
                className="group relative flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-amber-400/60 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {!isPro && (
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
          {/* Cup badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${config.badgeBg}`}
            >
              <span className={config.color}>{config.icon}</span>
              {config.name}
            </span>
            {config.premium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-2 py-1 text-[10px] font-semibold text-white">
                <Crown className="h-2.5 w-2.5" /> Pro
              </span>
            )}
            <span className="text-xs text-muted-foreground">{config.tagline}</span>
          </div>

          {/* Intro line */}
          <p className={`text-sm font-semibold leading-snug ${config.color}`}>
            {intro}
          </p>

          {/* Streamed content */}
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

      <UpgradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        reason={modalReason}
        isLoggedIn={!!user}
        onRequireLogin={promptLogin}
      />
    </div>
  );
}
