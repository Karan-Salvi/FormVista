import React, { useRef, useEffect, useCallback } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface ChoiceBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

export const ChoiceBlock: React.FC<ChoiceBlockProps> = ({
  block,
  isSelected,
  isPreview,
  value,
  onChange,
}) => {
  const { updateBlock } = useFormStore();
  const { label, options = [], required } = block.config;
  const isMultiple = block.type === 'checkbox';
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

  const handleOptionChange = (index: number, newValue: string) => {
    const newOptions = [...options];
    newOptions[index] = newValue;
    updateBlock(block.id, { config: { ...block.config, options: newOptions } });
  };

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    updateBlock(block.id, { config: { ...block.config, options: newOptions } });
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    updateBlock(block.id, { config: { ...block.config, options: newOptions } });
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = checked
      ? [...currentValue, option]
      : currentValue.filter((v) => v !== option);
    onChange?.(newValue);
  };

  if (isPreview) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>

        {isMultiple ? (
          <div className="space-y-2.5">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <Checkbox
                  id={`${block.id}-${index}`}
                  checked={Array.isArray(value) && value.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                />
                <label
                  htmlFor={`${block.id}-${index}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup value={value as string} onValueChange={onChange as (value: string) => void}>
            <div className="space-y-2.5">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem value={option} id={`${block.id}-${index}`} />
                  <label
                    htmlFor={`${block.id}-${index}`}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-1">
        <span
          ref={labelRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleLabelChange}
          className="text-sm font-medium text-foreground outline-none empty:before:content-['Label'] empty:before:text-muted-foreground/50"
        />
      </Label>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            {isMultiple ? (
              <div className="w-4 h-4 rounded border-2 border-muted-foreground/30" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
            )}
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 h-8 text-sm"
              placeholder={`Option ${index + 1}`}
            />
            {options.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeOption(index)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={addOption}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add option
        </Button>
      </div>
    </div>
  );
};

