import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-rapicredit-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="https://res.cloudinary.com/dp3gvxyft/image/upload/v1762490150/Logo_fondo_solido-06_deoxql.jpg"
                alt="RapiCredit Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold">RapiCredit</span>
            </div>
            <p className="text-white/70 text-sm">
              Préstamos personales rápidos y seguros en Panamá. Tu confianza es nuestra prioridad.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/servicios" className="hover:text-white transition-colors">Préstamos Personales</Link></li>
              <li><Link href="/servicios" className="hover:text-white transition-colors">Préstamos Rápidos</Link></li>
              <li><Link href="/servicios" className="hover:text-white transition-colors">Consulta APC</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-white/70 text-sm mb-4">
              <li>📞 +507 6900-7615</li>
              <li>📧 solicitudes@financierarapicredit.com</li>
              <li>📍 Via Ricardo J Alfaro, Centro Comercial La Alhambra, Local 2 Planta Baja</li>
              <li>🕒 Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 8:00 AM a 1:00 PM</li>
            </ul>
            <div className="w-full h-32 rounded-lg overflow-hidden border border-white/20">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5912909672534!2d-79.53647932551537!3d9.009702091050864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca843a11d8589%3A0xa00cd01d3f5450e4!2sCentro%20Comercial%20Alambra!5e0!3m2!1sen!2spa!4v1764121152965!5m2!1sen!2spa" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-center text-white/70 text-sm">
          <p className="text-center">Financiera RapiCredit 2026. Todos los derechos reservados. Financiera autorizada y regulada en Panama por la Superintendencia de Bancos de Panamá.</p>
        </div>
      </div>
    </footer>
  )
}