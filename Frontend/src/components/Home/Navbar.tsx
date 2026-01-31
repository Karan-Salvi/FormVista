import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">
            FormVista
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Features
          </Button>
          <Button variant="ghost" size="sm">
            Pricing
          </Button>
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Link to="/builder">
            <Button size="sm" className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
