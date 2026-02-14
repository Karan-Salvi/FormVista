import { useState } from 'react'
import '@/App.css'
import { Sparkles, Loader2 } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function SignUpPage() {
  return <SignUpCard />
}

const SignUpCard = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.register({ name: fullName, email, password })
      toast.success('Account created successfully!')
      setIsRegistered(true)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  if (isRegistered) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-br from-neutral-50 to-white">
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-none bg-blue-600 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-medium tracking-tight text-black">
                  FormVista
                </span>
              </div>
              <h1 className="mb-3 text-3xl font-medium tracking-tight text-gray-900 lg:text-4xl">
                Check your email
              </h1>
              <p className="tracking-tight text-gray-600">
                We've sent a verification link to{' '}
                <span className="font-semibold text-gray-900">{email}</span>.
                Please click the link to verify your account.
              </p>
            </div>
            <div className="space-y-6">
              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                Didn't receive the email? Check your spam folder or wait a few
                minutes.
              </div>
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
        <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-blue-800 p-16 lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
          <div className="relative z-10 w-full max-w-2xl">
            <div className="relative transform overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl transition-transform duration-300 hover:scale-105">
              <img
                src={'/Demo.png'}
                alt="Product Dashboard"
                width={800}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-neutral-50 to-white">
      {/* Left Side - Illustration */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-blue-800 p-16 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
        <div className="relative z-10 w-full max-w-2xl">
          <div className="relative transform overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl transition-transform duration-300 hover:scale-105">
            <img
              src={'/Demo.png'}
              alt="Product Dashboard"
              width={800}
              height={500}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-none bg-blue-600 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-medium tracking-tight text-black">
                FormVista
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-medium tracking-tight text-gray-900 lg:text-4xl">
              Create an account
            </h1>
            <p className="tracking-tight text-gray-600">
              Start building beautiful, high-converting forms without writing a
              single line of code.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-600"
                placeholder="John Doe"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-600"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-12 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-600/90 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating account...' : 'Create an account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <p className="mt-16 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-600/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
