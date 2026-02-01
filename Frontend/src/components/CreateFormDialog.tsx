import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { formService } from '@/services/form.service'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Sparkles,
  Type,
  Link as LinkIcon,
  Loader2,
  FileText,
} from 'lucide-react'

export function CreateFormDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) {
      setTitle('')
      setSlug('')
      setDescription('')
      setIsSlugManuallyEdited(false)
    }
  }, [open])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!isSlugManuallyEdited) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      )
    }
  }

  const handleCreate = async () => {
    if (!title || !slug) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await formService.create({ title, slug, description })
      toast.success('Form created successfully')
      setOpen(false)
      navigate(`/builder?formId=${response.data.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create form')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 shadow-primary/20 gap-2 shadow-lg transition-all hover:scale-105 active:scale-95">
          <Plus className="h-4 w-4" />
          <span className="font-semibold">Create New Form</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background overflow-hidden border-none p-0 shadow-2xl sm:max-w-[500px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">
            Create a new form
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5 text-base">
            Give your form a name and description to get started. You can change
            these later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Type className="text-muted-foreground h-4 w-4" />
              Form Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g., Customer Feedback Survey"
              className="border-muted-foreground/20 focus-visible:border-primary focus-visible:ring-primary/20 h-11 transition-all"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <LinkIcon className="text-muted-foreground h-4 w-4" />
              Custom link <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm select-none">
                /
              </span>
              <Input
                id="slug"
                value={slug}
                onChange={e => {
                  setSlug(e.target.value)
                  setIsSlugManuallyEdited(true)
                }}
                placeholder="customer-feedback"
                className="border-muted-foreground/20 focus-visible:border-primary focus-visible:ring-primary/20 bg-muted/30 h-11 pl-7 font-mono text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FileText className="text-muted-foreground h-4 w-4" />
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Briefly describe the purpose of this form..."
              className="border-muted-foreground/20 focus-visible:border-primary focus-visible:ring-primary/20 min-h-[100px] resize-none transition-all"
            />
          </div>
        </div>

        <DialogFooter className="bg-muted/20 p-6 pt-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreate}
            disabled={isLoading || !title || !slug}
            className="bg-primary hover:bg-primary/90 shadow-primary/20 w-32 shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating
              </>
            ) : (
              'Create Form'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
