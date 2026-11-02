import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, RefreshCw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#100905] text-stone-300 text-sm border-t border-[#2d1c12]">
      {/* Value Proposition Highlights */}
      <div className="border-b border-[#2d1c12] bg-[#160d08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-[#2e1c12] text-[#e0a96d] border border-[#4a2e1e] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Verified Equipment</h4>
              <p className="text-xs text-amber-200/60">Tested & cleaned before every single dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-[#2e1c12] text-[#e0a96d] border border-[#4a2e1e] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Instant Deposit Refund</h4>
              <p className="text-xs text-amber-200/60">Security deposits refunded upon return inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-[#2e1c12] text-[#e0a96d] border border-[#4a2e1e] flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Dedicated Support</h4>
              <p className="text-xs text-amber-200/60">On-call technical assistance throughout rental</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8c4a1e] flex items-center justify-center text-white font-bold shadow-md shadow-[#8c4a1e]/30">
              <Layers className="w-5 h-5 text-amber-100" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Rent<span className="text-[#e0a96d]">Hub</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-amber-100/70">
            India's modern electronic equipment rental marketplace. High-performance laptops, cinema cameras,
            drones, gaming rigs, and audio setups on flexible daily and weekly terms.
          </p>
          <div className="text-xs text-amber-200/50">
            Rich Espresso Theme • MongoDB Atlas Cloud
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Explore Platform</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/equipment" className="hover:text-[#e0a96d] transition text-stone-300">All Equipment Catalog</Link>
            </li>
            <li>
              <Link to="/equipment?category=Cameras & Photography" className="hover:text-[#e0a96d] transition text-stone-300">Cameras & Cinema Gear</Link>
            </li>
            <li>
              <Link to="/equipment?category=Laptops & Computers" className="hover:text-[#e0a96d] transition text-stone-300">Workstations & Laptops</Link>
            </li>
            <li>
              <Link to="/equipment?category=Drones" className="hover:text-[#e0a96d] transition text-stone-300">4K Aerial Drones</Link>
            </li>
            <li>
              <Link to="/equipment?category=Gaming Consoles" className="hover:text-[#e0a96d] transition text-stone-300">Gaming & VR Rigs</Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Company</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/about" className="hover:text-[#e0a96d] transition text-stone-300">About RentHub</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#e0a96d] transition text-stone-300">Customer Help & Support</Link>
            </li>
            <li>
              <Link to="/dashboard/bookings" className="hover:text-[#e0a96d] transition text-stone-300">Track Your Booking</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-[#e0a96d] transition text-stone-300">Administrator Portal</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h5 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Contact Us</h5>
          <div className="flex items-start gap-2.5 text-xs text-stone-300">
            <MapPin className="w-4 h-4 text-[#e0a96d] shrink-0 mt-0.5" />
            <span>100 Innovation Boulevard, Tech Park, Bangalore 560001</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-stone-300">
            <Phone className="w-4 h-4 text-[#e0a96d] shrink-0" />
            <span>+91 98765 43210 / 1800-RENTHUB</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-stone-300">
            <Mail className="w-4 h-4 text-[#e0a96d] shrink-0" />
            <span>support@renthub.com</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#24160e] py-6 text-center text-xs text-amber-200/50">
        <p>© {new Date().getFullYear()} RentHub Inc. All rights reserved. B.Tech Final Year CSE Capstone Demonstration.</p>
      </div>
    </footer>
  );
};

export default Footer;
