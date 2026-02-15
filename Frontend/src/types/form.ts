export type BlockType =
  | 'heading'
  | 'text'
  | 'short-text'
  | 'long-text'
  | 'email'
  | 'number'
  | 'dropdown'
  | 'multiple-choice'
  | 'checkbox'
  | 'date'
  | 'divider'
  | 'image'
  | 'bullet-list'
  | 'numbered-list'
  | 'toggle'
  | 'quote'
  | 'callout'
  | 'bookmark'
  | 'video'
  | 'audio'
  | 'file'
  | 'pdf'
  | 'phone'

export interface BlockConfig {
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  options?: string[]
  level?: 1 | 2 | 3
  imageUrl?: string
  content?: string
  items?: string[]
  isOpen?: boolean
  url?: string
  icon?: string
  embedUrl?: string
  fileName?: string
  fileSize?: string
}

export interface Block {
  id: string
  type: BlockType
  config: BlockConfig
  order: number
}

export interface Form {
  id: string
  title: string
  slug: string
  description?: string
  blocks: Block[]
  theme?: FormTheme
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
}

export interface FormTheme {
  primaryColor: string
  backgroundColor: string
  fontFamily: string
  textColor: string
}

export interface FormResponse {
  id: string
  formId: string
  responses: Record<string, unknown>
  submittedAt: Date
}

export const BLOCK_TYPES: {
  type: BlockType
  label: string
  icon: string
  description: string
}[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: 'heading',
    description: 'Large section title',
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'text',
    description: 'Rich text paragraph',
  },
  {
    type: 'bullet-list',
    label: 'Bullet List',
    icon: 'list',
    description: 'Simple bullet list',
  },
  {
    type: 'numbered-list',
    label: 'Numbered List',
    icon: 'list-ordered',
    description: 'Numbered list',
  },
  {
    type: 'toggle',
    label: 'Toggle List',
    icon: 'chevron-right',
    description: 'Collapsible section',
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: 'quote',
    description: 'Stylish quote block',
  },
  {
    type: 'callout',
    label: 'Callout',
    icon: 'alert-circle',
    description: 'Highlighted info box',
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'minus',
    description: 'Visual separator',
  },
  {
    type: 'short-text',
    label: 'Short Text',
    icon: 'text-cursor-input',
    description: 'Single line input',
  },
  {
    type: 'long-text',
    label: 'Long Text',
    icon: 'align-left',
    description: 'Multi-line text area',
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'mail',
    description: 'Email address input',
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'hash',
    description: 'Numeric input',
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'chevron-down',
    description: 'Select from options',
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    icon: 'circle-dot',
    description: 'Radio button selection',
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'check-square',
    description: 'Multiple selections',
  },
  { type: 'date', label: 'Date', icon: 'calendar', description: 'Date picker' },
  {
    type: 'image',
    label: 'Image',
    icon: 'image',
    description: 'Upload or embed image',
  },
  {
    type: 'video',
    label: 'Video',
    icon: 'video',
    description: 'YouTube, Vimeo or upload',
  },
  {
    type: 'audio',
    label: 'Audio',
    icon: 'music',
    description: 'Spotify, SoundCloud or upload',
  },
  {
    type: 'file',
    label: 'File',
    icon: 'file',
    description: 'Upload documents',
  },
  {
    type: 'pdf',
    label: 'PDF',
    icon: 'file-text',
    description: 'Embed PDF viewer',
  },
  {
    type: 'bookmark',
    label: 'Web Bookmark',
    icon: 'link',
    description: 'Visual URL preview',
  },
  {
    type: 'phone',
    label: 'Phone Number',
    icon: 'phone',
    description: 'Phone number input',
  },
]
