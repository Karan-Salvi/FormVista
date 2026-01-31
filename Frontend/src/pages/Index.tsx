import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Blocks,
  Zap,
  Palette,
  BarChart3,
  Check,
} from "lucide-react";
import "../App.css";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import Navbar from "@/components/Home/Navbar";
import Hero from "@/components/Home/Hero";
import HomeFooter from "@/components/Home/Footer";

const features = [
  {
    icon: Blocks,
    title: "Block-Based Editor",
    description:
      "Build forms using modular blocks. Drag, drop, and customize with ease.",
  },
  {
    icon: Zap,
    title: "Slash Commands",
    description:
      'Type "/" to instantly add any block type. Fast and intuitive.',
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description:
      "Modern, minimal aesthetics. Forms that look like landing pages.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track responses, completion rates, and user behavior.",
  },
];

const blockTypes = [
  "Headings",
  "Rich Text",
  "Short & Long Answers",
  "Dropdowns",
  "Multiple Choice",
  "Checkboxes",
  "Date Pickers",
  "Images",
  "Dividers",
];

const Index: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Navigation */}

        <Navbar />
        <Hero />

        {/* Features */}
        <section className="py-20 px-6 bg-surface-subtle">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-h1 text-foreground mb-4">
                Everything you need
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features to create, customize, and analyze your forms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h4 text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Block Types */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 text-foreground mb-4">12+ Block Types</h2>
              <p className="text-lg text-muted-foreground">
                All the building blocks you need to create any form.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {blockTypes.map((block) => (
                <div
                  key={block}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium"
                >
                  <Check className="w-4 h-4 text-success" />
                  {block}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent-soft to-primary/5 border border-primary/10">
              <h2 className="text-h1 text-foreground mb-4">Ready to create?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Start building beautiful forms today. No credit card required.
              </p>
              <Link to="/builder">
                <Button
                  size="lg"
                  className="gap-2 px-8 h-12 text-base shadow-glow"
                >
                  Start Building Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <HomeFooter />
      </div>
    </>
  );
};

export default Index;
