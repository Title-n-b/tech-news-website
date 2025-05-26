"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang="th">
      <body className="bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">เกิดข้อผิดพลาดร้ายแรง</h2>

            <p className="text-tech-pale mb-6 leading-relaxed">ขออภัย เกิดข้อผิดพลาดร้ายแรงในระบบ กรุณาลองใหม่อีกครั้ง</p>

            <button
              onClick={reset}
              className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ลองใหม่</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
