import { Suspense } from 'react'
import SolicitudForm from './solicitud-form'

export default function SolicitudPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    }>
      <SolicitudForm />
    </Suspense>
  )
}