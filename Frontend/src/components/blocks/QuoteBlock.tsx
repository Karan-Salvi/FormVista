import React, { useCallback, useRef, useEffect } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';

interface QuoteBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const contentRef = useRef<HTMLQuoteElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (contentRef.current && !isInitialized.current) {
      contentRef.current.textContent = block.config.content || 'Type a quote...';
      isInitialized.current = true;
    }
  }, []);

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      updateBlock(block.id, {
        config: { content: contentRef.current.textContent || '' },
      });
    }
  }, [block.id, updateBlock]);

  if (isPreview) {
    return (
      <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-muted-foreground">
        {block.config.content || 'Type a quote...'}
      </blockquote>
    );
  }

  return (
    <div className={`py-1 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
      <blockquote
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="border-l-4 border-primary pl-4 py-2 italic text-muted-foreground outline-none"
      />
    </div>
  );
};

