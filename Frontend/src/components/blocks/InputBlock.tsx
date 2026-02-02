import React, { useRef, useEffect, useCallback } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface InputBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
  value?: string
  onChange?: (value: string) => void
  error?: string
}

export const InputBlock: React.FC<InputBlockProps> = ({
  block,
  isSelected,
  isPreview,
  value,
  onChange,
  error,
}) => {
  const { updateBlock } = useFormStore()
  const { label, placeholder, helpText, required } = block.config
  const labelRef = useRef<HTMLSpanElement>(null)
  const placeholderRef = useRef<HTMLSpanElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isSelected && labelRef.current && !isPreview) {
      labelRef.current.focus()
    }
  }, [isSelected, isPreview])

  // Set initial content only once
  useEffect(() => {
    if (!isInitialized.current && !isPreview) {
      if (labelRef.current) labelRef.current.textContent = label || ''
      if (placeholderRef.current)
        placeholderRef.current.textContent = placeholder || ''
      isInitialized.current = true
    }
  }, [label, placeholder, isPreview])

  const handleLabelChange = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      const newLabel = e.currentTarget.textContent || ''
      updateBlock(block.id, { config: { ...block.config, label: newLabel } })
    },
    [block.id, block.config, updateBlock]
  )

  const handlePlaceholderChange = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      const newPlaceholder = e.currentTarget.textContent || ''
      updateBlock(block.id, {
        config: { ...block.config, placeholder: newPlaceholder },
      })
    },
    [block.id, block.config, updateBlock]
  )

  const inputType =
    block.type === 'email'
      ? 'email'
      : block.type === 'number'
        ? 'number'
        : block.type === 'phone'
          ? 'tel'
          : 'text'

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {isPreview ? (
          <span className="text-foreground text-sm font-medium">
            {label}
            {(required || isPreview) && (
              <span className="text-destructive ml-0.5">*</span>
            )}
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
        isPreview ? (
          <Textarea
            placeholder={placeholder}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            className={cn(
              'bg-background border-input focus:border-primary focus:ring-primary/20 min-h-[100px] resize-y transition-all focus:ring-1',
              error &&
                'border-destructive focus:border-destructive focus:ring-destructive/20'
            )}
          />
        ) : (
          <div className="bg-background border-input relative min-h-[100px] rounded-md border p-3">
            <span
              ref={placeholderRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handlePlaceholderChange}
              className="text-muted-foreground/50 empty:before:text-muted-foreground/30 block w-full outline-none empty:before:content-['Add_placeholder...']"
            />
          </div>
        )
      ) : isPreview ? (
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={cn(
            'bg-background border-input focus:border-primary focus:ring-primary/20 transition-all focus:ring-1',
            error &&
              'border-destructive focus:border-destructive focus:ring-destructive/20'
          )}
        />
      ) : (
        <div className="bg-background border-input relative flex h-10 items-center rounded-md border px-3 py-2">
          <span
            ref={placeholderRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handlePlaceholderChange}
            className="text-muted-foreground/50 empty:before:text-muted-foreground/30 w-full outline-none empty:before:content-['Add_placeholder...']"
          />
        </div>
      )}

      {helpText && <p className="text-muted-foreground text-xs">{helpText}</p>}
    </div>
  )
}
