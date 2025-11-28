import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple in-memory session store for development
const activeSessions = new Set<string>()

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      )
    }

    if (password === adminPassword) {
      // Generate session ID and store it
      const sessionId = generateSessionId()
      activeSessions.add(sessionId)
      
      // Clean old sessions (simple cleanup)
      if (activeSessions.size > 10) {
        activeSessions.clear()
        activeSessions.add(sessionId)
      }
      
      const response = NextResponse.json({ success: true, sessionId })
      
      // Set cookie with session ID
      response.cookies.set('admin-session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('admin-session')
    
    if (session?.value && activeSessions.has(session.value)) {
      return NextResponse.json({ authenticated: true })
    } else {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}