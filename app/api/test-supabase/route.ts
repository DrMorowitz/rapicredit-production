import { NextResponse } from 'next/server'
import { getAllLoanApplications } from '@/lib/supabase/queries'
import { createAdminClient } from '@/lib/supabase/client'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Basic client connection
    const adminClient = createAdminClient()
    console.log('Admin client created successfully')

    // Test 2: Simple query
    const { data: testData, error: testError } = await adminClient
      .from('loan_applications')
      .select('id, created_at, full_name')
      .limit(5)

    if (testError) {
      console.error('Direct query error:', testError)
      return NextResponse.json({
        success: false,
        error: 'Direct query failed',
        details: testError.message,
        code: testError.code
      }, { status: 500 })
    }

    console.log('Direct query success. Found records:', testData?.length || 0)

    // Test 3: Using our utility function
    try {
      const applications = await getAllLoanApplications()
      console.log('Utility function success. Found records:', applications.length)
      
      return NextResponse.json({
        success: true,
        directQueryCount: testData?.length || 0,
        utilityFunctionCount: applications.length,
        sampleData: testData?.slice(0, 2) || [],
        message: 'Supabase connection working correctly'
      })
      
    } catch (utilityError) {
      console.error('Utility function error:', utilityError)
      return NextResponse.json({
        success: false,
        error: 'Utility function failed',
        details: utilityError instanceof Error ? utilityError.message : 'Unknown error',
        directQueryWorked: true,
        directQueryCount: testData?.length || 0
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}