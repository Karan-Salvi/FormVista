import React from 'react'
import { useFormStore } from '@/store/formStore'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button } from '@/components/ui/button'

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
      <div className="mx-auto max-w-2xl px-8 py-16">
        <form onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="mb-10">
            <h1 className="text-display text-foreground mb-4">
              {form.title || 'Untitled Form'}
            </h1>
            {form.description && (
              <p className="text-body text-muted-foreground">
                {form.description}
              </p>
            )}
          </div>

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

          {/* Submit Button */}
          <div className="mt-10">
            <Button type="submit" size="lg" className="w-full px-8 sm:w-auto">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
