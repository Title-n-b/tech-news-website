"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">เกิดข้อผิดพลาด</h2>

          <p className="text-tech-pale mb-6 leading-relaxed">ขออภัย เกิดข้อผิดพลาดในการแสดงผลหน้าเว็บ กรุณาลองใหม่อีกครั้ง</p>

          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-400 text-sm font-mono">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ลองใหม่</span>
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="border border-tech-light text-tech-light px-6 py-3 rounded-lg font-medium hover:bg-tech-light hover:text-tech-navy transition-all duration-300"
            >
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
