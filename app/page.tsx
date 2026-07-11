import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth/auth-button";
import { DailyCup } from "@/components/barista/daily-cup";
import Image from "next/image";
import { Coffee, MapPin, Clock, Sparkles, MessageCircle, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm tracking-wide">Herning Kaffe</span>
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="relative px-6 pt-16 pb-12 flex flex-col items-center text-center gap-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] flex items-center justify-center overflow-hidden">
            <Image
              src="/images/hero-coffee.png"
              alt=""
              fill
              className="object-cover"
              priority
              aria-hidden="true"
            />
          </div>

          <div className="relative w-28 h-28 rounded-full border-4 border-primary/30 bg-secondary overflow-hidden shadow-lg">
            <Image
              src="/images/barista.png"
              alt="Your sassy AI barista"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Virtual Coffee Shop — Herning
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
              AI Barista
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed mt-1">
              Welcome! Pick your cup, hit serve, and your barista brews something
              fresh — wisdom, gossip, or a personal read. Every day is different.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              <Sparkles className="w-3 h-3" /> Cup of Wisdom
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
              <MessageCircle className="w-3 h-3" /> Cup of Gossip
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
              <BookOpen className="w-3 h-3" /> Read Your Cup
            </span>
          </div>
        </section>

        <section className="px-6 pb-16 flex justify-center">
          <DailyCup />
        </section>

        <div className="border-t border-border mx-6" />

        <section className="px-6 py-12 max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Coffee className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-sm">Danglish brewed fresh</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every cup is AI-brewed with a sassy mix of Danish and English.
              No filler, just flavor.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-sm">Proudly from Herning</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              MCH, the high street, electric scooters — we know the place.
              Local vibes, global attitude.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-sm">Open 24/7</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your barista never sleeps. Click whenever — morning, midnight,
              or mid existential crisis.
            </p>
          </div>
        </section>

        <section className="px-6 pb-16 max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-border h-52 md:h-72 relative">
            <Image
              src="/images/cafe-interior.png"
              alt="Cozy Scandinavian coffee shop interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent flex items-end p-6">
              <p className="text-sm font-medium text-foreground/90">
                Herning Kaffe — where hygge meets AI
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Herning Kaffe — Gågaden 1, 7400 Herning</span>
        <span>Brewed with coffee and love</span>
      </footer>
    </div>
  );
}
