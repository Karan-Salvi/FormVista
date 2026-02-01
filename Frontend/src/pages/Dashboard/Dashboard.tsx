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
  MoreVertical,
  Trash,
  Edit,
  Sparkles,
  ArrowRight,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { colorThemes } from '@/components/editor/ThemePanel'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function DashboardPage() {
  const [forms, setForms] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

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
      const response = await formService.getAll()
      setForms(response.data || [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch forms')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return
    try {
      await formService.delete(id)
      setForms(forms.filter(f => f.id !== id))
      toast.success('Form deleted')
    } catch {
      toast.error('Failed to delete form')
    }
  }

  const editForm = (id: string) => {
    navigate(`/builder?formId=${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50 p-8">
      <nav className="bg-background/80 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="text-primary h-6 w-6" />
            <span className="text-foreground text-xl font-semibold">
              FormVista
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <CreateFormDialog />
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
                  <CreateFormDialog />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <div className="mx-auto mt-12 max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Forms</h1>
            <p className="text-gray-500">Welcome back, {user?.name}</p>
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
              Create your first form to get started
            </p>
            <CreateFormDialog />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map(form => {
              const themeColorId = form.theme_config?.primaryColor || 'blue'
              const themeColor =
                colorThemes.find(t => t.id === themeColorId)?.primary ||
                '221 83% 53%'
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
                          {format(new Date(form.createdAt), 'MMM d')}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-1 text-lg font-semibold text-gray-900">
                        {form.title}
                      </CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={e => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation()
                            editForm(form.id)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={e => {
                            e.stopPropagation()
                            deleteForm(form.id)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
                      {form.description || 'No description provided.'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t bg-gray-50/50 px-6 py-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Updated{' '}
                        {format(new Date(form.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-gray-400">
                      <FileText className="h-3 w-3" />
                      {form.slug}
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
