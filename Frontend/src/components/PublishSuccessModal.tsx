import { useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/ui/confetti'
import {
  Check,
  Copy,
  ExternalLink,
  Share2,
  Sparkles,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'

interface PublishSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  formUrl: string
  formTitle: string
}

export function PublishSuccessModal({
  isOpen,
  onClose,
  formUrl,
  formTitle,
}: PublishSuccessModalProps) {
  const copiedRef = useRef(false)
  const copyButtonRef = useRef<HTMLButtonElement>(null)

  // Reset copy state when modal closes
  useEffect(() => {
    if (!isOpen) {
      copiedRef.current = false
    }
  }, [isOpen])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(formUrl)
      copiedRef.current = true
      // Force re-render of copy button
      if (copyButtonRef.current) {
        copyButtonRef.current.textContent = 'Copied!'
      }
      toast.success('Link copied to clipboard!')
      setTimeout(() => {
        copiedRef.current = false
        if (copyButtonRef.current) {
          copyButtonRef.current.textContent = 'Copy'
        }
      }, 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Check out my new form: "${formTitle}" - Built with FormVista`
    )
    const url = encodeURIComponent(formUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank'
    )
  }

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(formUrl)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank'
    )
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Fill out my form: ${formTitle}`)
    const body = encodeURIComponent(
      `Hi,\n\nI'd love to hear from you! Please fill out my form:\n\n${formUrl}\n\nThank you!`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: formTitle,
          text: `Fill out my form: ${formTitle}`,
          url: formUrl,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      copyLink()
    }
  }

  return (
    <>
      <Confetti isActive={isOpen} duration={3500} particleCount={200} />

      <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <DialogHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="mx-auto mb-4"
                  >
                    <div className="relative">
                      <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 10, 0],
                          }}
                          transition={{
                            duration: 0.5,
                            delay: 0.3,
                          }}
                        >
                          <Check className="text-primary h-10 w-10" />
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-primary absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full"
                      >
                        <Sparkles className="h-4 w-4 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <DialogTitle className="text-2xl font-bold">
                      🎉 Your form is live!
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-base">
                      Share it with the world and start collecting responses.
                    </DialogDescription>
                  </motion.div>
                </DialogHeader>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 space-y-4"
                >
                  {/* Form URL Display */}
                  <div className="bg-muted/50 flex items-center gap-2 rounded-lg border p-3">
                    <div className="flex-1 truncate font-mono text-sm">
                      {formUrl}
                    </div>
                    <Button
                      ref={copyButtonRef}
                      size="sm"
                      variant="outline"
                      onClick={copyLink}
                      className="shrink-0 gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>

                  {/* Primary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={nativeShare}
                      className="gap-2"
                      variant="default"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      onClick={() => window.open(formUrl, '_blank')}
                      variant="outline"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Form
                    </Button>
                  </div>

                  {/* Social Sharing */}
                  <div className="pt-2">
                    <p className="text-muted-foreground mb-3 text-center text-sm">
                      Or share on social media
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={shareOnTwitter}
                        className="h-10 w-10 rounded-full transition-colors hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={shareOnLinkedIn}
                        className="h-10 w-10 rounded-full transition-colors hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={shareViaEmail}
                        className="h-10 w-10 rounded-full transition-colors hover:bg-amber-500/10 hover:text-amber-600"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex justify-center"
                >
                  <Button variant="ghost" onClick={onClose}>
                    Continue editing
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  )
}
