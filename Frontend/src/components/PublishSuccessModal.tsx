import { useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
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
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Download,
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

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out my new form: "${formTitle}"\n\nFill it out here: ${formUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const downloadQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      formUrl
    )}`
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qr-code-${formTitle}.png`
    link.target = '_blank'
    link.click()
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
        <DialogContent className="w-[95vw] max-w-[400px] overflow-hidden rounded-2xl border p-6 shadow-2xl">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
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
                    className="mx-auto mb-2"
                  >
                    <div className="relative">
                      <div className="bg-primary/10 mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 10, 0],
                          }}
                          transition={{
                            duration: 0.5,
                            delay: 0.3,
                          }}
                        >
                          <Check className="text-primary h-7 w-7" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <DialogTitle className="text-xl font-bold">
                      🎉 Your form is live!
                    </DialogTitle>
                  </motion.div>
                </DialogHeader>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  {/* URL & QR Row */}
                  <div className="bg-muted/20 flex flex-col items-center gap-4 rounded-xl border p-4 sm:flex-row">
                    <div className="group relative shrink-0">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(formUrl)}`}
                        alt="QR"
                        className="h-20 w-20 rounded-lg bg-white p-1.5 shadow-sm transition-transform group-hover:scale-105"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={downloadQRCode}
                        className="bg-primary hover:bg-primary/90 absolute -top-2 -right-2 h-6 w-6 rounded-full text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Public Link
                      </p>
                      <div className="bg-background flex items-center gap-2 overflow-hidden rounded-lg border p-2">
                        <div className="flex-1 truncate font-mono text-xs">
                          {formUrl}
                        </div>
                        <Button
                          ref={copyButtonRef}
                          size="sm"
                          variant="ghost"
                          onClick={copyLink}
                          className="h-8 shrink-0 gap-1.5 px-2 text-xs"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Primary Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={nativeShare}
                      className="flex-1 gap-2 shadow-sm"
                      variant="default"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Link
                    </Button>
                    <Button
                      onClick={() => window.open(formUrl, '_blank')}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Form
                    </Button>
                  </div>

                  {/* Social Sharing */}
                  <div className="pt-2">
                    <div className="flex justify-center gap-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={shareViaWhatsApp}
                        className="border-border h-10 w-10 rounded-full border shadow-sm transition-all hover:scale-110 hover:bg-emerald-500 hover:text-white"
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-4.5 w-4.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={shareOnTwitter}
                        className="border-border h-10 w-10 rounded-full border shadow-sm transition-all hover:scale-110 hover:bg-[#1DA1F2] hover:text-white"
                        title="Twitter"
                      >
                        <Twitter className="h-4.5 w-4.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={shareOnLinkedIn}
                        className="border-border h-10 w-10 rounded-full border shadow-sm transition-all hover:scale-110 hover:bg-[#0A66C2] hover:text-white"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4.5 w-4.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={shareViaEmail}
                        className="border-border h-10 w-10 rounded-full border shadow-sm transition-all hover:scale-110 hover:bg-amber-500 hover:text-white"
                        title="Email"
                      >
                        <Mail className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex justify-center"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground"
                  >
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
