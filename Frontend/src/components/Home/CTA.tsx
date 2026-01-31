import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="w-full py-16 sm:py-20 sm:px-6 flex justify-center items-center">
      <div className="w-full mx-auto text-center">
        <div className="p-12 flex flex-col items-center justify-center w-full rounded-3xl bg-gradient-to-br from-primary/10 via-accent-soft to-primary/5 border border-primary/10">
          <h2 className="text-lg sm:text-3xl font-extrabold text-foreground mb-4">
            Ready to create something amazing?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of creators building beautiful forms today. No credit
            card required. Free forever.
          </p>
          <Link to="/builder">
            <Button
              size="lg"
              className="gap-2 sm:px-8 h-12  text-xs font-semibold sm:text-base shadow-glow rounded-full"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
