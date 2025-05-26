"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  isFirebaseAvailable,
  testFirebaseConnection,
  getFirebaseConfig,
  checkFirestoreRules,
  initializationError,
} from "@/lib/firebase"
import type { FirebaseConfig, FirebaseTestResult, FirestoreRulesCheck, FirebaseEnvVars } from "@/lib/firebase-types"

type ConnectionStatus = "testing" | "success" | "failed"

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("testing")
  const [testResult, setTestResult] = useState<FirebaseTestResult | null>(null)
  const [envVars, setEnvVars] = useState<FirebaseEnvVars>({
    NEXT_PUBLIC_FIREBASE_API_KEY: false,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: false,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: false,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: false,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: false,
    NEXT_PUBLIC_FIREBASE_APP_ID: false,
  })
  const [firebaseInfo, setFirebaseInfo] = useState<FirebaseConfig | null>(null)
  const [rulesCheck, setRulesCheck] = useState<FirestoreRulesCheck | null>(null)

  useEffect(() => {
    checkEnvironmentVariables()
    testConnection()
    checkRules()
  }, [])

  const checkEnvironmentVariables = () => {
    // ตรวจสอบแบบเดียวกับใน firebase.ts
    const vars: FirebaseEnvVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY.trim() !== ""
      ),
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!(
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.trim() !== ""
      ),
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!(
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.trim() !== ""
      ),
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!(
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.trim() !== ""
      ),
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!(
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.trim() !== ""
      ),
      NEXT_PUBLIC_FIREBASE_APP_ID: !!(
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID && process.env.NEXT_PUBLIC_FIREBASE_APP_ID.trim() !== ""
      ),
    }
    setEnvVars(vars)

    // แสดงค่าจริงใน console สำหรับ debug
    console.log("🔍 Debug - Environment Variables:")
    Object.entries(vars).forEach(([key, exists]) => {
      const value = process.env[key as keyof typeof process.env]
      console.log(`${key}: ${exists ? "✅" : "❌"} ${value ? `(${value.substring(0, 15)}...)` : "(empty)"}`)
    })

    const config = getFirebaseConfig()
    if (config) {
      setFirebaseInfo(config)
    }
  }

  const testConnection = async () => {
    setConnectionStatus("testing")
    setTestResult(null)

    try {
      const result = await testFirebaseConnection()
      setTestResult(result)
      setConnectionStatus(result.success ? "success" : "failed")
    } catch (error) {
      console.error("Connection test error:", error)
      setConnectionStatus("failed")
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const checkRules = async () => {
    try {
      const result = await checkFirestoreRules()
      setRulesCheck(result)
    } catch (error) {
      console.error("Rules check error:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("คัดลอกแล้ว!")
  }

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">Firebase Debug Information</h1>

        {/* Initialization Error */}
        {initializationError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Initialization Error</h2>
            <p className="text-red-300 font-mono text-sm">{initializationError}</p>
          </div>
        )}

        {/* Environment Variables */}
        <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span>Environment Variables</span>
          </h2>

          <div className="space-y-3">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-tech-pale font-mono text-sm">{key}</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={value} />
                  <span className={`text-sm ${value ? "text-green-400" : "text-red-400"}`}>
                    {value ? "Found" : "Missing"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {Object.values(envVars).some((v) => !v) && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">❌ บาง environment variables ขาดหายไป กรุณาตรวจสอบไฟล์ .env.local</p>
            </div>
          )}
        </div>

        {/* Firebase Configuration */}
        {firebaseInfo && (
          <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Firebase Configuration</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-tech-pale">Project ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono">{firebaseInfo.projectId}</span>
                  <button
                    onClick={() => copyToClipboard(firebaseInfo.projectId)}
                    className="text-tech-light hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-tech-pale">Auth Domain:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono">{firebaseInfo.authDomain}</span>
                  <button
                    onClick={() => copyToClipboard(firebaseInfo.authDomain)}
                    className="text-tech-light hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-tech-pale">Storage Bucket:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono">{firebaseInfo.storageBucket}</span>
                  <button
                    onClick={() => copyToClipboard(firebaseInfo.storageBucket)}
                    className="text-tech-light hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <a
                href={`https://console.firebase.google.com/project/${firebaseInfo.projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-tech-blue hover:bg-tech-light text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิด Firebase Console</span>
              </a>
              <a
                href={`https://console.firebase.google.com/project/${firebaseInfo.projectId}/firestore`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิด Firestore</span>
              </a>
            </div>
          </div>
        )}

        {/* Connection Test */}
        <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
            <span>Connection Test</span>
            <button
              onClick={testConnection}
              className="bg-tech-blue hover:bg-tech-light text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Test Again</span>
            </button>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {connectionStatus === "testing" && (
                <>
                  <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />
                  <span className="text-yellow-400">Testing connection...</span>
                </>
              )}
              {connectionStatus === "success" && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">✅ Firebase connection successful!</span>
                </>
              )}
              {connectionStatus === "failed" && (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">❌ Firebase connection failed</span>
                </>
              )}
            </div>

            {testResult && !testResult.success && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 font-medium mb-2">Error Details:</p>
                <p className="text-red-300 text-sm font-mono mb-2">{testResult.error}</p>
                {testResult.details?.suggestion && (
                  <p className="text-yellow-300 text-sm">💡 {testResult.details.suggestion}</p>
                )}
                {testResult.details?.message && testResult.details.message !== testResult.error && (
                  <p className="text-red-300/80 text-xs font-mono mt-2">Technical: {testResult.details.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Firestore Rules Check */}
        {rulesCheck && (
          <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Firestore Security Rules</h2>
            <div className="flex items-center space-x-3 mb-4">
              <StatusIcon status={rulesCheck.hasRules} />
              <span className={`${rulesCheck.hasRules ? "text-green-400" : "text-red-400"}`}>
                {rulesCheck.hasRules ? "Rules configured" : "Rules may need configuration"}
              </span>
            </div>
            {rulesCheck.suggestion && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">💡 {rulesCheck.suggestion}</p>
              </div>
            )}
          </div>
        )}

        {/* Status Summary */}
        <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Status Summary</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-tech-pale">Firebase Available:</span>
              <div className="flex items-center space-x-2">
                <StatusIcon status={isFirebaseAvailable} />
                <span className={`text-sm ${isFirebaseAvailable ? "text-green-400" : "text-red-400"}`}>
                  {isFirebaseAvailable ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-tech-pale">Database Connection:</span>
              <div className="flex items-center space-x-2">
                <StatusIcon status={connectionStatus === "success"} />
                <span
                  className={`text-sm ${
                    connectionStatus === "success"
                      ? "text-green-400"
                      : connectionStatus === "failed"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {connectionStatus === "success" ? "Connected" : connectionStatus === "failed" ? "Failed" : "Testing"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-tech-pale">Admin Panel:</span>
              <div className="flex items-center space-x-2">
                <StatusIcon status={isFirebaseAvailable || connectionStatus !== "failed"} />
                <span
                  className={`text-sm ${
                    isFirebaseAvailable || connectionStatus !== "failed" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isFirebaseAvailable || connectionStatus !== "failed" ? "Available" : "Limited"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Troubleshooting Guide</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-tech-light font-medium mb-2">1. ตรวจสอบ Firebase Project</h3>
              <ul className="text-tech-pale space-y-1 ml-4">
                <li>• เปิด Firebase Console และตรวจสอบว่า Project มีอยู่จริง</li>
                <li>• ตรวจสอบว่า Firestore Database ถูกเปิดใช้งานแล้ว</li>
                <li>• ตรวจสอบว่า Storage ถูกเปิดใช้งานแล้ว</li>
              </ul>
            </div>
            <div>
              <h3 className="text-tech-light font-medium mb-2">2. ตรวจสอบ Security Rules</h3>
              <ul className="text-tech-pale space-y-1 ml-4">
                <li>• ไปที่ Firestore  Rules</li>
                <li>• ตั้งค่า Rules สำหรับ development:</li>
              </ul>
              <div className="bg-tech-dark/50 rounded-lg p-3 mt-2 font-mono text-xs">
                <code className="text-green-300">
                  {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ สำหรับ development เท่านั้น
    }
  }
}`}
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-tech-light font-medium mb-2">3. ตรวจสอบ Environment Variables</h3>
              <ul className="text-tech-pale space-y-1 ml-4">
                <li>• ตรวจสอบว่าไฟล์ .env.local อยู่ใน root directory</li>
                <li>• ตรวจสอบว่าไม่มีช่องว่างหรือเครื่องหมายพิเศษ</li>
                <li>• รีสตาร์ท development server หลังแก้ไข .env.local</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/admin"
            className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300"
          >
            ไปหน้า Admin
          </Link>
          <Link
            href="/"
            className="border border-tech-light text-tech-light px-6 py-3 rounded-lg font-medium hover:bg-tech-light hover:text-tech-navy transition-all duration-300"
          >
            กลับหน้าแรก
          </Link>
          {firebaseInfo && (
            <a
              href={`https://console.firebase.google.com/project/${firebaseInfo.projectId}/firestore/rules`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ตั้งค่า Firestore Rules
            </a>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
