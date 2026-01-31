import React, { useCallback, useState } from 'react';
import { type Block } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { File, Link, Download, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FileBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
}

export const FileBlock: React.FC<FileBlockProps> = ({ block, isSelected, isPreview }) => {
  const updateBlock = useFormStore((state) => state.updateBlock);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      const fileName = nameInput.trim() || urlInput.split('/').pop() || 'Document';
      updateBlock(block.id, {
        config: { url: urlInput.trim(), fileName },
      });
      setShowUrlInput(false);
      setUrlInput('');
      setNameInput('');
    }
  }, [block.id, urlInput, nameInput, updateBlock]);

  const fileUrl = block.config.url;
  const fileName = block.config.fileName;

  if (fileUrl) {
    return (
      <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
        <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg border border-border group">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <File className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{fileName}</p>
            <p className="text-sm text-muted-foreground truncate">{fileUrl}</p>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </a>
          {!isPreview && (
            <button
              onClick={() => updateBlock(block.id, { config: { url: '', fileName: '' } })}
              className="p-2 hover:bg-accent rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className="py-2">
        <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center gap-2">
          <File className="w-8 h-8 text-muted-foreground" />
          <span className="text-muted-foreground">No file attached</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-2 ${isSelected ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
      <div className="border-2 border-dashed border-border rounded-lg p-8">
        {showUrlInput ? (
          <div className="space-y-2">
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="File name (optional)"
            />
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste file URL..."
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                autoFocus
              />
              <Button onClick={handleUrlSubmit}>Add</Button>
              <Button variant="ghost" onClick={() => setShowUrlInput(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <File className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Attach a file</p>
            <Button variant="outline" size="sm" onClick={() => setShowUrlInput(true)}>
              <Link className="w-4 h-4 mr-2" />
              Link file URL
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

