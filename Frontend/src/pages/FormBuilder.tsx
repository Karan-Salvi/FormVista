import React, { useEffect } from 'react'
import { useFormStore } from '@/store/formStore'
import { FormEditor } from '@/components/editor/FormEditor'
import { FormPreview } from '@/components/editor/FormPreview'
import {
  ThemePanel,
  colorThemes,
  fontFamilies,
} from '@/components/editor/ThemePanel'
import { Button } from '@/components/ui/button'
import {
  Eye,
  EyeOff,
  Share,
  ChevronLeft,
  Sparkles,
  Palette,
} from 'lucide-react'
import { type Form } from '@/types/form'

// Create a default form for demonstration
const createDefaultForm = (): Form => ({
  id: 'demo-form',
  title: 'Customer Feedback Survey',
  description: 'Help us improve by sharing your thoughts',
  blocks: [
    {
      id: '1',
      type: 'heading',
      config: { content: 'Tell us about your experience', level: 2 },
      order: 0,
    },
    {
      id: '2',
      type: 'text',
      config: {
        content:
          'We value your feedback and use it to improve our services. Please take a moment to share your thoughts.',
      },
      order: 1,
    },
    {
      id: '3',
      type: 'short-text',
      config: { label: 'Your name', placeholder: 'John Doe', required: true },
      order: 2,
    },
    {
      id: '4',
      type: 'email',
      config: {
        label: 'Email address',
        placeholder: 'john@example.com',
        required: true,
      },
      order: 3,
    },
    {
      id: '5',
      type: 'multiple-choice',
      config: {
        label: 'How satisfied are you with our service?',
        options: [
          'Very satisfied',
          'Satisfied',
          'Neutral',
          'Dissatisfied',
          'Very dissatisfied',
        ],
        required: true,
      },
      order: 4,
    },
    {
      id: '6',
      type: 'long-text',
      config: {
        label: 'What could we do better?',
        placeholder: 'Share your suggestions...',
      },
      order: 5,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: false,
})

import { useSearchParams } from 'react-router-dom'
import { formService } from '@/services/form.service'
import { toast } from 'sonner'
import type { Block } from '@/types/form'

const FormBuilderPage: React.FC = () => {
  const { form, setForm, isPreviewMode, togglePreviewMode } = useFormStore()
  const [searchParams] = useSearchParams()
  const formId = searchParams.get('formId')

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) {
        setForm(createDefaultForm())
        return
      }

      try {
        const [formRes, blocksRes] = await Promise.all([
          formService.getById(formId),
          formService.getBlocks(formId),
        ])

        if (formRes.data) {
          const blocks = blocksRes.data || []
          // Transform backend blocks to frontend blocks if needed
          // Assuming types are compatible or nearly compatible
          // Backend Block: { ..., position: number }
          // Frontend Block: { ..., order: number }

          const formattedBlocks = blocks.map((b: any) => ({
            ...b,
            id: b._id || b.id, // Handle _id from mongoose
            config: b.config || {},
            order: b.position !== undefined ? b.position : b.order,
          }))

          setForm({
            ...formRes.data,
            theme: formRes.data.theme_config,
            blocks: formattedBlocks as Block[], // Cast or map strictly
            isPublished: formRes.data.status === 'published',
          } as any) // Type casting might be needed due to mismatch
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to load form')
      }
    }
    loadForm()
  }, [formId, setForm])

  // Apply theme styles
  useEffect(() => {
    if (form?.theme) {
      const { primaryColor, fontFamily } = form.theme

      const theme = colorThemes.find(t => t.id === primaryColor)
      if (theme) {
        document.documentElement.style.setProperty('--primary', theme.primary)
        document.documentElement.style.setProperty(
          '--accent-soft',
          theme.accent
        )
        document.documentElement.style.setProperty('--ring', theme.primary)
      }

      const font = fontFamilies.find(f => f.id === fontFamily)
      if (font) {
        document.documentElement.style.setProperty('--font-family', font.value)
        document.body.style.fontFamily = font.value
      }
    }
  }, [form?.theme])

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => (window.location.href = '/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <span className="text-foreground font-semibold">FormVista</span>
            </div>
          </div>

          {/* Center - Form title */}
          <div className="flex flex-1 justify-center">
            <span className="text-muted-foreground max-w-xs truncate text-sm">
              {form?.title || 'Untitled Form'}
            </span>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreviewMode}
              className="gap-2"
            >
              {isPreviewMode ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
            <ThemePanel
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              }
            />
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={async () => {
                if (!form) return
                try {
                  const blocksToSave = form.blocks.map(b => ({
                    id: /^[0-9a-fA-F]{24}$/.test(b.id) ? b.id : undefined,
                    type: b.type,
                    label: b.config.label || 'Untitled',
                    field_key: (b as any).field_key || `field_${b.id}`,
                    position: b.order,
                    required: b.config.required,
                    config: b.config,
                  }))

                  await formService.update(form.id, {
                    title: form.title,
                    description: form.description,
                    theme_config: form.theme,
                    blocks: blocksToSave as any,
                  })

                  // Refresh blocks to get valid IDs from backend
                  const blocksRes = await formService.getBlocks(form.id)
                  if (blocksRes.data) {
                    const formattedBlocks = blocksRes.data.map((b: any) => ({
                      ...b,
                      id: b._id || b.id,
                      config: b.config || {},
                      order: b.position !== undefined ? b.position : b.order,
                    }))
                    setForm({ ...form, blocks: formattedBlocks as Block[] })
                  }

                  toast.success('Form saved!')
                } catch (e) {
                  console.error(e)
                  toast.error('Failed to save')
                }
              }}
            >
              <Sparkles className="h-4 w-4" />
              Save
            </Button>
            <Button size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-3.5rem)]">
        {isPreviewMode ? <FormPreview /> : <FormEditor />}
      </main>
    </div>
  )
}

export default FormBuilderPage
