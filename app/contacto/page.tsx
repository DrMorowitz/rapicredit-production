import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'

export const metadata: Metadata = {
  title: 'Contáctanos | RapiCredit Panamá',
  description:
    'Habla con un asesor RapiCredit por WhatsApp, correo o teléfono. Estamos disponibles para ayudarte con tu solicitud de préstamo o consultas sobre pagos y estados.',
}

const offices = [
  {
    name: 'Sede Principal',
    address: 'Via Ricardo J Alfaro, Centro Comercial La Alhambra, Local 2 Planta Baja',
    schedule: 'Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 8:00 AM a 1:00 PM',
    phone: '+507 6900-7615',
  },
]

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-white via-rapicredit-primary/5 to-white pb-24">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rapicredit-primary">
              Estamos aquí para ayudarte
            </p>
            <h1 className="mt-4 text-3xl font-bold text-rapicredit-secondary md:text-4xl">
              Contacta al equipo RapiCredit
            </h1>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              Resolvemos solicitudes y consultas en minutos. Elige el canal que prefieras y obtén
              acompañamiento personalizado para tu financiamiento.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-14">
        <section className="grid gap-8 lg:grid-cols-3">
          <article className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-rapicredit-primary/5">
            <h2 className="text-lg font-semibold text-rapicredit-secondary">Canales digitales</h2>
            <p className="mt-4 text-sm text-gray-600">
              Para solicitudes nuevas, seguimiento y dudas sobre tus pagos.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a
                href="https://wa.me/message/VMLI5QEO3F7EN1"
                className="block rounded-xl bg-gradient-primary px-4 py-3 text-center font-semibold text-white transition hover:opacity-90"
              >
                WhatsApp empresarial
              </a>
              <a
                href="mailto:soporte@rapicredit.com"
                className="block rounded-xl border border-rapicredit-primary px-4 py-3 text-center font-semibold text-rapicredit-primary transition hover:bg-rapicredit-primary/5"
              >
                soporte@rapicredit.com
              </a>
              <a
                href="tel:+50769007615"
                className="block rounded-xl border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Llamada directa
              </a>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-rapicredit-primary/5">
            <h2 className="text-lg font-semibold text-rapicredit-secondary">Documentación y soporte</h2>
            <p className="mt-4 text-sm text-gray-600">
              Envía documentos adicionales o reporta actualizaciones de tu perfil.
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p className="rounded-2xl bg-rapicredit-primary/5 px-4 py-3">
                <span className="font-semibold text-rapicredit-secondary">Email dedicado:</span>{' '}
                documentos@rapicredit.com
              </p>
              <p className="rounded-2xl bg-rapicredit-primary/5 px-4 py-3">
                <span className="font-semibold text-rapicredit-secondary">Extensión directa:</span> +507 6900-7615
              </p>
              <p className="rounded-2xl bg-rapicredit-primary/5 px-4 py-3">
                Respuesta garantizada en menos de 4 horas laborables.
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-rapicredit-primary/5">
            <h2 className="text-lg font-semibold text-rapicredit-secondary">¿Prefieres visitar nuestras oficinas?</h2>
            <p className="mt-4 text-sm text-gray-600">
              Agenda una cita para asesoría financiera, firma de documentos o recibir asistencia presencial.
            </p>
            
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-gradient-to-r from-rapicredit-primary/10 to-orange-50 border border-orange-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-4 w-4 text-rapicredit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-rapicredit-secondary">Horarios de atención</span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <strong>Lunes a Viernes:</strong> 8:00 AM - 6:00 PM
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <strong>Sábados:</strong> 8:00 AM - 1:00 PM
                  </p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    📍 Via Ricardo J Alfaro, Centro Comercial La Alhambra, Local 2 Planta Baja
                  </p>
                </div>
              </div>
              
              <Link
                href="/faq"
                className="inline-flex items-center justify-center w-full rounded-xl border border-rapicredit-primary px-4 py-3 text-sm font-semibold text-rapicredit-primary transition hover:bg-rapicredit-primary/5"
              >
                Revisa preguntas frecuentes
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-16 rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-rapicredit-primary/5">
          <h2 className="text-2xl font-semibold text-rapicredit-secondary">Nuestra ubicación</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              {offices.map(office => (
                <div key={office.name} className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <h3 className="text-base font-semibold text-rapicredit-secondary">{office.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{office.address}</p>
                  <p className="mt-2 text-sm text-gray-600">{office.schedule}</p>
                  <p className="mt-2 text-sm font-semibold text-orange-600">{office.phone}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5912909672534!2d-79.53647932551537!3d9.009702091050864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca843a11d8589%3A0xa00cd01d3f5450e4!2sCentro%20Comercial%20Alambra!5e0!3m2!1sen!2spa!4v1764121152965!5m2!1sen!2spa" 
                width="100%" 
                height="300" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer />
    </>
  )
}

