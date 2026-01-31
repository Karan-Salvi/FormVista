import React, { useCallback, useRef, useEffect } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { Plus, X } from 'lucide-react';

interface ListBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

export const ListBlock: React.FC<ListBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const items = block.config.items || ['List item'];
  const isNumbered = block.type === 'numbered-list';

  const addItem = useCallback(() => {
    updateBlock(block.id, {
      config: { items: [...items, 'New item'] },
    });
  }, [block.id, items, updateBlock]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateBlock(block.id, {
      config: { items: newItems.length > 0 ? newItems : ['List item'] },
    });
  }, [block.id, items, updateBlock]);

  const updateItem = useCallback((index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    updateBlock(block.id, {
      config: { items: newItems },
    });
  }, [block.id, items, updateBlock]);

  return (
    <div className={`py-1 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
      <ul className={`space-y-1 ${isNumbered ? 'list-decimal' : 'list-disc'} list-inside`}>
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
          />
        ))}
      </ul>
      {!isPreview && (
        <button
          onClick={addItem}
          className="mt-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add item
        </button>
      )}
    </div>
  );
};

interface ListItemProps {
  index: number;
  item: string;
  isNumbered: boolean;
  isPreview?: boolean;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  index,
  item,
  isNumbered,
  isPreview,
  onUpdate,
  onRemove,
  showRemove,
}) => {
  const itemRef = useRef<HTMLSpanElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (itemRef.current && !isInitialized.current) {
      itemRef.current.textContent = item;
      isInitialized.current = true;
    }
  }, []);

  const handleInput = useCallback(() => {
    if (itemRef.current) {
      onUpdate(index, itemRef.current.textContent || '');
    }
  }, [index, onUpdate]);

  if (isPreview) {
    return (
      <li className="text-foreground">
        <span className="ml-1">{item}</span>
      </li>
    );
  }

  return (
    <li className="flex items-center group">
      <span className="text-muted-foreground mr-1">
        {isNumbered ? `${index + 1}.` : '•'}
      </span>
      <span
        ref={itemRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="flex-1 outline-none text-foreground"
      />
      {showRemove && (
        <button
          onClick={() => onRemove(index)}
          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </li>
  );
};

