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
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileSpreadsheet,
  Filter,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  LogOut,
  Menu,
  Search,
  X,
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
import { type FormResponse } from '@/services/form.service'
import { type Block } from '@/types/form'

interface Response {
  id: string
  submittedAt: string
  answers: {
    block_id: string
    field_key: string
    value: unknown
  }[]
}

interface ApiAnswer {
  block_id: string
  field_key: string
  value: unknown
}

interface ApiSubmission {
  id?: string
  _id?: string
  submittedAt: string
  answers: ApiAnswer[]
}

interface InputBlock extends Block {
  field_key: string
}

export default function ResponsesPage() {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [responses, setResponses] = useState<Response[]>([])
  const [form, setForm] = useState<FormResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchData = useCallback(
    async (page: number = currentPage, pageSize: number = limit) => {
      try {
        setIsLoading(true)
        const [formRes, responsesRes, blocksRes] = await Promise.all([
          formService.getById(formId!),
          formService.getResponses(formId!, page, pageSize),
          formService.getBlocks(formId!),
        ])

        const formData = formRes.data
        if (formData && blocksRes.data) {
          formData.blocks = (
            blocksRes.data as (Block & { _id?: string; position?: number })[]
          ).map(b => ({
            ...b,
            id: b.id || b._id || '',
            order: b.position !== undefined ? b.position : b.order,
          }))
        }

        const { items, pagination } = responsesRes.data
        const responsesData = items.map((r: ApiSubmission) => ({
          ...r,
          id: r.id || r._id || '',
          answers: r.answers.map(a => ({
            ...a,
            block_id: a.block_id || '',
          })),
        })) as Response[]

        setForm(formData)
        setResponses(responsesData)
        setTotalCount(pagination.total)
        setTotalPages(pagination.totalPages)
        setCurrentPage(pagination.page)
      } catch (error) {
        console.error(error)
        toast.error('Failed to fetch responses')
      } finally {
        setIsLoading(false)
      }
    },
    [formId, currentPage, limit]
  )

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
    const value = answer.value
    if (value === null || value === undefined || value === '') return '-'

    if (Array.isArray(value)) return value.join(', ')

    if (typeof value === 'object') return JSON.stringify(value)

    // Check if it's a date string and format it if possible
    if (
      typeof value === 'string' &&
      value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    ) {
      try {
        return format(new Date(value), 'MMM d, yyyy')
      } catch {
        return value
      }
    }

    return String(value)
  }

  const exportToCSV = async () => {
    if (!form) return

    try {
      // Create a function to escape CSV values
      const escapeVal = (val: unknown) => {
        const str = val === null || val === undefined ? '' : String(val)
        return `"${str.replace(/"/g, '""')}"`
      }

      const inputBlocks: InputBlock[] =
        (form.blocks as InputBlock[])?.filter((b: InputBlock) =>
          [
            'short-text',
            'long-text',
            'email',
            'number',
            'dropdown',
            'multiple-choice',
            'checkbox',
            'date',
            'phone',
          ].includes(b.type)
        ) || []

      const headers = [
        'Submitted At',
        ...inputBlocks.map((b: InputBlock) => b.config.label || b.field_key),
      ]

      // Fetch all responses if there are multiple pages
      let dataToExport = responses
      if (totalCount > responses.length) {
        const toastId = toast.loading('Fetching all responses for export...')
        try {
          const res = await formService.getResponses(formId!, 1, totalCount)
          const { items } = res.data
          dataToExport = items.map((r: ApiSubmission) => ({
            ...r,
            id: r.id || r._id || '',
            answers: r.answers.map(a => ({
              ...a,
              block_id: a.block_id || '',
            })),
          })) as Response[]
          toast.dismiss(toastId)
        } catch (error) {
          console.error('Failed to fetch all responses:', error)
          toast.error(
            'Failed to fetch all responses, exporting current page only'
          )
        }
      }

      const rows = dataToExport.map(res => [
        escapeVal(format(new Date(res.submittedAt), 'yyyy-MM-dd HH:mm:ss')),
        ...inputBlocks.map((b: InputBlock) =>
          escapeVal(getAnswerValue(res, b.id, b.field_key))
        ),
      ])

      const csvContent = [
        headers.map(h => escapeVal(h)).join(','),
        ...rows.map(r => r.join(',')),
      ].join('\r\n')

      // Use Blob with BOM for proper Excel encoding
      const blob = new Blob(['\ufeff', csvContent], {
        type: 'text/csv;charset=utf-8;',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `${form.title.replace(/[/\\?%*:|"<>]/g, '-')}-responses.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`Exported ${dataToExport.length} responses`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export responses')
    }
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

  const inputBlocks: InputBlock[] =
    (form?.blocks as InputBlock[])?.filter((b: InputBlock) =>
      [
        'short-text',
        'long-text',
        'email',
        'number',
        'dropdown',
        'multiple-choice',
        'checkbox',
        'date',
        'phone',
      ].includes(b.type)
    ) || []

  const filteredResponses = responses.filter(res => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return res.answers.some(ans => {
      const val = String(ans.value).toLowerCase()
      return val.includes(searchLower)
    })
  })

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
                <div className="mx-2 hidden h-4 w-px bg-gray-200 sm:block" />
                <h1 className="max-w-[150px] truncate text-sm font-semibold text-gray-900 sm:max-w-[300px]">
                  {form?.title}{' '}
                  <Badge
                    variant="secondary"
                    className="h-4 py-0 text-[10px] font-normal"
                  >
                    {filteredResponses.length === responses.length
                      ? responses.length
                      : `${filteredResponses.length}/${responses.length}`}{' '}
                    Responses
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
                variant={showFilter ? 'secondary' : 'ghost'}
                className={`text-muted-foreground h-9 w-9 p-0 ${showFilter ? 'text-primary bg-gray-100' : ''}`}
                onClick={() => setShowFilter(!showFilter)}
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
                      className="justify-start"
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {showFilter ? 'Hide Filter' : 'Show Filter'}
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
        {showFilter && (
          <div className="animate-in fade-in slide-in-from-top-2 mb-6 flex items-center gap-4 duration-200">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all responses..."
                className="bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 h-10 w-full rounded-xl border pr-10 pl-10 text-sm transition-all outline-none focus:ring-4"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-muted-foreground hidden text-sm font-medium sm:block">
                Found {filteredResponses.length} matches
              </p>
            )}
          </div>
        )}

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
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="w-[180px] font-semibold">
                        Submitted At
                      </TableHead>
                      {inputBlocks.map((block: InputBlock) => (
                        <TableHead
                          key={block.id}
                          className="min-w-[150px] font-semibold"
                        >
                          {block.config.label || block.field_key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map(res => (
                      <TableRow
                        key={res.id}
                        className="group transition-colors hover:bg-gray-50"
                      >
                        <TableCell className="text-muted-foreground text-sm">
                          {format(
                            new Date(res.submittedAt),
                            'MMM d, yyyy HH:mm'
                          )}
                        </TableCell>
                        {inputBlocks.map((block: InputBlock) => (
                          <TableCell
                            key={block.id}
                            className="text-sm font-medium text-gray-700"
                          >
                            {getAnswerValue(res, block.id, block.field_key)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {filteredResponses.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={inputBlocks.length + 1}
                          className="py-12 text-center"
                        >
                          <p className="text-muted-foreground font-medium">
                            No responses matching "{searchTerm}"
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="border-t bg-gray-50/30 px-6 py-4">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-muted-foreground text-sm">
                      Showing{' '}
                      <span className="font-semibold text-gray-900">
                        {Math.min((currentPage - 1) * limit + 1, totalCount)}
                      </span>{' '}
                      to{' '}
                      <span className="font-semibold text-gray-900">
                        {Math.min(currentPage * limit, totalCount)}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-gray-900">
                        {totalCount}
                      </span>{' '}
                      responses
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground hidden text-xs sm:block">
                          Per page:
                        </span>
                        <select
                          className="bg-background border-border/50 h-8 rounded-md border px-2 text-xs outline-none"
                          value={limit}
                          onChange={e => {
                            const newLimit = Number(e.target.value)
                            setLimit(newLimit)
                            fetchData(1, newLimit)
                          }}
                        >
                          {[10, 20, 50, 100].map(v => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={currentPage === 1}
                          onClick={() => fetchData(1)}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={currentPage === 1}
                          onClick={() => fetchData(currentPage - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageToShow = currentPage
                              if (currentPage <= 3) pageToShow = i + 1
                              else if (currentPage >= totalPages - 2)
                                pageToShow = totalPages - 4 + i
                              else pageToShow = currentPage - 2 + i

                              // Ensure we don't show invalid pages
                              if (pageToShow <= 0 || pageToShow > totalPages)
                                return null

                              return (
                                <Button
                                  key={pageToShow}
                                  variant={
                                    currentPage === pageToShow
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => fetchData(pageToShow)}
                                >
                                  {pageToShow}
                                </Button>
                              )
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={currentPage === totalPages}
                          onClick={() => fetchData(currentPage + 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={currentPage === totalPages}
                          onClick={() => fetchData(totalPages)}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
