import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] py-8 px-6 shadow-inner mt-10">
      <div className="mx-0 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="App Logo" className="w-15 h-auto" />
        <img src="/text.png" alt="App Logo" className="w-40 h-auto" />
        </div>

        {/* Center: Navigation Links */}
        <div className="flex gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-black transition">Home</a>
          <a href="#" className="hover:text-black transition">Destinations</a>
          <a href="#" className="hover:text-black transition">Plans</a>
          <a href="#" className="hover:text-black transition">Contact</a>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="hover:text-blue-600 transition">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-sky-500 transition">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-700 transition">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} TravelGenie. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
