import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  ArrowRight, 
  Blocks, 
  Zap, 
  Palette, 
  BarChart3,
  Check,
} from 'lucide-react';

const features = [
  {
    icon: Blocks,
    title: 'Block-Based Editor',
    description: 'Build forms using modular blocks. Drag, drop, and customize with ease.',
  },
  {
    icon: Zap,
    title: 'Slash Commands',
    description: 'Type "/" to instantly add any block type. Fast and intuitive.',
  },
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'Modern, minimal aesthetics. Forms that look like landing pages.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Track responses, completion rates, and user behavior.',
  },
];

const blockTypes = [
  'Headings',
  'Rich Text',
  'Short & Long Answers',
  'Dropdowns',
  'Multiple Choice',
  'Checkboxes',
  'Date Pickers',
  'Images',
  'Dividers',
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">FormFlow</span>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-soft text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Notion-like form builder
          </div>
          
          <h1 className="text-display text-foreground mb-6 animate-slide-up">
            Build beautiful forms
            <br />
            <span className="text-primary">in minutes</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create stunning forms with a block-based editor inspired by Notion. 
            Drag, drop, and customize. No code required.
          </p>
          
          <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/builder">
              <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-glow hover:shadow-xl transition-all">
                Start Building
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 h-12 text-base">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xl animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-4 text-xs text-muted-foreground">formflow.app/builder</span>
            </div>
            <div className="p-8 bg-gradient-to-b from-card to-secondary/20 min-h-[400px]">
              <div className="max-w-lg mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="h-10 w-3/4 bg-foreground/10 rounded-lg" />
                  <div className="h-4 w-full bg-muted-foreground/10 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-foreground/10 rounded" />
                  <div className="h-11 w-full bg-background border border-border rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-foreground/10 rounded" />
                  <div className="h-11 w-full bg-background border border-border rounded-lg" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-48 bg-foreground/10 rounded" />
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary" />
                    <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                    <div className="h-4 w-20 bg-muted-foreground/10 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                    <div className="h-4 w-28 bg-muted-foreground/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <h3 className="text-h4 text-foreground mb-2">{feature.title}</h3>
                <p className="text-body-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block Types */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-foreground mb-4">
              12+ Block Types
            </h2>
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent-soft to-primary/5 border border-primary/10">
            <h2 className="text-h1 text-foreground mb-4">
              Ready to create?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Start building beautiful forms today. No credit card required.
            </p>
            <Link to="/builder">
              <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-glow">
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">FormFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FormFlow. Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
