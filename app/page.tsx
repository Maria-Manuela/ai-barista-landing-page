import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Menu } from "@/components/landing/menu"
import { About } from "@/components/landing/about"
import { Location } from "@/components/landing/location"
import { Contact } from "@/components/landing/contact"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Menu />
      <About />
      <Location />
      <Contact />
      <Footer />
    </main>
  )
}
