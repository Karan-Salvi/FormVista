import { apiClient } from '../api/client'
import type { Block } from '../types/form'

export interface FormResponse {
  id: string
  title: string
  description?: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  theme_config?: any
  createdAt: string
  updatedAt: string
  blocks?: Block[]
}

export const formService = {
  getAll: async () => {
    return apiClient.get<{ success: boolean; data: FormResponse[] }>('/forms')
  },

  getById: async (id: string) => {
    return apiClient.get<{ success: boolean; data: FormResponse }>(
      `/forms/${id}`
    )
  },

  create: async (data: {
    title: string
    slug: string
    description?: string
  }) => {
    return apiClient.post<{ success: boolean; data: FormResponse }>(
      '/forms',
      data
    )
  },

  update: async (id: string, data: Partial<FormResponse>) => {
    return apiClient.patch<{ success: boolean; data: FormResponse }>(
      `/forms/${id}`,
      data
    )
  },

  delete: async (id: string) => {
    return apiClient.delete<{ success: boolean }>(`/forms/${id}`)
  },

  // Blocks
  getBlocks: async (formId: string) => {
    return apiClient.get<{ success: boolean; data: Block[] }>(
      `/forms/${formId}/blocks`
    )
  },

  addBlock: async (formId: string, data: any) => {
    return apiClient.post<{ success: boolean; data: Block }>(
      `/forms/${formId}/blocks`,
      data
    )
  },

  updateBlock: async (blockId: string, data: any) => {
    return apiClient.patch<{ success: boolean; data: Block }>(
      `/forms/blocks/${blockId}`,
      data
    )
  },

  deleteBlock: async (blockId: string) => {
    return apiClient.delete<{ success: boolean }>(`/forms/blocks/${blockId}`)
  },

  // Public
  getBySlug: async (slug: string) => {
    return apiClient.get<{ success: boolean; data: FormResponse }>(
      `/forms/slug/${slug}`
    )
  },

  submitResponse: async (slug: string, data: any) => {
    return apiClient.post<{ success: boolean }>(
      `/forms/slug/${slug}/submit`,
      data
    )
  },

  getResponses: async (formId: string) => {
    return apiClient.get<{ success: boolean; data: any[] }>(
      `/forms/${formId}/responses`
    )
  },
}
