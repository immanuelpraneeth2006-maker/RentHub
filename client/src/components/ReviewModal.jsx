import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../api/axiosInstance';
import { Star, X, Loader2 } from 'lucide-react';

const ReviewModal = ({ equipmentId, equipmentName, isOpen, onClose, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please write a short review comment.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        equipmentId,
        rating,
        comment,
      });

      addToast('Thank you! Your review has been published.', 'success');
      if (onReviewAdded) onReviewAdded(res.data.data);
      onClose();
      setComment('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit review.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0604]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#22160f] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#3d271b] text-white">
        <div className="flex items-center justify-between pb-4 border-b border-[#352215] mb-4">
          <h3 className="font-bold text-white text-base">Write a Review</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#2d1e15] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-amber-200/60 mb-4">
          Share your rental experience with <span className="font-semibold text-white">{equipmentName}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-2">Overall Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-[#422c1e]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-200 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">Your Review</label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the equipment condition? Did it perform as expected? Share advice for future renters..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#422d1f] bg-[#180f0a] text-white text-xs focus:ring-2 focus:ring-[#c27838] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#422d1f] text-xs font-semibold text-stone-300 hover:bg-[#2d1e15] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-semibold shadow-md shadow-[#9c5221]/30 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                </>
              ) : (
                'Post Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
