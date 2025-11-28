import { Resend } from 'resend'
import { LoanApplication } from '../solicitud/data'
import { createAdminNotificationEmail, createUserConfirmationEmail } from './templates'
import { logEmailNotification, updateEmailNotificationStatus } from '../supabase/queries'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Configuration
const RAPICREDIT_STAFF_EMAIL = process.env.RAPICREDIT_STAFF_EMAIL || 'Ventas3@financierarapicredit.com'
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'noreply@yourdomain.com'
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'RapiCredit Notifications'

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
  emailLogId?: string
}

// Send admin notification email when new application is submitted
export async function sendAdminNotificationEmail(
  application: LoanApplication,
  applicationId: string
): Promise<SendEmailResult> {
  try {
    // Create email content
    const emailTemplate = createAdminNotificationEmail(application, applicationId)

    // Log email attempt in database
    const emailLog = await logEmailNotification(
      applicationId,
      'admin_notification',
      RAPICREDIT_STAFF_EMAIL,
      emailTemplate.subject,
      'pending'
    )

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`,
      to: [RAPICREDIT_STAFF_EMAIL],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      headers: {
        'X-Application-ID': applicationId,
        'X-Email-Type': 'admin_notification'
      }
    })

    if (error) {
      console.error('Failed to send admin notification email:', error)
      
      // Update email log with error
      if (emailLog && (emailLog as any).id) {
        await updateEmailNotificationStatus(
          (emailLog as any).id, 
          'failed', 
          undefined, 
          error.message || 'Failed to send email'
        )
      }

      return {
        success: false,
        error: error.message || 'Failed to send admin notification email',
        emailLogId: emailLog ? (emailLog as any).id : undefined
      }
    }

    console.log('Admin notification email sent successfully:', data?.id)

    // Update email log with success
    if (emailLog && (emailLog as any).id && data?.id) {
      await updateEmailNotificationStatus(
        (emailLog as any).id,
        'sent',
        data.id
      )
    }

    return {
      success: true,
      messageId: data?.id,
      emailLogId: emailLog ? (emailLog as any).id : undefined
    }

  } catch (error) {
    console.error('Error in sendAdminNotificationEmail:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending admin notification'
    }
  }
}

// Send user confirmation email after successful submission
export async function sendUserConfirmationEmail(
  application: LoanApplication,
  applicationId: string
): Promise<SendEmailResult> {
  try {
    const userEmail = application.personal.email

    if (!userEmail) {
      return {
        success: false,
        error: 'User email not provided'
      }
    }

    // Create email content
    const emailTemplate = createUserConfirmationEmail(application, applicationId)

    // Log email attempt in database
    const emailLog = await logEmailNotification(
      applicationId,
      'user_confirmation',
      userEmail,
      emailTemplate.subject,
      'pending'
    )

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`,
      to: [userEmail],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      headers: {
        'X-Application-ID': applicationId,
        'X-Email-Type': 'user_confirmation'
      }
    })

    if (error) {
      console.error('Failed to send user confirmation email:', error)
      
      // Update email log with error
      if (emailLog && (emailLog as any).id) {
        await updateEmailNotificationStatus(
          (emailLog as any).id, 
          'failed', 
          undefined, 
          error.message || 'Failed to send email'
        )
      }

      return {
        success: false,
        error: error.message || 'Failed to send user confirmation email',
        emailLogId: emailLog ? (emailLog as any).id : undefined
      }
    }

    console.log('User confirmation email sent successfully:', data?.id)

    // Update email log with success
    if (emailLog && (emailLog as any).id && data?.id) {
      await updateEmailNotificationStatus(
        (emailLog as any).id,
        'sent',
        data.id
      )
    }

    return {
      success: true,
      messageId: data?.id,
      emailLogId: emailLog ? (emailLog as any).id : undefined
    }

  } catch (error) {
    console.error('Error in sendUserConfirmationEmail:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending user confirmation'
    }
  }
}

// Send both admin and user emails (convenience function)
export async function sendApplicationEmails(
  application: LoanApplication,
  applicationId: string
): Promise<{
  adminResult: SendEmailResult
  userResult: SendEmailResult
}> {
  // Send emails in parallel
  const [adminResult, userResult] = await Promise.all([
    sendAdminNotificationEmail(application, applicationId),
    sendUserConfirmationEmail(application, applicationId)
  ])

  return {
    adminResult,
    userResult
  }
}

// Utility function to validate email configuration
export function validateEmailConfiguration(): {
  isValid: boolean
  missing: string[]
} {
  const missing: string[] = []

  if (!process.env.RESEND_API_KEY) {
    missing.push('RESEND_API_KEY')
  }

  if (!process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_FROM_ADDRESS === 'noreply@yourdomain.com') {
    missing.push('EMAIL_FROM_ADDRESS (must be a verified domain in Resend)')
  }

  if (!process.env.RAPICREDIT_STAFF_EMAIL) {
    missing.push('RAPICREDIT_STAFF_EMAIL')
  }

  return {
    isValid: missing.length === 0,
    missing
  }
}

// Test email function for development
export async function sendTestEmail(toEmail: string): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`,
      to: [toEmail],
      subject: 'Test Email - RapiCredit System',
      html: `
        <h2>✅ Email Configuration Test</h2>
        <p>This is a test email from the RapiCredit system.</p>
        <p>If you receive this, your email configuration is working correctly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
      text: `
Test Email - RapiCredit System

This is a test email from the RapiCredit system.
If you receive this, your email configuration is working correctly!

Timestamp: ${new Date().toISOString()}
      `
    })

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to send test email'
      }
    }

    return {
      success: true,
      messageId: data?.id
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending test email'
    }
  }
}