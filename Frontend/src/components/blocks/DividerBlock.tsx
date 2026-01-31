import React from 'react';
import { type Block } from '@/types/form';

interface DividerBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

export const DividerBlock: React.FC<DividerBlockProps> = () => {
  return (
    <div className="py-2">
      <hr className="border-t border-border" />
    </div>
  );
};

