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

import { colorThemes, fontFamilies } from '@/constants/theme'
import { Input } from '@/components/ui/input'
import { hexToHsl, hslToHex } from '@/lib/utils'

interface ThemePanelProps {
  trigger?: React.ReactNode
}

export const ThemePanel: React.FC<ThemePanelProps> = ({ trigger }) => {
  const { form, setForm } = useFormStore()
  const [customHex, setCustomHex] = React.useState('#000000')
  const [customBgHex, setCustomBgHex] = React.useState('#ffffff')
  const [customTextHex, setCustomTextHex] = React.useState('#000000')

  const currentTheme = React.useMemo(
    () =>
      form?.theme || {
        primaryColor: 'blue',
        backgroundColor: '#ffffff',
        fontFamily: 'inter',
        textColor: '#000000',
      },
    [form?.theme]
  )

  // Initialize custom hexes
  React.useEffect(() => {
    if (currentTheme.primaryColor?.startsWith('#')) {
      setCustomHex(currentTheme.primaryColor)
    }
    if (currentTheme.backgroundColor?.startsWith('#')) {
      setCustomBgHex(currentTheme.backgroundColor)
    }
    if (currentTheme.textColor?.startsWith('#')) {
      setCustomTextHex(currentTheme.textColor)
    }
  }, [currentTheme])

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
      updateTheme({ primaryColor: themeId })
    }
  }

  const applyCustomColor = (hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex) && !/^#[0-9A-F]{3}$/i.test(hex)) return

    const { h, s, l } = hexToHsl(hex)
    const hslString = `${h} ${s}% ${l}%`
    const accentString = `${h} 100% 96%`

    document.documentElement.style.setProperty('--primary', hslString)
    document.documentElement.style.setProperty('--accent-soft', accentString)
    document.documentElement.style.setProperty('--ring', hslString)

    updateTheme({ primaryColor: hex })
  }

  const applyBackgroundColor = (hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex) && !/^#[0-9A-F]{3}$/i.test(hex)) return
    document.documentElement.style.setProperty('--background-custom', hex)
    updateTheme({ backgroundColor: hex })
  }

  const applyTextColor = (hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex) && !/^#[0-9A-F]{3}$/i.test(hex)) return
    document.documentElement.style.setProperty('--text-custom', hex)
    updateTheme({ textColor: hex })
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
      <SheetContent className="scrollbar-thin w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </SheetTitle>
          <SheetDescription>
            Customize the look and feel of your form
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Color Theme */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Color Theme</Label>
              <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                Presets
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
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

            {/* Custom Color */}
            <div className="space-y-3 pt-2">
              <Label className="text-muted-foreground text-xs">
                Custom Color (Hex)
              </Label>
              <div className="flex gap-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border">
                  <input
                    type="color"
                    value={customHex?.startsWith('#') ? customHex : '#3b82f6'}
                    onChange={e => {
                      setCustomHex(e.target.value)
                      applyCustomColor(e.target.value)
                    }}
                    className="absolute -inset-2 h-[150%] w-[150%] cursor-pointer border-none bg-transparent"
                  />
                </div>
                <Input
                  value={customHex}
                  onChange={e => {
                    setCustomHex(e.target.value)
                    if (
                      /^#[0-9A-F]{6}$/i.test(e.target.value) ||
                      /^#[0-9A-F]{3}$/i.test(e.target.value)
                    ) {
                      applyCustomColor(e.target.value)
                    }
                  }}
                  placeholder="#000000"
                  className="h-10 text-sm"
                />
              </div>
            </div>
          </div>
          {/* Background Color */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Background Color</Label>
              <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                Presets
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'white', name: 'White', hex: '#ffffff' },
                { id: 'black', name: 'Black', hex: '#000000' },
                { id: 'gray', name: 'Light Gray', hex: '#f3f4f6' },
                ...colorThemes.map(t => {
                  const [h, s, l] = t.primary.split(' ').map(v => parseFloat(v))
                  return { id: t.id, name: t.name, hex: hslToHex(h, s, l) }
                }),
              ].map(theme => {
                const isSelected = currentTheme.backgroundColor === theme.hex
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCustomBgHex(theme.hex)
                      applyBackgroundColor(theme.hex)
                    }}
                    className={`relative aspect-square w-full rounded-lg transition-all hover:scale-105 ${
                      isSelected ? 'ring-primary ring-2 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: theme.hex }}
                    title={theme.name}
                  >
                    {isSelected && (
                      <Check
                        className={`absolute inset-0 m-auto h-4 w-4 ${theme.id === 'white' || theme.id === 'gray' ? 'text-black' : 'text-white'}`}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom Background Color */}
            <div className="space-y-3 pt-2">
              <Label className="text-muted-foreground text-xs">
                Custom Background (Hex)
              </Label>
              <div className="flex gap-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border">
                  <input
                    type="color"
                    value={
                      customBgHex?.startsWith('#') ? customBgHex : '#ffffff'
                    }
                    onChange={e => {
                      setCustomBgHex(e.target.value)
                      applyBackgroundColor(e.target.value)
                    }}
                    className="absolute -inset-2 h-[150%] w-[150%] cursor-pointer border-none bg-transparent"
                  />
                </div>
                <Input
                  value={customBgHex}
                  onChange={e => {
                    setCustomBgHex(e.target.value)
                    if (
                      /^#[0-9A-F]{6}$/i.test(e.target.value) ||
                      /^#[0-9A-F]{3}$/i.test(e.target.value)
                    ) {
                      applyBackgroundColor(e.target.value)
                    }
                  }}
                  placeholder="#ffffff"
                  className="h-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Text Color</Label>
              <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                Presets
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'black', name: 'Black', hex: '#000000' },
                { id: 'white', name: 'White', hex: '#ffffff' },
                { id: 'dark-gray', name: 'Dark Gray', hex: '#1f2937' },
                ...colorThemes.map(t => {
                  const [h, s, l] = t.primary.split(' ').map(v => parseFloat(v))
                  return { id: t.id, name: t.name, hex: hslToHex(h, s, l) }
                }),
              ].map(theme => {
                const isSelected = currentTheme.textColor === theme.hex
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCustomTextHex(theme.hex)
                      applyTextColor(theme.hex)
                    }}
                    className={`relative aspect-square w-full rounded-lg transition-all hover:scale-105 ${
                      isSelected ? 'ring-primary ring-2 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: theme.hex }}
                    title={theme.name}
                  >
                    {isSelected && (
                      <Check
                        className={`absolute inset-0 m-auto h-4 w-4 ${theme.id === 'white' ? 'text-black' : 'text-white'}`}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom Text Color */}
            <div className="space-y-3 pt-2">
              <Label className="text-muted-foreground text-xs">
                Custom Text (Hex)
              </Label>
              <div className="flex gap-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border">
                  <input
                    type="color"
                    value={
                      customTextHex?.startsWith('#') ? customTextHex : '#000000'
                    }
                    onChange={e => {
                      setCustomTextHex(e.target.value)
                      applyTextColor(e.target.value)
                    }}
                    className="absolute -inset-2 h-[150%] w-[150%] cursor-pointer border-none bg-transparent"
                  />
                </div>
                <Input
                  value={customTextHex}
                  onChange={e => {
                    setCustomTextHex(e.target.value)
                    if (
                      /^#[0-9A-F]{6}$/i.test(e.target.value) ||
                      /^#[0-9A-F]{3}$/i.test(e.target.value)
                    ) {
                      applyTextColor(e.target.value)
                    }
                  }}
                  placeholder="#000000"
                  className="h-10 text-sm"
                />
              </div>
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
          <div className="space-y-3 pb-8">
            <Label className="text-sm font-medium">Preview</Label>
            <div
              className="border-border rounded-lg border p-4 shadow-sm transition-colors"
              style={{
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.textColor,
              }}
            >
              <h3 className="mb-2 text-lg font-semibold">Sample Heading</h3>
              <p className="mb-4 text-sm opacity-80">
                This is how your form text will appear to users with the
                selected colors and typography.
              </p>
              <Button
                size="sm"
                style={{
                  backgroundColor: currentTheme.primaryColor?.startsWith('#')
                    ? currentTheme.primaryColor
                    : `hsl(${colorThemes.find(t => t.id === currentTheme.primaryColor)?.primary})`,
                }}
              >
                Submit Button
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
