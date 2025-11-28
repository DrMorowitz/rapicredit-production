'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  BarChart3,
  Download,
  FileSearch,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { SUBMISSIONS_KEY, StoredSubmission } from '@/lib/solicitud/data'
import { formatCurrency } from '@/lib/solicitud/utils'
import { cn } from '@/lib/utils'

const REFRESH_INTERVAL_MS = 30_000

// Helper function to get progress percentage from status
function getProgressFromStatus(status: string): number {
  switch (status) {
    case 'new':
      return 0
    case 'opened':
      return 50
    case 'sent':
      return 100
    default:
      return 0
  }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showUTM, setShowUTM] = useState(false)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000)
  const [activeSubmission, setActiveSubmission] = useState<StoredSubmission | null>(null)
  const [useSupabase, setUseSupabase] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const readSubmissions = useCallback(async () => {
    if (typeof window === 'undefined') return
    setLoading(true)
    setError(null)
    
    try {
      if (useSupabase) {
        // Try to fetch from Supabase via API
        try {
          const response = await fetch('/api/admin/applications', {
            method: 'GET',
            headers: {
              'x-admin-password': 'rapicredit2024admin',
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()

          if (!result.success) {
            throw new Error(result.error || 'Failed to fetch applications')
          }

          const supabaseData = result.applications
          const converted: StoredSubmission[] = supabaseData.map((app: any) => ({
            id: app.id,
            submittedAt: app.createdAt,
            status: 'completed' as const,
            progress: 100,
            application: app,
            applicationStatus: app.status || 'new', // Add application status from database
            session: {
              sessionId: 'supabase-session',
              createdAt: app.createdAt,
              lastSeenAt: app.createdAt,
              utm: {},
              landingPage: '/',
            }
          }))
          setSubmissions(converted)
          setLastRefresh(new Date())
          setCountdown(REFRESH_INTERVAL_MS / 1000)
        } catch (supabaseError) {
          console.warn('Failed to fetch from Supabase, falling back to localStorage:', supabaseError)
          setError('Error conectando con la base de datos. Mostrando datos locales.')
          // Fall back to localStorage
          const stored = localStorage.getItem(SUBMISSIONS_KEY)
          const parsed = stored ? (JSON.parse(stored) as StoredSubmission[]) : []
          setSubmissions(parsed)
        }
      } else {
        // Use localStorage only
        const stored = localStorage.getItem(SUBMISSIONS_KEY)
        const parsed = stored ? (JSON.parse(stored) as StoredSubmission[]) : []
        setSubmissions(parsed)
        setLastRefresh(new Date())
        setCountdown(REFRESH_INTERVAL_MS / 1000)
      }
    } catch (error) {
      console.warn('No se pudieron cargar las solicitudes', error)
      setSubmissions([])
      setError('Error cargando las solicitudes')
    } finally {
      setLoading(false)
    }
  }, [useSupabase])

  const updateApplicationStatus = useCallback(async (applicationId: string, newStatus: string) => {
    if (!useSupabase) {
      console.warn('Cannot update status when not using Supabase')
      return
    }

    setUpdatingStatus(applicationId)
    
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'x-admin-password': 'rapicredit2024admin',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: `Status updated to ${newStatus} via admin dashboard`
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update status')
      }

      console.log('Status updated successfully:', result)
      
      // Refresh the submissions to get updated data
      await readSubmissions()
      
    } catch (error) {
      console.error('Failed to update application status:', error)
      setError(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUpdatingStatus(null)
    }
  }, [useSupabase, readSubmissions])

  useEffect(() => {
    readSubmissions()
  }, [readSubmissions])

  useEffect(() => {
    if (!autoRefreshEnabled) return
    const interval = window.setInterval(() => {
      readSubmissions()
    }, REFRESH_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [autoRefreshEnabled, readSubmissions])

  useEffect(() => {
    if (!autoRefreshEnabled) return
    const interval = window.setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : REFRESH_INTERVAL_MS / 1000))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [autoRefreshEnabled])

  const filteredSubmissions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return submissions
    return submissions.filter(submission => {
      const { personal } = submission.application
      const haystack = [
        personal.fullName,
        personal.cedula,
        personal.email,
        personal.phoneNumber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [searchTerm, submissions])

  const stats = useMemo(() => {
    const total = submissions.length
    const completed = submissions.filter(submission => submission.status === 'completed').length
    const today = submissions.filter(submission => {
      const submitted = new Date(submission.submittedAt)
      const now = new Date()
      return (
        submitted.getDate() === now.getDate() &&
        submitted.getMonth() === now.getMonth() &&
        submitted.getFullYear() === now.getFullYear()
      )
    }).length
    const avgAmount =
      submissions.reduce((acc, submission) => acc + (submission.application.loan.amount || 0), 0) /
      (total || 1)
    return { total, completed, today, avgAmount }
  }, [submissions])

  const handleExportCsv = () => {
    if (!submissions.length) return
    const headers = [
      'ID',
      'Fecha envío',
      'Estado',
      'Progreso',
      'Nombre',
      'Cédula',
      'Email',
      'Teléfono',
      'Monto solicitado',
      'Plazo',
      'Propósito',
      'Provincia',
      'Distrito',
      'Situación laboral',
      'Ingreso mensual',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Landing Page',
    ]

    const rows = submissions.map(submission => {
      const { application, session } = submission
      return [
        submission.id,
        submission.submittedAt,
        submission.status,
        submission.progress,
        application.personal.fullName ?? '',
        application.personal.cedula ?? '',
        application.personal.email ?? '',
        application.personal.phoneNumber ?? '',
        application.loan.amount ?? '',
        application.loan.term ?? '',
        application.loan.purpose ?? '',
        '', // Province field removed from form
        application.address.fullAddress ?? '',
        application.employment.status ?? '',
        application.employment.monthlyIncome ?? '',
        session?.utm?.utm_source ?? '',
        session?.utm?.utm_medium ?? '',
        session?.utm?.utm_campaign ?? '',
        session?.landingPage ?? '',
      ]
    })

    const csv = [headers, ...rows]
      .map(row =>
        row
          .map(cell => {
            if (cell === null || cell === undefined) return ''
            const safe = String(cell).replace(/"/g, '""')
            return `"${safe}"`
          })
          .join(','),
      )
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rapicredit-solicitudes-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetStorage = () => {
    if (typeof window === 'undefined') return
    if (confirm('¿Deseas limpiar todas las solicitudes almacenadas? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(SUBMISSIONS_KEY)
      setSubmissions([])
      setActiveSubmission(null)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('admin-authenticated')
      localStorage.removeItem('admin-session-time')
      
      // Clear the session cookie
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.warn('Error during logout:', error)
    } finally {
      // Redirect to login regardless of API result
      router.push('/admin-rc-2024/login')
    }
  }

  // Check authentication - placed after all hooks to avoid conditional hook execution
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for development
        const localAuth = localStorage.getItem('admin-authenticated')
        const sessionTime = localStorage.getItem('admin-session-time')
        
        if (localAuth === 'true' && sessionTime) {
          const timeDiff = Date.now() - parseInt(sessionTime)
          const twentyFourHours = 24 * 60 * 60 * 1000
          
          if (timeDiff < twentyFourHours) {
            setIsAuthenticated(true)
            return
          } else {
            // Session expired, clear localStorage
            localStorage.removeItem('admin-authenticated')
            localStorage.removeItem('admin-session-time')
          }
        }
        
        // Fallback to server-side check
        const response = await fetch('/api/admin/auth', {
          credentials: 'include'
        })
        const data = await response.json()
        
        if (data.authenticated) {
          setIsAuthenticated(true)
          // Sync with localStorage
          localStorage.setItem('admin-authenticated', 'true')
          localStorage.setItem('admin-session-time', Date.now().toString())
        } else {
          router.push('/admin-rc-2024/login')
        }
      } catch (error) {
        // Clear localStorage on error
        localStorage.removeItem('admin-authenticated')
        localStorage.removeItem('admin-session-time')
        router.push('/admin-rc-2024/login')
      }
    }
    
    checkAuth()
  }, [router])

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rapicredit-primary/10 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rapicredit-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rapicredit-secondary/10 to-white pb-16">
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver al inicio
            </Link>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-11 w-11 text-rapicredit-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de control • RapiCredit</h1>
                <p className="text-sm text-gray-500">
                  Acceso interno. Monitorea solicitudes y campañas en tiempo real.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <Sparkles className="h-4 w-4 text-rapicredit-primary" />
            Última actualización:{' '}
            <span className="font-semibold text-gray-700">
              {lastRefresh ? format(lastRefresh, "d 'de' MMMM HH:mm:ss", { locale: es }) : '---'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rapicredit-primary/10 px-3 py-1 text-[11px] font-semibold text-rapicredit-primary md:ml-2">
              <RefreshCw className="h-3 w-3" />
              Auto-actualización {autoRefreshEnabled ? `en ${countdown}s` : 'pausada'}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-10">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BarChart3}
            title="Solicitudes totales"
            value={stats.total.toString()}
            subtitle="Acumulado histórico"
          />
          <StatCard
            icon={FileSearch}
            title="Completadas"
            value={stats.completed.toString()}
            subtitle={`${((stats.completed / (stats.total || 1)) * 100).toFixed(0)}% de conversión`}
            tone="success"
          />
          <StatCard
            icon={Sparkles}
            title="Nuevas hoy"
            value={stats.today.toString()}
            subtitle="Índice diario"
            tone="warning"
          />
          <StatCard
            icon={Filter}
            title="Monto promedio"
            value={formatCurrency(stats.avgAmount || 0)}
            subtitle="Ticket promedio solicitado"
          />
        </section>

        <section className="mt-10 rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-rapicredit-primary/5 backdrop-blur">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Solicitudes registradas</h2>
              <p className="text-sm text-gray-500">
                Filtra por nombre, correo, teléfono o cédula. Descarga el histórico en CSV para tu CRM.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={useSupabase}
                  onChange={event => setUseSupabase(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-rapicredit-primary focus:ring-rapicredit-primary"
                />
                Usar Supabase (BD)
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={event => setAutoRefreshEnabled(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-rapicredit-primary focus:ring-rapicredit-primary"
                />
                Actualizar cada 30s
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={showUTM}
                  onChange={event => setShowUTM(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-rapicredit-primary focus:ring-rapicredit-primary"
                />
                Mostrar columnas UTM
              </label>
              <button
                type="button"
                onClick={readSubmissions}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!submissions.length}
                className="inline-flex items-center gap-2 rounded-xl bg-rapicredit-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-3 w-3" />
                Exportar CSV
              </button>
              <button
                type="button"
                onClick={resetStorage}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Limpiar registros
              </button>
            </div>
          </header>

          {error && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <span className="text-sm font-medium">⚠️ {error}</span>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white/90">
            <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 md:max-w-md">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre, correo, teléfono o cédula..."
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{filteredSubmissions.length} resultados</span>
                <span className="hidden md:inline-block">•</span>
                <span>Ordenados por fecha (desc)</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <Th>Fecha</Th>
                    <Th>Cliente</Th>
                    <Th>Monto</Th>
                    <Th>Plazo</Th>
                    <Th>Estado</Th>
                    <Th>Progreso</Th>
                    {showUTM && (
                      <>
                        <Th>UTM Source</Th>
                        <Th>UTM Campaign</Th>
                      </>
                    )}
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={showUTM ? 9 : 7} className="px-6 py-10 text-center text-sm text-gray-500">
                        No hay registros que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}

                  {filteredSubmissions.map(submission => (
                    <tr
                      key={submission.id}
                      className={cn(
                        'transition hover:bg-rapicredit-primary/5',
                        activeSubmission?.id === submission.id && 'bg-rapicredit-primary/10',
                      )}
                    >
                      <Td>
                        <span className="block font-medium text-gray-800">
                          {format(new Date(submission.submittedAt), "dd MMM ''yy", { locale: es })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(submission.submittedAt), 'HH:mm:ss')}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {submission.application.personal.fullName || 'Sin nombre'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {submission.application.personal.email || '—'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {submission.application.personal.phoneNumber || submission.application.personal.cedula || '—'}
                          </span>
                        </div>
                      </Td>
                      <Td>{formatCurrency(submission.application.loan.amount)}</Td>
                      <Td>{submission.application.loan.term} meses</Td>
                      <Td>
                        <StatusDropdown 
                          status={(submission as any).applicationStatus || 'new'} 
                          applicationId={submission.id}
                          onStatusChange={updateApplicationStatus}
                          isUpdating={updatingStatus === submission.id}
                          canUpdate={useSupabase}
                        />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                (submission as any).applicationStatus === 'sent' ? 'bg-green-500' : 
                                (submission as any).applicationStatus === 'opened' ? 'bg-yellow-500' : 'bg-gray-400',
                              )}
                              style={{ width: `${getProgressFromStatus((submission as any).applicationStatus || 'new')}%` }}
                            />
                          </div>
                          <span className="w-12 text-xs font-semibold text-gray-600">
                            {getProgressFromStatus((submission as any).applicationStatus || 'new')}%
                          </span>
                        </div>
                      </Td>
                      {showUTM && (
                        <>
                          <Td>{submission.session?.utm?.utm_source ?? '—'}</Td>
                          <Td>{submission.session?.utm?.utm_campaign ?? '—'}</Td>
                        </>
                      )}
                      <Td>
                        <button
                          type="button"
                          onClick={() => setActiveSubmission(submission)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                          Ver detalle
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {activeSubmission && (
            <DetailPanel submission={activeSubmission} onClose={() => setActiveSubmission(null)} showUTM={showUTM} />
          )}
        </section>
      </main>
    </div>
  )
}

interface DetailPanelProps {
  submission: StoredSubmission
  onClose: () => void
  showUTM: boolean
}

function DetailPanel({ submission, onClose, showUTM }: DetailPanelProps) {
  const { application, session } = submission

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6 rounded-t-2xl">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Detalle de la Solicitud</h3>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">ID:</span> {submission.id.slice(0, 8)}...
              </p>
              <span className="text-gray-300">•</span>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Fecha:</span> {format(new Date(submission.submittedAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 hover:bg-gray-200 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Column */}
          <div className="space-y-8">
            <Section title="👤 Datos Personales">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <Definition label="Nombre completo" value={application.personal.fullName || '—'} />
                <Definition label="Cédula" value={application.personal.cedula || '—'} />
                <Definition label="Correo electrónico" value={application.personal.email || '—'} />
                <Definition label="Teléfono" value={`${application.personal.phoneCountryCode || ''} ${application.personal.phoneNumber || ''}`.trim() || '—'} />
                <Definition label="Fecha de nacimiento" value={application.personal.dateOfBirth || '—'} />
                <Definition label="Estado civil" value={application.personal.maritalStatus || '—'} />
                <Definition label="Dependientes" value={application.personal.dependents?.toString() || '0'} />
              </div>
            </Section>

            <Section title="💰 Préstamo Solicitado">
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <Definition label="Monto solicitado" value={formatCurrency(application.loan.amount)} />
                <Definition label="Plazo" value={`${application.loan.term} meses`} />
                <Definition label="Propósito" value={application.loan.purpose || '—'} />
                <Definition label="Comentarios adicionales" value={application.loan.comments || 'Sin comentarios'} />
              </div>
            </Section>

            <Section title="🏠 Dirección">
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                {/* Province field removed from form */}
                <Definition label="Dirección completa" value={application.address.fullAddress || '—'} />
                <Definition label="Tipo de propiedad" value={application.address.propertyType || '—'} />
              </div>
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Section title="💼 Situación Laboral">
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <Definition label="Estado laboral" value={application.employment.status || '—'} />
                <Definition label="Empresa" value={application.employment.companyName || '—'} />
                <Definition label="Cargo" value={application.employment.role || '—'} />
                <Definition label="Ingreso mensual" value={formatCurrency(application.employment.monthlyIncome || 0)} />
                <Definition label="Ingresos adicionales" value={formatCurrency(application.employment.extraIncome || 0)} />
                <Definition label="Antigüedad laboral" value={application.employment.employmentLength || '—'} />
              </div>
            </Section>

            {showUTM && (
              <Section title="📊 Información de Marketing">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <Definition label="UTM Source" value={session?.utm?.utm_source || '—'} />
                  <Definition label="UTM Medium" value={session?.utm?.utm_medium || '—'} />
                  <Definition label="UTM Campaign" value={session?.utm?.utm_campaign || '—'} />
                  <Definition label="Página de origen" value={session?.landingPage || '—'} />
                  <Definition label="Referrer" value={session?.referrer || '—'} />
                </div>
              </Section>
            )}
          </div>
        </div>

        {/* Documents Section - Full Width */}
        <div className="border-t border-gray-200 p-8">
          <Section title="📄 Documentos Adjuntos">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ID Front */}
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Cédula (Frontal)</h4>
                  {application.documents.idFront ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Cargada
                      </div>
                      <img
                        src={application.documents.idFront}
                        alt="Cédula frontal"
                        className="w-full max-w-xs mx-auto rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.open(application.documents.idFront, '_blank')}
                      />
                      <p className="text-xs text-gray-500">Click para ver en tamaño completo</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 py-8">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">No cargada</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ID Back */}
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Cédula (Reverso)</h4>
                  {application.documents.idBack ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Cargada
                      </div>
                      <img
                        src={application.documents.idBack}
                        alt="Cédula reverso"
                        className="w-full max-w-xs mx-auto rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.open(application.documents.idBack, '_blank')}
                      />
                      <p className="text-xs text-gray-500">Click para ver en tamaño completo</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 py-8">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">No cargada</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Letter */}
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Talonario / Carta de Trabajo</h4>
                  {application.documents.workLetter ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Cargada
                      </div>
                      <img
                        src={application.documents.workLetter}
                        alt="Talonario / Carta de trabajo"
                        className="w-full max-w-xs mx-auto rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.open(application.documents.workLetter, '_blank')}
                      />
                      <p className="text-xs text-gray-500">Click para ver en tamaño completo</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 py-8">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">No cargada</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

interface DefinitionProps {
  label: string
  value: string
}

function Definition({ label, value }: DefinitionProps) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
      <dt className="text-sm font-medium text-gray-600 min-w-0 mr-4">{label}:</dt>
      <dd className="text-sm font-semibold text-gray-900 text-right break-words">{value || '—'}</dd>
    </div>
  )
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string
  subtitle: string
  tone?: 'default' | 'success' | 'warning'
}

function StatCard({ icon: Icon, title, value, subtitle, tone = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-sm shadow-rapicredit-primary/5 backdrop-blur',
        tone === 'success' && 'border-green-100 bg-green-50/70',
        tone === 'warning' && 'border-amber-100 bg-amber-50/70',
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
        <Icon
          className={cn(
            'h-6 w-6 text-rapicredit-primary',
            tone === 'success' && 'text-green-500',
            tone === 'warning' && 'text-amber-500',
          )}
        />
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}

function StatusDropdown({ 
  status, 
  applicationId, 
  onStatusChange, 
  isUpdating,
  canUpdate 
}: { 
  status: string
  applicationId: string
  onStatusChange: (id: string, status: string) => void
  isUpdating: boolean
  canUpdate: boolean
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'opened':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'sent':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return '1. Nuevo'
      case 'opened':
        return '2. Abierto'
      case 'sent':
        return '3. Enviado'
      default:
        return status
    }
  }

  const statusOptions = [
    { value: 'new', label: '1. Nuevo' },
    { value: 'opened', label: '2. Abierto' }, 
    { value: 'sent', label: '3. Enviado' }
  ]

  if (!canUpdate) {
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}>
        {getStatusLabel(status)}
      </span>
    )
  }

  if (isUpdating) {
    return (
      <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}>
        <span className="mr-2">{getStatusLabel(status)}</span>
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <select
      value={status}
      onChange={(e) => onStatusChange(applicationId, e.target.value)}
      disabled={isUpdating}
      className={`text-xs font-semibold rounded-lg border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-rapicredit-primary ${getStatusColor(status)}`}
    >
      {statusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function StatusBadge({ status }: { status: StoredSubmission['status'] }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Completada
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      En progreso
    </span>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-500">{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 align-top">{children}</td>
}

