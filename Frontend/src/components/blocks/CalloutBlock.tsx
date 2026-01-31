import React, { useCallback, useRef, useEffect, useState } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { AlertCircle, Info, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CalloutBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

const iconOptions = [
  { icon: 'info', component: Info, color: 'text-blue-500' },
  { icon: 'alert', component: AlertCircle, color: 'text-red-500' },
  { icon: 'warning', component: AlertTriangle, color: 'text-yellow-500' },
  { icon: 'success', component: CheckCircle, color: 'text-green-500' },
  { icon: 'idea', component: Lightbulb, color: 'text-amber-500' },
];

export const CalloutBlock: React.FC<CalloutBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const currentIcon = block.config.icon || 'info';
  const IconData = iconOptions.find(i => i.icon === currentIcon) || iconOptions[0];
  const Icon = IconData.component;

  useEffect(() => {
    if (contentRef.current && !isInitialized.current) {
      contentRef.current.textContent = block.config.content || 'Type callout text...';
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

  const handleIconChange = useCallback((icon: string) => {
    updateBlock(block.id, {
      config: { icon },
    });
    setIsIconPickerOpen(false);
  }, [block.id, updateBlock]);

  if (isPreview) {
    return (
      <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg border border-border">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${IconData.color}`} />
        <p className="text-foreground">{block.config.content || 'Type callout text...'}</p>
      </div>
    );
  }

  return (
    <div className={`py-1 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
      <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg border border-border">
        <Popover open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
          <PopoverTrigger asChild>
            <button className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform">
              <Icon className={`w-5 h-5 ${IconData.color}`} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="flex gap-2">
              {iconOptions.map((opt) => {
                const OptIcon = opt.component;
                return (
                  <button
                    key={opt.icon}
                    onClick={() => handleIconChange(opt.icon)}
                    className={`p-2 rounded hover:bg-accent transition-colors ${
                      currentIcon === opt.icon ? 'bg-accent' : ''
                    }`}
                  >
                    <OptIcon className={`w-5 h-5 ${opt.color}`} />
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="flex-1 text-foreground outline-none"
        />
      </div>
    </div>
  );
};

