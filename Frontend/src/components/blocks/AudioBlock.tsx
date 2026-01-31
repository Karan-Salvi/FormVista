import React, { useCallback, useState } from 'react'
import { type Block } from '@/types/form'
import { useFormStore } from '@/store/formStore'
import { Music, Link } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AudioBlockProps {
  block: Block
  isSelected: boolean
  isPreview?: boolean
}

const getEmbedUrl = (
  url: string
): { embedUrl: string; type: 'spotify' | 'soundcloud' | 'direct' } | null => {
  // Spotify
  const spotifyMatch = url.match(
    /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/
  )
  if (spotifyMatch) {
    return {
      embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`,
      type: 'spotify',
    }
  }

  // SoundCloud - we'll use their oEmbed
  if (url.includes('soundcloud.com')) {
    return {
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
      type: 'soundcloud',
    }
  }

  // Direct audio files
  if (
    url.endsWith('.mp3') ||
    url.endsWith('.wav') ||
    url.endsWith('.ogg') ||
    url.endsWith('.m4a')
  ) {
    return { embedUrl: url, type: 'direct' }
  }

  return null
}

export const AudioBlock: React.FC<AudioBlockProps> = ({
  block,
  isSelected,
  isPreview,
}) => {
  const updateBlock = useFormStore(state => state.updateBlock)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [error, setError] = useState('')

  const handleUrlSubmit = useCallback(() => {
    const result = getEmbedUrl(urlInput.trim())
    if (result) {
      updateBlock(block.id, {
        config: {
          embedUrl: result.embedUrl,
          url: urlInput.trim(),
          icon: result.type,
        },
      })
      setShowUrlInput(false)
      setUrlInput('')
      setError('')
    } else {
      setError('Please enter a valid Spotify, SoundCloud, or audio file URL')
    }
  }, [block.id, urlInput, updateBlock])

  const embedUrl = block.config.embedUrl
  const embedType = block.config.icon as
    | 'spotify'
    | 'soundcloud'
    | 'direct'
    | undefined

  if (embedUrl) {
    return (
      <div
        className={`py-2 ${isSelected ? 'ring-primary/20 rounded-lg ring-2' : ''}`}
      >
        <div className="group relative">
          {embedType === 'direct' ? (
            <audio controls className="w-full">
              <source src={embedUrl} />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <iframe
              src={embedUrl}
              className="w-full rounded-lg"
              height={embedType === 'spotify' ? 152 : 166}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          )}
          {!isPreview && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  updateBlock(block.id, {
                    config: { embedUrl: '', url: '', icon: '' },
                  })
                }
              >
                Replace audio
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
        <div className="bg-muted flex h-24 w-full items-center justify-center rounded-lg">
          <Music className="text-muted-foreground h-12 w-12" />
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
                placeholder="Paste Spotify or SoundCloud URL..."
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
            <Music className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-sm">Embed audio</p>
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
