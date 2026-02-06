import React from 'react'
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
} from 'lucide-react'
import { type BlockType, BLOCK_TYPES } from '@/types/form'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

const iconMap: Record<string, React.ReactNode> = {
  heading: <Heading className="h-4 w-4" />,
  text: <Type className="h-4 w-4" />,
  'bullet-list': <List className="h-4 w-4" />,
  'numbered-list': <ListOrdered className="h-4 w-4" />,
  toggle: <ChevronRight className="h-4 w-4" />,
  quote: <Quote className="h-4 w-4" />,
  callout: <AlertCircle className="h-4 w-4" />,
  divider: <Minus className="h-4 w-4" />,
  'short-text': <TextCursorInput className="h-4 w-4" />,
  'long-text': <AlignLeft className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  dropdown: <ChevronDown className="h-4 w-4" />,
  'multiple-choice': <CircleDot className="h-4 w-4" />,
  checkbox: <CheckSquare className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  audio: <Music className="h-4 w-4" />,
  file: <File className="h-4 w-4" />,
  pdf: <FileText className="h-4 w-4" />,
  bookmark: <Link className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
}

const groups = [
  {
    name: 'Basic Blocks',
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
    name: 'Input Fields',
    types: ['short-text', 'long-text', 'email', 'number', 'phone', 'date'],
  },
  {
    name: 'Selection',
    types: ['multiple-choice', 'checkbox', 'dropdown'],
  },
  {
    name: 'Media & Files',
    types: ['image', 'video', 'audio', 'file', 'pdf', 'bookmark'],
  },
]

interface QuestionSidebarProps {
  onAddBlock: (type: BlockType) => void
  disabled?: boolean
}

export function QuestionSidebar({
  onAddBlock,
  disabled,
}: QuestionSidebarProps) {
  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type)
  }

  return (
    <aside className="border-border bg-background scrollbar-thin sticky top-0 hidden h-full w-64 flex-col overflow-y-auto border-r md:flex">
      <div className="border-border border-b p-4">
        <h2 className="text-foreground flex items-center gap-2 text-sm font-semibold">
          <Type className="text-primary h-4 w-4" />
          Blocks
        </h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Click to add or drag onto canvas
        </p>
      </div>

      <div className="flex-1 space-y-6 p-3">
        {groups.map(group => (
          <div key={group.name} className="space-y-2">
            <h3 className="text-muted-foreground/70 px-2 text-[10px] font-bold tracking-wider uppercase">
              {group.name}
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {group.types.map(type => {
                const config = BLOCK_TYPES.find(t => t.type === type)
                if (!config) return null

                return (
                  <motion.div
                    key={type}
                    whileHover={{ x: 4 }}
                    className="w-full"
                  >
                    <button
                      disabled={disabled}
                      onClick={() => onAddBlock(type as BlockType)}
                      draggable
                      onDragStart={e => handleDragStart(e, type as BlockType)}
                      className={cn(
                        'text-muted-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                        'hover:bg-accent hover:text-foreground group cursor-grab active:cursor-grabbing',
                        disabled &&
                          'pointer-events-none cursor-not-allowed opacity-50'
                      )}
                    >
                      <div className="bg-muted group-hover:bg-primary/10 group-hover:text-primary rounded-md p-1.5 transition-colors">
                        {iconMap[type] || <Type className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="truncate font-medium">
                          {config.label}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
