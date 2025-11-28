import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol'
  }).format(amount).replace('US$', 'B/.')
}

export function formatPhoneNumber(phone: string): string {
  // Format Panama phone numbers to +507 XXXX-XXXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('507') && cleaned.length === 10) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termInMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
    (Math.pow(1 + monthlyRate, termInMonths) - 1)
  return isNaN(payment) ? 0 : payment
}

export function validateCedula(cedula: string): boolean {
  // Basic Panama cedula validation (format: X-XXX-XXXX)
  const cedulaRegex = /^\d{1,2}-\d{3,4}-\d{4}$/
  return cedulaRegex.test(cedula)
}