import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the security deposit work?',
    a: 'Security deposits are held securely during the rental duration and are 100% refunded to your original payment method immediately upon inspection when you return the equipment.',
  },
  {
    q: 'How is double booking prevented?',
    a: 'RentHub utilizes atomic MongoDB query filtering to guarantee that two approved or active bookings can never overlap for the same equipment.',
  },
  {
    q: 'Can I extend my rental duration?',
    a: 'Yes, if no subsequent booking has been approved for the next period, you can request an extension directly through your User Dashboard or by contacting our support team.',
  },
  {
    q: 'Do you offer doorstep delivery?',
    a: 'Yes! During checkout, select "Home Delivery" and enter your address. Our verified courier will deliver the sealed equipment right to your door.',
  },
];

const ContactPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast('Thank you for reaching out! A RentHub support specialist will respond within 2 business hours.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">We are here to help</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Get in Touch with RentHub</h1>
        <p className="text-xs sm:text-sm text-amber-200/70">
          Have questions regarding gear availability, enterprise rentals, or custom leasing terms?
        </p>
      </div>

      {/* Contact Cards & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#180f0a] text-white p-8 rounded-3xl space-y-6 shadow-xl border border-[#3b271a]">
            <h3 className="text-lg font-bold text-white">Contact Channels</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#e0a96d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Central Hub & Warehouse</p>
                  <p className="text-stone-300">100 Innovation Boulevard, Tech Park, Bangalore 560001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#e0a96d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Direct Phone</p>
                  <p className="text-stone-300">+91 98765 43210 / Toll-Free 1800-RENTHUB</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#e0a96d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Email Inquiries</p>
                  <p className="text-stone-300">support@renthub.com / rentals@renthub.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#e0a96d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Operating Hours</p>
                  <p className="text-stone-300">Mon - Sun: 8:00 AM – 9:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="lg:col-span-7 bg-[#22160f] p-8 rounded-3xl border border-[#3b271a] shadow-xl space-y-6 text-white">
          <div>
            <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>
            <p className="text-xs text-amber-200/70">Fill in your requirements and our team will get back swiftly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Equipment Inquiry / Bulk Rental / Support"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about the gear you need, dates, or questions..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-semibold text-xs shadow-md shadow-[#9c5221]/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-amber-200/70 mt-1">Quick answers to common rental workflow inquiries</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#22160f] rounded-2xl border border-[#3b271a] overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-white hover:text-[#e0a96d] cursor-pointer transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#e0a96d] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-stone-300 leading-relaxed border-t border-[#3b271a] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
