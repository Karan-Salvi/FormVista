import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowLeft, Home } from 'lucide-react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    )
  }, [location.pathname])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-6">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-20">
        <div className="h-96 w-96 rounded-full bg-blue-400 blur-[120px]" />
      </div>
      <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 opacity-20">
        <div className="h-96 w-96 rounded-full bg-indigo-400 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mb-8 flex justify-center">
          <div className="animate-float flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-[0_20px_50px_rgba(8,112,184,0.1)]">
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <h1 className="mb-2 text-8xl font-black tracking-tighter text-blue-600/10 sm:text-9xl">
          404
        </h1>

        <div className="-mt-12 mb-8 sm:-mt-16">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Lost in FormVista?
          </h2>
          <p className="mx-auto max-w-sm text-lg leading-relaxed text-slate-500">
            The page you are looking for doesn't exist or has been moved to a
            new home.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="outline"
            className="h-12 w-full gap-2 rounded-2xl border-2 border-slate-200 px-8 text-base font-bold transition-all hover:bg-slate-50 sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
          <Link to="/" className="w-full sm:w-auto">
            <Button className="h-12 w-full gap-2 rounded-2xl bg-blue-600 px-8 text-base font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 hover:bg-blue-700 sm:w-auto">
              <Home className="h-5 w-5" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="mt-16">
          <p className="text-sm font-medium text-slate-400">
            Tried searching for "{location.pathname.split('/').pop()}"?
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
