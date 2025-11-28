import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'

export const metadata: Metadata = {
  title: 'Sobre RapiCredit Panamá | Financiera de confianza',
  description:
    'Conoce nuestra misión de democratizar el acceso al financiamiento en Panamá. Más de 10,000 personas confían en nosotros para préstamos rápidos, seguros y transparentes.',
}

const AUDIENCE_GROUPS = [
  {
    title: 'Jóvenes',
    description: 'Primeros empleos y metas personales',
    icon: '🎓',
  },
  {
    title: 'Empleados públicos y privados',
    description: 'Estabilidad laboral y crecimiento',
    icon: '💼',
  },
  {
    title: 'Jubilados',
    description: 'Experiencia y nuevos proyectos',
    icon: '🌅',
  },
  {
    title: 'Emprendedores',
    description: 'Sueños hechos realidad',
    icon: '🚀',
  },
] as const

const TRANSFORMATION_POINTS = [
  {
    before: 'Crédito como temor',
    after: 'Oportunidad para crecer',
    description: 'Con responsabilidad y confianza',
  },
  {
    before: 'Procesos lentos',
    after: 'Aprobaciones rápidas',
    description: 'Tecnología que acelera decisiones',
  },
  {
    before: 'Trámites complicados',
    after: 'Experiencia digital',
    description: 'Simple, moderna y eficiente',
  },
] as const

const VALUES = [
  {
    label: 'Rapidez',
    detail: 'Aprobaciones en minutos, desembolsos en 24 horas. La velocidad que necesitas cuando más lo necesitas.',
    icon: '⚡',
  },
  {
    label: 'Eficiencia',
    detail: 'Procesos digitales optimizados que eliminan el papeleo y simplifican cada paso.',
    icon: '🎯',
  },
  {
    label: 'Transparencia',
    detail: 'Sin sorpresas. Tasas claras, condiciones transparentes y comunicación honesta siempre.',
    icon: '🔍',
  },
] as const

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-rapicredit-secondary/5 via-white to-white pb-24">
        {/* Hero Section */}
        <section className="border-b border-gray-200 bg-white">
          <div className="container mx-auto flex flex-col gap-8 px-4 py-16 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                Transformamos el crédito en Panamá
              </p>
              <h1 className="text-3xl font-bold text-rapicredit-secondary md:text-4xl lg:text-5xl">
                Financiamiento accesible para todos
              </h1>
              <p className="text-lg text-gray-600 md:text-xl">
                Creemos que el acceso al crédito debe ser rápido, justo y transparente. Por eso trabajamos cada día 
                para transformar la forma en que las personas ven el financiamiento.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/solicitud"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Comienza tu solicitud
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center rounded-xl border border-orange-500 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Conoce nuestros productos
                </Link>
              </div>
            </div>

            {/* Audience Groups */}
            <div className="grid w-full gap-4 rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-lg shadow-orange-100 md:grid-cols-2 lg:max-w-xl">
              {AUDIENCE_GROUPS.map(group => (
                <article key={group.title} className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur transition-all hover:bg-white/90">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-rapicredit-secondary">
                        {group.title}
                      </h4>
                      <p className="text-xs text-gray-600">{group.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image */}
            <div className="flex justify-center lg:justify-start">
              <img
                src="https://res.cloudinary.com/dp3gvxyft/image/upload/v1764116662/4_ydjspf.jpg"
                alt="Nuestra misión"
                className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-lg"
              />
            </div>

            {/* Right side - Content */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="mb-6 text-3xl font-bold text-rapicredit-secondary md:text-4xl">
                  Nuestra Misión
                </h2>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 md:text-xl">
                    Nuestra misión es <span className="font-semibold text-orange-600">democratizar el acceso al financiamiento en Panamá</span>, 
                    ofreciendo soluciones de crédito rápidas, seguras y sostenibles que se adapten a las necesidades de cada persona.
                  </p>
                  <p className="text-base text-gray-600 md:text-lg">
                    Queremos transformar la forma en que las personas ven el crédito: <span className="font-medium text-rapicredit-secondary">de un temor, 
                    a una oportunidad para crecer con responsabilidad y confianza.</span>
                  </p>
                </div>
              </div>

              {/* Transformation Points */}
              <div className="grid gap-6 sm:grid-cols-1">
                {TRANSFORMATION_POINTS.map((point, index) => (
                  <div key={index} className="group relative bg-gradient-to-r from-orange-50 to-white rounded-xl p-6 border border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center space-x-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                        <div className="text-orange-500 text-xl font-bold">✓</div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-rapicredit-secondary mb-1">
                          {point.after}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {point.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded-full">
                            Antes: {point.before}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-rapicredit-primary/5 via-white to-rapicredit-secondary/5 shadow-lg">
            <div className="grid gap-10 px-8 py-12 md:px-12 lg:grid-cols-[1fr,2fr] lg:items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-rapicredit-secondary md:text-4xl">
                  Nuestra Visión
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg font-medium">
                    Ser la financiera líder en Panamá, reconocida por la <span className="text-orange-600">rapidez, eficiencia y transparencia</span> en la aprobación de créditos.
                  </p>
                  <p className="text-base">
                    Aspiramos a consolidarnos como una empresa moderna y digital, con <span className="font-medium">presencia a nivel nacional</span>, 
                    ofreciendo una experiencia de financiamiento ágil y confiable que combine tecnología, atención humana y soluciones reales para cada cliente.
                  </p>
                </div>
              </div>
              <div className="space-y-4 rounded-2xl bg-white/60 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-rapicredit-secondary">
                  Nuestro objetivo es transformar
                </h3>
                <p className="text-base text-gray-600">
                  La manera en que las personas acceden al crédito, brindando <span className="font-semibold text-orange-600">confianza, velocidad y cercanía</span> en cada paso del proceso.
                </p>
                <div className="mt-6 grid gap-3 text-sm">
                  <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">Presencia nacional completa</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">Tecnología + atención humana</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">Soluciones reales para cada cliente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rapicredit-secondary md:text-4xl mb-4">
              Los valores que nos guían
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Cada decisión que tomamos está respaldada por estos principios fundamentales que nos definen como empresa.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map(value => (
              <article key={value.label} className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-3xl transition-colors group-hover:bg-orange-200">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-rapicredit-secondary">
                    {value.label}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-gradient-to-r from-rapicredit-primary to-rapicredit-secondary p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              ¿Listo para experimentar el futuro del crédito?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Únete a miles de personas que ya confían en RapiCredit para alcanzar sus metas.
            </p>
            <Link
              href="/solicitud"
              className="inline-flex items-center rounded-xl bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-gray-50 border border-orange-200"
            >
              Solicita tu préstamo ahora
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}