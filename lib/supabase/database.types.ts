export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      loan_applications: {
        Row: {
          id: string
          session_id: string
          created_at: string
          updated_at: string
          status: string
          // Personal Information
          full_name: string
          cedula: string
          email: string
          phone_country_code: string
          custom_country_code: string | null
          phone_number: string
          date_of_birth: string
          marital_status: string
          dependents: number
          // Loan Details
          loan_amount: number
          loan_term: number
          loan_purpose: string
          loan_comments: string | null
          // Address Information
          full_address: string
          property_type: string
          // Employment Information
          employment_status: string
          company_name: string | null
          custom_company_name: string | null
          job_role: string | null
          monthly_income: number
          extra_income: number
          employment_length: string
          // Documents
          id_front_image: string | null
          id_back_image: string | null
          work_letter_image: string | null
          // Consent
          privacy_accepted: boolean
          marketing_accepted: boolean
          // Metadata
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
        }
        Insert: {
          id?: string
          session_id: string
          created_at?: string
          updated_at?: string
          status?: string
          // Personal Information
          full_name: string
          cedula: string
          email: string
          phone_country_code: string
          custom_country_code?: string | null
          phone_number: string
          date_of_birth: string
          marital_status: string
          dependents?: number
          // Loan Details
          loan_amount: number
          loan_term: number
          loan_purpose: string
          loan_comments?: string | null
          // Address Information
          full_address: string
          property_type: string
          // Employment Information
          employment_status: string
          company_name?: string | null
          custom_company_name?: string | null
          job_role?: string | null
          monthly_income: number
          extra_income?: number
          employment_length: string
          // Documents
          id_front_image?: string | null
          id_back_image?: string | null
          work_letter_image?: string | null
          // Consent
          privacy_accepted: boolean
          marketing_accepted?: boolean
          // Metadata
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          created_at?: string
          updated_at?: string
          status?: string
          // Personal Information
          full_name?: string
          cedula?: string
          email?: string
          phone_country_code?: string
          custom_country_code?: string | null
          phone_number?: string
          date_of_birth?: string
          marital_status?: string
          dependents?: number
          // Loan Details
          loan_amount?: number
          loan_term?: number
          loan_purpose?: string
          loan_comments?: string | null
          // Address Information
          full_address?: string
          property_type?: string
          // Employment Information
          employment_status?: string
          company_name?: string | null
          custom_company_name?: string | null
          job_role?: string | null
          monthly_income?: number
          extra_income?: number
          employment_length?: string
          // Documents
          id_front_image?: string | null
          id_back_image?: string | null
          work_letter_image?: string | null
          // Consent
          privacy_accepted?: boolean
          marketing_accepted?: boolean
          // Metadata
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
      }
      application_status_history: {
        Row: {
          id: string
          application_id: string
          status: string
          changed_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          status: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          status?: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      email_notifications: {
        Row: {
          id: string
          application_id: string
          email_type: string
          recipient_email: string
          subject: string
          status: string
          resend_message_id: string | null
          error_message: string | null
          created_at: string
          sent_at: string | null
        }
        Insert: {
          id?: string
          application_id: string
          email_type: string
          recipient_email: string
          subject: string
          status?: string
          resend_message_id?: string | null
          error_message?: string | null
          created_at?: string
          sent_at?: string | null
        }
        Update: {
          id?: string
          application_id?: string
          email_type?: string
          recipient_email?: string
          subject?: string
          status?: string
          resend_message_id?: string | null
          error_message?: string | null
          created_at?: string
          sent_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}