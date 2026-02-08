import React, { useState } from 'react'
import {
  Heading,
  Type,
  List,
  ListOrdered,
  ChevronRight,
  Quote,
  AlertCircle,
  Minus,
  TextCursorInput,
  AlignLeft,
  Mail,
  Hash,
  ChevronDown,
  CircleDot,
  CheckSquare,
  Calendar,
  Image as ImageIcon,
  Video,
  Music,
  File,
  FileText,
  Link,
  Phone,
  Clock,
} from 'lucide-react'
import { type BlockType, BLOCK_TYPES } from '@/types/form'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const iconMap: Record<string, React.ReactNode> = {
  heading: <Heading className="h-5 w-5" />,
  text: <Type className="h-5 w-5" />,
  'bullet-list': <List className="h-5 w-5" />,
  'numbered-list': <ListOrdered className="h-5 w-5" />,
  toggle: <ChevronRight className="h-5 w-5" />,
  quote: <Quote className="h-5 w-5" />,
  callout: <AlertCircle className="h-5 w-5" />,
  divider: <Minus className="h-5 w-5" />,
  'short-text': <TextCursorInput className="h-5 w-5" />,
  'long-text': <AlignLeft className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
  number: <Hash className="h-5 w-5" />,
  dropdown: <ChevronDown className="h-5 w-5" />,
  'multiple-choice': <CircleDot className="h-5 w-5" />,
  checkbox: <CheckSquare className="h-5 w-5" />,
  date: <Calendar className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  audio: <Music className="h-5 w-5" />,
  file: <File className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  bookmark: <Link className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
}

const groups = [
  {
    name: 'Basic',
    types: [
      'heading',
      'text',
      'bullet-list',
      'numbered-list',
      'divider',
      'quote',
      'callout',
      'toggle',
    ],
  },
  {
    name: 'Input',
    types: ['short-text', 'long-text', 'email', 'number', 'phone', 'date'],
  },
  {
    name: 'Selection',
    types: ['multiple-choice', 'checkbox', 'dropdown'],
  },
  {
    name: 'Media',
    types: ['image', 'video', 'audio', 'file', 'pdf', 'bookmark'],
  },
]

const STORAGE_KEY = 'formvista:block_usage'

interface QuestionSidebarProps {
  onAddBlock: (type: BlockType) => void
  disabled?: boolean
}

export function QuestionSidebar({
  onAddBlock,
  disabled,
}: QuestionSidebarProps) {
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (e) {
      console.error('Failed to load block usage', e)
      return {}
    }
  })

  const frequentBlocks = React.useMemo(() => {
    // Determine top 4 most used blocks
    return Object.entries(usageCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type)
      .slice(0, 4) // Top 4
      .filter(type => (usageCounts[type] || 0) > 0) // Only used ones
  }, [usageCounts])

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type)
  }

  const handleBlockClick = (type: BlockType) => {
    if (disabled) return
    onAddBlock(type)

    // Update usage count
    const newCounts = {
      ...usageCounts,
      [type]: (usageCounts[type] || 0) + 1,
    }
    setUsageCounts(newCounts)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCounts))
  }

  const renderBlockButton = (type: string) => {
    const config = BLOCK_TYPES.find(t => t.type === type)
    if (!config) return null

    return (
      <TooltipProvider key={type}>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                disabled={disabled}
                onClick={() => handleBlockClick(type as BlockType)}
                draggable
                onDragStart={e => handleDragStart(e, type as BlockType)}
                className={cn(
                  'bg-muted/50 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-transparent p-2 transition-all duration-200',
                  disabled && 'pointer-events-none opacity-50'
                )}
              >
                {iconMap[type] || <Type className="h-5 w-5" />}
              </button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <p className="font-semibold">{config.label}</p>
            <p className="text-muted-foreground text-xs">
              {config.description}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <aside className="border-border bg-background scrollbar-thin sticky top-0 hidden h-full w-[150px] flex-col overflow-y-auto border-r md:flex">
      <div className="border-border border-b p-4 text-center">
        <h2 className="text-foreground flex items-center justify-center gap-2 text-sm font-semibold">
          Blocks
        </h2>
      </div>

      <div className="flex-1 space-y-6 p-3">
        {/* Frequent Section */}
        {frequentBlocks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-muted-foreground/70 flex items-center justify-center gap-1 text-[10px] font-bold tracking-wider uppercase">
              <Clock className="h-3 w-3" /> Frequent
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {frequentBlocks.map(type => renderBlockButton(type))}
            </div>
            <div className="bg-border mx-auto h-px w-1/2 opacity-50" />
          </div>
        )}

        {groups.map(group => (
          <div key={group.name} className="space-y-2">
            <h3 className="text-muted-foreground/70 text-center text-[10px] font-bold tracking-wider uppercase">
              {group.name}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {group.types.map(type => renderBlockButton(type))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
