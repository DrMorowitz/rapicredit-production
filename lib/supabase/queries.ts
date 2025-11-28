import { createAdminClient, supabase } from './client'
import { Database } from './database.types'
import { LoanApplication } from '../solicitud/data'

type LoanApplicationRow = Database['public']['Tables']['loan_applications']['Row']
type LoanApplicationInsert = Database['public']['Tables']['loan_applications']['Insert']

// Transform our form data to database format
export function transformFormToDatabase(
  application: LoanApplication,
  sessionId: string,
  metadata?: {
    userAgent?: string
    ipAddress?: string
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
): LoanApplicationInsert {
  return {
    session_id: sessionId,
    status: 'new', // Default status for new applications
    // Personal Information
    full_name: application.personal.fullName,
    cedula: application.personal.cedula,
    email: application.personal.email,
    phone_country_code: application.personal.phoneCountryCode === '+OTHER' 
      ? (application.personal.customCountryCode || '+OTHER')
      : application.personal.phoneCountryCode,
    custom_country_code: application.personal.customCountryCode || null,
    phone_number: application.personal.phoneNumber,
    date_of_birth: application.personal.dateOfBirth,
    marital_status: application.personal.maritalStatus,
    dependents: application.personal.dependents,
    // Loan Details
    loan_amount: application.loan.amount,
    loan_term: application.loan.term,
    loan_purpose: application.loan.purpose,
    loan_comments: application.loan.comments || null,
    // Address Information
    full_address: application.address.fullAddress,
    property_type: application.address.propertyType,
    // Employment Information
    employment_status: application.employment.status,
    company_name: application.employment.companyName === 'Otro' 
      ? (application.employment.customCompanyName || application.employment.companyName)
      : application.employment.companyName,
    custom_company_name: application.employment.customCompanyName || null,
    job_role: application.employment.role || null,
    monthly_income: application.employment.monthlyIncome,
    extra_income: application.employment.extraIncome,
    employment_length: application.employment.employmentLength,
    // Documents
    id_front_image: application.documents.idFront || null,
    id_back_image: application.documents.idBack || null,
    work_letter_image: application.documents.workLetter || null,
    // Consent
    privacy_accepted: application.consent.privacyAccepted,
    marketing_accepted: application.consent.marketingAccepted,
    // Metadata
    user_agent: metadata?.userAgent || null,
    ip_address: metadata?.ipAddress || null,
    referrer: metadata?.referrer || null,
    utm_source: metadata?.utmSource || null,
    utm_medium: metadata?.utmMedium || null,
    utm_campaign: metadata?.utmCampaign || null,
  }
}

// Transform database row back to form format
export function transformDatabaseToForm(row: LoanApplicationRow): LoanApplication & { id: string; createdAt: string; status: string } {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status || 'new', // Include application status
    personal: {
      fullName: row.full_name,
      cedula: row.cedula,
      email: row.email,
      phoneCountryCode: row.phone_country_code,
      customCountryCode: row.custom_country_code || undefined,
      phoneNumber: row.phone_number,
      dateOfBirth: row.date_of_birth,
      maritalStatus: row.marital_status as LoanApplication['personal']['maritalStatus'],
      dependents: row.dependents,
    },
    loan: {
      amount: Number(row.loan_amount),
      term: row.loan_term,
      purpose: row.loan_purpose as LoanApplication['loan']['purpose'],
      comments: row.loan_comments || '',
    },
    address: {
      fullAddress: row.full_address,
      propertyType: row.property_type as LoanApplication['address']['propertyType'],
    },
    employment: {
      status: row.employment_status as LoanApplication['employment']['status'],
      companyName: row.company_name || '',
      customCompanyName: row.custom_company_name || undefined,
      role: row.job_role || '',
      monthlyIncome: Number(row.monthly_income),
      extraIncome: Number(row.extra_income),
      employmentLength: row.employment_length,
    },
    documents: {
      idFront: row.id_front_image || undefined,
      idBack: row.id_back_image || undefined,
      workLetter: row.work_letter_image || undefined,
    },
    consent: {
      privacyAccepted: row.privacy_accepted,
      marketingAccepted: row.marketing_accepted,
    },
  }
}

// Submit a new loan application
export async function submitLoanApplication(
  application: LoanApplication,
  sessionId: string,
  metadata?: {
    userAgent?: string
    ipAddress?: string
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
) {
  const adminClient = createAdminClient()
  
  const applicationData = transformFormToDatabase(application, sessionId, metadata)
  
  const { data, error } = await adminClient
    .from('loan_applications')
    .insert(applicationData as any)
    .select()
    .single()

  if (error) {
    console.error('Error submitting loan application:', error)
    throw new Error(`Failed to submit application: ${error.message}`)
  }

  return data
}

// Get all loan applications (for admin dashboard)
export async function getAllLoanApplications() {
  const adminClient = createAdminClient()
  
  const { data, error } = await adminClient
    .from('loan_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching loan applications:', error)
    throw new Error(`Failed to fetch applications: ${error.message}`)
  }

  return data.map(transformDatabaseToForm)
}

// Get a single loan application by ID
export async function getLoanApplicationById(id: string) {
  const adminClient = createAdminClient()
  
  const { data, error } = await adminClient
    .from('loan_applications')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching loan application:', error)
    throw new Error(`Failed to fetch application: ${error.message}`)
  }

  return transformDatabaseToForm(data)
}

// Update loan application status
export async function updateLoanApplicationStatus(
  id: string, 
  status: string, 
  changedBy?: string, 
  notes?: string
) {
  const adminClient = createAdminClient()
  
  // Update the application status
  const { error: updateError } = await adminClient
    .from('loan_applications')
    .update({ status, updated_at: new Date().toISOString() } as any)
    .eq('id', id)

  if (updateError) {
    console.error('Error updating application status:', updateError)
    throw new Error(`Failed to update status: ${updateError.message}`)
  }

  // Add status history record
  const { error: historyError } = await adminClient
    .from('application_status_history')
    .insert({
      application_id: id,
      status,
      changed_by: changedBy || null,
      notes: notes || null,
    })

  if (historyError) {
    console.error('Error adding status history:', historyError)
    // Don't throw error for history - it's not critical
  }

  return true
}

// Get application status history
export async function getApplicationStatusHistory(applicationId: string) {
  const adminClient = createAdminClient()
  
  const { data, error } = await adminClient
    .from('application_status_history')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching status history:', error)
    throw new Error(`Failed to fetch status history: ${error.message}`)
  }

  return data
}

// Log email notification
export async function logEmailNotification(
  applicationId: string,
  emailType: 'admin_notification' | 'user_confirmation',
  recipientEmail: string,
  subject: string,
  status: 'pending' | 'sent' | 'failed' = 'pending',
  resendMessageId?: string,
  errorMessage?: string
) {
  const adminClient = createAdminClient()
  
  const { data, error } = await adminClient
    .from('email_notifications')
    .insert({
      application_id: applicationId,
      email_type: emailType,
      recipient_email: recipientEmail,
      subject,
      status,
      resend_message_id: resendMessageId || null,
      error_message: errorMessage || null,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error logging email notification:', error)
    // Don't throw error for email logging - it's not critical
  }

  return data
}

// Update email notification status
export async function updateEmailNotificationStatus(
  id: string,
  status: 'sent' | 'failed',
  resendMessageId?: string,
  errorMessage?: string
) {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient
    .from('email_notifications')
    .update({
      status,
      resend_message_id: resendMessageId || null,
      error_message: errorMessage || null,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating email notification status:', error)
  }
}

// Validate admin password (using the database function we created)
export async function validateAdminPassword(password: string): Promise<boolean> {
  const adminClient = createAdminClient()
  
  const { data, error } = await adminClient
    .rpc('validate_admin_password', { password_input: password })

  if (error) {
    console.error('Error validating admin password:', error)
    return false
  }

  return data === true
}