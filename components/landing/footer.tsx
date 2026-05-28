import Link from "next/link"
import { Coffee } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="font-semibold">Herning Kaffe</span>
          </div>
          
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link href="#menu" className="text-muted-foreground hover:text-foreground transition-colors">
              Menu
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="#location" className="text-muted-foreground hover:text-foreground transition-colors">
              Location
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Herning Kaffe. All rights reserved.</p>
          <p>Made with love in Herning, Denmark</p>
        </div>
      </div>
    </footer>
  )
}
