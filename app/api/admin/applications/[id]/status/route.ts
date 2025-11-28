import { NextRequest, NextResponse } from 'next/server'
import { updateLoanApplicationStatus, validateAdminPassword } from '@/lib/supabase/queries'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params

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

    // Get request body
    const { status, notes } = await request.json()

    // Validate status
    const validStatuses = ['new', 'opened', 'sent']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be one of: new, opened, sent'
        },
        { status: 400 }
      )
    }

    // Update application status
    const result = await updateLoanApplicationStatus(
      applicationId,
      status,
      'admin', // changed_by
      notes || `Status updated to ${status}`
    )

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update application status'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Application status updated to ${status}`,
      applicationId,
      status
    })

  } catch (error) {
    console.error('API error in update status:', error)
    
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

// Get status history for an application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params

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

    // Get status history (we'll implement this function)
    // const history = await getApplicationStatusHistory(applicationId)

    return NextResponse.json({
      success: true,
      applicationId,
      history: [] // Placeholder for now
    })

  } catch (error) {
    console.error('API error in get status history:', error)
    
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