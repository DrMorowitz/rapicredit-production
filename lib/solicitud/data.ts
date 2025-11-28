export type LoanApplication = {
  personal: {
    fullName: string
    cedula: string
    email: string
    phoneCountryCode: string
    customCountryCode?: string
    phoneNumber: string
    dateOfBirth: string
    maritalStatus: 'soltero' | 'casado' | 'union_libre' | 'divorciado' | 'viudo' | ''
    dependents: number
  }
  loan: {
    amount: number
    term: number
    purpose:
      | 'deuda'
      | 'negocio'
      | 'hogar'
      | 'educacion'
      | 'salud'
      | 'viajes'
      | 'otro'
      | ''
    comments: string
  }
  address: {
    fullAddress: string
    propertyType: 'alquilado' | 'hipotecado' | 'comprado' | 'dependiente' | ''
  }
  employment: {
    status: 'sector_privado' | 'sector_gobierno' | 'independiente' | 'jubilado' | ''
    companyName: string
    customCompanyName?: string
    role: string
    monthlyIncome: number
    extraIncome: number
    employmentLength: string
  }
  documents: {
    idFront?: string
    idBack?: string
    workLetter?: string
  }
  consent: {
    privacyAccepted: boolean
    marketingAccepted: boolean
  }
}

export type SessionMetadata = {
  sessionId: string
  createdAt: string
  lastSeenAt: string
  utm: Record<string, string>
  landingPage: string
  referrer?: string
  userAgent?: string
}

export const defaultApplication: LoanApplication = {
  personal: {
    fullName: '',
    cedula: '',
    email: '',
    phoneCountryCode: '+507',
    phoneNumber: '',
    dateOfBirth: '',
    maritalStatus: '',
    dependents: 0,
  },
  loan: {
    amount: 0,
    term: 0,
    purpose: '',
    comments: '',
  },
  address: {
    fullAddress: '',
    propertyType: '',
  },
  employment: {
    status: '',
    companyName: '',
    role: '',
    monthlyIncome: 0,
    extraIncome: 0,
    employmentLength: '',
  },
  documents: {},
  consent: {
    privacyAccepted: false,
    marketingAccepted: false,
  },
}

export type Province =
  | 'Bocas del Toro'
  | 'Chiriquí'
  | 'Coclé'
  | 'Colón'
  | 'Darién'
  | 'Herrera'
  | 'Los Santos'
  | 'Panamá'
  | 'Panamá Oeste'
  | 'Veraguas'
  | 'Guna Yala'
  | 'Emberá'
  | 'Ngäbe-Buglé'

export const provinces: Record<Province, string[]> = {
  'Bocas del Toro': ['Bocas del Toro', 'Changuinola', 'Chiriquí Grande'],
  Chiriquí: ['David', 'Barú', 'Boquerón', 'Boquete', 'Bugaba', 'Dolega', 'Gualaca', 'Renacimiento', 'San Félix', 'San Lorenzo', 'Tierras Altas'],
  Coclé: ['Aguadulce', 'Antón', 'La Pintada', 'Natá', 'Olá', 'Penonomé'],
  Colón: ['Colón', 'Chagres', 'Donoso', 'Portobelo', 'Santa Isabel'],
  Darién: ['Chepigana', 'Pinogana', 'Santa Fe'],
  Herrera: ['Chitré', 'Las Minas', 'Los Pozos', 'Ocú', 'Parita', 'Pesé', 'Santa María'],
  'Los Santos': ['Guararé', 'Las Tablas', 'Los Santos', 'Macaracas', 'Pedasí', 'Pocrí', 'Tonosí'],
  Panamá: ['Panamá', 'San Miguelito', 'Chepo', 'Chimán', 'Balboa', 'Taboga'],
  'Panamá Oeste': ['Arraiján', 'Capira', 'Chame', 'La Chorrera', 'San Carlos'],
  Veraguas: ['Atalaya', 'Calobre', 'Cañazas', 'La Mesa', 'Las Palmas', 'Montijo', 'Río de Jesús', 'San Francisco', 'Santa Fe', 'Santiago', 'Soná'],
  'Guna Yala': ['Ailigandí', 'Narganá', 'Puerto Obaldía', 'Tubualá'],
  Emberá: ['Cémaco', 'Sambú'],
  'Ngäbe-Buglé': ['Besikó', 'Jirondai', 'Kankintú', 'Kusapín', 'Mironó', 'Müna', 'Nole Düima', 'Ñürüm'],
}

export const countryOptions = [
  { label: '🇵🇦 Panamá (+507)', value: '+507' },
  { label: '🇺🇸 Estados Unidos (+1)', value: '+1' },
  { label: '🇨🇷 Costa Rica (+506)', value: '+506' },
  { label: '🇨🇴 Colombia (+57)', value: '+57' },
  { label: '🇲🇽 México (+52)', value: '+52' },
  { label: '🇻🇪 Venezuela (+58)', value: '+58' },
  { label: '🇪🇸 España (+34)', value: '+34' },
  { label: '🇩🇴 República Dominicana (+1849)', value: '+1849' },
  { label: '🇪🇨 Ecuador (+593)', value: '+593' },
  { label: '🇵🇪 Perú (+51)', value: '+51' },
  { label: '🇦🇷 Argentina (+54)', value: '+54' },
  { label: '🇨🇱 Chile (+56)', value: '+56' },
  { label: '🇧🇷 Brasil (+55)', value: '+55' },
  { label: '🇳🇮 Nicaragua (+505)', value: '+505' },
  { label: '🇭🇳 Honduras (+504)', value: '+504' },
  { label: '🇬🇹 Guatemala (+502)', value: '+502' },
  { label: '🇸🇻 El Salvador (+503)', value: '+503' },
  { label: '🇧🇿 Belice (+501)', value: '+501' },
  { label: '🇨🇦 Canadá (+1)', value: '+1CA' },
  { label: '🇫🇷 Francia (+33)', value: '+33' },
  { label: '🇩🇪 Alemania (+49)', value: '+49' },
  { label: '🇮🇹 Italia (+39)', value: '+39' },
  { label: '🇬🇧 Reino Unido (+44)', value: '+44' },
  { label: '🇯🇵 Japón (+81)', value: '+81' },
  { label: '🇰🇷 Corea del Sur (+82)', value: '+82' },
  { label: '🇨🇳 China (+86)', value: '+86' },
  { label: '🇮🇳 India (+91)', value: '+91' },
  { label: '🇦🇺 Australia (+61)', value: '+61' },
  { label: '📞 Otro país', value: '+OTHER' },
]

export type SubmissionStatus = 'incomplete' | 'completed'

export type StoredSubmission = {
  id: string
  submittedAt: string
  status: SubmissionStatus
  progress: number
  application: LoanApplication
  session: SessionMetadata
}

export const STORAGE_KEY = 'rapicredit:application'
export const SUBMISSIONS_KEY = 'rapicredit:submissions'
export const SESSION_KEY = 'rapicredit:session'

