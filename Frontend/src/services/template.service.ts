import { apiClient } from '../api/client'

export interface Template {
  id: string
  title: string
  description?: string
  category: string
  thumbnail_url?: string
  theme_config?: Record<string, unknown>
  blocks?: any[]
}

export interface TemplatesResponse {
  success: boolean
  data: Template[]
}

export interface TemplateResponse {
  success: boolean
  data: Template
}

export const templateService = {
  getTemplates: async (): Promise<TemplatesResponse> => {
    return await apiClient.get<TemplatesResponse>('/templates')
  },

  getTemplateById: async (id: string): Promise<TemplateResponse> => {
    return await apiClient.get<TemplateResponse>(`/templates/${id}`)
  },

  createFormFromTemplate: async (
    templateId: string,
    title?: string
  ): Promise<{ success: boolean; data: { id: string; slug: string } }> => {
    return await apiClient.post<{
      success: boolean
      data: { id: string; slug: string }
    }>('/templates/use', { templateId, title })
  },

  createTemplate: async (
    data: Record<string, unknown>
  ): Promise<TemplateResponse> => {
    return await apiClient.post<TemplateResponse>('/templates', data)
  },

  deleteTemplate: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.delete<{
      success: boolean
      message: string
    }>(`/templates/${id}`)
  },
}
