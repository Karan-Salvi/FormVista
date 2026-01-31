import React from 'react';
import { GripVertical, Copy, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BlockToolbarProps {
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  onDuplicate,
  onDelete,
  onSettings,
  dragHandleProps,
}) => {
  return (
    <div className="flex items-center gap-0.5 absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div {...dragHandleProps} className="drag-handle">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onDuplicate}
          >
            <Copy className="w-3.5 h-3.5" />
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
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
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
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onSettings}
            >
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Settings
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
