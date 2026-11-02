import React from 'react';
import { ShieldCheck, RefreshCw, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-white">
      {/* Hero Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">About RentHub</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Democratizing Access to Professional Hardware & Electronics
        </h1>
        <p className="text-sm text-stone-300 leading-relaxed">
          RentHub was conceived with a clear vision: empower creators, software engineers, studios, and businesses with on-demand access to high-end equipment without burdensome capital expenditure.
        </p>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#180f0a] text-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-[#3b271a]">
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-[#e0a96d]">500+</div>
          <div className="text-xs text-stone-400 font-medium">Verified Gear Units</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-300">12,000+</div>
          <div className="text-xs text-stone-400 font-medium">Successful Rentals</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-200">4.9 / 5</div>
          <div className="text-xs text-stone-400 font-medium">Average User Rating</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-400">100%</div>
          <div className="text-xs text-stone-400 font-medium">Deposit Refund Rate</div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Our Core Principles</h2>
          <p className="text-xs text-amber-200/70 mt-1">What sets RentHub apart in equipment leasing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-lg hover:border-[#9c5221]/60 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-[#e0a96d] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Uncompromising Quality</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every camera, drone, laptop, and console undergoes an 18-point diagnostic inspection prior to dispatch. All firmware and sanitization are rigorously refreshed.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-lg hover:border-[#9c5221]/60 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-[#e0a96d] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Real-Time Reliability</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Double-booking is eliminated at the database level. Our date overlap algorithm protects every booking request so your project schedule never slips.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-lg hover:border-[#9c5221]/60 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-[#e0a96d] flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Fair & Flexible Terms</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Clear security deposits, zero penalizing hidden clauses, and immediate refunds upon safe check-in of rental equipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
