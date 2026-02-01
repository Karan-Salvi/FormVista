const BASE_URL = 'http://localhost:5000/api'

interface RequestOptions extends RequestInit {
  data?: any
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { data, headers, ...customConfig } = options

    const token = localStorage.getItem('token')

    const config: RequestInit = {
      ...customConfig,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Something went wrong')
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      throw error
    }
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, data, method: 'POST' })
  }

  put<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, data, method: 'PUT' })
  }

  patch<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, data, method: 'PATCH' })
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
