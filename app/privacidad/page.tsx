import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de privacidad | RapiCredit Panamá',
  description:
    'Conoce cómo RapiCredit recopila, utiliza y protege tus datos personales conforme a la Ley 81 de Protección de Datos Personales en Panamá.',
}

const policy = [
  {
    title: 'Datos recopilados',
    items: [
      'Datos de identificación: nombre, cédula, fecha de nacimiento.',
      'Información de contacto: teléfono, correo electrónico y dirección.',
      'Información financiera: ingresos, historial crediticio y comprobantes.',
      'Datos de navegación y origen de la visita (UTM, referrer, dispositivo).',
    ],
  },
  {
    title: 'Uso de la información',
    items: [
      'Evaluar la viabilidad crediticia del solicitante.',
      'Contactar al cliente durante el proceso de aprobación.',
      'Cumplir obligaciones legales y normativas ante la SBP.',
      'Mejorar la experiencia digital y detectar fraudes.',
    ],
  },
  {
    title: 'Seguridad',
    items: [
      'Cifrado TLS 1.3 en tránsito y almacenamiento en AWS con redundancia.',
      'Perímetro protegido con firewalls administrados y monitoreo 24/7.',
      'Protocolos de autenticación multifactor para el equipo interno.',
      'Auditorías externas anuales y evaluación de vulnerabilidades.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="bg-gray-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Política de privacidad</h1>
          <p className="mt-4 text-sm text-gray-600">
            RapiCredit cumple con la Ley 81 de Protección de Datos Personales (Panamá). Esta
            política describe cómo trataremos tus datos.
          </p>
        </header>

        <section className="mt-10 space-y-8 rounded-3xl bg-white p-8 shadow-sm">
          {policy.map((section) => (
            <article key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Derechos del titular</h3>
            <p className="mt-2 text-sm text-gray-600">
              Puedes solicitar acceso, rectificación, oposición o eliminación de tus datos enviando
              un correo a{' '}
              <a href="mailto:privacidad@rapicredit.com" className="text-rapicredit-primary underline">
                privacidad@rapicredit.com
              </a>
              .
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Tiempo de conservación</h3>
            <p className="mt-2 text-sm text-gray-600">
              Conservamos la información por el plazo necesario para cumplir obligaciones legales y
              contractuales. Los clientes con préstamos activos se mantienen según requisitos SBP.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

