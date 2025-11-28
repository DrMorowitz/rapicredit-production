[README.md](https://github.com/user-attachments/files/23812279/README.md)
# RapiCredit - Préstamos Personales Rápidos en Panamá

<div align="center">
  <img src="https://res.cloudinary.com/dp3gvxyft/image/upload/v1762392183/blanco_rapicredit_t5gi1s.svg" alt="RapiCredit Logo" width="200" height="200">
  
  **Aprobación en minutos, dinero en tu cuenta más rápido que speedy**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.0.1-black?logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18.3.0-blue?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
</div>

## 🚀 Descripción del Proyecto

RapiCredit es una plataforma financiera moderna que ofrece préstamos personales rápidos y seguros en Panamá. La aplicación web permite a los usuarios solicitar préstamos al llenar el form desde B/.500 hasta B/.10,000 con un proceso 100% digital, sin garantía ni aval. Este form se visualiza en el admin dashboard. Tiene capacidad de carga de imagenes.

### ✨ Características Principales

- **🏃‍♂️ Proceso Rápido**: Aprobación en minutos, dinero en 24 horas
- **📱 100% Digital**: Solicitud completamente en línea con captura de documentos
- **🔒 Seguro**: Encriptación de nivel bancario para protección de datos
- **💰 Flexible**: Montos desde B/.500 hasta B/.10,000
- **📄 Requisitos Mínimos**: Solo documentos básicos necesarios
- **🎯 Tasas Competitivas**: Las mejores tasas del mercado panameño

## 🛠️ Tecnologías Utilizadas

### Framework Principal
- **Next.js 15.0.1** - Framework React con App Router
- **React 18.3.0** - Librería para interfaces de usuario
- **TypeScript 5.0.0** - Tipado estático para JavaScript

### Estilos y UI
- **Tailwind CSS 3.3.0** - Framework de utilidades CSS
- **Framer Motion 10.16.0** - Animaciones y transiciones
- **Radix UI** - Componentes accesibles y sin estilos
- **Lucide React** - Iconografía moderna

### Formularios y Validación
- **React Hook Form 7.48.0** - Manejo de formularios
- **Zod 3.22.0** - Validación de esquemas TypeScript-first
- **@hookform/resolvers** - Integración entre React Hook Form y Zod

### Email y Notificaciones
- **React Email 5.0.3** - Plantillas de email con React
- **Resend 6.4.2** - Servicio de envío de emails

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📁 Estructura del Proyecto

```
rapicredit-mvp/
├── app/                          # App Router de Next.js
│   ├── admin-rc-2024/           # Panel administrativo
│   ├── api/                     # API Routes
│   │   └── send-notification/   # Endpoint para notificaciones
│   ├── contacto/                # Página de contacto
│   ├── faq/                     # Preguntas frecuentes
│   ├── nosotros/               # Página "Sobre nosotros"
│   ├── privacidad/             # Política de privacidad
│   ├── servicios/              # Servicios financieros
│   ├── solicitud/              # Formulario de solicitud
│   ├── terminos/               # Términos y condiciones
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout raíz
│   ├── page.tsx                # Página principal
│   └── manifest.json           # PWA manifest
├── components/                  # Componentes reutilizables
│   └── ui/                     # Componentes de UI
│       ├── button.tsx          # Botones estilizados
│       ├── camera-upload.tsx   # Captura de documentos
│       ├── card.tsx           # Tarjetas de contenido
│       ├── footer.tsx         # Footer del sitio
│       ├── input.tsx          # Inputs personalizados
│       ├── logo-carousel.tsx  # Carrusel de logos
│       ├── navigation.tsx     # Navegación principal
│       └── whatsapp-float.tsx # Botón flotante WhatsApp
├── emails/                     # Plantillas de email
│   └── admin-notification.tsx  # Email de notificación
├── lib/                        # Utilidades y configuración
│   ├── solicitud/             # Lógica de solicitudes
│   └── utils.ts              # Funciones de utilidad
├── public/                     # Archivos estáticos
│   ├── fonts/                 # Fuentes personalizadas
│   └── azul_rapicredit2.svg   # Logo principal
├── next.config.js             # Configuración Next.js
├── tailwind.config.ts         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
└── package.json              # Dependencias del proyecto
```

## 🚦 Inicio Rápido

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd rapicredit-mvp
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus configuraciones
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   - Visita `http://localhost:3000`

## 🎨 Diseño y Branding

### Paleta de Colores
- **Azul Principal**: `#3446F1` - Color primario de RapiCredit
- **Azul Marino**: `#03045F` - Color secundario
- **Naranjas**: Tonos de naranja para elementos destacados
- **Grises**: Escala completa para texto y fondos

### Tipografía
- **Fuente Principal**: RR Opaque (Custom font family)
- **Pesos Disponibles**: Thin, Light, Regular, Medium, Bold, Black
- **Estilos**: Normales e itálicas

### Componentes de UI
- **Botones**: Estilos primarios y secundarios con animaciones
- **Formularios**: Inputs personalizados con validación
- **Tarjetas**: Diseño moderno con shadows y efectos hover
- **Navegación**: Header sticky con efectos de scroll

## 📱 Características de la Aplicación

### Página Principal
- **Hero Section**: Llamada a la acción principal con animaciones
- **Proceso en 3 Pasos**: Explicación visual del flujo
- **Beneficios**: Grid de ventajas competitivas
- **Centro de Conocimiento**: Enlaces a secciones informativas
- **Call-to-Action Final**: Conversión optimizada

### Formulario de Solicitud (`/solicitud`)
- **Multi-step Form**: Formulario dividido en pasos
- **Captura de Documentos**: Integración con cámara del dispositivo
- **Validación en Tiempo Real**: Feedback inmediato al usuario
- **Encriptación**: Seguridad de datos desde el cliente

### Páginas de Contenido
- **Nosotros** (`/nosotros`): Historia y misión de la empresa
- **Servicios** (`/servicios`): Productos financieros disponibles
- **FAQ** (`/faq`): Preguntas frecuentes con acordeón
- **Contacto** (`/contacto`): Información de contacto y formularios

### Integración WhatsApp
- **Botón Flotante**: Acceso rápido desde cualquier página
- **Enlaces Directos**: Conexión con asesores comerciales
- **Mensajes Predefinidos**: Templates para consultas comunes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint para verificar código
```

## 🌐 Despliegue

### Preparación para Producción

1. **Build de Producción**
   ```bash
   npm run build
   ```

2. **Test Local de Producción**
   ```bash
   npm start
   ```

3. **Optimizaciones Implementadas**
   - **Image Optimization**: Next.js Image component
   - **Font Optimization**: Fuentes locales optimizadas
   - **Code Splitting**: Carga automática de chunks
   - **Static Generation**: Páginas pre-renderizadas donde sea posible

### Recomendaciones de Hosting
- **Vercel** (recomendado para Next.js)
- **Netlify**
- **AWS Amplify**
- **DigitalOcean App Platform**

## 🔒 Seguridad

### Medidas Implementadas
- **Encriptación HTTPS**: Obligatorio en producción
- **Validación de Formularios**: Cliente y servidor
- **Sanitización de Datos**: Prevención de XSS
- **Headers de Seguridad**: CSP, HSTS, etc.
- **Rate Limiting**: Protección contra abuso de API

### Variables de Entorno Requeridas
```env
# API Keys
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_API_URL=your_api_url

# Cloudinary (para imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Configuración del entorno
NODE_ENV=production
```

## 📊 Performance

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimizaciones Aplicadas
- **Image Lazy Loading**: Carga diferida de imágenes
- **Font Preloading**: Carga prioritaria de fuentes críticas
- **Code Splitting**: División automática del código
- **Prefetching**: Pre-carga de rutas probables

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear branch de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -am 'Add nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

### Estándares de Código
- **TypeScript**: Tipado estricto obligatorio
- **ESLint**: Seguir configuración establecida
- **Prettier**: Formateo automático de código
- **Commits**: Seguir conventional commits

## 📞 Soporte

### Información de Contacto
- **Sitio Web**: [https://rapicredit.com](https://rapicredit.com)
- **WhatsApp**: [Enlace directo](https://wa.me/message/VMLI5QEO3F7EN1)
- **Email**: info@rapicredit.com

### Documentación Adicional
- **Guía de Desarrollo**: Ver `DEVELOPMENT_LOG.md`
- **Instrucciones del Proyecto**: Ver `CLAUDE.md`
- **Schema de Base de Datos**: Ver archivos de documentación

## 📄 Licencia

Este proyecto es propiedad de RapiCredit. Todos los derechos reservados.

---

<div align="center">
  <strong>Desarrollado con ❤️ para ofrecer soluciones financieras accesibles en Panamá</strong>
</div>
