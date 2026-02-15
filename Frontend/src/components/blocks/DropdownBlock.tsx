import React, { useRef, useEffect, useCallback } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

import { cn } from '@/lib/utils'

interface DropdownBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
  value?: string
  onChange?: (value: string) => void
  error?: string
}

export const DropdownBlock: React.FC<DropdownBlockProps> = ({
  block,
  isSelected,
  isPreview,
  value,
  onChange,
  error,
}) => {
  const { updateBlock } = useFormStore()
  const { label, options = [], required } = block.config
  const labelRef = useRef<HTMLSpanElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isSelected && labelRef.current && !isPreview) {
      labelRef.current.focus()
    }
  }, [isSelected, isPreview])

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

  const handleOptionChange = (index: number, newValue: string) => {
    const newOptions = [...options]
    newOptions[index] = newValue
    updateBlock(block.id, { config: { ...block.config, options: newOptions } })
  }

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    updateBlock(block.id, { config: { ...block.config, options: newOptions } })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    updateBlock(block.id, { config: { ...block.config, options: newOptions } })
  }

  if (isPreview) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {label}
          {(required || isPreview) && (
            <span className="text-destructive ml-0.5">*</span>
          )}
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              'bg-background',
              error && 'border-destructive focus:ring-destructive/20'
            )}
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-1">
        <span
          ref={labelRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleLabelChange}
          className="empty:before:text-muted-foreground/50 text-sm font-medium outline-none empty:before:content-['Label']"
        />
      </Label>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="border-muted-foreground/30 h-3 w-3 rounded border-2" />
            <Input
              value={option}
              onChange={e => handleOptionChange(index, e.target.value)}
              className="h-8 flex-1 text-sm"
              placeholder={`Option ${index + 1}`}
            />
            {options.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-8 w-8"
                onClick={() => removeOption(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={addOption}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add option
        </Button>
      </div>
    </div>
  )
}
