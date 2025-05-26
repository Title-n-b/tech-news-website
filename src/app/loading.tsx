import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-12 h-12 text-tech-light animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">กำลังโหลด...</h2>
        <p className="text-tech-pale">กรุณารอสักครู่</p>
      </div>
    </div>
  )
}
