import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import AdminNotificationEmail from '@/emails/admin-notification';
import { StoredSubmission } from '@/lib/solicitud/data';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Verify API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Verify staff email is configured
    if (!process.env.RAPICREDIT_STAFF_EMAIL) {
      console.error('RAPICREDIT_STAFF_EMAIL is not configured');
      return NextResponse.json(
        { error: 'Recipient email not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { submission } = body as { submission: StoredSubmission };

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission data is required' },
        { status: 400 }
      );
    }

    const { application, id, submittedAt, progress } = submission;

    // Prepare email data
    const emailData = {
      submissionId: id,
      submittedAt,
      applicantName: application.personal.fullName || 'Sin nombre',
      applicantEmail: application.personal.email,
      applicantPhone: application.personal.phoneCountryCode && application.personal.phoneNumber ? `${application.personal.phoneCountryCode} ${application.personal.phoneNumber}` : undefined,
      applicantCedula: application.personal.cedula,
      loanAmount: application.loan.amount || 0,
      loanTerm: application.loan.term || 0,
      loanPurpose: application.loan.purpose,
      monthlyIncome: application.employment.monthlyIncome,
      employmentStatus: application.employment.status,
      province: '', // Province field removed from form
      district: application.address.fullAddress,
      progress,
      documentsAttached: {
        idFront: !!application.documents.idFront,
        idBack: !!application.documents.idBack,
      },
    };

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'RapiCredit'} <${process.env.EMAIL_FROM_ADDRESS || 'noreply@yourdomain.com'}>`,
      to: [process.env.RAPICREDIT_STAFF_EMAIL],
      subject: `Nueva Solicitud de Préstamo - ${emailData.applicantName} (${emailData.submissionId.slice(-8).toUpperCase()})`,
      react: AdminNotificationEmail(emailData),
    });

    if (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: 'Failed to send notification email', details: error },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data?.id);

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      message: 'Notification sent successfully',
    });

  } catch (error) {
    console.error('Error in send-notification API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}