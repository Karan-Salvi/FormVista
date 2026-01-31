import React from 'react'
import { useFormStore } from '@/store/formStore'
import { Copy, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface BlockContextMenuProps {
  children: React.ReactNode
  blockId: string
  onOpenSettings?: () => void
}

export const BlockContextMenu: React.FC<BlockContextMenuProps> = ({
  children,
  blockId,
  onOpenSettings,
}) => {
  const { form, deleteBlock, duplicateBlock, reorderBlocks, selectBlock } =
    useFormStore()

  const blockIndex = form?.blocks.findIndex(b => b.id === blockId) ?? -1
  const canMoveUp = blockIndex > 0
  const canMoveDown = blockIndex < (form?.blocks.length ?? 0) - 1

  const handleMoveUp = () => {
    if (canMoveUp) {
      reorderBlocks(blockIndex, blockIndex - 1)
    }
  }

  const handleMoveDown = () => {
    if (canMoveDown) {
      reorderBlocks(blockIndex, blockIndex + 1)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem
          onClick={() => {
            selectBlock(blockId)
            onOpenSettings?.()
          }}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Edit block
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => duplicateBlock(blockId)}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={handleMoveUp}
          disabled={!canMoveUp}
          className="gap-2"
        >
          <ArrowUp className="h-4 w-4" />
          Move up
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleMoveDown}
          disabled={!canMoveDown}
          className="gap-2"
        >
          <ArrowDown className="h-4 w-4" />
          Move down
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => deleteBlock(blockId)}
          className="text-destructive focus:text-destructive gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
