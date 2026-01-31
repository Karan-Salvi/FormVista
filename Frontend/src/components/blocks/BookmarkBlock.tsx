import React, { useCallback, useState } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Link as LinkIcon, ExternalLink, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BookmarkBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const BookmarkBlock: React.FC<BookmarkBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      let url = urlInput.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      // Extract domain for display
      const domain = new URL(url).hostname

      updateBlock(block.id, {
        config: { url, label: domain },
      })
      setShowUrlInput(false)
      setUrlInput('')
    }
  }, [block.id, urlInput, updateBlock])

  const bookmarkUrl = block.config.url
  const domain = block.config.label

  if (bookmarkUrl) {
    return (
      <div
        className={`py-2 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
      >
        <a
          href={bookmarkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent/30 border-border hover:bg-accent/50 group flex items-center gap-4 rounded-lg border p-4 transition-colors"
        >
          <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
            <LinkIcon className="text-primary h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate font-medium">{domain}</p>
            <p className="text-muted-foreground truncate text-sm">
              {bookmarkUrl}
            </p>
          </div>
          <ExternalLink className="text-muted-foreground h-5 w-5 flex-shrink-0" />
          {!isPreview && (
            <button
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                updateBlock(block.id, { config: { url: '', label: '' } })
              }}
              className="hover:bg-accent rounded-lg p-2 opacity-0 transition-colors group-hover:opacity-100"
            >
              <X className="text-muted-foreground h-4 w-4" />
            </button>
          )}
        </a>
      </div>
    )
  }

  if (isPreview) {
    return (
      <div className="py-2">
        <div className="bg-muted flex h-20 w-full items-center justify-center gap-2 rounded-lg">
          <LinkIcon className="text-muted-foreground h-8 w-8" />
          <span className="text-muted-foreground">No bookmark added</span>
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
              placeholder="Paste website URL..."
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
            <LinkIcon className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              Create a web bookmark
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(true)}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Add URL
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
