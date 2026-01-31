import React, { useCallback, useState } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { File, Link, Download, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FileBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const FileBlock: React.FC<FileBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const [urlInput, setUrlInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      const fileName =
        nameInput.trim() || urlInput.split('/').pop() || 'Document'
      updateBlock(block.id, {
        config: { url: urlInput.trim(), fileName },
      })
      setShowUrlInput(false)
      setUrlInput('')
      setNameInput('')
    }
  }, [block.id, urlInput, nameInput, updateBlock])

  const fileUrl = block.config.url
  const fileName = block.config.fileName

  if (fileUrl) {
    return (
      <div
        className={`py-2 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
      >
        <div className="bg-accent/30 border-border group flex items-center gap-3 rounded-lg border p-4">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <File className="text-primary h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate font-medium">{fileName}</p>
            <p className="text-muted-foreground truncate text-sm">{fileUrl}</p>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-accent rounded-lg p-2 transition-colors"
          >
            <Download className="text-muted-foreground h-4 w-4" />
          </a>
          {!isPreview && (
            <button
              onClick={() =>
                updateBlock(block.id, { config: { url: '', fileName: '' } })
              }
              className="hover:bg-accent rounded-lg p-2 opacity-0 transition-colors group-hover:opacity-100"
            >
              <X className="text-muted-foreground h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (isPreview) {
    return (
      <div className="py-2">
        <div className="bg-muted flex h-20 w-full items-center justify-center gap-2 rounded-lg">
          <File className="text-muted-foreground h-8 w-8" />
          <span className="text-muted-foreground">No file attached</span>
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
          <div className="space-y-2">
            <Input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="File name (optional)"
            />
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Paste file URL..."
                onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                autoFocus
              />
              <Button onClick={handleUrlSubmit}>Add</Button>
              <Button variant="ghost" onClick={() => setShowUrlInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <File className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-sm">Attach a file</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(true)}
            >
              <Link className="mr-2 h-4 w-4" />
              Link file URL
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
