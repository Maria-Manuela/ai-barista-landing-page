"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Instagram, Facebook } from "lucide-react"

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Content */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              Get in Touch
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              We&apos;d Love to Hear from You
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Whether you&apos;re planning an event, have feedback, or just want to say hello, 
              we&apos;re here for you. Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>
            
            {/* Social links */}
            <div className="mt-8">
              <p className="font-medium mb-4">Follow us on social media</p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Newsletter */}
            <Card className="mt-8 bg-secondary/50 border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold">Join Our Newsletter</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get weekly updates on new menu items, events, and exclusive offers.
                </p>
                <form className="mt-4 flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1"
                    aria-label="Email for newsletter"
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact form */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 sm:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold">Message Sent!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Thank you for reaching out. We&apos;ll get back to you soon.
                  </p>
                  <Button
                    className="mt-6"
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        placeholder="Anna"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        placeholder="Jensen"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="anna@example.dk"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      placeholder="Table reservation / Feedback / Other"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
