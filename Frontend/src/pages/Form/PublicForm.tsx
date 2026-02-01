import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formService } from '@/services/form.service'
import { type Form, type Block } from '@/types/form'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { colorThemes, fontFamilies } from '@/components/editor/ThemePanel'

const PublicForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [responses, setResponses] = useState<Record<string, unknown>>({})
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

  const handleResponseChange = (blockId: string, value: unknown) => {
    setResponses(prev => ({ ...prev, [blockId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !slug) return

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
              <div key={block.id}>
                <BlockRenderer
                  block={block}
                  isSelected={false}
                  isPreview={true}
                  value={responses[block.id]}
                  onChange={value => handleResponseChange(block.id, value)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
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
            <span className="text-muted-foreground hidden text-sm sm:block">
              Powered by FormVista
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublicForm
