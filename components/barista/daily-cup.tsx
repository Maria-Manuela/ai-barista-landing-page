"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useCallback } from "react";
import { CupSoda, Flame, MessageCircle, Sparkles, RefreshCw } from "lucide-react";

const cups = ["wisdom", "gossip", "fuel"] as const;
type CupType = (typeof cups)[number];

interface CupConfig {
  name: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  badgeBg: string;
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
};

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function DailyCup() {
  const [activeCup, setActiveCup] = useState<CupType | null>(null);
  const [intro, setIntro] = useState<string>("");
  const [serveCount, setServeCount] = useState(0);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/daily-cup",
  });

  const serveCup = useCallback(async () => {
    const cup = pickRandom(cups);
    const config = cupConfig[cup];
    setActiveCup(cup);
    setIntro(pickRandom(config.intros));
    setServeCount((c) => c + 1);
    await complete("serve", {
      body: { cupType: cup },
    });
  }, [complete]);

  const config = activeCup ? cupConfig[activeCup] : null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Serve button */}
      <button
        onClick={serveCup}
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
            : serveCount === 0
            ? "Serve Me My Daily Cup"
            : "Serve Another Cup"}
        </span>
        {isLoading && (
          <RefreshCw className="w-4 h-4 animate-spin ml-1 opacity-70" />
        )}
      </button>

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
            <span className="text-xs text-muted-foreground">{config.tagline}</span>
          </div>

          {/* Intro line */}
          <p className={`text-sm font-semibold leading-snug ${config.color}`}>
            {intro}
          </p>

          {/* Streamed content */}
          <div className="text-base leading-relaxed text-foreground min-h-[3rem]">
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
    </div>
  );
}
