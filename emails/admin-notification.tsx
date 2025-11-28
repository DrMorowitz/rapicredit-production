import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Link,
  Img,
} from '@react-email/components';
import { formatCurrency } from '@/lib/solicitud/utils';

interface AdminNotificationEmailProps {
  submissionId: string;
  submittedAt: string;
  applicantName: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantCedula?: string;
  loanAmount: number;
  loanTerm: number;
  loanPurpose?: string;
  monthlyIncome?: number;
  employmentStatus?: string;
  province?: string;
  district?: string;
  progress: number;
  documentsAttached: {
    idFront: boolean;
    idBack: boolean;
  };
}

export default function AdminNotificationEmail({
  submissionId,
  submittedAt,
  applicantName,
  applicantEmail,
  applicantPhone,
  applicantCedula,
  loanAmount,
  loanTerm,
  loanPurpose,
  monthlyIncome,
  employmentStatus,
  province,
  district,
  progress,
  documentsAttached,
}: AdminNotificationEmailProps) {
  const previewText = `Nueva solicitud de ${applicantName} por ${formatCurrency(loanAmount)}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with RapiCredit branding */}
          <Section style={header}>
            <Row>
              <Column>
                <Img
                  src="https://res.cloudinary.com/dp3gvxyft/image/upload/v1762392183/blanco_rapicredit_t5gi1s.svg"
                  width="120"
                  height="40"
                  alt="RapiCredit"
                  style={logo}
                />
              </Column>
              <Column align="right">
                <Text style={headerDate}>
                  {new Date(submittedAt).toLocaleString('es-PA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Alert Banner */}
          <Section style={alertSection}>
            <Text style={alertText}>
              🚨 Nueva Solicitud de Préstamo Recibida
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={title}>
              Solicitud #{submissionId.slice(-8).toUpperCase()}
            </Text>
            
            <Text style={subtitle}>
              Se ha recibido una nueva solicitud de préstamo. A continuación los detalles:
            </Text>

            {/* Applicant Information */}
            <Section style={infoSection}>
              <Text style={sectionTitle}>👤 Información del Solicitante</Text>
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Nombre:</Text>
                </Column>
                <Column>
                  <Text style={value}>{applicantName}</Text>
                </Column>
              </Row>
              {applicantEmail && (
                <Row style={infoRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Email:</Text>
                  </Column>
                  <Column>
                    <Link href={`mailto:${applicantEmail}`} style={linkValue}>
                      {applicantEmail}
                    </Link>
                  </Column>
                </Row>
              )}
              {applicantPhone && (
                <Row style={infoRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Teléfono:</Text>
                  </Column>
                  <Column>
                    <Link href={`tel:${applicantPhone}`} style={linkValue}>
                      {applicantPhone}
                    </Link>
                  </Column>
                </Row>
              )}
              {applicantCedula && (
                <Row style={infoRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Cédula:</Text>
                  </Column>
                  <Column>
                    <Text style={value}>{applicantCedula}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Loan Information */}
            <Section style={infoSection}>
              <Text style={sectionTitle}>💰 Detalles del Préstamo</Text>
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Monto:</Text>
                </Column>
                <Column>
                  <Text style={highlightValue}>{formatCurrency(loanAmount)}</Text>
                </Column>
              </Row>
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Plazo:</Text>
                </Column>
                <Column>
                  <Text style={value}>{loanTerm} meses</Text>
                </Column>
              </Row>
              {loanPurpose && (
                <Row style={infoRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Propósito:</Text>
                  </Column>
                  <Column>
                    <Text style={value}>{loanPurpose}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Employment & Location */}
            <Section style={infoSection}>
              <Text style={sectionTitle}>💼 Información Adicional</Text>
              {employmentStatus && (
                <Row style={infoRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Empleo:</Text>
                  </Column>
                  <Column>
                    <Text style={value}>{employmentStatus}</Text>
                  </Column>
                </Row>
              )}
              {monthlyIncome && (
                <Row style={infoRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Ingreso:</Text>
                  </Column>
                  <Column>
                    <Text style={value}>{formatCurrency(monthlyIncome)}/mes</Text>
                  </Column>
                </Row>
              )}
              {province && (
                <Row style={infoRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Ubicación:</Text>
                  </Column>
                  <Column>
                    <Text style={value}>{district || province}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Application Status */}
            <Section style={statusSection}>
              <Text style={sectionTitle}>📊 Estado de la Solicitud</Text>
              <Row>
                <Column>
                  <Text style={value}>
                    Progreso: <strong style={highlightValue}>{progress}%</strong>
                  </Text>
                </Column>
              </Row>
              <Text style={documentsTitle}>Documentos:</Text>
              <Row style={documentsRow}>
                <Column>
                  <Text style={documentStatus}>
                    {documentsAttached.idFront ? '✅' : '❌'} Cédula (Frontal)
                  </Text>
                </Column>
                <Column>
                  <Text style={documentStatus}>
                    {documentsAttached.idBack ? '✅' : '❌'} Cédula (Reverso)
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Text style={ctaText}>
                Para revisar todos los detalles y documentos, accede al panel administrativo:
              </Text>
              <Link
                href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin-rc-2024`}
                style={button}
              >
                Ver en Panel de Control
              </Link>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                Este email fue generado automáticamente por el sistema RapiCredit.
                <br />
                ID de solicitud: {submissionId}
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#3446F1',
  borderRadius: '8px 8px 0 0',
  padding: '20px 40px',
};

const logo = {
  filter: 'brightness(0) invert(1)', // Make logo white
};

const headerDate = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  textAlign: 'right' as const,
};

const alertSection = {
  backgroundColor: '#FEF3C7',
  borderLeft: '4px solid #F59E0B',
  padding: '16px 40px',
  margin: '0',
};

const alertText = {
  color: '#92400E',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '0 40px',
};

const title = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '32px 0 16px 0',
};

const subtitle = {
  fontSize: '16px',
  color: '#6b7280',
  margin: '0 0 32px 0',
  lineHeight: '1.5',
};

const infoSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const statusSection = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  border: '1px solid #e0f2fe',
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px 0',
};

const infoRow = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '30%',
  verticalAlign: 'top' as const,
};

const label = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
  fontWeight: '500',
};

const value = {
  fontSize: '14px',
  color: '#1f2937',
  margin: '0',
};

const highlightValue = {
  fontSize: '16px',
  color: '#3446F1',
  fontWeight: '600',
};

const linkValue = {
  fontSize: '14px',
  color: '#3446F1',
  textDecoration: 'underline',
  margin: '0',
};

const documentsTitle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '16px 0 8px 0',
  fontWeight: '500',
};

const documentsRow = {
  marginTop: '8px',
};

const documentStatus = {
  fontSize: '14px',
  color: '#1f2937',
  margin: '4px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const ctaText = {
  fontSize: '16px',
  color: '#6b7280',
  margin: '0 0 24px 0',
  lineHeight: '1.5',
};

const button = {
  backgroundColor: '#3446F1',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  minWidth: '200px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
  lineHeight: '1.5',
};