import { NextRequest, NextResponse } from 'next/server'
import { LoanApplication, SessionMetadata } from '@/lib/solicitud/data'
import { submitApplication, getClientMetadata } from '@/lib/services/submission'
import { sendAdminNotificationEmail } from '@/lib/email/service'

// Rate limiting - simple in-memory store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  const record = rateLimitMap.get(key)
  
  if (!record || record.resetTime < windowStart) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  record.count++
  return true
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.' 
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { application, session } = body as {
      application: LoanApplication
      session: SessionMetadata
    }

    // Validate required data
    if (!application || !session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required data' 
        },
        { status: 400 }
      )
    }

    // Get client metadata
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent')
    const referer = request.headers.get('referer')

    const metadata = {
      userAgent: userAgent || undefined,
      ipAddress: clientIP,
      referrer: referer || undefined,
    }

    // Submit application to database
    const result = await submitApplication(application, session, metadata)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    // Send admin notification email only
    if (result.applicationId) {
      try {
        const emailResult = await sendAdminNotificationEmail(
          application, 
          result.applicationId
        )
        
        if (emailResult.success) {
          console.log('Admin notification email sent successfully:', emailResult.messageId)
        } else {
          console.error('Admin notification email failed:', emailResult.error)
        }
        
      } catch (emailError) {
        // Don't fail the whole request if email fails
        console.error('Email notification failed:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      applicationId: result.applicationId,
      message: 'Application submitted successfully'
    })

  } catch (error) {
    console.error('API error in submit-application:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString() 
  })
}