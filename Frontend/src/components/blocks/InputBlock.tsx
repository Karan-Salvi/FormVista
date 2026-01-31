import React, { useRef, useEffect, useCallback } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InputBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const InputBlock: React.FC<InputBlockProps> = ({
  block,
  isSelected,
  isPreview,
  value,
  onChange,
}) => {
  const { updateBlock } = useFormStore();
  const { label, placeholder, helpText, required } = block.config;
  const labelRef = useRef<HTMLSpanElement>(null);
  const isInitialized = useRef(false);

  // Set initial content only once
  useEffect(() => {
    if (labelRef.current && !isInitialized.current && !isPreview) {
      labelRef.current.textContent = label || '';
      isInitialized.current = true;
    }
  }, [label, isPreview]);

  const handleLabelChange = useCallback((e: React.FormEvent<HTMLSpanElement>) => {
    const newLabel = e.currentTarget.textContent || '';
    updateBlock(block.id, { config: { ...block.config, label: newLabel } });
  }, [block.id, block.config, updateBlock]);

  const inputType = block.type === 'email' ? 'email' : block.type === 'number' ? 'number' : 'text';

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {isPreview ? (
          <span className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </span>
        ) : (
          <span
            ref={labelRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleLabelChange}
            className="text-sm font-medium text-foreground outline-none empty:before:content-['Label'] empty:before:text-muted-foreground/50"
          />
        )}
      </Label>
      
      {block.type === 'long-text' ? (
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={!isPreview}
          className="min-h-[100px] resize-y bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
      ) : (
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={!isPreview}
          className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
      )}
      
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

