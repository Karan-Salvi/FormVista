import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Blocks,
  Zap,
  Palette,
  BarChart3,
  Check,
} from "lucide-react";
import "@/App.css";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import Navbar from "@/components/Home/Navbar";
import Hero from "@/components/Home/Hero";
import HomeFooter from "@/components/Home/Footer";
import HomeLayout from "@/pages/Home/HomeLayout";
import FAQSection from "@/components/ui/faq-sections";

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
      <Navbar />
      <HomeLayout>
        {" "}
        <Hero />
        {/* Features */}
        <section className=" w-full py-20 px-6 bg-surface-subtle">
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
        <section className="w-full py-20 px-6">
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
        <section className="max-w-6xl mx-auto px-6 py-20 text-start">
          <div className="bg-blue-50/30 rounded-[3rem] p-12 md:flex items-center gap-16 border border-blue-50">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-[11px] font-bold text-blue-600 shadow-sm mb-6">
                ✨ Create forms in minutes no skills needed!
              </div>
              <h2 className="text-4xl font-extrabold leading-tight mb-6">
                Build{" "}
                <span className="text-blue-600">simple and beautiful</span>{" "}
                forms that people love to fill.
              </h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Design forms easily, share them anywhere, and collect responses
                in real time. Perfect for surveys, registrations, feedback, and
                more — all in one place.
              </p>
              <button className="font-bold text-blue-600 flex items-center gap-2 hover:gap-4 transition-all">
                Create your first form
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="hidden sm:block md:w-1/2 mb-10 md:mb-0 animate-float">
              <div className="bg-white p-8 rounded-xl shadow-2xl shadow-blue-100 border border-slate-100 max-w-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                  <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                </div>
                <h4 className="text-xl font-extrabold mb-4">
                  Create Your First Form
                </h4>
                <div className="space-y-3">
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
                  <button className="w-full h-10 bg-blue-600 rounded-xl text-white font-bold text-sm">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-20 px-6">
          <div className="max-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Simple, <span className="text-blue-600">Transparent</span>{" "}
                Pricing
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Choose the plan that's right for you. Start for free and upgrade
                as you grow.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Basic</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    Perfect for side projects and individuals.
                  </p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-black text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Unlimited free forms
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Up to 100 submissions/mo
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Basic Analytics
                  </li>
                </ul>

                <button className="w-full py-3 px-6 rounded-xl font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                  Get Started
                </button>
              </div>

              <div className="relative border-2 border-blue-600 rounded-3xl p-8 bg-white shadow-xl flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    Advanced tools for growing businesses.
                  </p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-black text-gray-900">$2</span>
                  <span className="text-gray-500">/month</span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Everything in Basic
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Unlimited submissions
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    AI-Powered Logic
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Remove FormVista branding
                  </li>
                </ul>

                <button className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
                  Go Pro
                </button>
              </div>
            </div>
          </div>
        </section>
        <FAQSection />
        {/* CTA */}
        <section className="w-full py-20 px-6">
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
      </HomeLayout>
      <HomeFooter />
    </>
  );
};

export default Index;
