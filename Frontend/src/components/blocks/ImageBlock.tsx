import React, { useCallback, useState } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Image, Link } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ImageBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
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
        config: { imageUrl: urlInput.trim() },
      })
      setShowUrlInput(false)
      setUrlInput('')
    }
  }, [block.id, urlInput, updateBlock])

  const imageUrl = block.config.imageUrl

  if (imageUrl) {
    return (
      <div
        className={`py-2 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
      >
        <div className="group relative">
          <img
            src={imageUrl}
            alt="Uploaded image"
            className="h-auto max-w-full rounded-lg"
            onError={e => {
              ;(e.target as HTMLImageElement).src = '/placeholder.svg'
            }}
          />
          {!isPreview && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  updateBlock(block.id, { config: { imageUrl: '' } })
                }
              >
                Replace image
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
          <Image className="text-muted-foreground h-12 w-12" />
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
              placeholder="Paste image URL..."
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
            <Image className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-sm">Add an image</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUrlInput(true)}
              >
                <Link className="mr-2 h-4 w-4" />
                Embed URL
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
