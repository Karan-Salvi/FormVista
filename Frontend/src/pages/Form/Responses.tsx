import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { formService } from '@/services/form.service'
import { authService } from '@/services/auth.service'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  ChevronLeft,
  Download,
  FileSpreadsheet,
  Filter,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  LogOut,
  Menu,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface Response {
  id: string
  submittedAt: string
  answers: {
    block_id: string
    field_key: string
    value: unknown
  }[]
}

export default function ResponsesPage() {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [responses, setResponses] = useState<Response[]>([])
  const [form, setForm] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [formRes, responsesRes, blocksRes] = await Promise.all([
        formService.getById(formId!),
        formService.getResponses(formId!),
        formService.getBlocks(formId!),
      ])

      const formData = formRes.data
      if (formData) {
        formData.blocks = (blocksRes.data as any[]).map(b => ({
          ...b,
          id: b.id || b._id,
        }))
      }

      const responsesData = (responsesRes.data as any[]).map(r => ({
        ...r,
        id: r.id || r._id,
        answers: (r.answers as any[]).map(a => ({
          ...a,
          block_id: a.block_id || a._id,
        })),
      }))

      setForm(formData)
      setResponses(responsesData)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch responses')
    } finally {
      setIsLoading(false)
    }
  }, [formId])

  useEffect(() => {
    if (formId) {
      fetchData()
    }
  }, [formId, fetchData])

  const getAnswerValue = (
    response: Response,
    blockId: string,
    fieldKey: string
  ) => {
    const answer = response.answers.find(
      a => a.field_key === fieldKey || a.block_id === blockId
    )
    if (!answer) return '-'
    if (typeof answer.value === 'object' && answer.value !== null) {
      if (Array.isArray(answer.value)) return answer.value.join(', ')
      return JSON.stringify(answer.value)
    }
    return String(answer.value)
  }

  const exportToCSV = () => {
    if (!form || responses.length === 0) return

    const inputBlocks =
      form.blocks?.filter((b: any) =>
        [
          'short-text',
          'long-text',
          'email',
          'number',
          'dropdown',
          'multiple-choice',
          'checkbox',
          'date',
        ].includes(b.type)
      ) || []

    const headers = [
      'Submitted At',
      ...inputBlocks.map((b: any) => b.label || b.field_key),
    ]
    const rows = responses.map(res => [
      format(new Date(res.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
      ...inputBlocks.map((b: any) => getAnswerValue(res, b.id, b.field_key)),
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${form.title}-responses.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">
            Loading responses...
          </p>
        </div>
      </div>
    )
  }

  const inputBlocks =
    form?.blocks?.filter((b: any) =>
      [
        'short-text',
        'long-text',
        'email',
        'number',
        'dropdown',
        'multiple-choice',
        'checkbox',
        'date',
      ].includes(b.type)
    ) || []

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}
      <nav className="bg-background/80 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-9 w-9"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <Sparkles className="text-primary h-5 w-5" />
                  <span className="text-foreground hidden text-lg font-semibold sm:block">
                    FormVista
                  </span>
                </Link>
                <div className="mx-2 hidden h-4 w-[1px] bg-gray-200 sm:block" />
                <h1 className="max-w-[150px] truncate text-sm font-semibold text-gray-900 sm:max-w-[300px]">
                  {form?.title}{' '}
                  <Badge
                    variant="secondary"
                    className="h-4 py-0 text-[10px] font-normal"
                  >
                    {responses.length} Responses
                  </Badge>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground h-9 w-9 p-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="border-primary/10 hover:border-primary/30 h-10 w-10 border-2 transition-all">
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
                <DropdownMenuItem onClick={exportToCSV} className="sm:hidden">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => authService.logout()}
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Actions Drawer */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
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
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={exportToCSV}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Responses
                    </Button>
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
        </div>
      </nav>

      <div className="mx-auto mt-16 max-w-7xl px-6 py-8">
        {/* Stats Summary */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-none bg-blue-50/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600/70">
                    Total Submissions
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {responses.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-purple-50/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600/70">
                    Last Response
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {responses.length > 0
                      ? format(new Date(responses[0].submittedAt), 'MMM d')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-green-50/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600/70">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold text-green-900">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responses Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {responses.length === 0 ? (
            <div className="py-24 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Mail className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No responses yet
              </h3>
              <p className="text-muted-foreground mx-auto mt-2 max-w-xs">
                As soon as someone fills out your form, their responses will
                appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="w-[180px] font-semibold">
                      Submitted At
                    </TableHead>
                    {inputBlocks.map((block: any) => (
                      <TableHead
                        key={block.id}
                        className="min-w-[150px] font-semibold"
                      >
                        {block.label || block.field_key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map(res => (
                    <TableRow
                      key={res.id}
                      className="group transition-colors hover:bg-gray-50"
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(res.submittedAt), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      {inputBlocks.map((block: any) => (
                        <TableCell
                          key={block.id}
                          className="text-sm font-medium text-gray-700"
                        >
                          {getAnswerValue(res, block.id, block.field_key)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
