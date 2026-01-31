import React, { useCallback, useState } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { Video, Link } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface VideoBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

const getEmbedUrl = (url: string): string | null => {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // If it's already an embed URL or direct video URL
  if (url.includes('embed') || url.endsWith('.mp4') || url.endsWith('.webm')) {
    return url;
  }
  
  return null;
};

export const VideoBlock: React.FC<VideoBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');

  const handleUrlSubmit = useCallback(() => {
    const embedUrl = getEmbedUrl(urlInput.trim());
    if (embedUrl) {
      updateBlock(block.id, {
        config: { embedUrl, url: urlInput.trim() },
      });
      setShowUrlInput(false);
      setUrlInput('');
      setError('');
    } else {
      setError('Please enter a valid YouTube or Vimeo URL');
    }
  }, [block.id, urlInput, updateBlock]);

  const embedUrl = block.config.embedUrl;

  if (embedUrl) {
    return (
      <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
        <div className="relative group aspect-video rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          {!isPreview && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateBlock(block.id, { config: { embedUrl: '', url: '' } })}
              >
                Replace video
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
        <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
          <Video className="w-12 h-12 text-muted-foreground" />
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
                placeholder="Paste YouTube or Vimeo URL..."
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
            <Video className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Embed a video</p>
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

