import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WhatsAppFloat from '@/components/ui/whatsapp-float'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Préstamos Personales Rápidos en Panamá | RapiCredit - Aprobación en Minutos',
  description: 'Obtén préstamos personales rápidos desde B/.500 hasta B/.10,000 en Panamá. Aprobación en minutos, dinero en 24 horas. Sin garantía ni aval. ¡Solicita online ahora!',
  keywords: 'préstamos personales panamá, crédito rápido, dinero urgente, préstamos online panamá, financiera rapicredit',
  authors: [{ name: 'RapiCredit' }],
  creator: 'RapiCredit',
  publisher: 'RapiCredit',
  robots: 'index, follow',
  openGraph: {
    title: 'Préstamos Personales Rápidos en Panamá | RapiCredit',
    description: 'Aprobación en minutos, dinero en 24 horas. Desde B/.500 hasta B/.10,000. Sin garantía ni aval.',
    url: 'https://rapicredit.com',
    siteName: 'RapiCredit',
    locale: 'es_PA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Préstamos Personales Rápidos | RapiCredit Panamá',
    description: 'Aprobación en minutos, dinero en 24 horas. Sin garantía ni aval.',
    creator: '@rapicredit',
  },
  manifest: '/manifest.json',
  icons: {
    icon: 'https://res.cloudinary.com/dp3gvxyft/image/upload/v1762490150/Logo_fondo_solido-06_deoxql.jpg',
    apple: 'https://res.cloudinary.com/dp3gvxyft/image/upload/v1762490150/Logo_fondo_solido-06_deoxql.jpg',
    shortcut: 'https://res.cloudinary.com/dp3gvxyft/image/upload/v1762490150/Logo_fondo_solido-06_deoxql.jpg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3446F1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}