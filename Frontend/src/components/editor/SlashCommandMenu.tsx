import React, { useEffect, useRef, useState } from 'react';
import { BLOCK_TYPES, type BlockType } from '@/types/form';
import {
  Heading,
  Type,
  TextCursorInput,
  AlignLeft,
  Mail,
  Hash,
  ChevronDown,
  CircleDot,
  CheckSquare,
  Calendar,
  Minus,
  Image,
  List,
  ListOrdered,
  ChevronRight,
  Quote,
  AlertCircle,
  Video,
  Music,
  File,
  FileText,
  Link,
} from 'lucide-react';

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  searchQuery: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'heading': Heading,
  'text': Type,
  'text-cursor-input': TextCursorInput,
  'align-left': AlignLeft,
  'mail': Mail,
  'hash': Hash,
  'chevron-down': ChevronDown,
  'circle-dot': CircleDot,
  'check-square': CheckSquare,
  'calendar': Calendar,
  'minus': Minus,
  'image': Image,
  'list': List,
  'list-ordered': ListOrdered,
  'chevron-right': ChevronRight,
  'quote': Quote,
  'alert-circle': AlertCircle,
  'video': Video,
  'music': Music,
  'file': File,
  'file-text': FileText,
  'link': Link,
};

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  position,
  onSelect,
  onClose,
  searchQuery,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const filteredBlocks = BLOCK_TYPES.filter(block =>
    block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredBlocks.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredBlocks.length) % filteredBlocks.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredBlocks[activeIndex]) {
          onSelect(filteredBlocks[activeIndex].type);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredBlocks, onSelect, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (filteredBlocks.length === 0) {
    return (
      <div
        ref={menuRef}
        className="fixed z-50 w-72 bg-popover border border-border rounded-xl shadow-xl p-2 animate-scale-in"
        style={{ top: position.top, left: position.left }}
      >
        <p className="text-sm text-muted-foreground px-3 py-2">No blocks found</p>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-72 bg-popover border border-border rounded-xl shadow-xl overflow-hidden animate-scale-in"
      style={{ top: position.top, left: position.left }}
    >
      <div className="p-2 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
          Add Block
        </p>
      </div>
      <div className="p-1.5 max-h-80 overflow-y-auto scrollbar-thin">
        {filteredBlocks.map((block, index) => {
          const Icon = iconMap[block.icon];
          return (
            <button
              key={block.type}
              className={`slash-command-item w-full text-left ${
                index === activeIndex ? 'active bg-accent' : ''
              }`}
              onClick={() => onSelect(block.type)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary">
                {Icon && <Icon className="w-4 h-4 text-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{block.label}</p>
                <p className="text-xs text-muted-foreground truncate">{block.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
