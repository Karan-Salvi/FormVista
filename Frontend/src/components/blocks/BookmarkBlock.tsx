import React, { useCallback, useState } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { Link as LinkIcon, ExternalLink, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BookmarkBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

export const BookmarkBlock: React.FC<BookmarkBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      let url = urlInput.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Extract domain for display
      const domain = new URL(url).hostname;
      
      updateBlock(block.id, {
        config: { url, label: domain },
      });
      setShowUrlInput(false);
      setUrlInput('');
    }
  }, [block.id, urlInput, updateBlock]);

  const bookmarkUrl = block.config.url;
  const domain = block.config.label;

  if (bookmarkUrl) {
    return (
      <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
        <a
          href={bookmarkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <LinkIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{domain}</p>
            <p className="text-sm text-muted-foreground truncate">{bookmarkUrl}</p>
          </div>
          <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          {!isPreview && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateBlock(block.id, { config: { url: '', label: '' } });
              }}
              className="p-2 hover:bg-accent rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </a>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className="py-2">
        <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center gap-2">
          <LinkIcon className="w-8 h-8 text-muted-foreground" />
          <span className="text-muted-foreground">No bookmark added</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
      <div className="border-2 border-dashed border-border rounded-lg p-8">
        {showUrlInput ? (
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste website URL..."
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              autoFocus
            />
            <Button onClick={handleUrlSubmit}>Add</Button>
            <Button variant="ghost" onClick={() => setShowUrlInput(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <LinkIcon className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Create a web bookmark</p>
            <Button variant="outline" size="sm" onClick={() => setShowUrlInput(true)}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Add URL
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

