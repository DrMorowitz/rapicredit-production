import { NextRequest, NextResponse } from 'next/server'
import { sendTestEmail, validateEmailConfiguration } from '@/lib/email/service'

export async function POST(request: NextRequest) {
  try {
    // Get email from request body
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email address required' 
        },
        { status: 400 }
      )
    }

    // Validate email configuration first
    const configValidation = validateEmailConfiguration()
    if (!configValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email configuration incomplete',
          missing: configValidation.missing
        },
        { status: 500 }
      )
    }

    // Send test email
    const result = await sendTestEmail(email)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId
    })

  } catch (error) {
    console.error('API error in test-email:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get email configuration status
export async function GET() {
  try {
    const configValidation = validateEmailConfiguration()
    
    return NextResponse.json({
      success: true,
      configuration: {
        isValid: configValidation.isValid,
        missing: configValidation.missing,
        configured: {
          resendApiKey: !!process.env.RESEND_API_KEY,
          emailFromAddress: !!process.env.EMAIL_FROM_ADDRESS && process.env.EMAIL_FROM_ADDRESS !== 'noreply@yourdomain.com',
          rapicreditStaffEmail: !!process.env.RAPICREDIT_STAFF_EMAIL,
          emailFromName: !!process.env.EMAIL_FROM_NAME
        }
      }
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check email configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}