"use client"

import { useState } from "react"
// import { Instagram, Twitter, Linkedin, Menu, X } from "lucide-react"

//uncomment the icons

export default function StartupSprintLanding() {
  const [email, setEmail] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle email submission
    console.log("Email submitted:", email)
  }

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 pt-7 relative max-w-7xl mx-auto z-10">
        <div className="text-4xl font-sans">
          <span className="font-extralight">Startup</span>
          <span className="font-serif italic">Sprint</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300/60 hover:text-white font-light transition-colors text-lg">
            Features
          </a>
          <a href="#" className="text-gray-300/60 hover:text-white font-light transition-colors text-lg">
            About
          </a>
          <a href="#" className="text-gray-300/60 hover:text-white font-light transition-colors text-lg">
            Newsletter
          </a>
          <a href="#" className="text-gray-300/60 hover:text-white font-light transition-colors text-lg">
            Contact
          </a>
        </div>

       
       <button className="hidden md:block bg-white text-black hover:bg-gray-200 rounded-[20px] px-6 py-3 font-medium transition-colors">
          Join The Waitlist
        </button>

        <button
          className="md:hidden w-10 h-10 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-900/80 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />} */}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
            <a
              href="#"
              className="text-white text-2xl hover:text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#"
              className="text-white text-2xl hover:text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#"
              className="text-white text-2xl hover:text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Newsletter
            </a>
            <a
              href="#"
              className="text-white text-2xl hover:text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <button
              className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-3 font-medium transition-colors mt-8"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join The Waitlist
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 relative z-10">
        {/* Waitlist Badge */}
        <div className="flex items-center bg-white/10 rounded-[15px] px-4 py-[6px]  mb-3 mt-10">
          <div className="flex -space-x-1 mr-5 -translate-x-2">
            <div className="w-8 h-8 rounded-xl ">
                <img src="https://i.pinimg.com/736x/0f/37/44/0f37449ce43858738a05f56e82ac6398.jpg" alt="" className="rounded-[10px] w-8 h-8 object-cover" />
            </div>
            <div className="w-8 h-8 rounded-xl  ">
                <img src="https://i.pinimg.com/1200x/2a/0b/22/2a0b2216788c4e596c594d27dfae3139.jpg" alt="" className="rounded-[10px] w-8 h-8 object-cover" />
            </div>
            <div className="w-8 h-8 rounded-xl ">
                <img src="https://i.pinimg.com/1200x/23/b6/31/23b631a3e21f6d88cfae17dd9269f67e.jpg" alt="" className="rounded-[10px] w-8 h-8 object-cover" />
            </div>
            <div className="w-8 h-8 rounded-xl  ">
                <img src="https://i.pinimg.com/1200x/23/9e/0d/239e0dd769817cd9c4ec3caaa01fd191.jpg" alt="" className="rounded-[10px] w-8 h-8 object-cover" />
            </div>
          </div>
          <span className="text-gray-100/90 font-light leading-relaxed text-base">2.4K currently on the waitlist</span>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8 ">
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight text-white mb-2">Building the Future</h1>
          <h2 className="text-5xl md:text-8xl font-semibold tracking-tight text-white/80">One Startup at a Time.</h2>
        </div>

        {/* Subtext */}
        <p className="text-white/50 text-lg md:text-2xl text-center tracking-tight max-w-2xl mb-12">
          Be the first to know when we launch.
          <br />
          Join the waitlist and get exclusive early access.
        </p>

        {/* Email Signup */}
<form
  onSubmit={handleSubmit}
  className="w-full max-w-md relative"
>
  <input
    type="email"
    placeholder="Enter Your Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="bg-white/10 text-white placeholder-gray-400 rounded-3xl px-6 py-5 pr-32 focus:border-white focus:ring-white focus:outline-none w-full"
    required
  />
  <button
    type="submit"
    className="absolute right-1 top-1 bottom-1 bg-white text-black hover:bg-gray-200 rounded-3xl px-6 font-medium transition-colors"
  >
    Join The Waitlist
  </button>
</form>


        {/* Social Icons */}
        <div className="flex items-center space-x-4 mt-8">
          <a
            href="#"
            className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-gray-900/80 transition-colors"
          >
            <img src="https://i.postimg.cc/Qt4DwvDH/instagram-1.png" className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-gray-900/80 transition-colors"
          >
            <img src="https://i.postimg.cc/HLTCxTsr/twitter.png" className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-gray-900/80 transition-colors"
          >
            <img src="https://i.postimg.cc/wvv8XFNH/linkedin.png" className="w-5 h-5 " />
          </a>
        </div>
      </div>
    </div>
  )
}