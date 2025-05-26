"use client"

import { ArrowRight, TrendingUp } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-tech-navy via-tech-dark to-tech-blue min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] flex items-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-32 h-32 sm:w-72 sm:h-72 bg-tech-light/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-tech-blue/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-tech-light" />
            <span className="text-tech-light font-medium text-sm sm:text-base">ข่าวสารเทคโนโลยีล่าสุด</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            ศูนย์รวม
            <span className="bg-gradient-to-r from-tech-light to-tech-blue bg-clip-text text-transparent">
              {" "}
              ข่าวสาร IT{" "}
            </span>
            ที่ทันสมัย
          </h1>

          <p className="text-tech-pale text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl leading-relaxed">
            ติดตามข่าวสารเทคโนโลยี AI การพัฒนาซอฟต์แวร์ และนวัตกรรมล่าสุด ที่จะเปลี่ยนโลกในอนาคต
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 flex items-center justify-center space-x-2 animate-glow text-sm sm:text-base">
              <span>เริ่มอ่านข่าว</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-tech-light text-tech-light px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-tech-light hover:text-tech-navy transition-all duration-300 text-sm sm:text-base">
              สมัครรับข่าวสาร
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
