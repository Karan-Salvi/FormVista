import React, { useCallback, useRef, useEffect } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Plus, X } from 'lucide-react'

interface ListBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const ListBlock: React.FC<ListBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const items = block.config.items || ['List item']
  const isNumbered = block.type === 'numbered-list'

  const addItem = useCallback(() => {
    updateBlock(block.id, {
      config: { items: [...items, 'New item'] },
    })
  }, [block.id, items, updateBlock])

  const removeItem = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index)
      updateBlock(block.id, {
        config: { items: newItems.length > 0 ? newItems : ['List item'] },
      })
    },
    [block.id, items, updateBlock]
  )

  const updateItem = useCallback(
    (index: number, value: string) => {
      const newItems = [...items]
      newItems[index] = value
      updateBlock(block.id, {
        config: { items: newItems },
      })
    },
    [block.id, items, updateBlock]
  )

  return (
    <div
      className={`py-1 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
    >
      <ul
        className={`space-y-1 ${isNumbered ? 'list-decimal' : 'list-disc'} list-inside`}
      >
        {items.map((item, index) => (
          <ListItem
            key={index}
            index={index}
            item={item}
            isNumbered={isNumbered}
            isPreview={isPreview}
            onUpdate={updateItem}
            onRemove={removeItem}
            showRemove={items.length > 1}
            autoFocus={isSelected && index === 0}
          />
        ))}
      </ul>
      {!isPreview && (
        <button
          onClick={addItem}
          className="text-muted-foreground hover:text-foreground mt-2 flex items-center gap-1 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add item
        </button>
      )}
    </div>
  )
}

interface ListItemProps {
  index: number
  item: string
  isNumbered: boolean
  isPreview?: boolean
  onUpdate: (index: number, value: string) => void
  onRemove: (index: number) => void
  showRemove: boolean
}

const ListItem: React.FC<ListItemProps & { autoFocus?: boolean }> = ({
  index,
  item,
  isNumbered,
  isPreview,
  onUpdate,
  onRemove,
  showRemove,
  autoFocus,
}) => {
  const itemRef = useRef<HTMLSpanElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (itemRef.current && !isInitialized.current) {
      itemRef.current.textContent = item
      isInitialized.current = true
    }
  }, [])

  useEffect(() => {
    if (autoFocus && itemRef.current && !isPreview) {
      itemRef.current.focus()
    }
  }, [autoFocus, isPreview])

  const handleInput = useCallback(() => {
    if (itemRef.current) {
      onUpdate(index, itemRef.current.textContent || '')
    }
  }, [index, onUpdate])

  if (isPreview) {
    return (
      <li className="text-foreground">
        <span className="ml-1">{item}</span>
      </li>
    )
  }

  return (
    <li className="group flex items-center">
      <span className="text-muted-foreground mr-1">
        {isNumbered ? `${index + 1}.` : '•'}
      </span>
      <span
        ref={itemRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="text-foreground flex-1 outline-none"
      />
      {showRemove && (
        <button
          onClick={() => onRemove(index)}
          className="text-muted-foreground hover:text-destructive p-1 opacity-0 transition-all group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </li>
  )
}
