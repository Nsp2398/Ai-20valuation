import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">ValuAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/valuation" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Start Valuation
          </Link>
          <Link 
            to="/methods" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Methods
          </Link>
          <Link 
            to="/pricing" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
          <Link to="/valuation">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              <Link 
                to="/valuation" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Valuation
              </Link>
              <Link 
                to="/methods" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Methods
              </Link>
              <Link 
                to="/pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link to="/signin">
                  <Button variant="ghost" className="justify-start w-full">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="justify-start w-full">Sign Up</Button>
                </Link>
                <Link to="/valuation">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
