import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Star,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowLeft,
  MapPin,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

const EquipmentDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/equipment/${id}`);
        if (res.data?.data) {
          setEquipment(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading equipment specifications..." />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 text-center bg-[#22160f] rounded-2xl border border-[#3b271a] text-white shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2">Equipment Not Found</h2>
        <p className="text-xs text-amber-200/70 mb-6">
          The requested equipment item does not exist or may have been removed.
        </p>
        <Link
          to="/equipment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9c5221] text-white font-semibold text-xs hover:bg-[#b86328] transition shadow-md shadow-[#9c5221]/30"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Equipment Catalog
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    category,
    brand,
    modelNumber,
    images = [],
    specifications = [],
    dailyPrice,
    securityDeposit = 0,
    condition = 'Like New',
    isAvailable,
    averageRating = 5.0,
    numReviews = 0,
    reviews = [],
    bookedRanges = [],
    location = 'Main Hub',
  } = equipment;

  const currentImage =
    images.length > 0
      ? images[activeImageIndex]?.startsWith('http') || images[activeImageIndex]?.startsWith('/uploads')
        ? images[activeImageIndex]
        : `http://localhost:5000${images[activeImageIndex]}`
      : 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-white">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-amber-200/70">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/equipment" className="hover:text-white transition">Equipment</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/equipment?category=${encodeURIComponent(category)}`} className="hover:text-white transition">
          {category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium truncate max-w-xs">{name}</span>
      </nav>

      {/* Main Grid: Gallery on left, Pricing & Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-[#180f0a] border border-[#3b271a] shadow-lg">
            <img
              src={currentImage}
              alt={name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Badges on main image */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1c130d]/90 text-amber-200 border border-[#3b271a] shadow-sm backdrop-blur">
                {category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#9c5221] text-white shadow-sm">
                {condition}
              </span>
            </div>
            <div className="absolute bottom-4 right-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${
                  isAvailable ? 'bg-emerald-600/90 text-white' : 'bg-rose-600/90 text-white'
                }`}
              >
                {isAvailable ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {isAvailable ? 'Available for Rent' : 'Unavailable'}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => {
                const src = img.startsWith('http') || img.startsWith('/uploads') ? img : `http://localhost:5000${img}`;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#e0a96d] ring-2 ring-[#e0a96d]/40'
                        : 'border-[#3b271a] hover:border-[#5a3824]'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Description */}
          <div className="bg-[#22160f] p-6 rounded-3xl border border-[#3b271a] shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white">Equipment Overview</h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
              {description}
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-200/70 pt-2 border-t border-[#3b271a]">
              <MapPin className="w-4 h-4 text-[#e0a96d]" />
              <span>Available for pickup / dispatch from: <strong className="text-white">{location}</strong></span>
            </div>
          </div>

          {/* Specifications Table */}
          {specifications && specifications.length > 0 && (
            <div className="bg-[#22160f] p-6 rounded-3xl border border-[#3b271a] shadow-lg space-y-4">
              <h3 className="text-base font-bold text-white">Technical Specifications</h3>
              <div className="overflow-hidden border border-[#3b271a] rounded-2xl">
                <table className="min-w-full divide-y divide-[#3b271a] text-xs">
                  <tbody className="divide-y divide-[#3b271a]">
                    {specifications.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#180f0a]' : 'bg-[#22160f]'}>
                        <td className="px-4 py-3 font-semibold text-amber-200/90 w-1/3">{spec.key}</td>
                        <td className="px-4 py-3 text-stone-300">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Quick Booking Action Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-xl space-y-6 sticky top-24">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-200/70 mb-1">
                <span>Brand: <strong className="text-white">{brand}</strong></span>
                {modelNumber && <span>Model: <strong className="text-white">{modelNumber}</strong></span>}
              </div>
              <h1 className="text-2xl font-extrabold text-white leading-snug">{name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <div className="flex items-center text-[#e0a96d] font-bold">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {averageRating.toFixed(1)}
                </div>
                <span className="text-stone-500">•</span>
                <span className="text-stone-300 font-medium">
                  {numReviews} {numReviews === 1 ? 'verified review' : 'verified reviews'}
                </span>
              </div>
            </div>

            {/* Price Highlight */}
            <div className="p-5 rounded-2xl bg-[#180f0a] border border-[#3b271a] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-amber-200/80 font-medium">Daily Rental Rate:</span>
                <div>
                  <span className="text-3xl font-extrabold text-[#e0a96d]">
                    ₹{dailyPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400"> / day</span>
                </div>
              </div>

              {securityDeposit > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-[#3b271a] text-xs">
                  <span className="flex items-center gap-1 text-stone-300">
                    <Shield className="w-3.5 h-3.5 text-[#e0a96d]" /> Refundable Deposit:
                  </span>
                  <span className="font-bold text-white">₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                } else {
                  setBookingModalOpen(true);
                }
              }}
              disabled={!isAvailable}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#9c5221] hover:bg-[#b86328] text-white font-bold text-sm shadow-lg shadow-[#9c5221]/30 hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {isAvailable ? 'Book This Equipment Now' : 'Currently Booked Out'}
            </button>

            {/* Guarantee bullets */}
            <div className="space-y-2.5 pt-2 border-t border-[#3b271a] text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e0a96d] shrink-0" />
                <span>Instant double-booking conflict prevention</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#e0a96d] shrink-0" />
                <span>100% Refundable Security Deposit upon return</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#e0a96d] shrink-0" />
                <span>Store Pickup or doorstep delivery available</span>
              </div>
            </div>

            {/* Booked Ranges Calendar Notice */}
            {bookedRanges && bookedRanges.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#2c1d14] border border-[#422d1f] text-xs text-amber-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <Calendar className="w-3.5 h-3.5 text-[#e0a96d]" /> Reserved Dates Calendar:
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Already reserved for the following periods:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-300">
                  {bookedRanges.map((range, idx) => (
                    <li key={idx}>
                      {new Date(range.startDate).toLocaleDateString()} to{' '}
                      {new Date(range.endDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#3b271a]">
          <div>
            <h3 className="text-lg font-bold text-white">Verified Customer Reviews</h3>
            <p className="text-xs text-amber-200/70">Based on authentic rental experiences</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9c5221] text-white text-xs font-semibold hover:bg-[#b86328] transition shadow-md shadow-[#9c5221]/30 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Write Review
            </button>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4 divide-y divide-[#3b271a]">
            {reviews.map((rev) => (
              <div key={rev._id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#382619] border border-[#4a3120] text-[#e0a96d] font-bold text-xs flex items-center justify-center">
                      {rev.userId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">{rev.userId?.name || 'Customer'}</h5>
                      <span className="text-[10px] text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#e0a96d] text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-amber-200/70">
            No customer reviews yet. Rent this equipment and be the first to share your experience!
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <BookingModal
        equipment={equipment}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        equipmentId={equipment._id}
        equipmentName={equipment.name}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewAdded={(newReview) => {
          setEquipment((prev) => ({
            ...prev,
            reviews: [newReview, ...(prev.reviews || [])],
            numReviews: (prev.numReviews || 0) + 1,
          }));
        }}
      />
    </div>
  );
};

export default EquipmentDetailsPage;
