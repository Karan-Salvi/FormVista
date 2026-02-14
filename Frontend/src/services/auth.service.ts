import { apiClient } from '../api/client'

export interface User {
  id: string
  name: string
  email: string
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
  }) => {
    const response = await apiClient.post<AuthResponse>(
      '/user/register',
      userData
    )
    // We don't set local storage here anymore if we want to enforce email verification before login
    // BUT the backend currently sends a token anyway.
    // If we want to support "Register but need verification", we might still allow them to see the dashboard
    // or redirect them to a "Verify your email" page.
    return response
  },

  verifyEmail: async (token: string) => {
    return await apiClient.get(`/user/verify-email?token=${token}`)
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
