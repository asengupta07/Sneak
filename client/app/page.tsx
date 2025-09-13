"use client"

import { useState } from "react"
import Navbar from "./components/Navbar"
// import { Instagram, Twitter, Linkedin, Menu, X } from "lucide-react"

//uncomment the icons

export default function StartupSprintLanding() {
  const [email, setEmail] = useState("")

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
      <Navbar variant="home" />

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
          <span className="text-gray-100/90 font-light leading-relaxed text-base">2.4K scouts ready to discover opportunities</span>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8 ">
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight text-white mb-2">Spot the Future.</h1>
          <h2 className="text-5xl md:text-8xl font-semibold tracking-tight text-white/80">Stake. Chain. Earn.</h2>
        </div>

        {/* Subtext */}
        <p className="text-white/50 text-lg md:text-2xl text-center tracking-tight max-w-2xl mb-12">
          Profit from discovering the next big thing.
          <br />
          Music, research, startups – bet on what you know.
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
    Start Discovering
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