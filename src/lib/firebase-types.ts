// Firebase-specific types
export interface FirebaseConfig {
  projectId: string
  authDomain: string
  storageBucket: string
  apiKey: string
  messagingSenderId: string
  appId: string
}

export interface FirebaseTestResult {
  success: boolean
  error?: string
  details?: {
    message?: string
    stack?: string
    suggestion?: string
    missingVars?: string[]
    initializationError?: string
  }
}

export interface FirestoreRulesCheck {
  hasRules: boolean
  suggestion?: string
}

export interface FirebaseError {
  code: string
  message: string
  name: string
}

export interface ConnectionTestDetails {
  writeTest?: boolean
  readTest?: boolean
  deleteTest?: boolean
  timestamp?: string
}

// Environment variables interface
export interface FirebaseEnvVars {
  NEXT_PUBLIC_FIREBASE_API_KEY: boolean
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: boolean
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: boolean
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: boolean
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: boolean
  NEXT_PUBLIC_FIREBASE_APP_ID: boolean
}
