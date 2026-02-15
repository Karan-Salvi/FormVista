import React, { useState, useRef, useCallback, useEffect } from 'react'
import { type BlockType } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { BlockToolbar } from './BlockToolbar'
import { SlashCommandMenu } from './SlashCommandMenu'
import { BlockContextMenu } from './BlockContextMenu'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TextareaAutosize from 'react-textarea-autosize'
import { cn } from '@/lib/utils'

export const FormEditor: React.FC = () => {
  const {
    form,
    selectedBlockId,
    isPreviewMode,
    selectBlock,
    addBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    updateFormTitle,
    updateFormDescription,
  } = useFormStore()

  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  })
  const [slashQuery, setSlashQuery] = useState('')
  const [contextBlockId, setContextBlockId] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const editorRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === '/' && !showSlashMenu) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          setSlashMenuPosition({
            top: rect.bottom + 8,
            left: rect.left,
          })
          setShowSlashMenu(true)
          setSlashQuery('')
          e.preventDefault()
        }
      } else if (showSlashMenu) {
        if (e.key === 'Backspace' && slashQuery === '') {
          setShowSlashMenu(false)
        } else if (
          e.key !== 'ArrowDown' &&
          e.key !== 'ArrowUp' &&
          e.key !== 'Enter' &&
          e.key !== 'Escape'
        ) {
          if (e.key.length === 1) {
            setSlashQuery(prev => prev + e.key)
          } else if (e.key === 'Backspace') {
            setSlashQuery(prev => prev.slice(0, -1))
          }
        }
      }
    },
    [showSlashMenu, slashQuery]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleBlockSelect = (type: BlockType) => {
    addBlock(type, contextBlockId || selectedBlockId || undefined)
    setShowSlashMenu(false)
    setSlashQuery('')
    setContextBlockId(null)
  }

  const handleAddBlockClick = (afterBlockId?: string) => {
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect()
      setSlashMenuPosition({
        top: rect.top + window.scrollY + 100,
        left: rect.left + 80,
      })
      setContextBlockId(afterBlockId || null)
      setShowSlashMenu(true)
      setSlashQuery('')
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
      reorderBlocks(draggedIndex, dragOverIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  if (!form) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No form loaded</p>
      </div>
    )
  }

  const sortedBlocks = [...form.blocks].sort((a, b) => a.order - b.order)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const type = e.dataTransfer.getData('blockType') as BlockType
    if (type) {
      addBlock(
        type,
        dragOverIndex !== null ? sortedBlocks[dragOverIndex]?.id : undefined
      )
    }
    setDragOverIndex(null)
  }

  return (
    <div
      ref={editorRef}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      className="form-container-custom mx-auto min-h-screen max-w-2xl px-4 py-8 text-start transition-colors duration-300 sm:px-8 sm:py-12"
      style={
        {
          backgroundColor: form.theme?.backgroundColor || '#ffffff',
          '--text-custom': form.theme?.textColor || 'inherit',
        } as React.CSSProperties
      }
    >
      {/* Form Header */}
      <div className="mb-10">
        <TextareaAutosize
          readOnly={isPreviewMode}
          value={form.title}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateFormTitle(e.target.value)
          }
          placeholder="Untitled Form"
          className="text-display placeholder:text-muted-foreground/50 mb-4 w-full resize-none bg-transparent text-lg outline-none sm:text-2xl"
        />
        <TextareaAutosize
          readOnly={isPreviewMode}
          value={form.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateFormDescription(e.target.value)
          }
          placeholder="Add a description..."
          className="text-body placeholder:text-muted-foreground/50 w-full resize-none bg-transparent text-sm outline-none sm:text-lg"
        />
      </div>

      {/* Blocks */}
      <div className="space-y-1">
        {sortedBlocks.map((block, index) => (
          <BlockContextMenu key={block.id} blockId={block.id}>
            <div
              draggable={!isPreviewMode}
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onClick={() => selectBlock(block.id)}
              className={cn(
                'form-block group relative pr-2 pl-10 transition-all sm:pr-4 sm:pl-20',
                selectedBlockId === block.id && 'selected',
                dragOverIndex === index && 'pt-4',
                draggedIndex === index && 'opacity-50'
              )}
            >
              {dragOverIndex === index && (
                <div className="bg-primary absolute top-0 right-4 left-10 h-1 rounded-full sm:left-20" />
              )}
              {!isPreviewMode && (
                <BlockToolbar
                  onDuplicate={() => duplicateBlock(block.id)}
                  onDelete={() => deleteBlock(block.id)}
                />
              )}
              <div className="py-2">
                <BlockRenderer
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  isPreview={isPreviewMode}
                />
              </div>
            </div>
          </BlockContextMenu>
        ))}

        {/* Drop zone when empty or at bottom */}
        {sortedBlocks.length === 0 && !isPreviewMode && (
          <div
            onDragOver={e => {
              e.preventDefault()
              setDragOverIndex(0)
            }}
            onDrop={handleDrop}
            className={cn(
              'flex h-32 items-center justify-center rounded-lg border-2 border-dashed transition-colors',
              dragOverIndex === 0
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/20'
            )}
          >
            <p className="text-muted-foreground text-sm">
              Drag blocks here to get started
            </p>
          </div>
        )}
      </div>

      {/* Add Block Button */}
      {!isPreviewMode && (
        <div className="mt-6 pl-10 sm:pl-20">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={() => handleAddBlockClick()}
          >
            <Plus className="h-4 w-4" />
            Add a block or type /
          </Button>
        </div>
      )}

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <SlashCommandMenu
          position={slashMenuPosition}
          onSelect={handleBlockSelect}
          onClose={() => {
            setShowSlashMenu(false)
            setSlashQuery('')
          }}
          searchQuery={slashQuery}
        />
      )}
    </div>
  )
}
