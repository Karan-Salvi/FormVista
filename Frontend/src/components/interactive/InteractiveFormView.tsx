import React, { useState, useCallback, useEffect, useRef } from 'react'
import { type Block, type Form } from '@/types/form'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button } from '@/components/ui/button'
import {
  ChevronUp,
  ChevronDown,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CornerDownLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

// --------------- Sub-components ---------------

/** Progress bar at the top of the interactive view */
const ProgressBar: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="fixed top-0 right-0 left-0 z-50">
      <div className="bg-muted/40 h-1.5 w-full backdrop-blur-sm">
        <motion.div
          className="bg-primary h-full rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
      <div className="absolute top-3 right-4 text-xs font-medium opacity-60 select-none">
        {current} / {total}
      </div>
    </div>
  )
}

/** Floating navigation buttons (up / down) */
const NavigationButtons: React.FC<{
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}> = ({ onPrev, onNext, canPrev, canNext }) => (
  <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-1.5">
    <Button
      variant="outline"
      size="icon"
      className="bg-background/80 h-10 w-10 rounded-lg shadow-lg backdrop-blur-sm"
      onClick={onPrev}
      disabled={!canPrev}
      aria-label="Previous question"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="bg-background/80 h-10 w-10 rounded-lg shadow-lg backdrop-blur-sm"
      onClick={onNext}
      disabled={!canNext}
      aria-label="Next question"
    >
      <ChevronDown className="h-5 w-5" />
    </Button>
  </div>
)

/** Welcome / start screen shown before question 1 */
const StartScreen: React.FC<{
  title: string
  description?: string
  onStart: () => void
}> = ({ title, description, onStart }) => (
  <motion.div
    key="start-screen"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
  >
    <div className="max-w-lg space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
      >
        <Sparkles className="text-primary h-8 w-8" />
      </motion.div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      )}
      <Button
        size="lg"
        className="mt-4 gap-2 px-10 text-lg font-semibold"
        onClick={onStart}
      >
        Start
        <ArrowRight className="h-5 w-5" />
      </Button>
      <p className="text-muted-foreground/50 text-xs">
        Press{' '}
        <kbd className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-semibold">
          Enter ↵
        </kbd>{' '}
        to begin
      </p>
    </div>
  </motion.div>
)

/** Submit / review screen shown after the last question */
const SubmitScreen: React.FC<{
  onSubmit: () => void
  submitting: boolean
  totalAnswered: number
  totalQuestions: number
}> = ({ onSubmit, submitting, totalAnswered, totalQuestions }) => (
  <motion.div
    key="submit-screen"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
  >
    <div className="max-w-md space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
      >
        <Check className="text-primary h-8 w-8" />
      </motion.div>
      <h2 className="text-2xl font-bold">All done!</h2>
      <p className="text-muted-foreground">
        You answered {totalAnswered} of {totalQuestions} questions. Click below
        to submit your responses.
      </p>
      <Button
        size="lg"
        className="w-full gap-2 text-lg font-semibold"
        onClick={onSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Submitting…
          </>
        ) : (
          <>
            Submit
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
      <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs opacity-60">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        Your data is secure
      </div>
    </div>
  </motion.div>
)

// --------------- Question block types that accept user input ---------------
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

// --------------- Main component ---------------

interface InteractiveFormViewProps {
  form: Form
  responses: Record<string, unknown>
  errors: Record<string, string>
  onResponseChange: (blockId: string, value: unknown) => void
  onSubmit: () => void
  submitting: boolean
  validateSingle: (block: Block) => string | null
}

const InteractiveFormView: React.FC<InteractiveFormViewProps> = ({
  form,
  responses,
  errors,
  onResponseChange,
  onSubmit,
  submitting,
  validateSingle,
}) => {
  // Only include question/input blocks in the interactive flow
  const questionBlocks = [...form.blocks]
    .sort((a, b) => a.order - b.order)
    .filter(b => INPUT_BLOCK_TYPES.includes(b.type as any))

  // Screens:  -1 = start,  0..N-1 = questions,  N = submit
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [direction, setDirection] = useState<'up' | 'down'>('down')
  const [localError, setLocalError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalQuestions = questionBlocks.length

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ignore if user is typing in a textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA') return

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, responses])

  const goNext = useCallback(() => {
    setLocalError(null)

    // If on a question, validate before moving
    if (currentIndex >= 0 && currentIndex < totalQuestions) {
      const block = questionBlocks[currentIndex]!
      const err = validateSingle(block)
      if (err) {
        setLocalError(err)
        return
      }
    }

    if (currentIndex < totalQuestions) {
      setDirection('down')
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, totalQuestions, questionBlocks, validateSingle])

  const goPrev = useCallback(() => {
    setLocalError(null)
    if (currentIndex > -1) {
      setDirection('up')
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  // Count how many questions have been answered
  const totalAnswered = questionBlocks.filter(b => {
    const v = responses[b.id]
    if (v === undefined || v === null) return false
    if (typeof v === 'string' && v.trim() === '') return false
    if (Array.isArray(v) && v.length === 0) return false
    return true
  }).length

  // Slide animation variants
  const variants = {
    enter: (dir: 'up' | 'down') => ({
      y: dir === 'down' ? 80 : -80,
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (dir: 'up' | 'down') => ({
      y: dir === 'down' ? -80 : 80,
      opacity: 0,
    }),
  }

  const currentBlock =
    currentIndex >= 0 && currentIndex < totalQuestions
      ? questionBlocks[currentIndex]
      : null

  const questionNumber = currentIndex + 1

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      style={{
        backgroundColor: form.theme?.backgroundColor || '#ffffff',
        color: form.theme?.textColor || 'inherit',
      }}
    >
      {/* Progress bar — visible during questions & submit */}
      {currentIndex >= 0 && (
        <ProgressBar
          current={Math.min(currentIndex + 1, totalQuestions)}
          total={totalQuestions}
        />
      )}

      {/* Navigation arrows — visible during questions */}
      {currentIndex >= 0 && currentIndex < totalQuestions && (
        <NavigationButtons
          onPrev={goPrev}
          onNext={goNext}
          canPrev={currentIndex > -1}
          canNext={currentIndex < totalQuestions}
        />
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {/* Start Screen */}
        {currentIndex === -1 && (
          <StartScreen
            title={form.title}
            description={form.description}
            onStart={goNext}
          />
        )}

        {/* Question Screens */}
        {currentBlock && (
          <motion.div
            key={`q-${currentBlock.id}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6"
          >
            <div className="w-full max-w-xl space-y-8">
              {/* Question number badge */}
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
                  {questionNumber}
                </span>
                <span className="text-muted-foreground text-sm">
                  of {totalQuestions}
                </span>
              </div>

              {/* The actual question block */}
              <div className="interactive-question">
                <BlockRenderer
                  block={currentBlock}
                  isSelected={false}
                  isPreview={true}
                  value={responses[currentBlock.id]}
                  onChange={value => onResponseChange(currentBlock.id, value)}
                  error={localError || errors[currentBlock.id]}
                />
              </div>

              {/* Next / OK button */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="lg"
                  className="gap-2 font-semibold"
                  onClick={goNext}
                >
                  {currentIndex === totalQuestions - 1 ? 'Review' : 'OK'}
                  <Check className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground/50 hidden items-center gap-1.5 text-xs sm:flex">
                  press{' '}
                  <kbd className="bg-muted inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                    Enter <CornerDownLeft className="h-2.5 w-2.5" />
                  </kbd>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Screen */}
        {currentIndex === totalQuestions && (
          <SubmitScreen
            onSubmit={onSubmit}
            submitting={submitting}
            totalAnswered={totalAnswered}
            totalQuestions={totalQuestions}
          />
        )}
      </AnimatePresence>

      {/* Powered By — fixed footer */}
      <div className="text-muted-foreground/40 fixed right-0 bottom-4 left-0 flex items-center justify-center gap-1.5 text-xs">
        <Sparkles className="h-3 w-3" />
        <span>Powered by FormVista</span>
      </div>
    </div>
  )
}

export default InteractiveFormView
