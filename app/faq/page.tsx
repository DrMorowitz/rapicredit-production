'use client'

import { useState } from 'react'
import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'

const faqs = [
  {
    question: '¿Cuál es el tiempo de respuesta?',
    answer:
      'La evaluación automática toma entre 5 y 15 minutos. Si necesitamos información adicional, un asesor se comunicará el mismo día hábil para continuar el proceso.',
  },
  {
    question: '¿Qué requisitos mínimos necesito?',
    answer:
      'Ser mayor de 18 años, contar con cédula panameña vigente, comprobante de ingresos (contrato laboral, carta de trabajo o estados de cuenta) y una cuenta bancaria para el desembolso.',
  },
  {
    question: '¿Cómo protegen mis datos personales?',
    answer:
      'Implementamos cifrado TLS, monitoreo continuo, autenticación reforzada para nuestro equipo y políticas estrictas de acceso. Además, cumplimos con la normativa panameña de protección de datos.',
  },
  {
    question: '¿Aceptan solicitudes de extranjeros residentes?',
    answer:
      'Sí, siempre que cuenten con residencia legal en Panamá, cédula E o pasaporte vigente, historial bancario local y relación laboral formal.',
  },
  {
    question: '¿Qué sucede si no califico en la primera evaluación?',
    answer:
      'Te enviaremos recomendaciones puntuales para mejorar tu perfil (validación de ingresos, reducción de deudas u otros ajustes). Puedes volver a intentarlo después de 30 días.',
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-rapicredit-secondary/5 via-white to-white pb-24">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                Preguntas frecuentes
              </p>
              <h1 className="mt-4 text-3xl font-bold text-rapicredit-secondary md:text-4xl">
                Resolvemos tus dudas antes de solicitar
              </h1>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Si necesitas información adicional, nuestro equipo de atención está disponible por WhatsApp,
                correo y teléfono para brindarte acompañamiento personalizado.
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pt-14">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <section className="space-y-4">
              {faqs.map((item, index) => (
                <article
                  key={item.question}
                  className="rounded-3xl border border-orange-100 bg-white/90 shadow-sm shadow-rapicredit-primary/5 transition hover:shadow-orange-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-orange-50 transition-colors group"
                  >
                    <h2 className="text-base font-semibold text-rapicredit-secondary md:text-lg group-hover:text-orange-700 transition-colors">
                      {item.question}
                    </h2>
                    <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-5 border-t border-orange-100">
                      <p className="pt-4 text-sm text-gray-600 md:text-base leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-rapicredit-secondary">
                  Canal de soporte
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Escríbenos por WhatsApp o correo para recibir asistencia prioritaria con tu solicitud.
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <a
                    href="https://wa.me/message/VMLI5QEO3F7EN1"
                    className="block rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-center font-semibold text-white transition hover:opacity-90"
                  >
                    WhatsApp: +507 6900-7615
                  </a>
                  <a
                    href="mailto:soporte@rapicredit.com"
                    className="block rounded-xl border border-orange-500 px-4 py-2 text-center font-semibold text-orange-600 transition hover:bg-orange-50"
                  >
                    soporte@rapicredit.com
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-sm shadow-rapicredit-primary/5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-rapicredit-secondary">
                  Recursos adicionales
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-orange-600">
                  <li>
                    <a href="/terminos" className="underline-offset-4 hover:underline">
                      Términos y condiciones
                    </a>
                  </li>
                  <li>
                    <a href="/privacidad" className="underline-offset-4 hover:underline">
                      Política de privacidad
                    </a>
                  </li>
                  <li>
                    <a href="/contacto" className="underline-offset-4 hover:underline">
                      Datos de contacto y horario de atención
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}