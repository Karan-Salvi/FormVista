import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How to use FormVista?',
      answer:
        "To use FormVista, simply go to the builder, add blocks using the '+' button or slash commands, and customize your form to your liking. Once done, you can share the link with anyone.",
    },
    {
      question: 'Are there different block types available?',
      answer:
        'Yes, we offer over 12+ block types including headings, rich text, multi-choice, dropdowns, date pickers, and more to build versatile forms.',
    },
    {
      question: 'Are the forms mobile-responsive?',
      answer:
        'Absolutely. All forms created with FormVista are fully responsive and look great on desktops, tablets, and smartphones.',
    },
    {
      question: 'Can I customize the design of my forms?',
      answer:
        'Yes, you can customize themes, colors, and layouts to match your brand identity using our intuitive design panel.',
    },
  ]

  return (
    <section className="bg-background sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-primary mb-2 text-xs font-bold tracking-wider uppercase sm:text-sm">
          FAQ's
        </p>
        <h2 className="mb-4 text-xl font-extrabold sm:text-3xl md:text-4xl">
          Looking for answers?
        </h2>
        <p className="text-muted-foreground mb-8 text-xs sm:text-base">
          Everything you need to know about building beautiful, high-converting
          forms with FormVista.
        </p>
        <div className="space-y-2 text-start">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-border group cursor-pointer border-b py-4"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3
                  className={cn(
                    'text-sm font-semibold transition-colors sm:text-lg',
                    openIndex === index
                      ? 'text-primary'
                      : 'text-foreground group-hover:text-primary'
                  )}
                >
                  {faq.question}
                </h3>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 transition-transform duration-300',
                    openIndex === index
                      ? 'text-primary rotate-180'
                      : 'text-muted-foreground'
                  )}
                />
              </div>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  openIndex === index
                    ? 'mt-4 max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                )}
              >
                <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
