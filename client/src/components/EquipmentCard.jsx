import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const EquipmentCard = ({ equipment, onQuickBook }) => {
  const {
    _id,
    name,
    brand,
    category,
    images = [],
    dailyPrice,
    securityDeposit,
    condition,
    isAvailable,
    averageRating = 5,
    numReviews = 0,
    featured,
  } = equipment;

  const displayImage =
    images && images.length > 0
      ? images[0].startsWith('http') || images[0].startsWith('/uploads')
        ? images[0]
        : `http://localhost:5000${images[0]}`
      : 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-[#22160f] rounded-2xl border border-[#3b271a] hover:border-[#c27838]/60 hover:shadow-2xl hover:shadow-[#000]/60 transition-all duration-300 flex flex-col overflow-hidden relative text-white">
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#9c5221] to-[#c27838] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md shadow-[#140d08]/60">
          Featured
        </div>
      )}

      {/* Image Container */}
      <Link to={`/equipment/${_id}`} className="relative h-52 overflow-hidden bg-[#180f0a] block">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Availability tag in image */}
        <div className="absolute bottom-2.5 right-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm ${
              isAvailable
                ? 'bg-[#8c4a1e]/90 text-white border border-[#b86328]/40'
                : 'bg-rose-900/90 text-white border border-rose-700/50'
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-amber-200" /> Available
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-rose-300" /> Booked Out
              </>
            )}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#e0a96d] font-semibold tracking-wide uppercase text-[11px]">
              {category}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#2e1d14] text-amber-200 font-medium text-[11px] border border-[#422c1e]">
              {condition || 'Like New'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/equipment/${_id}`}>
            <h3 className="font-bold text-white group-hover:text-[#e0a96d] transition-colors line-clamp-2 text-base leading-snug mb-1">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-amber-100/60 font-medium mb-3">Brand: {brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4 text-xs">
            <div className="flex items-center text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current mr-1" />
              {averageRating.toFixed(1)}
            </div>
            <span className="text-amber-200/50">({numReviews} {numReviews === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-[#352317]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-extrabold text-white">
                ₹{dailyPrice?.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-amber-200/60"> / day</span>
            </div>
            {securityDeposit > 0 && (
              <span className="text-[11px] text-amber-200/60">
                Deposit: <span className="font-medium text-amber-100">₹{securityDeposit.toLocaleString('en-IN')}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/equipment/${_id}`}
              className="w-full text-center py-2 px-3 rounded-xl border border-[#4a3222] text-stone-200 hover:bg-[#2e1d14] font-semibold text-xs transition cursor-pointer"
            >
              View Details
            </Link>
            <button
              onClick={() => (onQuickBook ? onQuickBook(equipment) : null)}
              className="w-full py-2 px-3 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-semibold text-xs shadow-md shadow-[#9c5221]/30 hover:shadow-lg transition flex items-center justify-center gap-1 cursor-pointer"
            >
              Book Now <ArrowRight className="w-3 h-3 text-amber-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
