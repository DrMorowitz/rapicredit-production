'use client'

import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/message/VMLI5QEO3F7EN1"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-110 hover:shadow-xl md:bottom-6 md:h-16 md:w-16"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
      
      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
    </Link>
  )
}