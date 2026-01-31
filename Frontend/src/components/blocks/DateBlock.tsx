import React, { useRef, useEffect, useCallback } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DateBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
  value?: Date
  onChange?: (value: Date | undefined) => void
}

export const DateBlock: React.FC<DateBlockProps> = ({
  block,
  isPreview,
  value,
  onChange,
}) => {
  const { updateBlock } = useFormStore()
  const { label, required } = block.config
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

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={!isPreview}
            className={cn(
              'bg-background w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
