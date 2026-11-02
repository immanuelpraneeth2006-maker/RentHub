import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import EquipmentCard from '../components/EquipmentCard';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Laptop,
  Camera,
  Compass,
  Gamepad2,
  Mic,
  Printer,
  Projector,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Star,
  Users,
} from 'lucide-react';

const categoryIcons = {
  'Laptops & Computers': Laptop,
  'Cameras & Photography': Camera,
  'Drones': Compass,
  'Gaming Consoles': Gamepad2,
  'Audio Equipment': Mic,
  'Projectors': Projector,
  'Printers': Printer,
  'Other Electronics': Sparkles,
};

const HomePage = () => {
  const [featuredEquipments, setFeaturedEquipments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipmentForModal, setSelectedEquipmentForModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          api.get('/equipment', { params: { limit: 6, sort: 'popular' } }),
          api.get('/equipment/categories'),
        ]);

        if (featRes.data?.data) {
          setFeaturedEquipments(featRes.data.data);
        }
        if (catRes.data?.data) {
          setCategories(catRes.data.data);
        }
      } catch (e) {
        console.error('Error loading home data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/equipment?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/equipment');
    }
  };

  return (
    <div className="space-y-20 pb-16 bg-[#140d08] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#120a06] via-[#1c1109] to-[#140d08] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#2d1c12]">
        {/* Warm Bronze Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-[#c27838]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2e1c12] border border-[#52331f] text-[#e0a96d] text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#e0a96d]" />
            <span>Next-Gen Equipment Rental Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Rent Pro Electronics. <br />
            <span className="bg-gradient-to-r from-[#f5d0a6] via-[#e0a96d] to-[#c27838] bg-clip-text text-transparent">
              Zero Commitment. Unlimited Power.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-amber-100/75 text-base sm:text-lg leading-relaxed">
            Access enterprise-grade MacBooks, 4K Cinema Cameras, Drones, Consoles and AV Gear on flexible daily terms. Save up to 90% over retail.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-[#22160f] rounded-2xl p-2 shadow-2xl shadow-[#0a0604]/80 border border-[#422d1f]"
          >
            <div className="pl-3 pr-2 text-[#e0a96d]">
              <Search className="w-5 h-5 text-[#e0a96d]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by gear name, brand (e.g. Sony A7 IV, MacBook, DJI)..."
              className="w-full py-2.5 text-sm text-white focus:outline-none placeholder:text-amber-200/40 bg-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-semibold text-sm transition shrink-0 shadow-md shadow-[#9c5221]/30 cursor-pointer"
            >
              Search Gear
            </button>
          </form>

          {/* Quick Categories pills in hero */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-amber-200/60 font-medium">Popular:</span>
            {['Sony A7 IV', 'MacBook Pro', 'DJI Mini 4 Pro', 'PS5 Console', 'Bose PA'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/equipment?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-[#26170f] hover:bg-[#382317] hover:text-[#f5d0a6] text-amber-100/80 border border-[#422c1e] transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Explore by Category</h2>
            <p className="text-sm text-amber-200/60 mt-1">
              Curated professional inventory across high-demand tech sectors
            </p>
          </div>
          <Link
            to="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e0a96d] hover:text-[#f3c28b] transition"
          >
            View Full Inventory <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.length > 0
            ? categories.map((cat) => {
                const IconComponent = categoryIcons[cat.name] || Sparkles;
                return (
                  <Link
                    key={cat.name}
                    to={`/equipment?category=${encodeURIComponent(cat.name)}`}
                    className="group p-5 bg-[#22160f] rounded-2xl border border-[#3b271a] hover:border-[#c27838]/60 hover:shadow-xl hover:shadow-[#0a0604]/60 transition-all duration-300 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#2e1d14] text-[#e0a96d] group-hover:bg-[#9c5221] group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs border border-[#422c1e]">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#e0a96d] transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-amber-200/60 mt-0.5">
                        {cat.count} {cat.count === 1 ? 'item' : 'items'} available
                      </p>
                    </div>
                  </Link>
                );
              })
            : [
                'Laptops & Computers',
                'Cameras & Photography',
                'Drones',
                'Gaming Consoles',
                'Audio Equipment',
                'Projectors',
                'Printers',
                'Other Electronics',
              ].map((name) => (
                <Link
                  key={name}
                  to={`/equipment?category=${encodeURIComponent(name)}`}
                  className="p-5 bg-[#22160f] rounded-2xl border border-[#3b271a] hover:border-[#c27838]/60 hover:shadow-lg transition flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2e1d14] text-[#e0a96d] flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{name}</h4>
                    <p className="text-xs text-amber-200/60">Rent per day</p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* Featured Equipment Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2e1c12] text-[#e0a96d] text-xs font-bold mb-2 border border-[#4d2f1c]">
              <Award className="w-3.5 h-3.5 text-[#e0a96d]" /> High Demand Gear
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured & Most Rented Equipment</h2>
            <p className="text-sm text-amber-200/60 mt-1">
              Top rated gear chosen by filmmakers, tech studios, developers and gamers
            </p>
          </div>
          <Link
            to="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e0a96d] hover:text-[#f3c28b] transition"
          >
            See All Gear ({featuredEquipments.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading available gear..." />
        ) : featuredEquipments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquipments.map((equipment) => (
              <EquipmentCard
                key={equipment._id}
                equipment={equipment}
                onQuickBook={(item) => setSelectedEquipmentForModal(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#22160f] rounded-2xl border border-[#3b271a]">
            <p className="text-amber-200/60 text-sm">No equipment found.</p>
          </div>
        )}
      </section>

      {/* How RentHub Works Workflow */}
      <section className="bg-[#180f0a] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto relative overflow-hidden border border-[#352215] shadow-2xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">Effortless Process</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">How RentHub Works in 4 Steps</h2>
          <p className="text-amber-200/70 text-sm mt-2">
            No complex paperwork. Safe, swift, transparent equipment rental from checkout to return.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-2xl bg-[#241710] border border-[#3d271b] hover:border-[#c27838]/40 transition">
            <div className="w-10 h-10 rounded-xl bg-[#9c5221] text-white font-extrabold text-base flex items-center justify-center mb-4 shadow-lg shadow-[#9c5221]/30">
              1
            </div>
            <h4 className="font-bold text-base text-white mb-1.5">Pick Your Gear</h4>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              Browse our verified catalog of cameras, laptops, drones and gaming consoles with real-time specs and reviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#241710] border border-[#3d271b] hover:border-[#c27838]/40 transition">
            <div className="w-10 h-10 rounded-xl bg-[#9c5221] text-white font-extrabold text-base flex items-center justify-center mb-4 shadow-lg shadow-[#9c5221]/30">
              2
            </div>
            <h4 className="font-bold text-base text-white mb-1.5">Choose Dates</h4>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              Select rental start and return dates. Our system checks conflicts atomically to guarantee zero double bookings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#241710] border border-[#3d271b] hover:border-[#c27838]/40 transition">
            <div className="w-10 h-10 rounded-xl bg-[#9c5221] text-white font-extrabold text-base flex items-center justify-center mb-4 shadow-lg shadow-[#9c5221]/30">
              3
            </div>
            <h4 className="font-bold text-base text-white mb-1.5">Admin Approval</h4>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              RentHub operations team validates equipment readiness and approves your request with real-time notifications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#241710] border border-[#3d271b] hover:border-[#c27838]/40 transition">
            <div className="w-10 h-10 rounded-xl bg-[#9c5221] text-white font-extrabold text-base flex items-center justify-center mb-4 shadow-lg shadow-[#9c5221]/30">
              4
            </div>
            <h4 className="font-bold text-base text-white mb-1.5">Enjoy & Return</h4>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              Pick up or get delivered. Return when finished and receive instant, full refund of your security deposit.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose RentHub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">Why RentHub</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Engineered for Reliability & Scale</h2>
          <p className="text-amber-200/60 text-sm mt-2">
            Why buy depreciating hardware when you can rent cutting-edge devices on demand?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-sm hover:shadow-xl hover:border-[#c27838]/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-[#2e1d14] text-[#e0a96d] border border-[#422c1e] flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Zero Double Bookings</h3>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              Every equipment rental undergoes server-side date conflict verification. Your gear is reserved exclusively for you.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-sm hover:shadow-xl hover:border-[#c27838]/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-[#2e1d14] text-[#e0a96d] border border-[#422c1e] flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Transparent Pricing</h3>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              No hidden fees. Crystal-clear daily rental rates and 100% refundable security deposits calculated right before you confirm.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-sm hover:shadow-xl hover:border-[#c27838]/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-[#2e1d14] text-[#e0a96d] border border-[#422c1e] flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Dual Portal Ecosystem</h3>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              Dedicated User Dashboard for live booking tracking plus a comprehensive Administrator Command Center for inventory management.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">Real Testimonials</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Trusted by Creators & Developers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#22160f] border border-[#3b271a] shadow-sm">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-amber-100/80 leading-relaxed mb-4">
              "Rented the Sony A7 IV for a 3-day destination wedding shoot. The gear was freshly serviced, packed safely with dual batteries, and the admin approved it within an hour. Incredible service!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Aditi Sen"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#422c1e]"
              />
              <div>
                <h5 className="font-bold text-xs text-white">Aditi Sen</h5>
                <p className="text-[10px] text-amber-200/60">Commercial Photographer</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#22160f] border border-[#3b271a] shadow-sm">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-amber-100/80 leading-relaxed mb-4">
              "Needed a high-end M3 Max MacBook Pro for a hackathon AI model deployment. RentHub delivered it in pristine shape with Xcode and Docker ready to go. Deposit returned the very next day!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Karthik R."
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#422c1e]"
              />
              <div>
                <h5 className="font-bold text-xs text-white">Karthik R.</h5>
                <p className="text-[10px] text-amber-200/60">Full-Stack Engineer</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#22160f] border border-[#3b271a] shadow-sm">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-amber-100/80 leading-relaxed mb-4">
              "The DJI Mini 4 Pro Fly More combo was perfect for our weekend trek. Great flight time and crisp 4K vertical footage for social media reels. Booking process was completely seamless."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Priya Patel"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#422c1e]"
              />
              <div>
                <h5 className="font-bold text-xs text-white">Priya Patel</h5>
                <p className="text-[10px] text-amber-200/60">Content Creator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Signup Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#22160f] via-[#2d1b11] to-[#22160f] border border-[#52331f] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-[#0a0604]/80">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Upgrade Your Next Project?
            </h3>
            <p className="text-amber-100/75 text-sm mt-2">
              Create a free RentHub account today and get instant access to hundreds of verified tech equipment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              Create Free Account
            </Link>
            <Link
              to="/equipment"
              className="px-6 py-3 rounded-xl bg-[#2e1c12] hover:bg-[#3d2719] text-white font-semibold text-sm border border-[#4d2f1c] transition"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedEquipmentForModal && (
        <BookingModal
          equipment={selectedEquipmentForModal}
          isOpen={!!selectedEquipmentForModal}
          onClose={() => setSelectedEquipmentForModal(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
