import { IForm } from './form.model.js';
import { IBlock } from './block.model.js';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../shared/interfaces/response.interface.js';

export interface CreateFormRequest {
  title: string;
  description?: string;
  slug: string;
  theme_config?: Record<string, unknown>;
}

export interface UpdateFormRequest {
  title?: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  theme_config?: Record<string, unknown>;
  export_settings?: {
    fileName?: string;
    includeMetadata?: boolean;
    dateFormat?: string;
  };
  blocks?: (AddBlockRequest & { id?: string })[];
}

export interface AddBlockRequest {
  type: string;
  label: string;
  field_key: string;
  position: number;
  required?: boolean;
  config?: Record<string, unknown>;
}

export interface SubmitResponseRequest {
  answers: {
    block_id: string;
    field_key: string;
    value: unknown;
  }[];
  completion_time_ms?: number;
}

export interface FormResponseData extends Omit<Partial<IForm>, 'user_id'> {
  id: string;
  user_id?: string;
  blocks?: IBlock[];
}

export type FormResponse = ApiResponse<FormResponseData>;
export type FormsResponse = ApiResponse<FormResponseData[]>;
export type BlockResponse = ApiResponse<IBlock>;
export type BlocksResponse = ApiResponse<IBlock[]>;
export interface FormSubmissionData {
  id: string;
  submittedAt: Date;
  answers: {
    block_id: string;
    field_key: string;
    value: unknown;
  }[];
}

export type FormResponsesResponse = ApiResponse<
  PaginatedResponse<FormSubmissionData>
>;
