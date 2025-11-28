'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Shield, Zap, FileCheck, Percent, Camera, Upload, Smartphone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { LogoCarousel } from '@/components/ui/logo-carousel'
import Footer from '@/components/ui/footer'
import Navigation from '@/components/ui/navigation'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        {/* Subtle Money-themed Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-rapicredit-secondary/20 to-transparent"></div>
        
        {/* Floating Dollar Signs - Enhanced Visibility */}
        <div className="absolute inset-0">
          {/* Orange Dollar Signs - More Prominent */}
          <div className="absolute top-16 left-1/4 text-orange-400/60 text-3xl animate-bounce drop-shadow-lg" style={{animationDelay: '0s', animationDuration: '3s'}}>$</div>
          <div className="absolute top-24 right-1/5 text-orange-500/55 text-2xl animate-pulse drop-shadow-md" style={{animationDelay: '2.5s', animationDuration: '3.2s'}}>$</div>
          <div className="absolute top-12 left-1/5 text-orange-400/50 text-xl animate-ping drop-shadow-sm" style={{animationDelay: '1.8s', animationDuration: '3.4s'}}>$</div>
          <div className="absolute top-32 right-1/3 text-orange-300/55 text-2xl animate-pulse drop-shadow-lg" style={{animationDelay: '1s', animationDuration: '4s'}}>$</div>
          <div className="absolute top-28 left-1/6 text-orange-400/65 text-xl animate-bounce drop-shadow-md" style={{animationDelay: '0.4s', animationDuration: '3.6s'}}>$</div>
          <div className="absolute top-40 right-1/6 text-orange-300/45 text-lg animate-ping drop-shadow-sm" style={{animationDelay: '1.4s', animationDuration: '2.8s'}}>$</div>
          <div className="absolute top-48 left-1/3 text-orange-500/58 text-2xl animate-pulse drop-shadow-lg" style={{animationDelay: '0.8s', animationDuration: '4.2s'}}>$</div>
          <div className="absolute top-56 right-1/2 text-orange-300/60 text-xl animate-bounce drop-shadow-md" style={{animationDelay: '2.2s', animationDuration: '3.7s'}}>$</div>
          <div className="absolute top-60 left-1/5 text-orange-400/52 text-2xl animate-ping drop-shadow-lg" style={{animationDelay: '0.6s', animationDuration: '3.1s'}}>$</div>
          <div className="absolute top-36 right-1/4 text-orange-300/62 text-lg animate-pulse drop-shadow-sm" style={{animationDelay: '2.8s', animationDuration: '2.9s'}}>$</div>
          
          {/* Bottom Section - Enhanced */}
          <div className="absolute bottom-40 left-1/5 text-orange-400/65 text-2xl animate-bounce drop-shadow-lg" style={{animationDelay: '2s', animationDuration: '3.5s'}}>$</div>
          <div className="absolute bottom-48 right-1/4 text-orange-500/50 text-2xl animate-ping drop-shadow-md" style={{animationDelay: '1.2s', animationDuration: '3.6s'}}>$</div>
          <div className="absolute bottom-28 left-1/3 text-orange-400/55 text-2xl animate-pulse drop-shadow-lg" style={{animationDelay: '1.5s', animationDuration: '3.8s'}}>$</div>
          <div className="absolute bottom-36 right-1/6 text-orange-400/52 text-xl animate-bounce drop-shadow-sm" style={{animationDelay: '0.3s', animationDuration: '4.5s'}}>$</div>
          <div className="absolute bottom-44 left-1/6 text-orange-300/55 text-lg animate-pulse drop-shadow-md" style={{animationDelay: '0.7s', animationDuration: '4.1s'}}>$</div>
          <div className="absolute bottom-20 left-1/2 text-orange-500/60 text-xl animate-bounce drop-shadow-lg" style={{animationDelay: '1.1s', animationDuration: '3.9s'}}>$</div>
          <div className="absolute bottom-52 right-1/5 text-orange-300/58 text-2xl animate-ping drop-shadow-md" style={{animationDelay: '2.4s', animationDuration: '3.3s'}}>$</div>
          <div className="absolute bottom-32 left-1/4 text-orange-400/54 text-2xl animate-pulse drop-shadow-lg" style={{animationDelay: '1.7s', animationDuration: '2.7s'}}>$</div>
          <div className="absolute bottom-24 right-1/3 text-orange-300/56 text-xl animate-bounce drop-shadow-sm" style={{animationDelay: '0.9s', animationDuration: '4.3s'}}>$</div>
          <div className="absolute bottom-16 left-1/6 text-orange-400/48 text-lg animate-ping drop-shadow-md" style={{animationDelay: '2.6s', animationDuration: '3.4s'}}>$</div>
          
          {/* Additional Right Side Dollar Signs */}
          <div className="absolute top-20 right-1/8 text-orange-400/58 text-2xl animate-pulse drop-shadow-lg" style={{animationDelay: '0.2s', animationDuration: '3.5s'}}>$</div>
          <div className="absolute top-44 right-1/12 text-orange-300/54 text-xl animate-bounce drop-shadow-md" style={{animationDelay: '1.6s', animationDuration: '2.9s'}}>$</div>
          <div className="absolute top-52 right-2/3 text-orange-500/60 text-2xl animate-ping drop-shadow-lg" style={{animationDelay: '2.3s', animationDuration: '4.1s'}}>$</div>
          <div className="absolute top-64 right-1/7 text-orange-300/52 text-lg animate-pulse drop-shadow-sm" style={{animationDelay: '0.5s', animationDuration: '3.8s'}}>$</div>
          <div className="absolute bottom-60 right-1/8 text-orange-400/56 text-2xl animate-bounce drop-shadow-lg" style={{animationDelay: '1.3s', animationDuration: '3.2s'}}>$</div>
          <div className="absolute bottom-56 right-1/12 text-orange-300/62 text-xl animate-ping drop-shadow-md" style={{animationDelay: '2.7s', animationDuration: '3.6s'}}>$</div>
          <div className="absolute bottom-40 right-2/3 text-orange-500/50 text-2xl animate-pulse drop-shadow-lg" style={{animationDelay: '0.1s', animationDuration: '4.4s'}}>$</div>
          <div className="absolute bottom-12 right-1/7 text-orange-300/58 text-xl animate-bounce drop-shadow-md" style={{animationDelay: '1.9s', animationDuration: '2.6s'}}>$</div>
          
          {/* Enhanced White Sparkles */}
          <div className="absolute top-40 right-1/4 w-2 h-2 bg-white/70 rounded-full animate-pulse drop-shadow-sm"></div>
          <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-white/60 rounded-full animate-ping drop-shadow-sm"></div>
          <div className="absolute bottom-32 right-1/5 w-2 h-2 bg-white/80 rounded-full animate-bounce drop-shadow-md"></div>
          <div className="absolute top-20 left-1/6 w-1.5 h-1.5 bg-white/65 rounded-full animate-pulse drop-shadow-sm"></div>
          <div className="absolute top-52 right-1/6 w-2 h-2 bg-white/55 rounded-full animate-ping drop-shadow-md"></div>
          <div className="absolute bottom-24 left-1/4 w-1.5 h-1.5 bg-white/75 rounded-full animate-bounce drop-shadow-sm"></div>
          
          {/* Enhanced Blue Sparkles */}
          <div className="absolute top-28 right-1/5 w-1.5 h-1.5 bg-blue-300/80 rounded-full animate-pulse drop-shadow-sm"></div>
          <div className="absolute bottom-28 left-1/4 w-2 h-2 bg-blue-400/70 rounded-full animate-ping drop-shadow-md"></div>
          <div className="absolute top-48 left-1/5 w-1.5 h-1.5 bg-blue-300/70 rounded-full animate-bounce drop-shadow-sm"></div>
          <div className="absolute bottom-48 right-1/3 w-2 h-2 bg-blue-400/65 rounded-full animate-pulse drop-shadow-md"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Main Title - Black font weight */}
              <h1 className="hero-title text-4xl md:text-6xl text-white leading-tight" 
                  style={{ fontFamily: 'var(--font-opaque)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                <span style={{ fontWeight: 900 }}>Préstamos</span>{' '}
                <span style={{ fontWeight: 700 }}>rápidos</span>{' '}
                <span style={{ fontWeight: 800 }}>y seguros</span><br/>
                <span style={{ fontWeight: 600, fontStyle: 'italic' }}>en Panamá</span>
              </h1>
              
              {/* Subtitle - Medium weight */}
              <p className="hero-subtitle text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
                 style={{ fontFamily: 'var(--font-opaque)', fontWeight: 500 }}>
                Solicita tu préstamo 100% en línea y aprovecha las mejores tasas del mercado.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
                {/* Primary Button - Bold weight */}
                <Link 
                  href="/solicitud"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 text-lg text-orange-600 bg-white rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-2xl hover:shadow-orange-200/50 transform hover:scale-105 border-2 border-orange-400/30"
                  style={{ fontFamily: 'var(--font-opaque)', fontWeight: 700 }}
                >
                  Solicita tu préstamo ahora
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
                
                {/* Secondary Button - SemiBold weight */}
                <Link 
                  href="https://wa.me/message/VMLI5QEO3F7EN1"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 text-lg text-white bg-white/20 border-2 border-white/40 rounded-2xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm shadow-xl hover:shadow-orange-400/10 transform hover:scale-105"
                  style={{ fontFamily: 'var(--font-opaque)', fontWeight: 600 }}
                >
                  <Smartphone className="w-5 h-5 mr-3" />
                  Habla con un asesor
                </Link>
              </div>
              
              {/* Feature badges - Light and Regular weights */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-10 text-white/80 text-sm">
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-orange-400/20"
                     style={{ fontFamily: 'var(--font-opaque)', fontWeight: 400 }}>
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-400" />
                  Proceso Transparente
                </div>
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
                     style={{ fontFamily: 'var(--font-opaque)', fontWeight: 300 }}>
                  <CheckCircle className="w-4 h-4 mr-2 text-white" />
                  Certificaciones Internacionales
                </div>
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-orange-400/20"
                     style={{ fontFamily: 'var(--font-opaque)', fontWeight: 500 }}>
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-400" />
                  Cotiza 100% en línea
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logo Carousel - Trust & Security Badges */}
      <LogoCarousel />

      {/* Process Steps Section */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Background Image - Woman with Cash */}
        <div className="absolute inset-0 hidden md:block">
          <img
            src="https://res.cloudinary.com/dp3gvxyft/image/upload/v1762833687/cholitax_momney_Bling_tqpodw.png"
            alt="Woman with cash background"
            className="absolute bottom-0 left-0 h-full w-auto object-cover opacity-70"
            style={{ 
              height: '95%',
              bottom: '0',
              left: '0',
              objectFit: 'cover',
              objectPosition: 'bottom left'
            }}
          />
        </div>
        
        {/* Mobile Background Image - Centered */}
        <div className="absolute inset-0 md:hidden">
          <img
            src="https://res.cloudinary.com/dp3gvxyft/image/upload/v1762833687/cholitax_momney_Bling_tqpodw.png"
            alt="Woman with cash background"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full w-auto object-cover opacity-35"
            style={{ 
              height: '95%',
              bottom: '0',
              objectFit: 'cover',
              objectPosition: 'bottom center'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-wide">Proceso simple</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Obtén tu préstamo en 3 pasos
            </h2>
            <p className="text-lg text-gray-600">
              Rápido, fácil y sin complicaciones
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Toma foto de tu cédula
              </h3>
              <p className="text-gray-600">
                Usa la cámara de tu celular para tomar foto de tu cédula. Seguro y encriptado.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Completa tu información
              </h3>
              <p className="text-gray-600">
                Llena el formulario inteligente en menos de 5 minutos. Sin papeles complicados.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¡Recibe tu dinero!
              </h3>
              <p className="text-gray-600">
                Una vez aprobado te transferimos el dinero a tu cuenta bancaria!
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/solicitud"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Comenzar ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Orange Dollar Signs from Hero */}
          <div className="absolute top-16 left-[10%] text-orange-400/60 text-2xl animate-bounce drop-shadow-lg" style={{animationDelay: '0s', animationDuration: '3s'}}>$</div>
          <div className="absolute top-32 right-[15%] text-orange-500/55 text-xl animate-pulse drop-shadow-md" style={{animationDelay: '1s', animationDuration: '3.2s'}}>$</div>
          <div className="absolute top-48 left-[20%] text-orange-400/50 text-lg animate-ping drop-shadow-sm" style={{animationDelay: '2s', animationDuration: '3.4s'}}>$</div>
          <div className="absolute top-20 right-[25%] text-orange-300/55 text-2xl animate-pulse drop-shadow-lg" style={{animationDelay: '0.5s', animationDuration: '4s'}}>$</div>
          <div className="absolute bottom-20 left-[12%] text-orange-400/65 text-xl animate-bounce drop-shadow-md" style={{animationDelay: '1.5s', animationDuration: '3.6s'}}>$</div>
          <div className="absolute bottom-40 right-[18%] text-orange-300/45 text-lg animate-ping drop-shadow-sm" style={{animationDelay: '2.5s', animationDuration: '2.8s'}}>$</div>
          
          {/* Subtle Geometric Shapes */}
          <div className="absolute top-36 right-[8%] w-2 h-2 bg-rapicredit-primary/8 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-24 left-[8%] w-3 h-3 bg-rapicredit-primary/8 rounded-full animate-pulse" style={{animationDelay: '0.7s', animationDuration: '3.5s'}}></div>
          <div className="absolute top-28 left-[50%] w-1 h-1 bg-rapicredit-primary/8 rounded-full animate-ping" style={{animationDelay: '1.5s', animationDuration: '5s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir RapiCredit?
            </h2>
            <p className="text-lg text-gray-600">
              Hacemos que obtener un préstamo sea fácil y rápido
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Préstamos Personales */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-orange-100 hover:border-orange-300"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Préstamos Personales
              </h3>
              <p className="text-gray-600 text-sm">
                Dinero rápido para tus necesidades personales. Sin garantías ni avales requeridos.
              </p>
            </motion.div>

            {/* Autos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-orange-100 hover:border-orange-300"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Autos
              </h3>
              <p className="text-gray-600 text-sm">
                Saca tu nuevo carro con las mejores tasas del mercado. Financiamiento flexible.
              </p>
            </motion.div>

            {/* Inmuebles */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-orange-100 hover:border-orange-300"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Inmuebles
              </h3>
              <p className="text-gray-600 text-sm">
                Compra tu casa o remodela tu hogar. Financiamiento especializado en bienes raíces.
              </p>
            </motion.div>

            {/* Tasas Competitivas - Keep this one */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-orange-100 hover:border-orange-300"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors duration-300">
                <Percent className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tasas competitivas
              </h3>
              <p className="text-gray-600 text-sm">
                Las mejores tasas del mercado panameño para préstamos personales.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Knowledge Hub Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-wide">
              Aprende más sobre RapiCredit
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Respuestas claras, equipo cercano y soporte en cada paso
            </h2>
            <p className="text-lg text-gray-600">
              Explora nuestras secciones para conocer cómo trabajamos, los productos disponibles y la mejor
              forma de contactarnos cuando lo necesites.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/nosotros"
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Sobre nosotros</h3>
                <span className="text-orange-500">&rarr;</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Conoce nuestra historia, misión y el equipo que respalda cada solicitud.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-500 group-hover:underline">
                Ver historia
              </p>
            </Link>

            <Link
              href="/servicios"
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Servicios financieros</h3>
                <span className="text-orange-500">&rarr;</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Descubre préstamos personales, capital de trabajo y consolidación de deudas.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-500 group-hover:underline">
                Explorar soluciones
              </p>
            </Link>

            <Link
              href="/faq"
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Preguntas frecuentes</h3>
                <span className="text-orange-500">&rarr;</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Aclara tiempos de respuesta, requisitos y procesos de seguridad.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-500 group-hover:underline">
                Resolver dudas
              </p>
            </Link>

            <Link
              href="/contacto"
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Contáctanos</h3>
                <span className="text-orange-500">&rarr;</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Encuentra horarios de atención, números directos y canales digitales.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-500 group-hover:underline">
                Hablar con un asesor
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para obtener tu préstamo?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Completa tu solicitud en menos de 5 minutos y recibe una respuesta inmediata
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/solicitud"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Solicitar préstamo ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link 
                href="https://wa.me/message/VMLI5QEO3F7EN1"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Hablar con asesor
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/80 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Proceso 100% en línea
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Respuesta en minutos
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Sin sorpresas
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}