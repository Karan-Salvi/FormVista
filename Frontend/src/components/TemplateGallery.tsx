import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Mail,
  Calendar,
  MessageSquare,
  AlignLeft,
  ArrowRight,
  Plus,
  Loader2,
  Sparkles,
  Briefcase,
  Bug,
  Bell,
  HelpCircle,
} from 'lucide-react'
import { templates, type Template } from '@/constants/templates'
import { formService } from '@/services/form.service'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

import { authService } from '@/services/auth.service'

const iconMap: Record<string, React.ReactNode> = {
  mail: <Mail className="h-5 w-5" />,
  calendar: <Calendar className="h-5 w-5" />,
  'message-square': <MessageSquare className="h-5 w-5" />,
  'align-left': <AlignLeft className="h-5 w-5" />,
  briefcase: <Briefcase className="h-5 w-5" />,
  bug: <Bug className="h-5 w-5" />,
  bell: <Bell className="h-5 w-5" />,
  'help-circle': <HelpCircle className="h-5 w-5" />,
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
  green: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  orange: 'bg-orange-500/10 text-orange-600 border-orange-200',
  indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  rose: 'bg-rose-500/10 text-rose-600 border-rose-200',
  cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  pink: 'bg-pink-500/10 text-pink-600 border-pink-200',
}

export function TemplateGallery() {
  const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null)
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const handleTemplateSelect = async (template: Template) => {
    if (!user?.is_email_verified) {
      navigate('/verify-notice')
      return
    }

    setCreatingTemplate(template.id)
    try {
      // 1. Create the base form
      const slug = `${template.id}-${Math.random().toString(36).substring(2, 7)}`
      const createResponse = await formService.create({
        title: template.title,
        description: template.description,
        slug,
      })

      const formId = createResponse.data.id

      // 2. Prepare blocks from template
      const blocksToSave = template.blocks.map((block, index) => ({
        type: block.type,
        label: block.label || '',
        field_key: `${block.type}_${Math.random().toString(36).substring(2, 7)}`,
        position: index,
        required: block.required || false,
        config: {
          ...block,
        },
      }))

      // 3. Update form with blocks and theme
      await formService.update(formId, {
        theme_config: {
          primaryColor: template.primaryColor || 'blue',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter',
        },
        blocks: blocksToSave as any,
      })

      toast.success(`${template.title} created!`)
      navigate(`/builder?formId=${formId}`)
    } catch (error: any) {
      console.error(error)
      toast.error('Failed to create form from template')
    } finally {
      setCreatingTemplate(null)
    }
  }

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            <Sparkles className="text-primary h-5 w-5" />
            Start with a Template
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Choose a starting point to create your form faster
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => handleTemplateSelect(template)}
              disabled={!!creatingTemplate}
              className={cn(
                'group border-border bg-card relative w-full cursor-pointer rounded-xl border p-5 text-left transition-all duration-300',
                'hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl',
                creatingTemplate === template.id &&
                  'ring-primary opacity-80 ring-2 ring-offset-2'
              )}
            >
              <div
                className={cn(
                  'mb-4 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
                  colorMap[template.primaryColor || 'blue'] || colorMap.blue
                )}
              >
                {iconMap[template.icon] || <Plus className="h-5 w-5" />}
              </div>

              <h3 className="text-foreground group-hover:text-primary mb-1 font-bold transition-colors">
                {template.title}
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                {template.description}
              </p>

              <div className="border-border/50 mt-4 flex items-center justify-between border-t pt-4 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                  Use Template
                </span>
                <ArrowRight className="text-primary h-4 w-4" />
              </div>

              {creatingTemplate === template.id && (
                <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px] transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="text-primary h-6 w-6 animate-spin" />
                    <span className="text-foreground text-xs font-medium">
                      Setting up...
                    </span>
                  </div>
                </div>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
