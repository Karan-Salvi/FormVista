import {
  TestimonialsColumn,
  type Testimonial,
} from '@/components/ui/testimonials-columns-1'
import { motion } from 'motion/react'

const testimonials: Testimonial[] = [
  {
    text: 'Building forms has never been this satisfying. The block-based interface and slash commands changed our entire workflow.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Alex Rivera',
    role: 'UX Designer @ Orbit',
  },
  {
    text: 'The speed at which I can prototype new surveys is incredible. My stakeholders are consistently impressed with the results.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Josh Smith',
    role: 'Product Manager @ Loom',
  },
  {
    text: 'FormVista simplified our data collection. The integrations with Slack and Notion work like magic.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Saman Malik',
    role: 'Customer Success @ Tally',
  },
  {
    text: "I recommended this to our entire team. It's the only form builder that actually feels like a modern tool.",
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Omar Raza',
    role: 'Founder @ Nexa',
  },
  {
    text: 'Its robust features and quick support have transformed our workflow, making us significantly more efficient.',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Zainab Hussain',
    role: 'Marketing Manager @ Flow',
  },
  {
    text: 'The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Aliza Khan',
    role: 'Data Analyst @ Prism',
  },
  {
    text: "Finally, a form builder that doesn't feel like it's from 2005. The aesthetics are just top-notch.",
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Farhan Siddiqui',
    role: 'Growth Lead @ Amplify',
  },
  {
    text: 'They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Sana Sheikh',
    role: 'Creative Director',
  },
  {
    text: 'Using this ERP, our online presence and conversions significantly improved, boosting business performance.',
    image:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=150&h=150&auto=format&fit=crop',
    name: 'Hassan Ali',
    role: 'E-commerce Manager',
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export const TestimonialsSection = () => {
  return (
    <section className="bg-background relative w-full overflow-hidden py-24">
      <div className="z-10 container mx-auto sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="text-primary bg-primary/5 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
              Testimonials
            </div>
          </div>

          <h2 className="text-4xl leading-tight font-black tracking-tight text-slate-900 md:text-5xl">
            Loved by builders <br />
            <span className="text-primary italic">everywhere.</span>
          </h2>
          <p className="mt-6 text-lg font-medium text-slate-500">
            Join thousands of creators who are building better forms with
            FormVista.
          </p>
        </motion.div>

        <div className="mt-16 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  )
}
