import { create } from 'zustand'
import { type Block, type BlockType, type Form } from '@/types/form'

interface FormState {
  form: Form | null
  selectedBlockId: string | null
  isPreviewMode: boolean
  isDragging: boolean

  // Actions
  setForm: (form: Form) => void
  updateFormTitle: (title: string) => void
  updateFormDescription: (description: string) => void
  addBlock: (type: BlockType, afterBlockId?: string) => void
  updateBlock: (blockId: string, updates: Partial<Block>) => void
  deleteBlock: (blockId: string) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
  selectBlock: (blockId: string | null) => void
  togglePreviewMode: () => void
  setIsDragging: (isDragging: boolean) => void
  duplicateBlock: (blockId: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const createDefaultBlock = (type: BlockType, order: number): Block => {
  const baseConfig = { required: false }

  switch (type) {
    case 'heading':
      return {
        id: generateId(),
        type,
        config: { ...baseConfig, content: 'Untitled', level: 1 },
        order,
      }
    case 'text':
      return {
        id: generateId(),
        type,
        config: { ...baseConfig, content: 'Start typing...' },
        order,
      }
    case 'bullet-list':
    case 'numbered-list':
      return {
        id: generateId(),
        type,
        config: { ...baseConfig, items: ['List item'] },
        order,
      }
    case 'toggle':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Toggle heading',
          content: 'Toggle content...',
          isOpen: false,
        },
        order,
      }
    case 'quote':
      return {
        id: generateId(),
        type,
        config: { ...baseConfig, content: 'Type a quote...' },
        order,
      }
    case 'callout':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          content: 'Type callout text...',
          icon: 'info',
        },
        order,
      }
    case 'short-text':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Short answer',
          placeholder: 'Your answer',
        },
        order,
      }
    case 'long-text':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Long answer',
          placeholder: 'Your detailed answer',
        },
        order,
      }
    case 'email':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Email',
          placeholder: 'your@email.com',
        },
        order,
      }
    case 'number':
      return {
        id: generateId(),
        type,
        config: { ...baseConfig, label: 'Number', placeholder: '0' },
        order,
      }
    case 'dropdown':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Select an option',
          options: ['Option 1', 'Option 2', 'Option 3'],
        },
        order,
      }
    case 'multiple-choice':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Choose one',
          options: ['Option 1', 'Option 2', 'Option 3'],
        },
        order,
      }
    case 'checkbox':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Select all that apply',
          options: ['Option 1', 'Option 2', 'Option 3'],
        },
        order,
      }
    case 'date':
      return {
        id: generateId(),
        type,
        config: { ...baseConfig, label: 'Date' },
        order,
      }
    case 'divider':
      return { id: generateId(), type, config: {}, order }
    case 'image':
      return { id: generateId(), type, config: { imageUrl: '' }, order }
    case 'video':
      return {
        id: generateId(),
        type,
        config: { embedUrl: '', url: '' },
        order,
      }
    case 'audio':
      return {
        id: generateId(),
        type,
        config: { embedUrl: '', url: '' },
        order,
      }
    case 'file':
      return {
        id: generateId(),
        type,
        config: { url: '', fileName: '' },
        order,
      }
    case 'pdf':
      return { id: generateId(), type, config: { url: '' }, order }
    case 'bookmark':
      return { id: generateId(), type, config: { url: '', label: '' }, order }
    case 'phone':
      return {
        id: generateId(),
        type,
        config: {
          ...baseConfig,
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
        },
        order,
      }
    default:
      return { id: generateId(), type, config: baseConfig, order }
  }
}

export const useFormStore = create<FormState>(set => ({
  form: null,
  selectedBlockId: null,
  isPreviewMode: false,
  isDragging: false,

  setForm: form => set({ form }),

  updateFormTitle: title =>
    set(state => ({
      form: state.form ? { ...state.form, title, updatedAt: new Date() } : null,
    })),

  updateFormDescription: description =>
    set(state => ({
      form: state.form
        ? { ...state.form, description, updatedAt: new Date() }
        : null,
    })),

  addBlock: (type, afterBlockId) =>
    set(state => {
      if (!state.form) return state

      const blocks = [...state.form.blocks]
      let insertIndex = blocks.length

      if (afterBlockId) {
        const afterIndex = blocks.findIndex(b => b.id === afterBlockId)
        if (afterIndex !== -1) {
          insertIndex = afterIndex + 1
        }
      }

      const newBlock = createDefaultBlock(type, insertIndex)
      blocks.splice(insertIndex, 0, newBlock)

      // Update order for all blocks
      blocks.forEach((block, index) => {
        block.order = index
      })

      return {
        form: { ...state.form, blocks, updatedAt: new Date() },
        selectedBlockId: newBlock.id,
      }
    }),

  updateBlock: (blockId, updates) =>
    set(state => {
      if (!state.form) return state

      const blocks = state.form.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              ...updates,
              config: { ...block.config, ...updates.config },
            }
          : block
      )

      return {
        form: { ...state.form, blocks, updatedAt: new Date() },
      }
    }),

  deleteBlock: blockId =>
    set(state => {
      if (!state.form) return state

      const blocks = state.form.blocks
        .filter(block => block.id !== blockId)
        .map((block, index) => ({ ...block, order: index }))

      return {
        form: { ...state.form, blocks, updatedAt: new Date() },
        selectedBlockId:
          state.selectedBlockId === blockId ? null : state.selectedBlockId,
      }
    }),

  reorderBlocks: (startIndex, endIndex) =>
    set(state => {
      if (!state.form) return state

      const blocks = [...state.form.blocks]
      const [removed] = blocks.splice(startIndex, 1)
      blocks.splice(endIndex, 0, removed)

      blocks.forEach((block, index) => {
        block.order = index
      })

      return {
        form: { ...state.form, blocks, updatedAt: new Date() },
      }
    }),

  selectBlock: blockId => set({ selectedBlockId: blockId }),

  togglePreviewMode: () =>
    set(state => ({ isPreviewMode: !state.isPreviewMode })),

  setIsDragging: isDragging => set({ isDragging }),

  duplicateBlock: blockId =>
    set(state => {
      if (!state.form) return state

      const blockIndex = state.form.blocks.findIndex(b => b.id === blockId)
      if (blockIndex === -1) return state

      const originalBlock = state.form.blocks[blockIndex]
      const newBlock: Block = {
        ...originalBlock,
        id: generateId(),
        order: blockIndex + 1,
      }

      const blocks = [...state.form.blocks]
      blocks.splice(blockIndex + 1, 0, newBlock)

      blocks.forEach((block, index) => {
        block.order = index
      })

      return {
        form: { ...state.form, blocks, updatedAt: new Date() },
        selectedBlockId: newBlock.id,
      }
    }),
}))
