import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent-soft to-primary/5 border border-primary/10">
          <h2 className="text-3xl font-extrabold text-foreground mb-4">
            Ready to create something amazing?
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of creators building beautiful forms today. No credit
            card required. Free forever.
          </p>
          <Link to="/builder">
            <Button
              size="lg"
              className="gap-2 px-8 h-12 text-base shadow-glow rounded-full"
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
