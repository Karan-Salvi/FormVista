import React, { useCallback, useState } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { FileText, Link } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PDFBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const PDFBlock: React.FC<PDFBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      updateBlock(block.id, {
        config: { url: urlInput.trim() },
      })
      setShowUrlInput(false)
      setUrlInput('')
    }
  }, [block.id, urlInput, updateBlock])

  const pdfUrl = block.config.url

  if (pdfUrl) {
    return (
      <div
        className={`py-2 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
      >
        <div className="group relative">
          <iframe
            src={`${pdfUrl}#view=FitH`}
            className="border-border h-[500px] w-full rounded-lg border"
            title="PDF Viewer"
          />
          {!isPreview && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateBlock(block.id, { config: { url: '' } })}
              >
                Replace PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isPreview) {
    return (
      <div className="py-2">
        <div className="bg-muted flex h-48 w-full items-center justify-center rounded-lg">
          <FileText className="text-muted-foreground h-12 w-12" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`py-2 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
    >
      <div className="border-border rounded-lg border-2 border-dashed p-8">
        {showUrlInput ? (
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="Paste PDF URL..."
              onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
              autoFocus
            />
            <Button onClick={handleUrlSubmit}>Add</Button>
            <Button variant="ghost" onClick={() => setShowUrlInput(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <FileText className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-sm">Embed a PDF</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(true)}
            >
              <Link className="mr-2 h-4 w-4" />
              Embed URL
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
