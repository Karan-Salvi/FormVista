import { apiClient } from '../api/client'

export interface User {
  id: string
  name: string
  email: string
  is_email_verified: boolean
  plan: string
  role: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post<AuthResponse>(
      '/user/login',
      credentials
    )
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response
  },

  register: async (userData: {
    name: string
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/user/register',
      userData
    )
    return response
  },

  verifyEmail: async (token: string) => {
    return await apiClient.get<{
      success: boolean
      data: { message: string; user: User }
    }>(`/user/verify-email?token=${token}`)
  },

  resendVerification: async () => {
    return await apiClient.post('/user/resend-verification')
  },

  forgotPassword: async (email: string) => {
    return await apiClient.post('/user/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string) => {
    return await apiClient.post('/user/reset-password', { token, password })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}
