import React, { useRef, useEffect, useCallback } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface InputBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
  value?: string
  onChange?: (value: string) => void
}

export const InputBlock: React.FC<InputBlockProps> = ({
  block,
  isPreview,
  value,
  onChange,
}) => {
  const { updateBlock } = useFormStore()
  const { label, placeholder, helpText, required } = block.config
  const labelRef = useRef<HTMLSpanElement>(null)
  const isInitialized = useRef(false)

  // Set initial content only once
  useEffect(() => {
    if (labelRef.current && !isInitialized.current && !isPreview) {
      labelRef.current.textContent = label || ''
      isInitialized.current = true
    }
  }, [label, isPreview])

  const handleLabelChange = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      const newLabel = e.currentTarget.textContent || ''
      updateBlock(block.id, { config: { ...block.config, label: newLabel } })
    },
    [block.id, block.config, updateBlock]
  )

  const inputType =
    block.type === 'email'
      ? 'email'
      : block.type === 'number'
        ? 'number'
        : 'text'

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {isPreview ? (
          <span className="text-foreground text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </span>
        ) : (
          <span
            ref={labelRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleLabelChange}
            className="text-foreground empty:before:text-muted-foreground/50 text-sm font-medium outline-none empty:before:content-['Label']"
          />
        )}
      </Label>

      {block.type === 'long-text' ? (
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={!isPreview}
          className="bg-background border-input focus:border-primary focus:ring-primary/20 min-h-[100px] resize-y transition-all focus:ring-1"
        />
      ) : (
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={!isPreview}
          className="bg-background border-input focus:border-primary focus:ring-primary/20 transition-all focus:ring-1"
        />
      )}

      {helpText && <p className="text-muted-foreground text-xs">{helpText}</p>}
    </div>
  )
}
