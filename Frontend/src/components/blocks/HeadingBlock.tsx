import React, { useRef, useEffect, useCallback } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'

interface HeadingBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const { updateBlock } = useFormStore()
  const inputRef = useRef<HTMLHeadingElement>(null)
  const isInitialized = useRef(false)

  const level = block.config.level || 1
  const content = block.config.content || 'Untitled'

  // Set initial content only once
  useEffect(() => {
    if (inputRef.current && !isInitialized.current && !isPreview) {
      inputRef.current.textContent = content
      isInitialized.current = true
    }
  }, [content, isPreview])

  useEffect(() => {
    if (isSelected && inputRef.current && !isPreview) {
      inputRef.current.focus()
    }
  }, [isSelected, isPreview])

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLHeadingElement>) => {
      const newContent = e.currentTarget.textContent || ''
      updateBlock(block.id, {
        config: { ...block.config, content: newContent },
      })
    },
    [block.id, block.config, updateBlock]
  )

  const baseClasses = 'outline-none w-full font-semibold text-foreground'
  const levelClasses = {
    1: 'text-h1',
    2: 'text-h2',
    3: 'text-h3',
  }

  if (isPreview) {
    const Tag = `h${level}` as any
    return (
      <Tag className={`${baseClasses} ${levelClasses[level as 1 | 2 | 3]}`}>
        {content}
      </Tag>
    )
  }

  return (
    <h1
      ref={inputRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      className={`${baseClasses} ${levelClasses[level as 1 | 2 | 3]} empty:before:text-muted-foreground/50 empty:before:content-['Heading']`}
      data-placeholder="Heading"
    />
  )
}
