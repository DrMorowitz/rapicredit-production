import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'

export const metadata: Metadata = {
  title: 'Servicios financieros | RapiCredit Panamá',
  description:
    'Explora los productos financieros de RapiCredit: préstamos personales, consolidación de deudas, soluciones para emprendedores y asesoría crediticia.',
}

type Service = {
  title: string
  summary: string
  features: string[]
  audience: string
}

const services: Service[] = [
  {
    title: 'Préstamos personales express',
    summary: 'Liquidez inmediata para imprevistos, estudios o proyectos. Aprobación rápida y desembolso en 24h.',
    features: [],
    audience: 'Colaboradores asalariados, jubilados y profesionales independientes.',
  },
  {
    title: 'Préstamo para tu nuevo auto',
    summary: 'Financia tu auto con tasas preferenciales y proceso simplificado. Plazos flexibles y pre-aprobación rápida.',
    features: [],
    audience: 'Personas con ingresos estables que buscan renovar o adquirir su vehículo.',
  },
  {
    title: 'Consolidación de deudas',
    summary: 'Unifica tus pagos en una sola cuota con mejor tasa. Asesoría personalizada sin comisiones ocultas.',
    features: [],
    audience: 'Clientes con múltiples tarjetas o préstamos.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-white via-rapicredit-primary/5 to-white pb-24">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Soluciones financieras flexibles
            </p>
            <h1 className="mt-4 text-3xl font-bold text-rapicredit-secondary md:text-4xl">
              Elige el producto RapiCredit ideal para tus metas
            </h1>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              Diseñamos productos para cada etapa de tu vida financiera. Todos los préstamos incluyen
              asesoría experta, autoservicio digital y un acompañamiento cercano durante todo el ciclo.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <Link
                href="/solicitud"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Iniciar solicitud
              </Link>
              <a
                href="https://wa.me/message/VMLI5QEO3F7EN1"
                className="inline-flex items-center rounded-xl border border-orange-500 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Evaluación personalizada
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-14">
        <div className="grid gap-8 lg:grid-cols-3">
          {services.map(service => (
            <article
              key={service.title}
              className="relative flex h-full flex-col rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-lg shadow-orange-100 backdrop-blur transition hover:-translate-y-1 hover:shadow-orange-200 hover:border-orange-200"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-rapicredit-secondary">{service.title}</h2>
                <p className="text-sm text-gray-600">{service.summary}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-orange-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-gray-600">
                <p className="font-semibold text-orange-700">Ideal para:</p>
                <p className="mt-1">{service.audience}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-rapicredit-primary/5">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-rapicredit-secondary">Características comunes</h2>
              <p className="text-sm text-gray-600">
                Todos los productos comparten un estándar de servicio RapiCredit: información clara, trámites
                digitales y la posibilidad de adelantar pagos sin penalizaciones.
              </p>
              <ul className="grid gap-3 text-sm text-gray-600">
                <li className="rounded-2xl bg-orange-50 px-4 py-3">
                  Dashboard en línea para consultar cronograma, saldo y recibos.
                </li>
                <li className="rounded-2xl bg-orange-50 px-4 py-3">
                  Recordatorios automáticos por correo y WhatsApp.
                </li>
                <li className="rounded-2xl bg-orange-50 px-4 py-3">
                  Integración con ACH, Yappy y pagos en efectivo aliados.
                </li>
              </ul>
            </div>
            <div className="space-y-4 rounded-3xl border border-orange-200 bg-white/90 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-orange-700">
                Requisitos esenciales
              </h3>
              <dl className="space-y-3 text-sm text-gray-600">
                <div>
                  <dt className="font-medium text-orange-600">Documentación</dt>
                  <dd>Cédula vigente, comprobante de ingresos o estados bancarios recientes.</dd>
                </div>
                <div>
                  <dt className="font-medium text-orange-600">Historial</dt>
                  <dd>Evaluación crediticia con burós locales y análisis propio de comportamiento.</dd>
                </div>
                <div>
                  <dt className="font-medium text-orange-600">Plataformas</dt>
                  <dd>Firma electrónica y carga de documentos disponibles 24/7.</dd>
                </div>
              </dl>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center rounded-xl border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Revisa preguntas frecuentes
              </Link>
            </div>
          </div>
        </section>

        {/* Image with CTA Section */}
        <section className="mt-16 bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Call to Action */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                  ✨ Proceso 100% Digital
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-rapicredit-secondary leading-tight">
                  ¿Listo para comenzar?
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Solicita tu préstamo <span className="font-semibold text-orange-600">AHORA</span>. 
                  Proceso completamente digital con la mejor experiencia.
                </p>
              </div>
              
              <div className="space-y-6">
                <Link
                  href="/solicitud"
                  className="group inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                >
                  ¡Solicita tu préstamo ya!
                  <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Respuesta</p>
                        <p className="text-sm text-gray-600">En minutos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Sin papeleos</p>
                        <p className="text-sm text-gray-600">Todo digital</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://res.cloudinary.com/dp3gvxyft/image/upload/v1764117264/corporate_girlie_italcv.png"
                  alt="Professional woman"
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer />
    </>
  )
}

