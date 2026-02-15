import { useEffect, useState } from 'react'
import '@/App.css'
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react'
import { authService } from '@/services/auth.service'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('Verifying your email...')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid or missing verification token.')
        return
      }

      try {
        const response = await authService.verifyEmail(token)
        const updatedUser = response.data.user
        if (updatedUser) {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
        setStatus('success')
        setMessage(
          'Your email has been successfully verified! You can now start using FormVista.'
        )
      } catch (error: any) {
        setStatus('error')
        setMessage(
          error.response?.data?.message ||
            'Verification failed. The link might be expired or invalid.'
        )
      }
    }

    verifyToken()
  }, [token])

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

            <div className="mt-12 text-center">
              {status === 'loading' && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  <h1 className="text-2xl font-medium text-gray-900">
                    Verifying...
                  </h1>
                  <p className="text-gray-600">{message}</p>
                </div>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-medium text-gray-900">
                    Email Verified!
                  </h1>
                  <p className="text-gray-600">{message}</p>
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-600/90"
                  >
                    Go to Login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h1 className="text-3xl font-medium text-gray-900">
                    Verification Failed
                  </h1>
                  <p className="text-gray-600">{message}</p>
                  <Link
                    to="/signup"
                    className="text-sm font-medium text-blue-600 hover:text-blue-600/80"
                  >
                    Try signing up again
                  </Link>
                </div>
              )}
            </div>
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
