import { ArrowRight, Sparkles, Menu } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { authService } from '@/services/auth.service'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'

const Navbar = () => {
  const isAuthenticated = authService.isAuthenticated()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="bg-background/80 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" />
          <span className="text-foreground text-xl font-semibold">
            FormVista
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('how-it-works')}
          >
            How it works
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('features')}
          >
            Features
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('pricing')}
          >
            Pricing
          </Button>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm" className="gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary h-6 w-6" />
                  FormVista
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    scrollToSection('how-it-works')
                  }}
                >
                  How it works
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    scrollToSection('features')
                  }}
                >
                  Features
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    scrollToSection('pricing')
                  }}
                >
                  Pricing
                </Button>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="w-full">
                    <Button className="w-full gap-2">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <Button className="w-full gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
