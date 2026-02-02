import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formService } from '@/services/form.service'
import { type Form, type Block } from '@/types/form'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { colorThemes, fontFamilies } from '@/constants/theme'
import { hexToHsl } from '@/lib/utils'

const PublicForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [responses, setResponses] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const loadForm = async () => {
      if (!slug) return
      try {
        const res = await formService.getBySlug(slug)
        if (res.data) {
          const blocksRes = await formService.getBlocks(res.data.id)
          const formattedBlocks: Block[] = (
            (blocksRes.data as any[]) || []
          ).map((b: any) => ({
            ...b,
            id: b._id || b.id,
            config: b.config || {},
            order: b.position !== undefined ? b.position : b.order,
          }))

          if (res.data.status !== 'published') {
            setForm(null)
            return
          }

          const formData: Form = {
            id: res.data.id,
            title: res.data.title,
            slug: res.data.slug,
            description: res.data.description,
            theme: res.data.theme_config,
            blocks: formattedBlocks,
            isPublished: true,
            createdAt: new Date(res.data.createdAt),
            updatedAt: new Date(res.data.updatedAt),
          }
          setForm(formData)

          // Apply theme
          if (formData.theme) {
            const { primaryColor, fontFamily } = formData.theme

            if (primaryColor?.startsWith('#')) {
              const { h, s, l } = hexToHsl(primaryColor)
              const hslString = `${h} ${s}% ${l}%`
              const accentString = `${h} 100% 96%`
              document.documentElement.style.setProperty('--primary', hslString)
              document.documentElement.style.setProperty(
                '--accent-soft',
                accentString
              )
              document.documentElement.style.setProperty('--ring', hslString)
            } else {
              const theme = colorThemes.find(t => t.id === primaryColor)
              if (theme) {
                document.documentElement.style.setProperty(
                  '--primary',
                  theme.primary
                )
                document.documentElement.style.setProperty(
                  '--accent-soft',
                  theme.accent
                )
                document.documentElement.style.setProperty(
                  '--ring',
                  theme.primary
                )
              }
            }

            const font = fontFamilies.find(f => f.id === fontFamily)
            if (font) {
              document.documentElement.style.setProperty(
                '--font-family',
                font.value
              )
              document.body.style.fontFamily = font.value
            }
          }
        }
      } catch (error) {
        console.error(error)
        toast.error('Form not found or unavailable')
      } finally {
        setLoading(false)
      }
    }
    loadForm()
  }, [slug])

  // Load responses from local storage
  useEffect(() => {
    if (slug) {
      const saved = localStorage.getItem(`form-draft-${slug}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Convert date strings back to Date objects if needed
          // Some blocks might store dates as strings in JSON
          setResponses(parsed)
        } catch (e) {
          console.error('Failed to parse saved responses', e)
        }
      }
    }
  }, [slug])

  // Save responses to local storage
  useEffect(() => {
    if (slug && !submitted && Object.keys(responses).length > 0) {
      localStorage.setItem(`form-draft-${slug}`, JSON.stringify(responses))
    }
  }, [responses, slug, submitted])

  const handleResponseChange = (blockId: string, value: unknown) => {
    setResponses(prev => ({ ...prev, [blockId]: value }))
    if (errors[blockId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[blockId]
        return newErrors
      })
    }
  }

  const validate = (): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {}
    const inputBlockTypes = [
      'short-text',
      'long-text',
      'email',
      'number',
      'dropdown',
      'multiple-choice',
      'checkbox',
      'date',
      'phone',
    ]

    form?.blocks.forEach(block => {
      if (!inputBlockTypes.includes(block.type)) return

      const value = responses[block.id]
      const label = block.config.label || 'This field'

      // Required check
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)

      if (isEmpty) {
        newErrors[block.id] = `${label} is required`
      } else if (
        block.type === 'email' &&
        typeof value === 'string' &&
        value.trim() !== ''
      ) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          newErrors[block.id] = 'Please enter a valid email address'
        }
      } else if (
        block.type === 'phone' &&
        typeof value === 'string' &&
        value.trim() !== ''
      ) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/
        if (!phoneRegex.test(value)) {
          newErrors[block.id] = 'Please enter a valid phone number'
        }
      } else if (
        block.type === 'number' &&
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        if (isNaN(Number(value))) {
          newErrors[block.id] = 'Please enter a valid number'
        }
      }
    })

    setErrors(newErrors)
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !slug) return

    const { isValid, errors: validationErrors } = validate()
    if (!isValid) {
      toast.error('Please fix the errors before submitting')
      // Scroll to first error
      const firstErrorId = Object.keys(validationErrors)[0]
      if (firstErrorId) {
        const element = document.getElementById(`block-${firstErrorId}`)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
      return
    }

    setSubmitting(true)
    try {
      const submissionData = {
        answers: Object.entries(responses).map(([blockId, value]) => {
          const block = form.blocks.find(b => b.id === blockId)
          return {
            block_id: blockId,
            field_key: (block as any)?.field_key || `field_${blockId}`,
            value,
          }
        }),
        completion_time_ms: Date.now() - startTime,
      }

      await formService.submitResponse(slug, submissionData)
      localStorage.removeItem(`form-draft-${slug}`)
      setSubmitted(true)
      toast.success('Response submitted successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Form not found</h1>
        <p className="text-muted-foreground">
          The link you followed might be broken or the form has been
          unpublished.
        </p>
        <Button onClick={() => (window.location.href = '/')}>Go Home</Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-surface-subtle flex min-h-screen items-center justify-center p-4">
        <div className="bg-background animate-in fade-in zoom-in w-full max-w-md space-y-6 rounded-2xl p-8 text-center shadow-lg duration-300">
          <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Thank you!</h1>
            <p className="text-muted-foreground">
              Your response has been recorded.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Submit another response
          </Button>
        </div>
      </div>
    )
  }

  const sortedBlocks = [...form.blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="bg-surface-subtle selection:bg-primary/10 min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-20">
        {/* <div className="bg-background mb-12 space-y-4 rounded-2xl p-8 shadow-sm">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-muted-foreground text-lg">{form.description}</p>
          )}
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {sortedBlocks.map(block => (
              <div key={block.id} id={`block-${block.id}`}>
                <BlockRenderer
                  block={block}
                  isSelected={false}
                  isPreview={true}
                  value={responses[block.id]}
                  onChange={value => handleResponseChange(block.id, value)}
                  error={errors[block.id]}
                />
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full px-12 text-lg font-semibold sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
            <span className="text-muted-foreground text-sm">
              Powered by FormVista
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublicForm
