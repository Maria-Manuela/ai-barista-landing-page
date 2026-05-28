import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-coffee.png"
          alt="Artisan coffee with latte art"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/70 dark:bg-background/85" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
            Specialty Coffee in Herning
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance">
            Where Every Cup Tells a Story
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-xl">
            Experience the art of Scandinavian coffee culture in the heart of Herning. 
            Handcrafted drinks, locally sourced pastries, and a cozy atmosphere 
            that feels like home.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button size="lg" asChild className="group">
              <Link href="#menu">
                Explore Our Menu
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#about">Our Story</Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div>
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground">Years of passion</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">25k+</p>
              <p className="text-sm text-muted-foreground">Happy customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Organic beans</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
