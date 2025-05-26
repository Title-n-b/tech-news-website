"use client";

import { useState } from "react";
import { Menu, X, Search, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-tech-navy/95 backdrop-blur-md border-b border-tech-blue/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://img.icons8.com/?size=100&id=lIabI5WM659d&format=png&color=000000"
              alt="TechNews Logo"
              width={32}
              height={32}
              className="rounded-lg object-cover"
            />
            <span className="text-white font-tech font-bold text-xl">
              TechNews
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a
              href="#"
              className="text-tech-pale hover:text-tech-light transition-colors text-sm xl:text-base"
            >
              หน้าแรก
            </a>
            <a
              href="#"
              className="text-tech-pale hover:text-tech-light transition-colors text-sm xl:text-base"
            >
              ข่าวล่าสุด
            </a>
            <a
              href="#"
              className="text-tech-pale hover:text-tech-light transition-colors text-sm xl:text-base"
            >
              เทคโนโลยี
            </a>
            <a
              href="#"
              className="text-tech-pale hover:text-tech-light transition-colors text-sm xl:text-base"
            >
              AI & ML
            </a>
            <a
              href="#"
              className="text-tech-pale hover:text-tech-light transition-colors text-sm xl:text-base"
            >
              การพัฒนา
            </a>
            <a
              href="#"
              className="text-tech-pale hover:text-tech-light transition-colors text-sm xl:text-base"
            >
              รีวิว
            </a>
          </nav>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tech-pale w-4 h-4" />
              <input
                type="text"
                placeholder="ค้นหาข่าว..."
                className="bg-tech-dark/50 border border-tech-blue/30 rounded-lg pl-10 pr-4 py-2 text-sm text-tech-pale placeholder-tech-pale/60 focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light w-40 lg:w-48 xl:w-56"
              />
            </div>
            <button className="text-tech-pale hover:text-tech-light transition-colors p-2">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Mobile Search Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button className="text-tech-pale hover:text-tech-light transition-colors p-2">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-tech-pale hover:text-tech-light transition-colors p-2">
              <Bell className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-tech-pale ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-tech-blue/20">
            {/* Mobile Search */}
            <div className="mb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tech-pale w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาข่าว..."
                  className="w-full bg-tech-dark/50 border border-tech-blue/30 rounded-lg pl-10 pr-4 py-2 text-tech-pale placeholder-tech-pale/60 focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors py-2 border-b border-tech-blue/10"
              >
                หน้าแรก
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors py-2 border-b border-tech-blue/10"
              >
                ข่าวล่าสุด
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors py-2 border-b border-tech-blue/10"
              >
                เทคโนโลยี
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors py-2 border-b border-tech-blue/10"
              >
                AI & ML
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors py-2 border-b border-tech-blue/10"
              >
                การพัฒนา
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors py-2"
              >
                รีวิว
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
