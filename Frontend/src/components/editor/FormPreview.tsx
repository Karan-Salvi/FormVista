import React from 'react'
import { useFormStore } from '@/store/formStore'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Sparkles } from 'lucide-react'

export const FormPreview: React.FC = () => {
  const { form } = useFormStore()
  const [responses, setResponses] = React.useState<Record<string, unknown>>({})

  if (!form) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No form to preview</p>
      </div>
    )
  }

  const handleResponseChange = (blockId: string, value: unknown) => {
    setResponses(prev => ({ ...prev, [blockId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form responses:', responses)
    // In production, this would submit to the backend
  }

  const sortedBlocks = [...form.blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="bg-surface-subtle min-h-screen text-start">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-16">
        <form onSubmit={handleSubmit}>
          {/* Form Header */}
          {/* <div className="mb-10">
            <h1 className="text-display text-foreground mb-4 text-2xl">
              {form.title || 'Untitled Form'}
            </h1>
            {form.description && (
              <p className="text-body text-muted-foreground text-lg">
                {form.description}
              </p>
            )}
          </div> */}

          {/* Blocks */}
          <div className="space-y-6">
            {sortedBlocks.map(block => (
              <div key={block.id} className="animate-fade-in">
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

          {/* Submit Button & Trust Signals */}
          <div className="flex flex-col items-center gap-6 pt-10">
            <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                className="w-full px-12 text-lg font-semibold sm:w-auto"
              >
                Submit
              </Button>

              <div className="text-muted-foreground bg-muted/30 border-border/50 flex items-center gap-2 rounded-full border px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium">
                  We respect your privacy. Your data is secure.
                </span>
              </div>
            </div>

            <div className="text-muted-foreground/60 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by FormVista</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
