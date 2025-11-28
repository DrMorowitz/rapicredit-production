'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Menu,
  X,
} from 'lucide-react'
import CameraUpload from '@/components/ui/camera-upload'
import { cn } from '@/lib/utils'
import Footer from '@/components/ui/footer'
import {
  LoanApplication,
  SESSION_KEY,
  STORAGE_KEY,
  SUBMISSIONS_KEY,
  SessionMetadata,
  StoredSubmission,
  provinces,
  countryOptions,
} from '@/lib/solicitud/data'
import {
  buildPersistedApplication,
  calculateAge,
  createEmptyApplication,
  formatCurrency,
  generateSessionMetadata,
  parseStoredApplication,
  updateSessionLastSeen,
} from '@/lib/solicitud/utils'

const STEP_KEYS = ['personal', 'loan', 'address', 'employment', 'documents', 'review'] as const
type StepKey = (typeof STEP_KEYS)[number]

const stepLabels: Record<StepKey, { title: string; description: string }> = {
  personal: {
    title: 'Información personal',
    description: 'Valida quién eres y cómo podemos contactarte.',
  },
  loan: {
    title: 'Detalle de tu préstamo',
    description: 'Elige monto, plazo y propósito del préstamo.',
  },
  address: {
    title: 'Dirección y referencias',
    description: 'Ubica tu residencia para validar tu perfil.',
  },
  employment: {
    title: 'Ingresos y empleo',
    description: 'Cuéntanos sobre tu actividad económica.',
  },
  documents: {
    title: 'Documentos de identidad',
    description: 'Sube las fotografías de tu cédula.',
  },
  review: {
    title: 'Revisión y envío',
    description: 'Confirma la información y envía tu solicitud.',
  },
}

const personalSchema = z
  .object({
    fullName: z.string().min(4, 'Ingresa tu nombre completo'),
    cedula: z.string().min(1, 'Ingresa tu cédula'),
    email: z.string().email('Correo inválido'),
    phoneCountryCode: z.string().min(1, 'Selecciona código de país'),
    phoneNumber: z.string().min(6, 'Ingresa número de teléfono válido'),
    dateOfBirth: z.string().min(1, 'Requerido'),
    maritalStatus: z.enum(['soltero', 'casado', 'union_libre', 'divorciado', 'viudo']),
    dependents: z.number().min(0, 'Mínimo 0 dependientes').max(10, 'Máximo 10 dependientes'),
  })
  .superRefine((data, ctx) => {
    const age = calculateAge(data.dateOfBirth)
    if (age < 18) {
      ctx.addIssue({
        path: ['dateOfBirth'],
        code: z.ZodIssueCode.custom,
        message: 'Debes ser mayor de 18 años',
      })
    }
  })

const loanSchema = z.object({
  amount: z.number().min(0, 'Ingresa un monto válido').optional(),
  term: z.number().min(0, 'Ingresa un plazo válido').optional(),
  purpose: z.enum(['deuda', 'negocio', 'hogar', 'educacion', 'salud', 'viajes', 'otro']).optional(),
  comments: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

const addressSchema = z.object({
  fullAddress: z.string().min(1, 'Ingresa tu dirección'),
  propertyType: z.enum(['alquilado', 'hipotecado', 'comprado', 'dependiente']),
})

const employmentSchema = z.object({
  status: z.enum(['sector_privado', 'sector_gobierno', 'independiente', 'jubilado']),
  companyName: z.string().min(2, 'Selecciona una empresa o entidad').optional(),
  role: z.string().min(2, 'Ingresa tu cargo').optional(),
  monthlyIncome: z.number().min(450, 'El ingreso mínimo es B/. 450'),
  extraIncome: z.number().min(0, 'Ingresa ingresos adicionales o 0'),
  employmentLength: z.string().min(2, 'Ingresa el tiempo en el empleo'),
})

const documentsSchema = z.object({
  idFront: z.string().optional(),
  idBack: z.string().optional(),
  workLetter: z.string().optional(),
})

const consentSchema = z.object({
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la política de privacidad' }),
  }),
  marketingAccepted: z.boolean().optional(),
})

const stepValidators: Record<StepKey, (data: LoanApplication) => string[]> = {
  personal: (data) => formatZodErrors(personalSchema.safeParse(data.personal)),
  loan: (data) => formatZodErrors(loanSchema.safeParse(data.loan)),
  address: (data) => formatZodErrors(addressSchema.safeParse(data.address)),
  employment: (data) => formatZodErrors(employmentSchema.safeParse(data.employment)),
  documents: (data) => formatZodErrors(documentsSchema.safeParse(data.documents)),
  review: (data) =>
    formatZodErrors(consentSchema.safeParse(data.consent)).concat(
      formatZodErrors(documentsSchema.safeParse(data.documents))
    ),
}

const amountOptions = [500, 1000, 3000, 5000, 8000, 10000, 15000]
const termOptions = [6, 9, 12, 18, 24, 36, 48, 60]

const companyOptions = [
  // Sector Privado - Bancos
  { label: 'Banco General', value: 'Banco General' },
  { label: 'Banco Nacional de Panamá', value: 'Banco Nacional de Panamá' },
  { label: 'Banistmo', value: 'Banistmo' },
  { label: 'Banco BAC Credomatic', value: 'Banco BAC Credomatic' },
  { label: 'Multibank', value: 'Multibank' },
  { label: 'Global Bank', value: 'Global Bank' },
  { label: 'Banco Pichincha', value: 'Banco Pichincha' },
  { label: 'Banco Aliado', value: 'Banco Aliado' },
  
  // Sector Privado - Telecomunicaciones
  { label: 'Cable & Wireless Panamá', value: 'Cable & Wireless Panamá' },
  { label: 'Claro Panamá', value: 'Claro Panamá' },
  { label: 'Digicel', value: 'Digicel' },
  { label: 'Tigo', value: 'Tigo' },
  
  // Sector Privado - Retail y Comercio
  { label: 'Grupo Rey', value: 'Grupo Rey' },
  { label: 'Super 99', value: 'Super 99' },
  { label: 'Xtra', value: 'Xtra' },
  { label: 'Riba Smith', value: 'Riba Smith' },
  { label: 'El Machetazo', value: 'El Machetazo' },
  { label: 'Novey', value: 'Novey' },
  { label: 'Conway', value: 'Conway' },
  { label: 'Stevens', value: 'Stevens' },
  
  // Sector Privado - Seguros
  { label: 'ASSA Seguros', value: 'ASSA Seguros' },
  { label: 'Seguros Suramericana', value: 'Seguros Suramericana' },
  { label: 'Mapfre Seguros', value: 'Mapfre Seguros' },
  { label: 'Pan-American Life Insurance', value: 'Pan-American Life Insurance' },
  
  // Sector Privado - Construcción y Desarrollo
  { label: 'CEMEX Panamá', value: 'CEMEX Panamá' },
  { label: 'Grupo MELO', value: 'Grupo MELO' },
  { label: 'Odebrecht', value: 'Odebrecht' },
  { label: 'FCC Construcción', value: 'FCC Construcción' },
  
  // Sector Privado - Energía y Servicios
  { label: 'Naturgy', value: 'Naturgy' },
  { label: 'AES Panamá', value: 'AES Panamá' },
  { label: 'Enel Fortuna', value: 'Enel Fortuna' },
  { label: 'Empresa de Distribución Eléctrica Metro-Oeste', value: 'Empresa de Distribución Eléctrica Metro-Oeste' },
  
  // Sector Privado - Logística y Transporte
  { label: 'Copa Airlines', value: 'Copa Airlines' },
  { label: 'Panamá Ports Company', value: 'Panamá Ports Company' },
  { label: 'MIT Panamá', value: 'MIT Panamá' },
  { label: 'DHL Panamá', value: 'DHL Panamá' },
  { label: 'FedEx Panamá', value: 'FedEx Panamá' },
  
  // Sector Privado - Salud
  { label: 'Hospital Punta Pacifica', value: 'Hospital Punta Pacifica' },
  { label: 'Hospital San Fernando', value: 'Hospital San Fernando' },
  { label: 'Hospital Nacional', value: 'Hospital Nacional' },
  { label: 'Centro Médico Paitilla', value: 'Centro Médico Paitilla' },
  
  // Sector Privado - Educación
  { label: 'Universidad Tecnológica de Panamá (UTP)', value: 'Universidad Tecnológica de Panamá (UTP)' },
  { label: 'Universidad de Panamá', value: 'Universidad de Panamá' },
  { label: 'Universidad Latina de Panamá', value: 'Universidad Latina de Panamá' },
  { label: 'Universidad Santa María La Antigua (USMA)', value: 'Universidad Santa María La Antigua (USMA)' },
  
  // Gobierno - Entidades Principales
  { label: 'Presidencia de la República', value: 'Presidencia de la República' },
  { label: 'Ministerio de Economía y Finanzas (MEF)', value: 'Ministerio de Economía y Finanzas (MEF)' },
  { label: 'Ministerio de Salud (MINSA)', value: 'Ministerio de Salud (MINSA)' },
  { label: 'Ministerio de Educación (MEDUCA)', value: 'Ministerio de Educación (MEDUCA)' },
  { label: 'Ministerio de Seguridad Pública', value: 'Ministerio de Seguridad Pública' },
  { label: 'Ministerio de Obras Públicas (MOP)', value: 'Ministerio de Obras Públicas (MOP)' },
  { label: 'Ministerio de Desarrollo Agropecuario (MIDA)', value: 'Ministerio de Desarrollo Agropecuario (MIDA)' },
  { label: 'Ministerio de Comercio e Industrias (MICI)', value: 'Ministerio de Comercio e Industrias (MICI)' },
  { label: 'Ministerio de Trabajo y Desarrollo Laboral (MITRADEL)', value: 'Ministerio de Trabajo y Desarrollo Laboral (MITRADEL)' },
  { label: 'Ministerio de Ambiente (MIAMBIENTE)', value: 'Ministerio de Ambiente (MIAMBIENTE)' },
  
  // Gobierno - Entidades Autónomas
  { label: 'Caja de Seguro Social (CSS)', value: 'Caja de Seguro Social (CSS)' },
  { label: 'Autoridad del Canal de Panamá (ACP)', value: 'Autoridad del Canal de Panamá (ACP)' },
  { label: 'Autoridad Nacional de Aduanas (ANA)', value: 'Autoridad Nacional de Aduanas (ANA)' },
  { label: 'Dirección General de Ingresos (DGI)', value: 'Dirección General de Ingresos (DGI)' },
  { label: 'Tribunal Electoral', value: 'Tribunal Electoral' },
  { label: 'Contraloría General de la República', value: 'Contraloría General de la República' },
  { label: 'Defensoría del Pueblo', value: 'Defensoría del Pueblo' },
  { label: 'Procuraduría General de la Nación', value: 'Procuraduría General de la Nación' },
  { label: 'Instituto de Seguro Agropecuario (ISA)', value: 'Instituto de Seguro Agropecuario (ISA)' },
  { label: 'Instituto para la Formación y Aprovechamiento de Recursos Humanos (IFARHU)', value: 'Instituto para la Formación y Aprovechamiento de Recursos Humanos (IFARHU)' },
  
  // Gobierno - Poder Judicial y Legislativo
  { label: 'Órgano Judicial', value: 'Órgano Judicial' },
  { label: 'Asamblea Nacional', value: 'Asamblea Nacional' },
  { label: 'Ministerio Público', value: 'Ministerio Público' },
  
  // Gobierno - Municipios Principales
  { label: 'Alcaldía de Panamá', value: 'Alcaldía de Panamá' },
  { label: 'Alcaldía de San Miguelito', value: 'Alcaldía de San Miguelito' },
  { label: 'Alcaldía de Penononé', value: 'Alcaldía de Penononé' },
  { label: 'Alcaldía de David', value: 'Alcaldía de David' },
  { label: 'Alcaldía de Colón', value: 'Alcaldía de Colón' },
  
  // Sector Privado - Otros
  { label: 'Otro (especificar)', value: 'Otro' },
]

const cloneApplication = (app: LoanApplication): LoanApplication =>
  JSON.parse(JSON.stringify(app))

export default function SolicitudForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [application, setApplication] = useState<LoanApplication>(createEmptyApplication)
  const [session, setSession] = useState<SessionMetadata | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [saveState, setSaveState] = useState<{ status: 'idle' | 'saving' | 'saved'; timestamp?: string }>({
    status: 'idle',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const persisted = parseStoredApplication(localStorage.getItem(STORAGE_KEY))
    if (persisted) {
      setApplication(persisted.data)
      setCurrentStep(Math.min(persisted.currentStep ?? 0, STEP_KEYS.length - 1))
      setSession(updateSessionLastSeen(persisted.session))
      setSaveState({ status: 'saved', timestamp: persisted.updatedAt })
    } else {
      const storedSession = window.sessionStorage.getItem(SESSION_KEY)
      if (storedSession) {
        const parsed = JSON.parse(storedSession) as SessionMetadata
        setSession(updateSessionLastSeen(parsed))
      } else {
        const meta = generateSessionMetadata()
        setSession(meta)
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(meta))
      }
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !session || loading) return
    setSaveState({ status: 'saving' })
    const handler = window.setTimeout(() => {
      const payload = buildPersistedApplication(application, updateSessionLastSeen(session), currentStep)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      setSaveState({ status: 'saved', timestamp: payload.updatedAt })
    }, 1200)
    return () => window.clearTimeout(handler)
  }, [application, currentStep, session, loading])

  const progress = useMemo(() => ((currentStep + 1) / STEP_KEYS.length) * 100, [currentStep])

  const handleFieldChange = (
    step: StepKey,
    field: string,
    value: unknown
  ) => {
    setApplication((prev) => {
      const next = cloneApplication(prev)
      if (step === 'personal' || step === 'loan' || step === 'address' || step === 'employment') {
        ;(next[step as keyof LoanApplication] as Record<string, unknown>)[field] = value
      } else if (step === 'documents') {
        ;(next.documents as Record<string, unknown>)[field] = value
      } else if (step === 'review') {
        ;(next.consent as Record<string, unknown>)[field] = value
      }
      return next
    })
  }

  const handleNext = () => {
    const key = STEP_KEYS[currentStep]
    const validation = stepValidators[key](application)
    if (validation.length > 0) {
      setErrors(validation)
      return
    }
    setErrors([])
    setCurrentStep((prev) => Math.min(prev + 1, STEP_KEYS.length - 1))
  }

  const handlePrev = () => {
    setErrors([])
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    setApplication(createEmptyApplication())
    setCurrentStep(0)
    setErrors([])
    setSaveState({ status: 'idle' })
    setSubmitted(false)
  }

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Error al procesar la imagen'))
      reader.readAsDataURL(file)
    })

  const handleDocumentCapture = async (side: 'idFront' | 'idBack' | 'workLetter', file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file)
      handleFieldChange('documents', side, dataUrl)
      setErrors([])
    } catch (error) {
      console.error(error)
      setErrors(['No se pudo procesar la imagen. Inténtalo nuevamente.'])
    }
  }

  const handleSubmit = async () => {
    const reviewErrors = stepValidators.review(application)
    if (reviewErrors.length > 0) {
      setErrors(reviewErrors)
      return
    }
    setErrors([])
    setIsSubmitting(true)
    try {
      const currentSession = updateSessionLastSeen(session ?? generateSessionMetadata())
      
      // Submit to Supabase via API
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application,
          session: currentSession,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit application')
      }

      // Clear localStorage since we now have it in database
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
        
        // Still save to localStorage as backup/cache for admin dashboard
        const submissions: StoredSubmission[] = JSON.parse(
          localStorage.getItem(SUBMISSIONS_KEY) ?? '[]'
        )
        const payload: StoredSubmission = {
          id: result.applicationId || crypto.randomUUID(),
          submittedAt: new Date().toISOString(),
          status: 'completed',
          progress: 100,
          application,
          session: currentSession,
        }
        submissions.unshift(payload)
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions))
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors([error instanceof Error ? error.message : 'Error al enviar la solicitud. Inténtalo nuevamente.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentKey = STEP_KEYS[currentStep]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-rapicredit-primary" />
          <p className="text-sm text-gray-500">Cargando tu solicitud...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-16">
      {/* Mobile Header */}
      <div className="md:hidden border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-rapicredit-primary" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">RapiCredit</h1>
              <p className="text-xs text-gray-500">Paso {currentStep + 1} de {STEP_KEYS.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {Math.round(progress)}%
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Progress Bar */}
        <div className="px-4 pb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-rapicredit-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menú de navegación</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Navigation Items */}
            <div className="p-4 space-y-4">
              <Link
                href="/"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Volver al inicio</span>
              </Link>
              
              <button
                onClick={() => {
                  handleReset()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 w-full text-left"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="text-sm font-medium">Reiniciar solicitud</span>
              </button>
            </div>

            {/* Steps Overview */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Progreso de solicitud</h3>
              <div className="space-y-2">
                {STEP_KEYS.map((key, index) => {
                  const done = index < currentStep
                  const active = index === currentStep
                  return (
                    <div
                      key={key}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-lg text-sm',
                        done && 'text-green-700 bg-green-50',
                        active && 'text-rapicredit-primary bg-rapicredit-primary/10',
                        !done && !active && 'text-gray-500'
                      )}
                    >
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                        done && 'bg-green-500 text-white',
                        active && 'bg-rapicredit-primary text-white',
                        !done && !active && 'bg-gray-200 text-gray-600'
                      )}>
                        {done ? '✓' : index + 1}
                      </div>
                      <span className="font-medium">{stepLabels[key].title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Save Status */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {saveState.status === 'saving' && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin text-rapicredit-primary" />
                    <span>Guardando...</span>
                  </>
                )}
                {saveState.status === 'saved' && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>Guardado {saveState.timestamp && formatLocaleTime(saveState.timestamp)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden md:block border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver al inicio
            </Link>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-rapicredit-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Solicitud de préstamo</h1>
                <p className="text-sm text-gray-500">
                  Completa los pasos para obtener una respuesta en minutos.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                Progreso {Math.round(progress)}%
              </span>
              {saveState.status === 'saving' && (
                <span className="flex items-center gap-1 text-rapicredit-primary">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Guardando...
                </span>
              )}
              {saveState.status === 'saved' && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Guardado {saveState.timestamp && formatLocaleTime(saveState.timestamp)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCcw className="h-3 w-3" />
              Reiniciar
            </button>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-6">
          <ol className="grid gap-4 md:grid-cols-6">
            {STEP_KEYS.map((key, index) => {
              const done = index < currentStep
              const active = index === currentStep
              return (
                <li
                  key={key}
                  className={cn(
                    'rounded-xl border p-3',
                    done && 'border-green-200 bg-green-50 text-green-700',
                    active && 'border-rapicredit-primary bg-rapicredit-primary/10',
                    !done && !active && 'border-gray-200 bg-white text-gray-500'
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Paso {index + 1}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{stepLabels[key].title}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 md:pt-10">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm">
            <header className="mb-4 md:mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  {stepLabels[currentKey].title}
                </h2>
                <p className="text-sm text-gray-500 hidden md:block">{stepLabels[currentKey].description}</p>
              </div>
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-rapicredit-primary/60" />
            </header>

            {errors.length > 0 && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <p className="mb-2 font-semibold">Revisa los siguientes puntos:</p>
                <ul className="list-disc space-y-1 pl-5">
                  {errors.map((error, index) => (
                    <li key={`error-${index}-${error}`}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-8">
              {renderStep(
                currentKey,
                application,
                handleFieldChange,
                (side) => handleFieldChange('documents', side, undefined),
                handleDocumentCapture,
                showPrivacyDetails,
                setShowPrivacyDetails
              )}
            </div>

            <footer className="mt-6 md:mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500 hidden md:flex">
                <ShieldCheck className="h-4 w-4 text-rapicredit-primary" />
                Conexión segura y datos cifrados.
              </div>

              <div className="flex flex-col-reverse items-stretch gap-3 md:flex-row md:items-center">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Atrás
                  </button>
                )}

                {currentKey !== 'review' && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {currentKey === 'review' && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || submitted}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rapicredit-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-rapicredit-secondary-hover disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : submitted ? (
                      <>
                        Solicitud enviada
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Enviar solicitud
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </footer>

            {submitted && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">
                      ¡Gracias! Recibimos tu solicitud.
                    </h3>
                    <p className="mt-1 text-sm text-green-700/80">
                      Un asesor se comunicará contigo en las próximas horas. También puedes
                      continuar en WhatsApp para acelerar el proceso.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="https://wa.me/message/VMLI5QEO3F7EN1"
                        className="inline-flex items-center gap-2 rounded-xl border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                      >
                        <UploadCloud className="h-4 w-4" />
                        Continuar por WhatsApp
                      </Link>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-100"
                      >
                        Nueva solicitud
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800">Estado de tu solicitud</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase text-gray-400">Paso actual</p>
                  <p className="text-sm font-medium text-gray-700">{stepLabels[currentKey].title}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Monto seleccionado</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatCurrency(application.loan.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Plazo estimado</p>
                  <p className="text-sm font-medium text-gray-700">
                    {application.loan.term} meses
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Ingreso mensual</p>
                  <p className="text-sm font-medium text-gray-700">
                    {application.employment.monthlyIncome
                      ? formatCurrency(application.employment.monthlyIncome)
                      : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-rapicredit-primary/30 bg-rapicredit-primary/5 p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <FileText className="h-4 w-4 text-rapicredit-primary" />
                Consejos para aprobación rápida
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Asegúrate de que tus datos coincidan con tu cédula.</li>
                <li>• Sube fotografías claras y sin reflejos.</li>
                <li>• Acepta la política de privacidad para continuar.</li>
                <li>• Verifica que tu número de celular se encuentre activo.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800">¿Necesitas ayuda?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Escríbenos por WhatsApp o llámanos y te guiaremos paso a paso durante el proceso.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <a
                  href="https://wa.me/message/VMLI5QEO3F7EN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
                >
                  Contactar por WhatsApp
                </a>
                <a
                  href="tel:+50769007615"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Llamar a un asesor
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile-only key info bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <ShieldCheck className="h-4 w-4 text-rapicredit-primary" />
            <span>Seguro</span>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Monto: {formatCurrency(application.loan.amount)}</div>
            <div className="text-xs text-gray-500">Plazo: {application.loan.term} meses</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/message/VMLI5QEO3F7EN1"
              className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function renderStep(
  step: StepKey,
  application: LoanApplication,
  onChange: (step: StepKey, field: string, value: unknown) => void,
  onRemoveDocument: (side: 'idFront' | 'idBack' | 'workLetter') => void,
  onCapture: (side: 'idFront' | 'idBack' | 'workLetter', file: File) => Promise<void>,
  showPrivacyDetails: boolean,
  setShowPrivacyDetails: (show: boolean) => void
) {
  switch (step) {
    case 'personal':
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Nombre completo"
            required
            value={application.personal.fullName}
            onChange={(value) => onChange('personal', 'fullName', value)}
            placeholder="Ej. María Gómez"
          />
          <Field
            label="Cédula"
            required
            value={application.personal.cedula}
            onChange={(value) => onChange('personal', 'cedula', value)}
            placeholder="Ej. 8-123-4567"
          />
          <Field
            label="Correo electrónico"
            required
            type="email"
            value={application.personal.email}
            onChange={(value) => onChange('personal', 'email', value)}
            placeholder="tu@correo.com"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <SelectField
                label="Código de país"
                required
                value={application.personal.phoneCountryCode}
                onChange={(value) => onChange('personal', 'phoneCountryCode', value)}
                options={countryOptions}
              />
              {application.personal.phoneCountryCode === '+OTHER' && (
                <div className="mt-2">
                  <Field
                    label="Código personalizado"
                    required
                    value={application.personal.customCountryCode || ''}
                    onChange={(value) => onChange('personal', 'customCountryCode', value)}
                    placeholder="Ej. +123"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <Field
                label="Celular"
                required
                value={application.personal.phoneNumber}
                onChange={(value) => onChange('personal', 'phoneNumber', value)}
                placeholder="Ej. 60000000"
              />
            </div>
          </div>
          <Field
            label="Fecha de nacimiento"
            required
            type="date"
            value={application.personal.dateOfBirth}
            onChange={(value) => onChange('personal', 'dateOfBirth', value)}
          />
          <SelectField
            label="Estado civil"
            required
            value={application.personal.maritalStatus}
            onChange={(value) => onChange('personal', 'maritalStatus', value)}
            options={[
              { label: 'Soltero(a)', value: 'soltero' },
              { label: 'Casado(a)', value: 'casado' },
              { label: 'Unión libre', value: 'union_libre' },
              { label: 'Divorciado(a)', value: 'divorciado' },
              { label: 'Viudo(a)', value: 'viudo' },
            ]}
          />
          <Field
            label="Dependientes"
            type="number"
            min={0}
            max={10}
            value={application.personal.dependents === 0 ? '' : application.personal.dependents}
            onChange={(value) => onChange('personal', 'dependents', value === '' ? 0 : Number(value))}
            placeholder="0"
          />
        </div>
      )
    case 'loan':
      return (
        <div className="space-y-8">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Información estimativa
                </h3>
                <p className="text-sm text-blue-800">
                  Esta información nos ayuda a tener una idea de tus necesidades financieras. Los montos y términos finales pueden cambiar y están sujetos a términos y condiciones de aprobación.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Monto aproximado deseado"
              type="number"
              min={500}
              max={15000}
              value={application.loan.amount === 0 ? '' : application.loan.amount}
              onChange={(value) => onChange('loan', 'amount', value === '' ? 0 : Number(value))}
              placeholder="5000"
              prefix="B/."
            />
            <Field
              label="Plazo aproximado (meses)"
              type="number"
              min={6}
              max={60}
              value={application.loan.term === 0 ? '' : application.loan.term}
              onChange={(value) => onChange('loan', 'term', value === '' ? 0 : Number(value))}
              placeholder="24"
            />
            <div className="md:col-span-2">
              <SelectField
                label="Propósito del préstamo"
                value={application.loan.purpose}
                onChange={(value) => onChange('loan', 'purpose', value)}
                options={[
                  { label: 'Unificar deudas', value: 'deuda' },
                  { label: 'Invertir en un negocio', value: 'negocio' },
                  { label: 'Remodelar el hogar', value: 'hogar' },
                  { label: 'Educación', value: 'educacion' },
                  { label: 'Salud', value: 'salud' },
                  { label: 'Viajes o vacaciones', value: 'viajes' },
                  { label: 'Otro', value: 'otro' },
                ]}
              />
            </div>
          </div>
        </div>
      )
    case 'address':
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field
              label="Dirección completa"
              required
              value={application.address.fullAddress}
              onChange={(value) => onChange('address', 'fullAddress', value)}
              placeholder="Ingresa tu dirección actual"
            />
          </div>
          <SelectField
            label="Tipo de domicilio"
            required
            value={application.address.propertyType}
            onChange={(value) => onChange('address', 'propertyType', value)}
            options={[
              { label: 'Alquilado', value: 'alquilado' },
              { label: 'Hipotecado', value: 'hipotecado' },
              { label: 'Comprado', value: 'comprado' },
              { label: 'Dependiente', value: 'dependiente' },
            ]}
          />
        </div>
      )
    case 'employment':
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <SelectField
            label="Situación laboral"
            required
            value={application.employment.status}
            onChange={(value) => onChange('employment', 'status', value)}
            options={[
              { label: 'Sector Privado', value: 'sector_privado' },
              { label: 'Sector Gobierno', value: 'sector_gobierno' },
              { label: 'Independiente', value: 'independiente' },
              { label: 'Jubilado', value: 'jubilado' },
            ]}
          />
          <Field
            label="Antigüedad en el trabajo"
            required
            value={application.employment.employmentLength}
            onChange={(value) => onChange('employment', 'employmentLength', value)}
            placeholder="Ej. 2 años"
          />
          <SelectField
            label="Empresa o entidad"
            value={application.employment.companyName ?? ''}
            onChange={(value) => onChange('employment', 'companyName', value)}
            options={companyOptions}
          />
          {application.employment.companyName === 'Otro' && (
            <div className="md:col-span-2">
              <Field
                label="Especifica tu empresa"
                required
                value={application.employment.customCompanyName || ''}
                onChange={(value) => onChange('employment', 'customCompanyName', value)}
                placeholder="Nombre de tu empresa o actividad económica"
              />
            </div>
          )}
          <Field
            label="Cargo o actividad"
            value={application.employment.role ?? ''}
            onChange={(value) => onChange('employment', 'role', value)}
            placeholder="Ej. Analista financiero"
          />
          <Field
            label="Ingreso mensual aproximado"
            type="number"
            min={0}
            value={application.employment.monthlyIncome === 0 ? '' : application.employment.monthlyIncome}
            onChange={(value) => onChange('employment', 'monthlyIncome', value === '' ? 0 : Number(value))}
            placeholder="1000"
            prefix="B/."
          />
          <Field
            label="Otros ingresos mensuales"
            type="number"
            min={0}
            value={application.employment.extraIncome === 0 ? '' : application.employment.extraIncome}
            onChange={(value) => onChange('employment', 'extraIncome', value === '' ? 0 : Number(value))}
            placeholder="0"
            prefix="B/."
          />
        </div>
      )
    case 'documents':
      return (
        <div className="space-y-8">
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  ¡Acelera tu aprobación!
                </h3>
                <p className="text-sm text-orange-800 mb-3">
                  <strong>95% de las personas que adjuntan su imagen reciben aprobación mucho más rápido.</strong>
                </p>
                <p className="text-xs text-orange-700">
                  También puedes subir carta de trabajo o último talonario (no obligatorio).
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <DocumentUploader
              label="Cédula (frontal)"
              currentImage={application.documents.idFront}
              helpText="Utiliza buena iluminación y evita reflejos."
              onCapture={(file) => onCapture('idFront', file)}
              onRemove={() => onRemoveDocument('idFront')}
            />
            <DocumentUploader
              label="Cédula (reverso)"
              currentImage={application.documents.idBack}
              helpText="Asegúrate que todos los datos sean legibles."
              onCapture={(file) => onCapture('idBack', file)}
              onRemove={() => onRemoveDocument('idBack')}
            />
          </div>
          
          <div className="grid gap-8 md:grid-cols-1">
            <OptionalDocumentUploader
              label="Carta de trabajo o último talonario"
              currentImage={application.documents.workLetter}
              helpText="Documento opcional que puede acelerar tu aprobación."
              onCapture={(file) => onCapture('workLetter', file)}
              onRemove={() => onRemoveDocument('workLetter')}
            />
          </div>
        </div>
      )
    case 'review':
      return (
        <div className="space-y-6">
          <ReviewCard
            title="Información personal"
            items={[
              { label: 'Nombre', value: application.personal.fullName || 'Pendiente' },
              { label: 'Cédula', value: application.personal.cedula || 'Pendiente' },
              { label: 'Correo', value: application.personal.email || 'Pendiente' },
              { label: 'Celular', value: application.personal.phoneNumber ? `${application.personal.phoneCountryCode === '+OTHER' ? (application.personal.customCountryCode || '+OTHER') : application.personal.phoneCountryCode} ${application.personal.phoneNumber}` : 'Pendiente' },
            ]}
          />
          <ReviewCard
            title="Dirección"
            items={[
              { label: 'Dirección completa', value: application.address.fullAddress || 'Pendiente' },
              { label: 'Tipo de domicilio', value: application.address.propertyType ? formatPropertyType(application.address.propertyType) : 'Pendiente' },
            ]}
          />
          <ReviewCard
            title="Préstamo solicitado"
            items={[
              { label: 'Monto', value: formatCurrency(application.loan.amount) },
              { label: 'Plazo', value: `${application.loan.term} meses` },
              { label: 'Propósito', value: formatPurpose(application.loan.purpose) },
            ]}
          />
          <ReviewCard
            title="Documentos cargados"
            items={[
              {
                label: 'Cédula frontal',
                value: application.documents.idFront ? 'Cargada ✓' : 'Pendiente',
              },
              {
                label: 'Cédula reverso',
                value: application.documents.idBack ? 'Cargada ✓' : 'Pendiente',
              },
              {
                label: 'Carta de trabajo',
                value: application.documents.workLetter ? 'Cargada ✓' : 'No cargada',
              },
            ]}
          />
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-4 text-sm text-gray-600">
              <div className="rounded-lg bg-white border border-gray-200 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={application.consent.privacyAccepted}
                    onChange={(event) => onChange('review', 'privacyAccepted', event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-rapicredit-primary focus:ring-rapicredit-primary"
                  />
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium">
                      He leído y acepto los{' '}
                      <button 
                        type="button"
                        className="text-rapicredit-primary underline hover:text-rapicredit-primary-hover"
                        onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                      >
                        términos y condiciones, política de privacidad
                      </button>
                      {' '}y autorizo el uso de mis datos para evaluación crediticia con la APC (Autoridad de Protección al Consumidor y Defensa de la Competencia).
                    </span>
                    
                    {showPrivacyDetails && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2">TÉRMINOS DE SERVICIO Y POLÍTICAS DE PRIVACIDAD</h3>
                            <h4 className="font-semibold text-gray-800">FINANCIERA RAPICREDIT (Shalom Capital, S.A.)</h4>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">1. Propósito General</p>
                            <p>El presente documento establece los Términos de Servicio, Políticas de Privacidad y el Acuerdo de Consentimiento Electrónico, que regulan el uso de los servicios digitales, la plataforma web y las relaciones entre Financiera RAPICREDIT (Shalom Capital, S.A.) y sus clientes o usuarios.</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">2. Consentimiento Electrónico</p>
                            <p>Al utilizar los servicios en línea de Financiera RAPICREDIT, el cliente otorga su consentimiento expreso para:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Recibir, por medios electrónicos, toda la información relacionada con su solicitud o producto financiero.</li>
                              <li>Permitir que la entidad consulte y comparta su historial crediticio con APC Buró, S.A. u otras agencias autorizadas, conforme a la Ley 24 de 2002.</li>
                              <li>Autorizar el uso de registros y firmas electrónicas en lugar de documentos físicos.</li>
                            </ul>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">3. Política de Privacidad</p>
                            <p>Financiera RAPICREDIT (Shalom Capital, S.A.) se compromete a proteger la información personal y financiera de todos sus clientes y usuarios, aplicando las normas de la Ley 81 de 2019 y el Decreto Ejecutivo No. 285 de 2021, sobre protección de datos personales en la República de Panamá.</p>
                            <p className="mt-2"><strong>Datos recopilados:</strong> Nombre completo, cédula o documento de identidad, dirección, teléfono y correo electrónico, fecha de nacimiento, información financiera y laboral, historial de crédito y referencias personales.</p>
                            <p className="mt-2"><strong>Conservación y seguridad:</strong> Los datos serán almacenados en bases seguras por un período de hasta 12 años. Financiera RAPICREDIT aplica medidas físicas, técnicas y administrativas de seguridad para evitar accesos no autorizados, alteraciones o pérdidas de información.</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">4. Uso de la Página Web y Términos de Servicio</p>
                            <p>Al ingresar y utilizar la página web de Financiera RAPICREDIT, el usuario acepta la aceptación total de estos Términos y Condiciones. Todo el contenido está protegido por las leyes de derechos de autor. El sitio está dirigido exclusivamente a personas mayores de 18 años.</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">5. Seguridad de la Información</p>
                            <p>Financiera RAPICREDIT aplica controles estrictos incluyendo encriptación de datos, certificados de seguridad, políticas de contraseñas seguras, monitoreo y sistemas de prevención de intrusiones.</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">Contacto</p>
                            <p><strong>FINANCIERA RAPICREDIT (Shalom Capital, S.A.)</strong></p>
                            <p>Via Ricardo J Alfaro, Centro Comercial La Alhambra, Local 2 Planta Baja</p>
                            <p>Teléfono: 262-4168 | Celular: 6900-7615</p>
                            <p>Correo: cumplimiento@financierarapicredit.com</p>
                          </div>
                          
                          <div className="border-t border-gray-300 pt-2">
                            <p className="text-xs text-gray-500">© 2025 Financiera RAPICREDIT (Shalom Capital, S.A.). Todos los derechos reservados.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="text-red-500">*</span> Campo obligatorio - Requerido para evaluación crediticia
                    </div>
                  </div>
                </label>
              </div>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={application.consent.marketingAccepted}
                  onChange={(event) => onChange('review', 'marketingAccepted', event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-rapicredit-primary focus:ring-rapicredit-primary"
                />
                <span>
                  Deseo recibir ofertas y comunicaciones de RapiCredit por correo o WhatsApp (opcional).
                </span>
              </label>
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}

type FieldProps = {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: string
  min?: number
  max?: number
  prefix?: string
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  min,
  max,
  prefix,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:border-rapicredit-primary focus:outline-none focus:ring-2 focus:ring-rapicredit-primary/20',
            prefix && 'pl-10'
          )}
        />
      </div>
    </label>
  )
}

type SelectFieldProps = {
  label: string
  value: string | number
  onChange: (value: string) => void
  options: { label: string; value: string | number }[]
  required?: boolean
}

function SelectField({ label, value, onChange, options, required }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:border-rapicredit-primary focus:outline-none focus:ring-2 focus:ring-rapicredit-primary/20"
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

type TextareaFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function TextareaField({ label, value, onChange, placeholder }: TextareaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:border-rapicredit-primary focus:outline-none focus:ring-2 focus:ring-rapicredit-primary/20"
      />
    </label>
  )
}

type DocumentUploaderProps = {
  label: string
  currentImage?: string
  helpText?: string
  onCapture: (file: File) => Promise<void>
  onRemove: () => void
}

function DocumentUploader({ label, currentImage, helpText, onCapture, onRemove }: DocumentUploaderProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-gray-300 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          <p className="text-xs text-gray-500">{helpText}</p>
        </div>
        {currentImage && <CheckCircle2 className="h-5 w-5 text-green-500" />}
      </div>
      <CameraUpload
        onImageCapture={async (file) => {
          await onCapture(file)
        }}
        onRemoveImage={onRemove}
        currentImage={currentImage ?? null}
        required={false}
        accept="image/*"
        helpText="Formato JPG o PNG, máximo 5MB."
        side={label.toLowerCase().includes('reverso') ? 'trasera' : 'frontal'}
      />
      {currentImage && (
        <img
          src={currentImage}
          alt={label}
          className="h-48 w-full rounded-xl object-cover shadow-sm"
        />
      )}
    </div>
  )
}

type OptionalDocumentUploaderProps = {
  label: string
  currentImage?: string
  helpText?: string
  onCapture: (file: File) => Promise<void>
  onRemove: () => void
}

function OptionalDocumentUploader({ label, currentImage, helpText, onCapture, onRemove }: OptionalDocumentUploaderProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          <p className="text-xs text-gray-500">{helpText}</p>
        </div>
        {currentImage && <CheckCircle2 className="h-5 w-5 text-orange-500" />}
      </div>
      <CameraUpload
        onImageCapture={async (file) => {
          await onCapture(file)
        }}
        onRemoveImage={onRemove}
        currentImage={currentImage ?? null}
        required={false}
        accept="image/*"
        helpText="Formato JPG o PNG, máximo 5MB."
        side="frontal"
      />
      {currentImage && (
        <img
          src={currentImage}
          alt={label}
          className="h-48 w-full rounded-xl object-cover shadow-sm"
        />
      )}
    </div>
  )
}

type ReviewCardProps = {
  title: string
  items: { label: string; value: string }[]
}

function ReviewCard({ title, items }: ReviewCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <dl className="mt-3 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${title}-${item.label}-${index}`}>
            <dt className="text-xs uppercase text-gray-400">{item.label}</dt>
            <dd className="font-medium text-gray-700">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function formatPurpose(purpose: string) {
  const map: Record<string, string> = {
    deuda: 'Unificar deudas',
    negocio: 'Inversión en negocio',
    hogar: 'Remodelación del hogar',
    educacion: 'Educación',
    salud: 'Salud',
    viajes: 'Viajes',
    otro: 'Otros fines',
    '': 'Pendiente',
  }
  return map[purpose] ?? 'Pendiente'
}

function formatPropertyType(propertyType: string) {
  const map: Record<string, string> = {
    alquilado: 'Alquilado',
    hipotecado: 'Hipotecado',
    comprado: 'Comprado',
    dependiente: 'Dependiente',
    '': 'Pendiente',
  }
  return map[propertyType] ?? 'Pendiente'
}

function formatLocaleTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('es-PA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function formatZodErrors(result: z.SafeParseReturnType<any, any>): string[] {
  if (result.success) return []
  return result.error.issues.map((issue) => issue.message)
}

