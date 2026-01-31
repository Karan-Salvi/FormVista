import React, { useCallback, useState } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Video, Link } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface VideoBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

const getEmbedUrl = (url: string): string | null => {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // If it's already an embed URL or direct video URL
  if (url.includes('embed') || url.endsWith('.mp4') || url.endsWith('.webm')) {
    return url
  }

  return null
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [error, setError] = useState('')

  const handleUrlSubmit = useCallback(() => {
    const embedUrl = getEmbedUrl(urlInput.trim())
    if (embedUrl) {
      updateBlock(block.id, {
        config: { embedUrl, url: urlInput.trim() },
      })
      setShowUrlInput(false)
      setUrlInput('')
      setError('')
    } else {
      setError('Please enter a valid YouTube or Vimeo URL')
    }
  }, [block.id, urlInput, updateBlock])

  const embedUrl = block.config.embedUrl

  if (embedUrl) {
    return (
      <div
        className={`py-2 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
      >
        <div className="group relative aspect-video overflow-hidden rounded-lg">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          {!isPreview && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  updateBlock(block.id, { config: { embedUrl: '', url: '' } })
                }
              >
                Replace video
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
        <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-lg">
          <Video className="text-muted-foreground h-12 w-12" />
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
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Paste YouTube or Vimeo URL..."
                onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                autoFocus
              />
              <Button onClick={handleUrlSubmit}>Add</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowUrlInput(false)
                  setError('')
                }}
              >
                Cancel
              </Button>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Video className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-sm">Embed a video</p>
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
