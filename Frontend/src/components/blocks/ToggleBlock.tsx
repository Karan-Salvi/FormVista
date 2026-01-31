import React, { useCallback, useRef, useEffect } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface ToggleBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const ToggleBlock: React.FC<ToggleBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const labelRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isLabelInitialized = useRef(false)
  const isContentInitialized = useRef(false)
  const isOpen = block.config.isOpen ?? false

  useEffect(() => {
    if (labelRef.current && !isLabelInitialized.current) {
      labelRef.current.textContent = block.config.label || 'Toggle heading'
      isLabelInitialized.current = true
    }
  }, [])

  useEffect(() => {
    if (contentRef.current && !isContentInitialized.current) {
      contentRef.current.textContent =
        block.config.content || 'Toggle content...'
      isContentInitialized.current = true
    }
  }, [])

  const handleLabelInput = useCallback(() => {
    if (labelRef.current) {
      updateBlock(block.id, {
        config: { label: labelRef.current.textContent || '' },
      })
    }
  }, [block.id, updateBlock])

  const handleContentInput = useCallback(() => {
    if (contentRef.current) {
      updateBlock(block.id, {
        config: { content: contentRef.current.textContent || '' },
      })
    }
  }, [block.id, updateBlock])

  const toggleOpen = useCallback(() => {
    updateBlock(block.id, {
      config: { isOpen: !isOpen },
    })
  }, [block.id, isOpen, updateBlock])

  return (
    <div
      className={`py-1 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
    >
      <Collapsible open={isOpen} onOpenChange={toggleOpen}>
        <CollapsibleTrigger className="hover:bg-accent/50 -ml-1 flex w-full items-center gap-2 rounded-md p-1 text-left transition-colors">
          <ChevronRight
            className={`text-muted-foreground h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
          {isPreview ? (
            <span className="text-foreground font-medium">
              {block.config.label || 'Toggle heading'}
            </span>
          ) : (
            <span
              ref={labelRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleLabelInput}
              onClick={e => e.stopPropagation()}
              className="text-foreground flex-1 font-medium outline-none"
            />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pl-6">
          {isPreview ? (
            <p className="text-muted-foreground">
              {block.config.content || 'Toggle content...'}
            </p>
          ) : (
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentInput}
              className="text-muted-foreground outline-none"
            />
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
