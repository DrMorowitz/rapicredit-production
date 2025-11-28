import { LoanApplication, SessionMetadata, defaultApplication } from './data'

const VERSION = 1

type PersistedApplication = {
  version: number
  updatedAt: string
  currentStep: number
  data: LoanApplication
  session: SessionMetadata
}

export const parseStoredApplication = (raw: string | null) => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as PersistedApplication
    if (parsed.version !== VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export const createEmptyApplication = (): LoanApplication => ({
  personal: { ...defaultApplication.personal },
  loan: { ...defaultApplication.loan },
  address: { ...defaultApplication.address },
  employment: { ...defaultApplication.employment },
  documents: {},
  consent: { ...defaultApplication.consent },
})

export const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0
  const dob = new Date(birthDate)
  if (Number.isNaN(dob.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age -= 1
  }
  return age
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency: 'PAB',
    maximumFractionDigits: 2,
  }).format(value || 0)

export const generateSessionMetadata = (): SessionMetadata => {
  const now = new Date().toISOString()
  if (typeof window === 'undefined') {
    return {
      sessionId: crypto.randomUUID(),
      createdAt: now,
      lastSeenAt: now,
      utm: {},
      landingPage: '/',
    }
  }

  const url = new URL(window.location.href)
  const utm: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    if (key.startsWith('utm_')) {
      utm[key] = value
    }
  })

  return {
    sessionId: crypto.randomUUID(),
    createdAt: now,
    lastSeenAt: now,
    utm,
    landingPage: url.pathname || '/',
    referrer: document.referrer || undefined,
    userAgent: navigator.userAgent,
  }
}

export const updateSessionLastSeen = (session: SessionMetadata) => ({
  ...session,
  lastSeenAt: new Date().toISOString(),
})

export const buildPersistedApplication = (
  data: LoanApplication,
  session: SessionMetadata,
  currentStep: number
): PersistedApplication => ({
  version: VERSION,
  updatedAt: new Date().toISOString(),
  data,
  session,
  currentStep,
})

