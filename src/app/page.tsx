import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"


export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border-divider bg-card-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <Image
                  src="/speaks-logo.jpg"
                  alt="Speaks Logo"
                  width={40}  // adjust size as needed
                  height={40}
                />
                <span className="ml-2 text-xl font-bold text-heading-text">Speaks</span>
              </Link>
            </div>

            {/* <div className="w-8 h-8 bg-primary-cta rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-heading-text">Speaks</span> */}
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/discover" className="text-body-text hover:text-heading-text transition-colors">
              Events
            </Link>
            <Link href="#about" className="text-body-text hover:text-heading-text transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-heading-text mb-6">
              Discover MUN Events in <span className="text-primary-cta">South India</span>
            </h1>
            <p className="text-xl text-body-text mb-8 max-w-2xl mx-auto">
              Connect with the vibrant Model United Nations community across South India. Find conferences, create
              events, and build lasting diplomatic connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-cta hover:bg-primary-cta/90 text-white px-8" asChild>
                <Link href="/discover">Explore Events</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border-divider hover:bg-card-background bg-transparent"
                asChild
              >
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-card-background/50" id="about">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-heading-text text-center mb-12">Why Choose Speaks?</h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-border-divider bg-card-background">
                <CardHeader>
                  <CardTitle className="text-heading-text">Discover Events</CardTitle>
                  <CardDescription className="text-body-text">
                    Find MUN conferences across South India with advanced filtering and search
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border-divider bg-card-background">
                <CardHeader>
                  <CardTitle className="text-heading-text">Create & Manage</CardTitle>
                  <CardDescription className="text-body-text">
                    Organize your own MUN events with our comprehensive event management tools
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border-divider bg-card-background">
                <CardHeader>
                  <CardTitle className="text-heading-text">Connect & Network</CardTitle>
                  <CardDescription className="text-body-text">
                    Build connections with fellow delegates, organizers, and MUN enthusiasts
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold text-heading-text mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-body-text mb-8">
              Join thousands of MUN enthusiasts already using Speaks to discover and create amazing events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-cta hover:bg-primary-cta/90 text-white px-8" asChild>
                <Link href="/auth/signup">Sign Up Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border-divider bg-transparent" asChild>
                <Link href="/discover">Browse Events</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-divider bg-card-background/80 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-cta rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-heading-text">Speaks</span>
              </div>
              <p className="text-body-text mb-4">
                Empowering the South Indian MUN community through seamless event discovery and creation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-heading-text mb-3">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/discover" className="text-body-text hover:text-heading-text">
                    Discover Events
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="text-body-text hover:text-heading-text">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-body-text hover:text-heading-text">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-heading-text mb-3">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-body-text hover:text-heading-text">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-text hover:text-heading-text">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-text hover:text-heading-text">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border-divider mt-8 pt-8 text-center">
            <p className="text-body-text">© 2024 Speaks Platform. Empowering the South Indian MUN community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
