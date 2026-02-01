import React from 'react'
import { type Block } from '@/types/form'
import { HeadingBlock } from './HeadingBlock'
import { TextBlock } from './TextBlock'
import { InputBlock } from './InputBlock'
import { DropdownBlock } from './DropdownBlock'
import { ChoiceBlock } from './ChoiceBlock'
import { DividerBlock } from './DividerBlock'
import { DateBlock } from './DateBlock'
import { ListBlock } from './ListBlock'
import { ToggleBlock } from './ToggleBlock'
import { QuoteBlock } from './QuoteBlock'
import { CalloutBlock } from './CalloutBlock'
import { ImageBlock } from './ImageBlock'
import { VideoBlock } from './VideoBlock'
import { AudioBlock } from './AudioBlock'
import { FileBlock } from './FileBlock'
import { PDFBlock } from './PDFBlock'
import { BookmarkBlock } from './BookmarkBlock'

interface BlockRendererProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
  value?: unknown
  onChange?: (value: unknown) => void
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  isPreview,
  value,
  onChange,
}) => {
  switch (block.type) {
    case 'heading':
      return (
        <HeadingBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'text':
      return (
        <TextBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'bullet-list':
    case 'numbered-list':
      return (
        <ListBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'toggle':
      return (
        <ToggleBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'quote':
      return (
        <QuoteBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'callout':
      return (
        <CalloutBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'short-text':
    case 'long-text':
    case 'email':
    case 'number':
    case 'phone':
      return (
        <InputBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
          value={value as string}
          onChange={onChange as (value: string) => void}
        />
      )

    case 'dropdown':
      return (
        <DropdownBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
          value={value as string}
          onChange={onChange as (value: string) => void}
        />
      )

    case 'multiple-choice':
    case 'checkbox':
      return (
        <ChoiceBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
          value={value as string | string[]}
          onChange={onChange as (value: string | string[]) => void}
        />
      )

    case 'date':
      return (
        <DateBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
          value={value as Date}
          onChange={onChange as (value: Date | undefined) => void}
        />
      )

    case 'divider':
      return (
        <DividerBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'image':
      return (
        <ImageBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'video':
      return (
        <VideoBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'audio':
      return (
        <AudioBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'file':
      return (
        <FileBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    case 'pdf':
      return (
        <PDFBlock block={block} isSelected={isSelected} isPreview={isPreview} />
      )

    case 'bookmark':
      return (
        <BookmarkBlock
          block={block}
          isSelected={isSelected}
          isPreview={isPreview}
        />
      )

    default:
      return (
        <div className="text-muted-foreground text-sm italic">
          Unknown block type: {block.type}
        </div>
      )
  }
}
