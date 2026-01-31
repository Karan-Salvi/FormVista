import React, { useCallback, useState } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { Image, Upload, Link } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ImageBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      updateBlock(block.id, {
        config: { imageUrl: urlInput.trim() },
      });
      setShowUrlInput(false);
      setUrlInput('');
    }
  }, [block.id, urlInput, updateBlock]);

  const imageUrl = block.config.imageUrl;

  if (imageUrl) {
    return (
      <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Uploaded image"
            className="max-w-full h-auto rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {!isPreview && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateBlock(block.id, { config: { imageUrl: '' } })}
              >
                Replace image
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
        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
          <Image className="w-12 h-12 text-muted-foreground" />
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
              placeholder="Paste image URL..."
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              autoFocus
            />
            <Button onClick={handleUrlSubmit}>Add</Button>
            <Button variant="ghost" onClick={() => setShowUrlInput(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Add an image</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowUrlInput(true)}>
                <Link className="w-4 h-4 mr-2" />
                Embed URL
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

