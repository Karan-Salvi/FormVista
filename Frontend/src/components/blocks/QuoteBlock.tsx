import React, { useCallback, useRef, useEffect } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'

interface QuoteBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const contentRef = useRef<HTMLQuoteElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (contentRef.current && !isInitialized.current) {
      contentRef.current.textContent = block.config.content || 'Type a quote...'
      isInitialized.current = true
    }
  }, [])

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      updateBlock(block.id, {
        config: { content: contentRef.current.textContent || '' },
      })
    }
  }, [block.id, updateBlock])

  if (isPreview) {
    return (
      <blockquote className="border-primary text-muted-foreground border-l-4 py-2 pl-4 italic">
        {block.config.content || 'Type a quote...'}
      </blockquote>
    )
  }

  return (
    <div
      className={`py-1 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
    >
      <blockquote
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="border-primary text-muted-foreground border-l-4 py-2 pl-4 italic outline-none"
      />
    </div>
  )
}
