import React, { useState, useEffect, useRef } from 'react'
import { type Block, type Form } from '@/types/form'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button } from '@/components/ui/button'
import { Send, CheckCircle2, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

type Message = {
  id: string
  type: 'bot' | 'user'
  text?: string
  component?: React.ReactNode
}

interface ChatFormViewProps {
  form: Form
  responses: Record<string, unknown>
  errors: Record<string, string>
  onResponseChange: (blockId: string, value: unknown) => void
  onSubmit: () => void
  submitting: boolean
  validateSingle: (block: Block) => string | null
}

const INPUT_BLOCK_TYPES = [
  'short-text',
  'long-text',
  'email',
  'number',
  'dropdown',
  'multiple-choice',
  'checkbox',
  'date',
  'phone',
] as const

const ChatFormView: React.FC<ChatFormViewProps> = ({
  form,
  responses,
  errors,
  onResponseChange,
  onSubmit,
  submitting,
  validateSingle,
}) => {
  const questionBlocks = [...form.blocks]
    .sort((a, b) => a.order - b.order)
    .filter(b => INPUT_BLOCK_TYPES.includes(b.type as any))

  const totalQuestions = questionBlocks.length

  const [currentIndex, setCurrentIndex] = useState(-1)
  const [messages, setMessages] = useState<Message[]>([])
  const [localError, setLocalError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, currentIndex])

  // Initialize Chat
  useEffect(() => {
    if (currentIndex === -1 && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([
          {
            id: 'welcome',
            type: 'bot',
            text:
              form.description ||
              `Welcome to ${form.title}! Let's get started.`,
          },
        ])
        setIsTyping(false)
        setCurrentIndex(0) // Show first question
      }, 1000)
    }
  }, [currentIndex, form.description, form.title, messages.length])

  // When currentIndex changes, show the question
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < totalQuestions) {
      const block = questionBlocks[currentIndex]
      // Format text, replace personalized tags from previous answers
      let questionText = block.config.label || 'Please answer the question below:'
      // Simple regex to replace {{variable}} with answers
      questionText = questionText.replace(/\{\{(.*?)\}\}/g, (match, p1) => {
        const key = p1.trim()
        const foundBlock = questionBlocks.find(
          b => b.config.label === key || (b as any).field_key === key
        )
        if (foundBlock && responses[foundBlock.id] !== undefined) {
          const val = responses[foundBlock.id]
          if (Array.isArray(val)) return val.join(', ')
          return String(val)
        }
        return match // if not found, keep original
      })

      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: `q-${block.id}`, type: 'bot', text: questionText },
        ])
        setIsTyping(false)
      }, 700) // slight delay to simulate typing
    } else if (currentIndex === totalQuestions) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'done',
            type: 'bot',
            text: 'All done! Thank you for your responses. Click submit below.',
          },
        ])
        setIsTyping(false)
      }, 700)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, totalQuestions])

  const handleNext = () => {
    setLocalError(null)
    const block = questionBlocks[currentIndex]
    if (!block) return

    const err = validateSingle(block)
    if (err) {
      setLocalError(err)
      return
    }

    const value = responses[block.id]
    const userText = Array.isArray(value)
      ? value.join(', ')
      : value !== undefined
        ? String(value)
        : '(Skipped)'

    setMessages(prev => [
      ...prev,
      { id: `a-${block.id}`, type: 'user', text: userText },
    ])

    setCurrentIndex(prev => prev + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA') return
      e.preventDefault()
      handleNext()
    }
  }

  const activeBlock =
    currentIndex >= 0 && currentIndex < totalQuestions && !isTyping
      ? questionBlocks[currentIndex]
      : null

  const pct =
    totalQuestions > 0
      ? Math.round((Math.max(0, currentIndex) / totalQuestions) * 100)
      : 0

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: form.theme?.backgroundColor || '#f3f4f6',
        color: form.theme?.textColor || 'inherit',
      }}
    >
      {/* Header */}
      <header className="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
              <Sparkles className="text-primary h-4 w-4" />
            </div>
            <span className="font-semibold">{form.title}</span>
          </div>
          <div className="text-muted-foreground text-xs font-medium">
            {currentIndex >= 0 && currentIndex < totalQuestions
              ? `${currentIndex + 1} / ${totalQuestions}`
              : currentIndex === totalQuestions
                ? 'Complete'
                : 'Starting...'}
          </div>
        </div>
        {/* Progress bar */}
        <div className="bg-muted h-0.5 w-full">
          <motion.div
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* Chat Transcript Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto flex max-w-3xl flex-col space-y-6">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring' }}
                className={`flex w-full ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-background border-border border rounded-bl-none text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-background border-border flex items-center justify-center gap-1 rounded-2xl rounded-bl-none border px-5 py-4 shadow-sm">
                <span className="bg-primary/60 inline-block h-2 w-2 animate-bounce rounded-full" />
                <span
                  className="bg-primary/60 inline-block h-2 w-2 animate-bounce rounded-full"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="bg-primary/60 inline-block h-2 w-2 animate-bounce rounded-full"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input / Block Area */}
      <footer className="bg-background/90 border-border sticky bottom-0 border-t p-4 backdrop-blur-md pb-8 sm:pb-4">
        <div className="mx-auto max-w-3xl">
          {activeBlock ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-end"
              onKeyDown={handleKeyDown}
            >
              <div
                className="chat-block-container max-h-[300px] flex-1 overflow-y-auto"
                style={{
                  // Simple hack: We only want the input part of the BlockRenderer, but since
                  // we're reusing it, we hide its label via CSS trickery to make it look like
                  // a pure input!
                }}
              >
                <style>{`
                  .chat-block-container > div > div > label { display: none !important; }
                  .chat-block-container > div { margin-top: 0 !important; }
                `}</style>
                <BlockRenderer
                  block={activeBlock}
                  isSelected={false}
                  isPreview={true}
                  value={responses[activeBlock.id]}
                  onChange={value => onResponseChange(activeBlock.id, value)}
                  error={localError || errors[activeBlock.id]}
                />
              </div>
              <Button
                size="icon"
                onClick={handleNext}
                className="h-12 w-12 shrink-0 rounded-full shadow-md"
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : currentIndex === totalQuestions ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                onClick={onSubmit}
                disabled={submitting}
                className="gap-2 rounded-full px-8 font-semibold shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Submit Responses
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <div className="flex h-12 w-full items-center justify-center opacity-0 pointer-events-none">
              <span className="h-5 w-5" />
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

export default ChatFormView
