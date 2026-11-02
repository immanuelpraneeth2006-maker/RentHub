import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosInstance';
import { X, CreditCard, Shield, Loader2, Smartphone, Landmark } from 'lucide-react';

const PaymentModal = ({ booking, isOpen, onClose, onPaymentSuccess }) => {
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('renter@upi');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen || !booking) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const txId = `PAY-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
      const res = await api.post(`/bookings/${booking._id}/pay`, {
        paymentMethod: method,
        transactionId: txId,
      });

      addToast(`Payment of ₹${booking.totalAmount.toLocaleString('en-IN')} confirmed!`, 'success');
      if (onPaymentSuccess) onPaymentSuccess(res.data.data.booking);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment processing failed.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#22160f] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#3b271a] text-white">
        <div className="flex items-center justify-between pb-4 border-b border-[#3b271a] mb-4">
          <div>
            <h3 className="font-bold text-white text-base">Complete Rental Payment</h3>
            <p className="text-xs text-amber-200/70">Secure Sandboxed Payment Gateway</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#2c1d14] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount summary */}
        <div className="p-4 rounded-2xl bg-[#180f0a] text-white mb-5 space-y-1 border border-[#3b271a] shadow-inner">
          <div className="text-xs text-amber-200/70">Total Payable Amount</div>
          <div className="text-2xl font-black text-[#e0a96d]">
            ₹{booking.totalAmount?.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-300">
            Includes ₹{booking.rentalAmount?.toLocaleString('en-IN')} rental + ₹{booking.securityDeposit?.toLocaleString('en-IN')} refundable deposit
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`p-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                  method === 'upi'
                    ? 'border-[#9c5221] bg-[#2c1d14] text-white ring-2 ring-[#9c5221]/30'
                    : 'border-[#3b271a] bg-[#180f0a] text-stone-300 hover:bg-[#281a12]'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-[#e0a96d]" />
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                  method === 'card'
                    ? 'border-[#9c5221] bg-[#2c1d14] text-white ring-2 ring-[#9c5221]/30'
                    : 'border-[#3b271a] bg-[#180f0a] text-stone-300 hover:bg-[#281a12]'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#e0a96d]" />
                Card
              </button>
              <button
                type="button"
                onClick={() => setMethod('netbanking')}
                className={`p-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                  method === 'netbanking'
                    ? 'border-[#9c5221] bg-[#2c1d14] text-white ring-2 ring-[#9c5221]/30'
                    : 'border-[#3b271a] bg-[#180f0a] text-stone-300 hover:bg-[#281a12]'
                }`}
              >
                <Landmark className="w-4 h-4 mx-auto mb-1 text-[#e0a96d]" />
                Netbanking
              </button>
            </div>
          </div>

          {method === 'upi' && (
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">Enter UPI Virtual ID</label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okaxis"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Card Number (4532 •••• •••• 8892)"
                defaultValue="4532 8920 1192 8892"
                className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  defaultValue="12/28"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  defaultValue="789"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-amber-200/70 bg-[#180f0a] p-3 rounded-xl border border-[#3b271a]">
            <Shield className="w-4 h-4 text-[#e0a96d] shrink-0" />
            <span>256-Bit SSL Encrypted Mock Sandbox Payment Gateway</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#422d1f] text-xs font-semibold text-stone-300 hover:bg-[#2c1d14] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-bold shadow-md shadow-[#9c5221]/30 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing Payment...
                </>
              ) : (
                `Pay ₹${booking.totalAmount?.toLocaleString('en-IN')}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
