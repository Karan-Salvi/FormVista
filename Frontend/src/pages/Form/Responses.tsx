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
  Tag,
  MessageSquare,
  History,
  Copy,
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
  notes?: string
  tags?: string[]
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
  notes?: string
  tags?: string[]
}

interface InputBlock extends Block {
  field_key: string
}

export default function ResponsesPage() {
  const { formId } = useParams<{ formId: string }>()
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

  // Details Sheet State
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(
    null
  )
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isSavingDetails, setIsSavingDetails] = useState(false)
  const [detailsNotes, setDetailsNotes] = useState('')
  const [detailsTags, setDetailsTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

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
        // Only update current page if it's different to avoid loops
        if (pagination.page !== currentPage) {
          setCurrentPage(pagination.page)
        }
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

  const handleOpenDetails = (res: Response) => {
    setSelectedResponse(res)
    setDetailsNotes(res.notes || '')
    setDetailsTags(res.tags || [])
    setIsDetailsOpen(true)
  }

  const handleSaveDetails = async () => {
    if (!selectedResponse) return

    try {
      setIsSavingDetails(true)
      await formService.updateResponse(selectedResponse.id, {
        notes: detailsNotes,
        tags: detailsTags,
      })

      // Update local state
      setResponses(prev =>
        prev.map(r =>
          r.id === selectedResponse.id
            ? { ...r, notes: detailsNotes, tags: detailsTags }
            : r
        )
      )

      toast.success('Response updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update response')
    } finally {
      setIsSavingDetails(false)
    }
  }

  const toggleTag = (tag: string) => {
    setDetailsTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const addCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!detailsTags.includes(newTag.trim())) {
        setDetailsTags(prev => [...prev, newTag.trim()])
      }
      setNewTag('')
    }
  }

  const PRESET_TAGS = [
    'Hot Lead',
    'Follow-up',
    'Spam',
    'Completed',
    'Important',
  ]

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
        escapeVal(formatDate(res.submittedAt, 'yyyy-MM-dd HH:mm:ss')),
        ...inputBlocks.map((b: InputBlock) =>
          escapeVal(getAnswerValue(res, b.id, b.field_key))
        ),
      ])

      const csvContent = [
        headers.map(h => escapeVal(h)).join(','),
        ...rows.map(r => r.join(',')),
      ].join('\r\n')

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
                      ? formatDate(responses[0].submittedAt, 'MMM d')
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
                        className="group cursor-pointer transition-colors hover:bg-gray-50"
                        onClick={() => handleOpenDetails(res)}
                      >
                        <TableCell className="text-muted-foreground text-sm">
                          <div className="flex flex-col gap-1">
                            <span>
                              {formatDate(res.submittedAt, 'MMM d, yyyy HH:mm')}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {res.tags?.map(tag => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="px-1 py-0 text-[9px] font-normal uppercase"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
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

      {/* Response Details Sidebar */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="h-full w-full overflow-y-auto border-l p-0 shadow-2xl sm:max-w-xl">
          {selectedResponse && (
            <div className="flex h-full flex-col bg-white">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
                <div className="flex flex-col gap-1">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                      Submission Details
                      <Badge
                        variant="outline"
                        className="py-0 text-[10px] font-normal"
                      >
                        ID: {selectedResponse.id.slice(-6)}
                      </Badge>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="text-muted-foreground flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{' '}
                      {formatDate(selectedResponse.submittedAt, 'MMMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{' '}
                      {formatDate(selectedResponse.submittedAt, 'HH:mm:ss')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 gap-1.5"
                    onClick={handleSaveDetails}
                    disabled={isSavingDetails}
                  >
                    {isSavingDetails ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-8 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 rounded-xl bg-gray-50 p-3">
                    <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      <Tag className="h-3 w-3" /> Status
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {detailsTags.length > 0 ? (
                        detailsTags.map(tag => (
                          <Badge
                            key={tag}
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-2 py-0.5 text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No tags
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 rounded-xl bg-gray-50 p-3">
                    <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      <History className="h-3 w-3" /> Response Time
                    </span>
                    <div className="pt-1 text-sm font-bold text-gray-900">
                      N/A
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <div className="bg-primary h-4 w-1 rounded-full" />
                    USER ANSWERS
                  </h3>
                  <div className="grid gap-4">
                    {inputBlocks.map(block => {
                      const value = getAnswerValue(
                        selectedResponse,
                        block.id,
                        block.field_key
                      )
                      return (
                        <div
                          key={block.id}
                          className="group flex flex-col gap-1.5 rounded-xl border-2 border-transparent bg-gray-50/50 p-4 transition-all hover:border-gray-100 hover:bg-gray-50"
                        >
                          <span className="text-xs font-semibold text-gray-500">
                            {block.config.label || block.field_key}
                          </span>
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium whitespace-pre-wrap text-gray-900">
                              {value}
                            </p>
                            <button
                              className="p-1 opacity-0 transition-opacity group-hover:opacity-40 hover:opacity-100"
                              onClick={() => {
                                navigator.clipboard.writeText(String(value))
                                toast.success('Copied to clipboard')
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <div className="h-4 w-1 rounded-full bg-emerald-500" />
                    TAG SUBMISSION
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {PRESET_TAGS.map(tag => (
                        <Badge
                          key={tag}
                          variant={
                            detailsTags.includes(tag) ? 'default' : 'outline'
                          }
                          className={`cursor-pointer px-3 py-1 text-[11px] transition-all hover:scale-105 ${detailsTags.includes(tag) ? 'bg-emerald-600' : ''}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="relative">
                      <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Add custom tag (Press Enter)..."
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2 pr-4 pl-9 text-xs transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={addCustomTag}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pb-8">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <div className="h-4 w-1 rounded-full bg-amber-500" />
                    INTERNAL NOTES
                  </h3>
                  <div className="group relative">
                    <MessageSquare className="absolute top-3 left-3 h-4 w-4 text-amber-500 opacity-50" />
                    <textarea
                      placeholder="Add private notes about this submission (leads info, follow-up context...)"
                      className="min-h-[120px] w-full resize-none rounded-xl border border-amber-100 bg-amber-50/30 py-3 pr-4 pl-10 text-xs leading-relaxed transition-all outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                      value={detailsNotes}
                      onChange={e => setDetailsNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
