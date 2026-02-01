import React from 'react'
import { GripVertical, Copy, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface BlockToolbarProps {
  onDuplicate: () => void
  onDelete: () => void
  onSettings?: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  onDuplicate,
  onDelete,
  onSettings,
  dragHandleProps,
}) => {
  return (
    <div className="absolute top-1/2 -left-9 flex -translate-y-1/2 items-center gap-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:-left-20">
      <div {...dragHandleProps} className="drag-handle">
        <GripVertical className="h-4 w-4" />
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-7 w-7"
            onClick={onDuplicate}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Duplicate
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-7 w-7"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Delete
        </TooltipContent>
      </Tooltip>

      {onSettings && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-7 w-7"
              onClick={onSettings}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Settings
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
