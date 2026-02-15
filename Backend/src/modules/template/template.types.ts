import { ApiResponse } from '../../shared/interfaces/response.interface.js';

export interface CreateTemplateRequest {
  title: string;
  description?: string;
  category: string;
  thumbnail_url?: string;
  theme_config?: Record<string, unknown>;
  blocks: TemplateBlockData[];
}

export interface TemplateBlockData {
  type: string;
  label: string;
  field_key: string;
  position: number;
  required: boolean;
  config?: Record<string, unknown>;
}

export interface TemplateResponseData {
  id: string;
  title: string;
  description?: string;
  category: string;
  thumbnail_url?: string;
  theme_config?: Record<string, unknown>;
  blocks?: TemplateBlockData[];
}

export type TemplateResponse = ApiResponse<TemplateResponseData>;
export type TemplatesResponse = ApiResponse<TemplateResponseData[]>;
