import { NextRequest, NextResponse } from 'next/server'
import { getAllLoanApplications, validateAdminPassword } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  try {
    // Get admin password from header
    const adminPassword = request.headers.get('x-admin-password')
    
    if (!adminPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin password required' 
        },
        { status: 401 }
      )
    }

    // Validate admin password
    const isValidPassword = await validateAdminPassword(adminPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid admin password' 
        },
        { status: 403 }
      )
    }

    // Fetch applications from database
    const applications = await getAllLoanApplications()

    return NextResponse.json({
      success: true,
      applications: applications,
      count: applications.length
    })

  } catch (error) {
    console.error('API error in admin/applications:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch applications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function HEAD() {
  return new Response('OK', { status: 200 })
}