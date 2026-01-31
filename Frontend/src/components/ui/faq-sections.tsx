import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How to use FormVista?",
      answer:
        "To use FormVista, simply go to the builder, add blocks using the '+' button or slash commands, and customize your form to your liking. Once done, you can share the link with anyone.",
    },
    {
      question: "Are there different block types available?",
      answer:
        "Yes, we offer over 12+ block types including headings, rich text, multi-choice, dropdowns, date pickers, and more to build versatile forms.",
    },
    {
      question: "Are the forms mobile-responsive?",
      answer:
        "Absolutely. All forms created with FormVista are fully responsive and look great on desktops, tablets, and smartphones.",
    },
    {
      question: "Can I customize the design of my forms?",
      answer:
        "Yes, you can customize themes, colors, and layouts to match your brand identity using our intuitive design panel.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="w-full max-w-3xl mx-auto">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">
          FAQ's
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Looking for answers?
        </h2>
        <p className="text-muted-foreground mb-8">
          Everything you need to know about building beautiful, high-converting
          forms with FormVista.
        </p>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-border py-4 cursor-pointer group"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3
                  className={cn(
                    "text-lg font-semibold transition-colors",
                    openIndex === index
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary",
                  )}
                >
                  {faq.question}
                </h3>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    openIndex === index
                      ? "rotate-180 text-primary"
                      : "text-muted-foreground",
                  )}
                />
              </div>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index
                    ? "max-h-40 opacity-100 mt-4"
                    : "max-h-0 opacity-0",
                )}
              >
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
