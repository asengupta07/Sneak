"use client"

import { useState } from "react"

interface NavbarProps {
  variant?: 'home' | 'technical'
  currentPage?: string
}

export default function Navbar({ variant = 'home', currentPage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const homeNavItems = [
    { href: "/how-it-works", label: "How it Works" },
    { href: "#markets", label: "Markets" },
    { href: "#privacy", label: "Privacy" },
    { href: "#contact", label: "Contact" }
  ]

  const technicalNavItems = [
    { href: "/", label: "Home" },
    { href: "#abstract", label: "Technical Paper" },
    { href: "#markets", label: "Markets" },
    { href: "#privacy", label: "Privacy" }
  ]

  const navItems = variant === 'home' ? homeNavItems : technicalNavItems

  return (
    <nav className="flex items-center justify-between px-6 pt-7 relative max-w-7xl mx-auto z-10">
      <div className="text-4xl font-sans">
        <span className="font-serif italic">Sneak</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`font-light transition-colors text-lg ${
              currentPage === item.href
                ? 'text-orange-500 font-medium'
                : 'text-gray-300/60 hover:text-white'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>

      <button className="hidden md:block bg-white text-black hover:bg-gray-200 rounded-[20px] px-6 py-3 font-medium transition-colors">
        Start Scouting
      </button>

      <button
        className="md:hidden w-10 h-10 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-900/80 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {/* {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />} */}
      </button>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white text-2xl hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-3 font-medium transition-colors mt-8"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Scouting
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
