import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-8">
          <div className="text-6xl font-bold text-tech-light mb-4">404</div>

          <h2 className="text-2xl font-bold text-white mb-4">ไม่พบหน้าที่ต้องการ</h2>

          <p className="text-tech-pale mb-6 leading-relaxed">ขออภัย หน้าที่คุณกำลังมองหาไม่มีอยู่แล้ว</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>กลับหน้าแรก</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
