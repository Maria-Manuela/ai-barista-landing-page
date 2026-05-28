import { Clock, MapPin, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const hours = [
  { day: "Monday - Friday", time: "07:00 - 18:00" },
  { day: "Saturday", time: "08:00 - 17:00" },
  { day: "Sunday", time: "09:00 - 16:00" },
]

export function Location() {
  return (
    <section id="location" className="py-24 sm:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
            Visit Us
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Find Your Way to Hygge
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;re located in the heart of Herning, just steps from the city center.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map placeholder */}
          <div className="relative h-[400px] rounded-xl overflow-hidden bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.8901234567!2d8.973!3d56.138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHerning%2C%20Denmark!5e0!3m2!1sen!2sdk!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Herning Kaffe location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          {/* Info cards */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="mt-1 text-muted-foreground">
                      Bredgade 23<br />
                      7400 Herning<br />
                      Denmark
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Opening Hours</h3>
                    <ul className="mt-2 space-y-1">
                      {hours.map((schedule) => (
                        <li key={schedule.day} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{schedule.day}</span>
                          <span className="font-medium">{schedule.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact</h3>
                    <p className="mt-1 text-muted-foreground">
                      <a href="tel:+4512345678" className="hover:text-primary transition-colors">
                        +45 12 34 56 78
                      </a>
                    </p>
                    <p className="text-muted-foreground">
                      <a href="mailto:hej@herningkaffe.dk" className="hover:text-primary transition-colors">
                        hej@herningkaffe.dk
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
