import React, { useEffect } from 'react'
import { useFormStore } from '@/store/formStore'
import { FormEditor } from '@/components/editor/FormEditor'
import { FormPreview } from '@/components/editor/FormPreview'
import { ThemePanel } from '@/components/editor/ThemePanel'
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

const FormBuilderPage: React.FC = () => {
  const { form, setForm, isPreviewMode, togglePreviewMode } = useFormStore()

  useEffect(() => {
    if (!form) {
      setForm(createDefaultForm())
    }
  }, [form, setForm])

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
