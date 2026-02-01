import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { authService } from '@/services/auth.service'

const CTA = () => {
  const isAuthenticated = authService.isAuthenticated()
  const startLink = isAuthenticated ? '/dashboard' : '/signup'

  return (
    <section className="flex w-full items-center justify-center py-16 sm:px-6 sm:py-20">
      <div className="mx-auto w-full text-center">
        <div className="from-primary/10 via-accent-soft to-primary/5 border-primary/10 flex w-full flex-col items-center justify-center rounded-3xl border bg-gradient-to-br p-12">
          <h2 className="text-foreground mb-4 text-lg font-extrabold sm:text-3xl">
            Ready to create something amazing?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-lg text-sm sm:text-base">
            Join thousands of creators building beautiful forms today. No credit
            card required. Free forever.
          </p>
          <Link to={startLink}>
            <Button
              size="lg"
              className="shadow-glow h-12 gap-2 rounded-full text-xs font-semibold sm:px-8 sm:text-base"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Building Free'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA
