import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y condiciones | RapiCredit Panamá',
  description:
    'Lee los términos y condiciones del servicio RapiCredit: uso de la plataforma, evaluación crediticia, desembolsos, obligaciones y derechos del cliente.',
}

const sections = [
  {
    title: '1. Definiciones',
    content:
      '“RapiCredit” corresponde a la sociedad financiera autorizada en Panamá. “Cliente” es toda persona que solicite un préstamo a través de la plataforma. “Solicitud” es el formulario digital y documentación que envía el Cliente para evaluación.',
  },
  {
    title: '2. Uso de la plataforma',
    content:
      'El Cliente se compromete a suministrar información veraz y actualizada. El uso indebido, la falsificación de documentos o el intento de fraude faculta a RapiCredit para cancelar la solicitud y notificar a las autoridades competentes.',
  },
  {
    title: '3. Evaluación crediticia',
    content:
      'RapiCredit realiza análisis interno y consultas en agencias autorizadas como APC. La aprobación no está garantizada. Los criterios pueden incluir historial crediticio, capacidad de pago, validación de ingresos y documentación complementaria.',
  },
  {
    title: '4. Desembolso y pagos',
    content:
      'Una vez firmado el contrato, el desembolso se efectúa por transferencia bancaria. Las cuotas se pagan mediante ACH o banca en línea en las fechas pactadas. Los atrasos generan intereses moratorios y gastos de cobranza conforme al contrato.',
  },
  {
    title: '5. Datos personales',
    content:
      'RapiCredit almacena y procesa los datos del Cliente siguiendo la Ley 81 de Protección de Datos Personales. El Cliente puede ejercer sus derechos de acceso, rectificación y eliminación escribiendo a privacidad@rapicredit.com.',
  },
]

export default function TermsPage() {
  return (
    <main className="bg-gray-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Términos y condiciones</h1>
          <p className="mt-4 text-sm text-gray-600">
            Última actualización: {new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date())}
          </p>
        </header>

        <section className="mt-10 space-y-8 rounded-3xl bg-white p-8 shadow-sm">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{section.content}</p>
            </article>
          ))}
        </section>

        <footer className="mt-8 rounded-3xl border border-gray-200 bg-white/60 p-6 text-sm text-gray-600">
          <p>
            Para consultas legales adicionales o solicitud de contratos, escribe a{' '}
            <a href="mailto:legal@rapicredit.com" className="text-rapicredit-primary underline">
              legal@rapicredit.com
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  )
}

