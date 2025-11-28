import { LoanApplication, SessionMetadata } from '../solicitud/data'
import { submitLoanApplication, logEmailNotification } from '../supabase/queries'

export interface SubmissionResult {
  success: boolean
  applicationId?: string
  error?: string
}

export interface SubmissionMetadata {
  userAgent?: string
  ipAddress?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export async function submitApplication(
  application: LoanApplication,
  session: SessionMetadata,
  metadata?: SubmissionMetadata
): Promise<SubmissionResult> {
  try {
    // Validate required fields
    const validationErrors = validateApplication(application)
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: `Validation failed: ${validationErrors.join(', ')}`
      }
    }

    // Submit to database
    const submittedApplication = await submitLoanApplication(
      application,
      session.sessionId,
      {
        userAgent: metadata?.userAgent,
        ipAddress: metadata?.ipAddress,
        referrer: metadata?.referrer || session.referrer,
        utmSource: metadata?.utmSource || session.utm?.utm_source,
        utmMedium: metadata?.utmMedium || session.utm?.utm_medium,
        utmCampaign: metadata?.utmCampaign || session.utm?.utm_campaign,
      }
    )

    // Log initial email notification (we'll send it via API endpoint)
    await logEmailNotification(
      (submittedApplication as any).id,
      'admin_notification',
      process.env.RAPICREDIT_STAFF_EMAIL || 'solicitudes@financierarapicredit.com',
      `Nueva Solicitud de Préstamo - ${application.personal.fullName}`,
      'pending'
    )

    return {
      success: true,
      applicationId: (submittedApplication as any).id
    }

  } catch (error) {
    console.error('Form submission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

function validateApplication(application: LoanApplication): string[] {
  const errors: string[] = []

  // Personal information validation
  if (!application.personal.fullName?.trim()) {
    errors.push('Nombre completo requerido')
  }
  if (!application.personal.cedula?.trim()) {
    errors.push('Cédula requerida')
  }
  if (!application.personal.email?.trim()) {
    errors.push('Email requerido')
  }
  if (!application.personal.phoneNumber?.trim()) {
    errors.push('Número de teléfono requerido')
  }
  if (!application.personal.dateOfBirth) {
    errors.push('Fecha de nacimiento requerida')
  }

  // Loan validation
  if (!application.loan.amount || application.loan.amount < 500) {
    errors.push('Monto mínimo B/. 500')
  }
  if (!application.loan.term || application.loan.term < 6) {
    errors.push('Plazo mínimo 6 meses')
  }
  if (!application.loan.purpose) {
    errors.push('Propósito del préstamo requerido')
  }

  // Address validation
  if (!application.address.fullAddress?.trim()) {
    errors.push('Dirección completa requerida')
  }
  if (!application.address.propertyType) {
    errors.push('Tipo de domicilio requerido')
  }

  // Employment validation
  if (!application.employment.status) {
    errors.push('Situación laboral requerida')
  }
  if (!application.employment.monthlyIncome || application.employment.monthlyIncome < 450) {
    errors.push('Ingreso mensual mínimo B/. 450')
  }
  if (!application.employment.employmentLength?.trim()) {
    errors.push('Tiempo en el empleo requerido')
  }

  // Consent validation
  if (!application.consent.privacyAccepted) {
    errors.push('Debe aceptar términos y condiciones')
  }

  return errors
}

export function getClientMetadata(): SubmissionMetadata {
  if (typeof window === 'undefined') {
    return {}
  }

  // Extract UTM parameters from URL
  const urlParams = new URLSearchParams(window.location.search)
  
  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
  }
}