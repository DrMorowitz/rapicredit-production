import { LoanApplication } from '../solicitud/data'
import { formatCurrency } from '../solicitud/utils'

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

// Admin notification email when a new application is submitted
export function createAdminNotificationEmail(
  application: LoanApplication,
  applicationId: string
): EmailTemplate {
  const { personal, loan, employment, address } = application

  const subject = `Nueva Solicitud de Préstamo - ${personal.fullName} (${formatCurrency(loan.amount)})`

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Solicitud - RapiCredit</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3446F1 0%, #03045F 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; color: #03045F; margin-bottom: 10px; border-bottom: 2px solid #3446F1; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 15px; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .highlight { background-color: #f8f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3446F1; margin: 15px 0; }
        .footer { background-color: #f8f9ff; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .button { display: inline-block; background: #3446F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
        @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Nueva Solicitud de Préstamo</h1>
          <p>Se ha recibido una nueva solicitud en RapiCredit</p>
        </div>
        
        <div class="content">
          <div class="highlight">
            <h2 style="margin-top: 0; color: #03045F;">ID de Solicitud: ${applicationId}</h2>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <div class="section">
            <div class="section-title">👤 Información Personal</div>
            <div class="info-grid">
              <div class="info-label">Nombre completo:</div>
              <div class="info-value">${personal.fullName}</div>
              <div class="info-label">Cédula:</div>
              <div class="info-value">${personal.cedula}</div>
              <div class="info-label">Email:</div>
              <div class="info-value">${personal.email}</div>
              <div class="info-label">Teléfono:</div>
              <div class="info-value">${personal.phoneCountryCode} ${personal.phoneNumber}</div>
              <div class="info-label">Fecha de nacimiento:</div>
              <div class="info-value">${personal.dateOfBirth}</div>
              <div class="info-label">Estado civil:</div>
              <div class="info-value">${personal.maritalStatus}</div>
              <div class="info-label">Dependientes:</div>
              <div class="info-value">${personal.dependents}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">💰 Detalles del Préstamo</div>
            <div class="info-grid">
              <div class="info-label">Monto solicitado:</div>
              <div class="info-value"><strong>${formatCurrency(loan.amount)}</strong></div>
              <div class="info-label">Plazo:</div>
              <div class="info-value">${loan.term} meses</div>
              <div class="info-label">Propósito:</div>
              <div class="info-value">${loan.purpose}</div>
              ${loan.comments ? `
              <div class="info-label">Comentarios:</div>
              <div class="info-value">${loan.comments}</div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">🏠 Dirección</div>
            <div class="info-grid">
              <div class="info-label">Dirección completa:</div>
              <div class="info-value">${address.fullAddress}</div>
              <div class="info-label">Tipo de propiedad:</div>
              <div class="info-value">${address.propertyType}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">💼 Información Laboral</div>
            <div class="info-grid">
              <div class="info-label">Situación laboral:</div>
              <div class="info-value">${employment.status}</div>
              <div class="info-label">Empresa:</div>
              <div class="info-value">${employment.companyName}</div>
              <div class="info-label">Cargo:</div>
              <div class="info-value">${employment.role}</div>
              <div class="info-label">Ingreso mensual:</div>
              <div class="info-value"><strong>${formatCurrency(employment.monthlyIncome)}</strong></div>
              <div class="info-label">Ingresos adicionales:</div>
              <div class="info-value">${formatCurrency(employment.extraIncome || 0)}</div>
              <div class="info-label">Antigüedad laboral:</div>
              <div class="info-value">${employment.employmentLength}</div>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin-rc-2024" class="button">
              Ver en Panel de Control
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>RapiCredit</strong> - Sistema de Notificaciones</p>
          <p>Este email fue generado automáticamente. No responder a esta dirección.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Nueva Solicitud de Préstamo - RapiCredit

ID de Solicitud: ${applicationId}
Fecha: ${new Date().toLocaleDateString('es-ES')}

INFORMACIÓN PERSONAL:
- Nombre: ${personal.fullName}
- Cédula: ${personal.cedula}
- Email: ${personal.email}
- Teléfono: ${personal.phoneCountryCode} ${personal.phoneNumber}
- Fecha de nacimiento: ${personal.dateOfBirth}
- Estado civil: ${personal.maritalStatus}
- Dependientes: ${personal.dependents}

PRÉSTAMO SOLICITADO:
- Monto: ${formatCurrency(loan.amount)}
- Plazo: ${loan.term} meses
- Propósito: ${loan.purpose}
${loan.comments ? `- Comentarios: ${loan.comments}` : ''}

DIRECCIÓN:
- Dirección: ${address.fullAddress}
- Tipo de propiedad: ${address.propertyType}

INFORMACIÓN LABORAL:
- Situación: ${employment.status}
- Empresa: ${employment.companyName}
- Cargo: ${employment.role}
- Ingreso mensual: ${formatCurrency(employment.monthlyIncome)}
- Ingresos adicionales: ${formatCurrency(employment.extraIncome || 0)}
- Antigüedad: ${employment.employmentLength}

Panel de control: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin-rc-2024
  `

  return { subject, html, text }
}

// User confirmation email after successful submission
export function createUserConfirmationEmail(
  application: LoanApplication,
  applicationId: string
): EmailTemplate {
  const { personal, loan } = application

  const subject = `Confirmación de Solicitud - RapiCredit (${formatCurrency(loan.amount)})`

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación - RapiCredit</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3446F1 0%, #03045F 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .success-badge { background-color: #d4edda; color: #155724; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin: 15px 0; text-align: center; }
        .info-section { background-color: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #f8f9ff; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .contact-info { background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ¡Solicitud Recibida!</h1>
          <p>Hola ${personal.fullName}, hemos recibido tu solicitud</p>
        </div>
        
        <div class="content">
          <div class="success-badge">
            <h3 style="margin: 0 0 10px 0;">¡Tu solicitud ha sido enviada exitosamente!</h3>
            <p style="margin: 0;">Número de referencia: <strong>${applicationId}</strong></p>
          </div>

          <div class="info-section">
            <h3 style="margin-top: 0; color: #03045F;">Resumen de tu solicitud:</h3>
            <p><strong>Monto solicitado:</strong> ${formatCurrency(loan.amount)}</p>
            <p><strong>Plazo:</strong> ${loan.term} meses</p>
            <p><strong>Propósito:</strong> ${loan.purpose}</p>
            <p><strong>Fecha de solicitud:</strong> ${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })}</p>
          </div>

          <h3 style="color: #03045F;">¿Qué sigue?</h3>
          <ol>
            <li><strong>Revisión inicial:</strong> Nuestro equipo revisará tu solicitud en las próximas 24-48 horas.</li>
            <li><strong>Verificación de documentos:</strong> Validaremos la información y documentos proporcionados.</li>
            <li><strong>Evaluación crediticia:</strong> Realizaremos el análisis correspondiente.</li>
            <li><strong>Respuesta:</strong> Te contactaremos con la decisión y próximos pasos.</li>
          </ol>

          <div class="contact-info">
            <h4 style="margin-top: 0;">¿Necesitas ayuda?</h4>
            <p>Si tienes alguna pregunta sobre tu solicitud, no dudes en contactarnos:</p>
            <ul>
              <li>📧 Email: ${process.env.RAPICREDIT_STAFF_EMAIL || 'info@rapicredit.com'}</li>
              <li>📱 Teléfono: [Número de contacto]</li>
              <li>🕒 Horario de atención: Lunes a Viernes, 8:00 AM - 5:00 PM</li>
            </ul>
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <em>Gracias por confiar en RapiCredit para tus necesidades financieras.</em>
          </p>
        </div>
        
        <div class="footer">
          <p><strong>RapiCredit</strong> - Tu aliado financiero</p>
          <p>Este email fue generado automáticamente. Guarda este mensaje para tus registros.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
¡Solicitud Recibida! - RapiCredit

Hola ${personal.fullName},

¡Tu solicitud ha sido enviada exitosamente!
Número de referencia: ${applicationId}

RESUMEN DE TU SOLICITUD:
- Monto solicitado: ${formatCurrency(loan.amount)}
- Plazo: ${loan.term} meses
- Propósito: ${loan.purpose}
- Fecha de solicitud: ${new Date().toLocaleDateString('es-ES')}

¿QUÉ SIGUE?
1. Revisión inicial: Nuestro equipo revisará tu solicitud en las próximas 24-48 horas.
2. Verificación de documentos: Validaremos la información y documentos proporcionados.
3. Evaluación crediticia: Realizaremos el análisis correspondiente.
4. Respuesta: Te contactaremos con la decisión y próximos pasos.

¿NECESITAS AYUDA?
Email: ${process.env.RAPICREDIT_STAFF_EMAIL || 'info@rapicredit.com'}
Horario: Lunes a Viernes, 8:00 AM - 5:00 PM

Gracias por confiar en RapiCredit para tus necesidades financieras.

---
RapiCredit - Tu aliado financiero
  `

  return { subject, html, text }
}