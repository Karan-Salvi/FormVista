import React from 'react'
import { useFormStore } from '@/store/formStore'
import { Palette, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const colorThemes = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '221 83% 53%',
    accent: '221 100% 96%',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '270 70% 55%',
    accent: '270 100% 96%',
  },
  {
    id: 'green',
    name: 'Forest Green',
    primary: '142 70% 40%',
    accent: '142 100% 96%',
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    primary: '24 95% 53%',
    accent: '24 100% 96%',
  },
  {
    id: 'pink',
    name: 'Rose Pink',
    primary: '340 75% 55%',
    accent: '340 100% 96%',
  },
  {
    id: 'teal',
    name: 'Ocean Teal',
    primary: '180 65% 40%',
    accent: '180 100% 96%',
  },
  { id: 'red', name: 'Cherry Red', primary: '0 72% 51%', accent: '0 100% 96%' },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    primary: '240 60% 55%',
    accent: '240 100% 96%',
  },
]

const fontFamilies = [
  { id: 'inter', name: 'Inter', value: "'Inter', system-ui, sans-serif" },
  {
    id: 'system',
    name: 'System Default',
    value: 'system-ui, -apple-system, sans-serif',
  },
  { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
  { id: 'mono', name: 'Monospace', value: 'ui-monospace, monospace' },
]

interface ThemePanelProps {
  trigger?: React.ReactNode
}

export const ThemePanel: React.FC<ThemePanelProps> = ({ trigger }) => {
  const { form, setForm } = useFormStore()

  const currentTheme = form?.theme || {
    primaryColor: 'blue',
    backgroundColor: '0 0% 100%',
    fontFamily: 'inter',
  }

  const updateTheme = (updates: Partial<typeof currentTheme>) => {
    if (!form) return
    setForm({
      ...form,
      theme: { ...currentTheme, ...updates },
      updatedAt: new Date(),
    })
  }

  const applyThemeToDocument = (themeId: string) => {
    const theme = colorThemes.find(t => t.id === themeId)
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary)
      document.documentElement.style.setProperty('--accent-soft', theme.accent)
      document.documentElement.style.setProperty('--ring', theme.primary)
    }
    updateTheme({ primaryColor: themeId })
  }

  const applyFontToDocument = (fontId: string) => {
    const font = fontFamilies.find(f => f.id === fontId)
    if (font) {
      document.documentElement.style.setProperty('--font-family', font.value)
      document.body.style.fontFamily = font.value
    }
    updateTheme({ fontFamily: fontId })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Palette className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </SheetTitle>
          <SheetDescription>
            Customize the look and feel of your form
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Color Theme */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color Theme</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorThemes.map(theme => {
                const isSelected = currentTheme.primaryColor === theme.id
                return (
                  <button
                    key={theme.id}
                    onClick={() => applyThemeToDocument(theme.id)}
                    className={`relative aspect-square w-full rounded-lg transition-all hover:scale-105 ${
                      isSelected ? 'ring-primary ring-2 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: `hsl(${theme.primary})` }}
                    title={theme.name}
                  >
                    {isSelected && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Font Family</Label>
            <Select
              value={currentTheme.fontFamily}
              onValueChange={applyFontToDocument}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font.id} value={font.id}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview</Label>
            <div className="border-border bg-card rounded-lg border p-4">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Sample Heading
              </h3>
              <p className="text-muted-foreground mb-3 text-sm">
                This is how your form text will appear to users.
              </p>
              <Button size="sm">Submit Button</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
