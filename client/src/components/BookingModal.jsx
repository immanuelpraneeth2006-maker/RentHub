import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axiosInstance';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Shield,
  Truck,
  Building,
  Loader2,
} from 'lucide-react';

const BookingModal = ({ equipment, isOpen, onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState(getTomorrowStr());
  const [deliveryType, setDeliveryType] = useState('store_pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [userNotes, setUserNotes] = useState('');

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState({ available: true, message: '' });
  const [submitting, setSubmitting] = useState(false);

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    if (diff < 0) return 0;
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const rentalDays = calculateDays(startDate, endDate);
  const dailyPrice = equipment?.dailyPrice || 0;
  const rentalAmount = dailyPrice * rentalDays;
  const securityDeposit = equipment?.securityDeposit || 0;
  const totalAmount = rentalAmount + securityDeposit;

  useEffect(() => {
    if (!equipment?._id || !startDate || !endDate) return;

    const check = async () => {
      setCheckingAvailability(true);
      try {
        const res = await api.get(`/equipment/${equipment._id}/availability`, {
          params: { startDate, endDate },
        });

        if (res.data?.available === false) {
          setAvailabilityResult({
            available: false,
            message:
              res.data.reason ||
              'This equipment is already booked for these selected dates. Please choose another timeframe.',
          });
        } else {
          setAvailabilityResult({ available: true, message: 'Equipment is available for these dates!' });
        }
      } catch (err) {
        if (err.response?.status === 409) {
          setAvailabilityResult({
            available: false,
            message: 'Double Booking Conflict: Equipment already reserved in this period.',
          });
        }
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timer = setTimeout(check, 300);
    return () => clearTimeout(timer);
  }, [equipment?._id, startDate, endDate]);

  if (!isOpen || !equipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      addToast('Please sign in or create an account to book equipment.', 'warning');
      navigate('/login');
      return;
    }

    if (rentalDays <= 0) {
      addToast('End date must be on or after start date.', 'error');
      return;
    }

    if (!availabilityResult.available) {
      addToast('Selected dates conflict with an existing booking. Please pick alternative dates.', 'error');
      return;
    }

    if (deliveryType === 'home_delivery' && !deliveryAddress.trim()) {
      addToast('Please enter your complete delivery address.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        equipmentId: equipment._id,
        startDate,
        endDate,
        deliveryType,
        deliveryAddress: deliveryType === 'home_delivery' ? deliveryAddress : '',
        userNotes,
      };

      const res = await api.post('/bookings', payload);

      addToast(
        'Booking request submitted! Admin will review and approve shortly.',
        'success'
      );

      if (onSuccess) onSuccess(res.data.data);
      onClose();
      navigate('/dashboard/bookings');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Could not submit booking request. Please try again.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0604]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#22160f] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#3d271b] text-white">
        <div className="flex items-center justify-between p-6 border-b border-[#352215] sticky top-0 bg-[#22160f]/95 backdrop-blur z-10">
          <div>
            <h2 className="text-lg font-bold text-white">Book Equipment Rental</h2>
            <p className="text-xs text-amber-200/60">Transparent pricing & instant conflict checks</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#2d1e15] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Equipment Summary Snippet */}
          <div className="flex gap-4 p-4 rounded-2xl bg-[#180f0a] border border-[#352215]">
            <img
              src={
                equipment.images?.[0]?.startsWith('http') || equipment.images?.[0]?.startsWith('/uploads')
                  ? equipment.images[0]
                  : `http://localhost:5000${equipment.images?.[0]}`
              }
              alt={equipment.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#e0a96d]">{equipment.category}</span>
              <h4 className="font-bold text-sm text-white truncate">{equipment.name}</h4>
              <p className="text-xs text-amber-200/60">
                ₹{equipment.dailyPrice?.toLocaleString('en-IN')}/day • {equipment.brand}
              </p>
            </div>
          </div>

          {/* Rental Dates Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider">
              1. Select Rental Duration
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-amber-200/70 mb-1 font-medium">Rental Start Date</label>
                <input
                  type="date"
                  min={getTodayStr()}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#422d1f] bg-[#180f0a] text-white text-sm focus:ring-2 focus:ring-[#c27838] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-amber-200/70 mb-1 font-medium">Rental Return Date</label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#422d1f] bg-[#180f0a] text-white text-sm focus:ring-2 focus:ring-[#c27838] focus:outline-none"
                />
              </div>
            </div>

            {/* Live Availability Status */}
            <div className="pt-1">
              {checkingAvailability ? (
                <div className="flex items-center gap-2 text-xs text-amber-200/60">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#e0a96d]" />
                  <span>Checking live schedule availability...</span>
                </div>
              ) : availabilityResult.available ? (
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-[#183422] px-3 py-2 rounded-xl border border-[#275737]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Available for {rentalDays} day{rentalDays > 1 ? 's' : ''} ({startDate} to {endDate})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-rose-300 bg-[#381616] px-3 py-2 rounded-xl border border-[#5c2424]">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{availabilityResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery or Pickup */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider">
              2. Handover Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('store_pickup')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  deliveryType === 'store_pickup'
                    ? 'border-[#c27838] bg-[#352115] text-white ring-2 ring-[#c27838]/30'
                    : 'border-[#3d291c] hover:bg-[#281a12] text-stone-300'
                }`}
              >
                <Building className="w-4 h-4 text-[#e0a96d] shrink-0" />
                <div>
                  <div className="text-white">Store Pickup</div>
                  <div className="text-[10px] text-amber-200/60 font-normal">Free • Instant Pickup</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('home_delivery')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  deliveryType === 'home_delivery'
                    ? 'border-[#c27838] bg-[#352115] text-white ring-2 ring-[#c27838]/30'
                    : 'border-[#3d291c] hover:bg-[#281a12] text-stone-300'
                }`}
              >
                <Truck className="w-4 h-4 text-[#e0a96d] shrink-0" />
                <div>
                  <div className="text-white">Home Delivery</div>
                  <div className="text-[10px] text-amber-200/60 font-normal">Delivered to door</div>
                </div>
              </button>
            </div>

            {deliveryType === 'home_delivery' && (
              <div>
                <label className="block text-xs text-amber-200/70 mb-1 font-medium">Delivery Address</label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Apartment / Office, Street, City, Pincode"
                  required={deliveryType === 'home_delivery'}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#422d1f] bg-[#180f0a] text-white text-xs focus:ring-2 focus:ring-[#c27838] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* User Notes */}
          <div>
            <label className="block text-xs text-amber-200/70 mb-1 font-medium">
              Special Requests or Project Notes (Optional)
            </label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g., Please include extra battery if available"
              className="w-full px-3.5 py-2 rounded-xl border border-[#422d1f] bg-[#180f0a] text-white text-xs focus:ring-2 focus:ring-[#c27838] focus:outline-none"
            />
          </div>

          {/* Transparent Price Breakdown */}
          <div className="p-4 rounded-2xl bg-[#140d08] text-white space-y-2.5 border border-[#352215]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/60">
              Pricing Breakdown
            </h4>

            <div className="flex justify-between text-xs text-stone-300">
              <span>
                Daily Rate (₹{dailyPrice.toLocaleString('en-IN')} × {rentalDays} day{rentalDays > 1 ? 's' : ''})
              </span>
              <span className="font-semibold text-white">₹{rentalAmount.toLocaleString('en-IN')}</span>
            </div>

            {securityDeposit > 0 && (
              <div className="flex justify-between text-xs text-stone-300">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#e0a96d]" />
                  Refundable Security Deposit
                </span>
                <span className="font-semibold text-white">₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#352215] flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-white">Total Amount</span>
                <span className="block text-[10px] text-amber-200/50">Deposit is 100% refunded upon return</span>
              </div>
              <span className="text-xl font-extrabold text-[#e0a96d]">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#422d1f] text-stone-300 hover:bg-[#2d1e15] text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !availabilityResult.available}
              className="px-6 py-2.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-semibold shadow-md shadow-[#9c5221]/30 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                </>
              ) : (
                'Confirm & Submit Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
