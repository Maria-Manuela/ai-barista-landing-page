import Image from "next/image"
import { Coffee, Heart, Leaf, Users } from "lucide-react"

const values = [
  {
    icon: Coffee,
    title: "Quality First",
    description: "We obsess over every detail, from bean selection to the final pour.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Organic beans, compostable packaging, and zero-waste practices.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "More than a café - a gathering place for Herning locals.",
  },
  {
    icon: Users,
    title: "Connection",
    description: "We believe great coffee brings people together.",
  },
]

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden order-2 lg:order-1">
            <Image
              src="/images/cafe-interior.png"
              alt="Herning Kaffe interior"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              Our Story
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              A Decade of Passion in Every Cup
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2014, Herning Kaffe began as a small dream shared between 
                two coffee enthusiasts who believed that great coffee could transform 
                ordinary moments into extraordinary ones.
              </p>
              <p>
                Today, we&apos;re proud to be a cornerstone of the Herning community. 
                Our café has become a place where students study, friends reunite, 
                and strangers become neighbors over perfectly crafted cups.
              </p>
              <p>
                Every bean we serve is ethically sourced, every pastry is baked fresh, 
                and every customer is treated like family. That&apos;s the Danish way - 
                and it&apos;s our promise to you.
              </p>
            </div>
          </div>
        </div>
        
        {/* Values */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div key={value.title} className="group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
