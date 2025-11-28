'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-50 to-white backdrop-blur-sm border-b border-gray-100 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
          {/* Logo - Same as landing page */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            <img
              src="/azul_rapicredit2.svg"
              alt="RapiCredit Logo"
              className="h-50 w-auto object-contain"
              style={{ 
                height: '200px',
                transform: 'translateY(3%)' 
              }}
            />
          </Link>
          
          {/* Desktop Navigation - Interactive hover effects */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="/nosotros" className="relative text-lg font-medium text-gray-700 hover:text-rapicredit-primary transition-all duration-300 group">
              <span className="relative z-10">Nosotros</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-rapicredit-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/servicios" className="relative text-lg font-medium text-gray-700 hover:text-rapicredit-primary transition-all duration-300 group">
              <span className="relative z-10">Servicios</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-rapicredit-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/faq" className="relative text-lg font-medium text-gray-700 hover:text-rapicredit-primary transition-all duration-300 group">
              <span className="relative z-10">FAQ</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-rapicredit-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/contacto" className="relative text-lg font-medium text-gray-700 hover:text-rapicredit-primary transition-all duration-300 group">
              <span className="relative z-10">Contacto</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-rapicredit-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/solicitud" 
              className="bg-gradient-primary text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Solicitar Préstamo
            </Link>
          </div>
          
          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full shadow-xl animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="p-6 space-y-4">
              <Link
                href="/nosotros"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base font-medium text-gray-700">Nosotros</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              
              <Link
                href="/servicios"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base font-medium text-gray-700">Servicios</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              
              <Link
                href="/faq"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base font-medium text-gray-700">FAQ</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              
              <Link
                href="/contacto"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base font-medium text-gray-700">Contacto</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
            
            {/* Mobile CTA Button at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
              <Link
                href="/solicitud"
                className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white font-semibold px-6 py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solicitar Préstamo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}