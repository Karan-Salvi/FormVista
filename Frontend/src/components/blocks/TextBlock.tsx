import React, { useRef, useEffect, useCallback } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';

interface TextBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block, isSelected, isPreview }) => {
  const { updateBlock } = useFormStore();
  const inputRef = useRef<HTMLParagraphElement>(null);
  const isInitialized = useRef(false);

  const content = block.config.content || '';

  // Set initial content only once
  useEffect(() => {
    if (inputRef.current && !isInitialized.current && !isPreview) {
      inputRef.current.textContent = content;
      isInitialized.current = true;
    }
  }, [content, isPreview]);

  useEffect(() => {
    if (isSelected && inputRef.current && !isPreview) {
      inputRef.current.focus();
    }
  }, [isSelected, isPreview]);

  const handleInput = useCallback((e: React.FormEvent<HTMLParagraphElement>) => {
    const newContent = e.currentTarget.textContent || '';
    updateBlock(block.id, { config: { ...block.config, content: newContent } });
  }, [block.id, block.config, updateBlock]);

  if (isPreview) {
    return (
      <p className="text-body text-muted-foreground leading-relaxed">
        {content}
      </p>
    );
  }

  return (
    <p
      ref={inputRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      className="text-body text-muted-foreground leading-relaxed outline-none w-full empty:before:content-['Start_typing...'] empty:before:text-muted-foreground/40"
    />
  );
};

