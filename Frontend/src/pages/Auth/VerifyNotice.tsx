import { authService } from '@/services/auth.service'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function VerifyNoticePage() {
  const user = authService.getCurrentUser()
  const [isResending, setIsResending] = useState(false)

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />
  }

  if (user?.is_email_verified) {
    return <Navigate to="/dashboard" />
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await authService.resendVerification()
      toast.success('Verification link sent to your email!')
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to resend verification link'
      )
    } finally {
      setIsResending(false)
    }
  }

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
              Verify your email
            </h1>
            <p className="tracking-tight text-gray-600">
              You're almost there! We will send a verification link to{' '}
              <span className="font-semibold text-gray-900">{user?.email}</span>
              . Please click on the Send Verification Link button to get the
              verification link.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-600/90 disabled:opacity-50"
            >
              {isResending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Send Verification Link'
              )}
            </button>

            <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
              Can't find the email? Check your spam folder or wait a few
              minutes. Once verified, you'll be able to create forms and
              templates.
            </div>

            <Link
              to="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-50"
            >
              Back to Dashboard
              <ArrowRight className="h-4 w-4" />
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
