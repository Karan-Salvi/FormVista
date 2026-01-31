import React, { useCallback, useState } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { Music, Link } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AudioBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

const getEmbedUrl = (url: string): { embedUrl: string; type: 'spotify' | 'soundcloud' | 'direct' } | null => {
  // Spotify
  const spotifyMatch = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return {
      embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`,
      type: 'spotify'
    };
  }
  
  // SoundCloud - we'll use their oEmbed
  if (url.includes('soundcloud.com')) {
    return {
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
      type: 'soundcloud'
    };
  }
  
  // Direct audio files
  if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg') || url.endsWith('.m4a')) {
    return { embedUrl: url, type: 'direct' };
  }
  
  return null;
};

export const AudioBlock: React.FC<AudioBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');

  const handleUrlSubmit = useCallback(() => {
    const result = getEmbedUrl(urlInput.trim());
    if (result) {
      updateBlock(block.id, {
        config: { embedUrl: result.embedUrl, url: urlInput.trim(), icon: result.type },
      });
      setShowUrlInput(false);
      setUrlInput('');
      setError('');
    } else {
      setError('Please enter a valid Spotify, SoundCloud, or audio file URL');
    }
  }, [block.id, urlInput, updateBlock]);

  const embedUrl = block.config.embedUrl;
  const embedType = block.config.icon as 'spotify' | 'soundcloud' | 'direct' | undefined;

  if (embedUrl) {
    return (
      <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
        <div className="relative group">
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
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateBlock(block.id, { config: { embedUrl: '', url: '', icon: '' } })}
              >
                Replace audio
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className="py-2">
        <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
          <Music className="w-12 h-12 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
      <div className="border-2 border-dashed border-border rounded-lg p-8">
        {showUrlInput ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste Spotify or SoundCloud URL..."
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                autoFocus
              />
              <Button onClick={handleUrlSubmit}>Add</Button>
              <Button variant="ghost" onClick={() => { setShowUrlInput(false); setError(''); }}>Cancel</Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Music className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Embed audio</p>
            <Button variant="outline" size="sm" onClick={() => setShowUrlInput(true)}>
              <Link className="w-4 h-4 mr-2" />
              Embed URL
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

