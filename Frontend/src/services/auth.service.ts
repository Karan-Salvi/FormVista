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
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response
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
