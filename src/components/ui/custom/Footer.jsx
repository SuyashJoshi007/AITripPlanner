import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] py-10 px-6 shadow-inner mt-10">
      
      {/* Top Section: Logo, Nav & Social */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-6 max-w-7xl mx-auto">
        
        {/* Left: Logo & Description */}
        <div className="flex flex-col md:flex-row items-start  gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="App Logo" className="w-10 h-auto" />
            <img src="/text.png" alt="App Logo" className="w-36 h-auto" />
          </div>
          <p className="mt-2 md:mt-0 text-gray-500 text-sm max-w-xs">
            Explore the world with TravelGenie. Your journey starts here!
          </p>
        </div>

        {/* Center: Navigation & Resources */}
        <div className="flex flex-col md:flex-row gap-10 text-gray-600 text-sm">
          
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-800">Quick Links</h3>
            <a href="#" className="hover:text-black transition">Home</a>
            <a href="#" className="hover:text-black transition">Destinations</a>
            <a href="#" className="hover:text-black transition">Plans</a>
            <a href="#" className="hover:text-black transition">Contact</a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-800">Resources</h3>
            <a href="#" className="hover:text-black transition">Blog</a>
            <a href="#" className="hover:text-black transition">Support</a>
            <a href="#" className="hover:text-black transition">FAQ</a>
          </div>

        </div>

        {/* Right: Social & Newsletter */}
        <div className="flex flex-col gap-4">
          {/* Social Icons */}
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
            <a href="#" aria-label="YouTube" className="hover:text-red-600 transition">
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-800 text-sm">Subscribe to our Newsletter</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Copyright */}
      <div className="text-center text-xs text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} TravelGenie. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
