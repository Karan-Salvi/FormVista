import { useEffect, useState } from 'react'
import { formService, type FormResponse } from '@/services/form.service'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreateFormDialog } from '@/components/CreateFormDialog'
import { authService } from '@/services/auth.service'
import { Link, useNavigate } from 'react-router-dom'
import {
  Loader2,
  FileText,
  Calendar,
  Trash,
  Edit,
  Sparkles,
  Menu,
  LogOut,
  ChevronLeft,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { colorThemes } from '@/constants/theme'
import { hexToHsl } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

import { TemplateGallery } from '@/components/TemplateGallery'
import { StatsOverview } from '@/components/StatsOverview'

export default function DashboardPage() {
  const [forms, setForms] = useState<FormResponse[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formToDelete, setFormToDelete] = useState<string | null>(null)
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  // Helper function to safely format dates
  const formatDate = (dateString: string | undefined, formatStr: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return format(date, formatStr)
    } catch {
      return 'N/A'
    }
  }

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    fetchForms()
  }, [navigate])

  const fetchForms = async () => {
    try {
      setIsLoading(true)
      const [formsResponse, statsResponse] = await Promise.all([
        formService.getAll(),
        formService.getDashboardStats(),
      ])
      setForms(formsResponse.data || [])
      setStats(statsResponse.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteForm = async (id: string) => {
    try {
      await formService.delete(id)
      setForms(forms.filter(f => f.id !== id))
      toast.success('Form deleted')
    } catch {
      toast.error('Failed to delete form')
    } finally {
      setFormToDelete(null)
    }
  }

  const editForm = (id: string) => {
    navigate(`/builder?formId=${id}`)
  }

  if (isLoading) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-muted/20 relative min-h-screen px-4 py-8 md:px-8">
      <nav className="bg-background/80 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-9 w-9"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Link
              to="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Sparkles className="text-primary h-6 w-6" />
              <span className="text-foreground text-xl font-semibold">
                FormVista
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <CreateFormDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="border-primary/10 hover:border-primary/30 h-10 w-10 border-2 transition-all">
                    {/* <AvatarImage src={`/images/profile.png`} alt={user?.name} /> */}
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm leading-none font-medium">
                    {user?.name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => authService.logout()}
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary h-6 w-6" />
                    FormVista
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <div className="border-border/50 flex items-center gap-3 border-b px-2 py-4">
                    <Avatar className="border-primary/10 h-10 w-10 border">
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {user?.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <CreateFormDialog />
                  <Button
                    variant="ghost"
                    className="justify-start text-red-600 hover:bg-red-50 hover:text-red-600"
                    onClick={() => authService.logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <div className="mx-auto mt-16 max-w-7xl md:mt-20">
        {stats && <StatsOverview stats={stats} />}

        <div className="mb-8 flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Your Forms
            </h1>
            <p className="text-sm text-gray-500 md:text-base">
              Welcome back, {user?.name}
            </p>
          </div>
          <div className="md:hidden">
            <CreateFormDialog />
          </div>
        </div>

        {forms.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white text-center">
            <div className="rounded-full bg-gray-100 p-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No forms yet
            </h3>
            <p className="mt-2 mb-4 text-gray-500">
              Start with a template above or create a blank form
            </p>
            <CreateFormDialog />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map(form => {
              const themeColorId = form.theme_config?.primaryColor || 'blue'
              let themeColor = '221 83% 53%'

              if (themeColorId.startsWith('#')) {
                const { h, s, l } = hexToHsl(themeColorId)
                themeColor = `${h} ${s}% ${l}%`
              } else {
                themeColor =
                  colorThemes.find(t => t.id === themeColorId)?.primary ||
                  '221 83% 53%'
              }
              const statusColor =
                form.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'

              return (
                <Card
                  key={form.id}
                  className="group relative cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => editForm(form.id)}
                >
                  <div
                    className="absolute top-0 left-0 h-1.5 w-full"
                    style={{ backgroundColor: `hsl(${themeColor})` }}
                  />
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor}`}
                        >
                          {form.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(form.createdAt, 'MMM d')}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-1 text-lg font-semibold text-gray-900">
                        {form.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
                      {form.description || 'No description provided.'}
                    </p>

                    {/* Insightful Stats Row */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{form.analytics?.total_views || 0} views</span>
                        </div>
                        <div className="font-medium text-gray-900">
                          {form.analytics?.total_submissions || 0} submissions
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                          <div className="flex items-center gap-1">
                            <span>Conversion Rate</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-2.5 w-2.5 cursor-help opacity-50" />
                                </TooltipTrigger>
                                <TooltipContent className="border-none bg-gray-900 p-2 text-[10px] text-white">
                                  <p>
                                    The percentage of views that resulted in a
                                    submission.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span>
                            {form.analytics?.total_views
                              ? (
                                  (form.analytics.total_submissions /
                                    form.analytics.total_views) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${form.analytics?.total_views ? Math.min((form.analytics.total_submissions / form.analytics.total_views) * 100, 100) : 0}%`,
                            }}
                            className="bg-primary h-full rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="grid grid-cols-3 divide-x divide-gray-100 border-t bg-gray-50/30">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        editForm(form.id)
                      }}
                      className="flex cursor-pointer items-center justify-center gap-2 py-2.5 text-[10px] font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 md:text-xs"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        navigate(`/responses/${form.id}`)
                      }}
                      className="flex cursor-pointer items-center justify-center gap-2 py-2.5 text-[10px] font-medium text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600 md:text-xs"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Responses
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setFormToDelete(form.id)
                      }}
                      className="flex cursor-pointer items-center justify-center gap-2 py-2.5 text-[10px] font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 md:text-xs"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                  <CardFooter className="flex items-center justify-between border-t bg-gray-50/50 px-4 py-2 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Updated {formatDate(form.updatedAt, 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <FileText className="h-2.5 w-2.5" />
                      {form.slug}
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-16 border-t pt-12">
          <TemplateGallery />
        </div>
      </div>

      <AlertDialog
        open={!!formToDelete}
        onOpenChange={open => !open && setFormToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              form and all of its responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => formToDelete && deleteForm(formToDelete)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
