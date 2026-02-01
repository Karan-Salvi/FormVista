import { z } from 'zod';

export const createFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().optional(),
  slug: z
    .string()
    .toLowerCase()
    .trim()
    .min(3, 'Slug must be at least 3 characters'),
  theme_config: z.record(z.string(), z.unknown()).optional(),
});

export const updateFormSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  theme_config: z.record(z.string(), z.unknown()).optional(),
  export_settings: z
    .object({
      fileName: z.string().optional(),
      includeMetadata: z.boolean().optional(),
      dateFormat: z.string().optional(),
    })
    .optional(),
});

export const addBlockSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  label: z.string().min(1, 'Label is required'),
  field_key: z.string().min(1, 'Field key is required'),
  position: z.number().int().min(0),
  required: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const submitResponseSchema = z.object({
  answers: z.array(
    z.object({
      block_id: z.string(),
      field_key: z.string(),
      value: z.unknown(),
    })
  ),
  completion_time_ms: z.number().optional(),
});
