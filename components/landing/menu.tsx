import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const menuItems = [
  {
    category: "Signature Drinks",
    items: [
      { name: "Herning Blend Espresso", price: "28 kr", description: "Our house specialty - rich and smooth" },
      { name: "Nordic Latte", price: "38 kr", description: "Velvety oat milk with vanilla" },
      { name: "Hygge Mocha", price: "42 kr", description: "Dark chocolate meets espresso" },
      { name: "Cold Brew Tonic", price: "45 kr", description: "Refreshing summer favorite" },
    ]
  },
  {
    category: "Classic Coffee",
    items: [
      { name: "Americano", price: "25 kr", description: "Bold and straightforward" },
      { name: "Cappuccino", price: "35 kr", description: "Perfect foam ratio" },
      { name: "Flat White", price: "36 kr", description: "Creamy microfoam" },
      { name: "Pour Over", price: "40 kr", description: "Single origin selection" },
    ]
  },
  {
    category: "Fresh Pastries",
    items: [
      { name: "Kanelsnegle", price: "32 kr", description: "Danish cinnamon swirl" },
      { name: "Croissant", price: "28 kr", description: "Buttery and flaky" },
      { name: "Rugbrød Toast", price: "45 kr", description: "Avocado & poached egg" },
      { name: "Cardamom Bun", price: "35 kr", description: "Scandinavian classic" },
    ]
  },
]

export function Menu() {
  return (
    <section id="menu" className="py-24 sm:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
            Our Menu
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Crafted with Care, Served with Love
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every item on our menu is thoughtfully selected and prepared fresh daily.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {menuItems.map((section) => (
            <Card key={section.category} className="bg-card border-border overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-6 pb-2 border-b border-border">
                  {section.category}
                </h3>
                <ul className="space-y-4">
                  {section.items.map((item) => (
                    <li key={item.name} className="group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-primary ml-4 whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Featured Image */}
        <div className="mt-16 relative h-64 sm:h-80 rounded-xl overflow-hidden">
          <Image
            src="/images/coffee-beans.png"
            alt="Freshly roasted coffee beans"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent flex items-center">
            <div className="px-8 sm:px-12 max-w-md">
              <h3 className="text-2xl font-bold">Freshly Roasted Weekly</h3>
              <p className="mt-2 text-muted-foreground">
                We source our beans from ethical farms and roast them locally in small batches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
