"use client";

import { Sparkles, MessageCircle, BookOpen } from "lucide-react";
import { useCupSelection, type FreeCupType } from "./cup-selection";

const heroCups: {
  id: FreeCupType;
  label: string;
  icon: React.ReactNode;
  base: string;
  selected: string;
}[] = [
  {
    id: "wisdom",
    label: "Cup of Wisdom",
    icon: <Sparkles className="w-3 h-3" />,
    base: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60",
    selected:
      "bg-amber-500 text-white dark:bg-amber-500 dark:text-white ring-2 ring-amber-400/50 ring-offset-2 ring-offset-background",
  },
  {
    id: "gossip",
    label: "Cup of Gossip",
    icon: <MessageCircle className="w-3 h-3" />,
    base: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60",
    selected:
      "bg-rose-500 text-white dark:bg-rose-500 dark:text-white ring-2 ring-rose-400/50 ring-offset-2 ring-offset-background",
  },
  {
    id: "fuel",
    label: "Read Your Cup",
    icon: <BookOpen className="w-3 h-3" />,
    base: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/60",
    selected:
      "bg-orange-500 text-white dark:bg-orange-500 dark:text-white ring-2 ring-orange-400/50 ring-offset-2 ring-offset-background",
  },
];

export function CupHeroButtons() {
  const { selectedCup, setSelectedCup } = useCupSelection();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {heroCups.map((cup) => {
        const isSelected = selectedCup === cup.id;
        return (
          <button
            key={cup.id}
            type="button"
            onClick={() => setSelectedCup(cup.id)}
            aria-pressed={isSelected}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 ${
              isSelected ? cup.selected : cup.base
            }`}
          >
            {cup.icon}
            {cup.label}
          </button>
        );
      })}
    </div>
  );
}
