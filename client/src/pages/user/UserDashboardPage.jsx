import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosInstance';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ReviewModal from '../../components/ReviewModal';
import PaymentModal from './PaymentModal';
import {
  Calendar,
  User,
  Bell,
  CreditCard,
  MessageSquare,
  ExternalLink,
  Save,
  Lock,
} from 'lucide-react';

const UserDashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const getInitialTab = () => {
    if (location.pathname.includes('/profile')) return 'profile';
    if (location.pathname.includes('/notifications')) return 'notifications';
    return 'bookings';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [bookingFilter, setBookingFilter] = useState('all');

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const [activeReviewModal, setActiveReviewModal] = useState(null);
  const [activePaymentModal, setActivePaymentModal] = useState(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data?.data) {
        setBookings(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const res = await api.get('/notifications');
      if (res.data?.data) {
        setNotifications(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;

    try {
      await api.delete(`/bookings/${bookingId}`, {
        data: { reason: 'User requested cancellation from dashboard' },
      });
      addToast('Booking cancelled successfully.', 'info');
      fetchBookings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not cancel booking.', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      name: profileData.name,
      phone: profileData.phone,
      avatar: profileData.avatar,
      address: {
        street: profileData.street,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
      },
    });
    setSavingProfile(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', passwordData);
      addToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.bookingStatus === bookingFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white">
      {/* Top Banner with User Greeting */}
      <div className="bg-gradient-to-r from-[#1c130d] via-[#22160f] to-[#1c130d] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#3b271a] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#e0a96d]/40"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#9c5221] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#9c5221]/30">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2c1d14] text-[#e0a96d] border border-[#422d1f] uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-amber-200/70 mt-0.5">{user?.email} • {user?.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/equipment"
            className="px-5 py-2.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-semibold shadow-md shadow-[#9c5221]/30 transition cursor-pointer"
          >
            + Rent More Gear
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#3b271a] gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#e0a96d]" /> My Bookings & Rentals ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <User className="w-4 h-4 text-[#e0a96d]" /> Profile & Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bell className="w-4 h-4 text-[#e0a96d]" /> Activity Notifications
        </button>
      </div>

      {/* TAB 1: MY BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Booking Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'pending', label: 'Pending Approval' },
              { id: 'approved', label: 'Approved' },
              { id: 'active', label: 'Active Rentals' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setBookingFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  bookingFilter === f.id
                    ? 'bg-[#9c5221] text-white shadow-sm shadow-[#9c5221]/30'
                    : 'bg-[#22160f] border border-[#3b271a] text-stone-300 hover:bg-[#2c1d14]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loadingBookings ? (
            <LoadingSpinner text="Fetching your rental history..." />
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const eq = b.equipmentId;
                const canCancel = ['pending', 'approved'].includes(b.bookingStatus);
                const canPay = b.bookingStatus === 'approved' && b.paymentStatus === 'pending';
                const canReview = b.bookingStatus === 'completed';

                return (
                  <div
                    key={b._id}
                    className="bg-[#22160f] rounded-3xl border border-[#3b271a] p-6 shadow-lg hover:border-[#9c5221]/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={
                          eq?.images?.[0]?.startsWith('http') || eq?.images?.[0]?.startsWith('/uploads')
                            ? eq.images[0]
                            : `http://localhost:5000${eq?.images?.[0]}`
                        }
                        alt={eq?.name || 'Equipment'}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-[#180f0a] border border-[#3b271a]"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={b.bookingStatus} type="booking" />
                          <StatusBadge status={b.paymentStatus} type="payment" />
                          <span className="text-[10px] text-stone-400">
                            ID: {b._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-white truncate">
                          {eq?.name || 'Equipment'}
                        </h4>
                        <div className="text-xs text-amber-200/70 flex items-center gap-3 flex-wrap">
                          <span>
                            Dates: <strong className="text-white">{new Date(b.startDate).toLocaleDateString()}</strong> to{' '}
                            <strong className="text-white">{new Date(b.endDate).toLocaleDateString()}</strong> ({b.rentalDays} days)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#3b271a]">
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-amber-200/70">Total Amount:</div>
                        <div className="text-lg font-black text-[#e0a96d]">
                          ₹{b.totalAmount?.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          (₹{b.rentalAmount} rent + ₹{b.securityDeposit} deposit)
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {canPay && (
                          <button
                            onClick={() => setActivePaymentModal(b)}
                            className="px-4 py-2 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-bold shadow-md shadow-[#9c5221]/30 transition flex items-center gap-1 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Pay Now
                          </button>
                        )}

                        {canReview && (
                          <button
                            onClick={() =>
                              setActiveReviewModal({
                                equipmentId: eq._id,
                                equipmentName: eq.name,
                              })
                            }
                            className="px-3.5 py-2 rounded-xl bg-[#b86328] hover:bg-[#d47634] text-white text-xs font-semibold shadow transition flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Review Gear
                          </button>
                        )}

                        {canCancel && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="px-3 py-2 rounded-xl border border-rose-800 text-rose-300 hover:bg-rose-950/40 text-xs font-semibold transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        {eq?._id && (
                          <Link
                            to={`/equipment/${eq._id}`}
                            className="p-2 rounded-xl border border-[#422d1f] text-stone-300 hover:bg-[#2c1d14] hover:text-white transition"
                            title="View Equipment Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#22160f] rounded-3xl border border-[#3b271a] p-8 space-y-3 shadow-lg">
              <Calendar className="w-12 h-12 text-[#e0a96d] mx-auto opacity-60" />
              <h3 className="font-bold text-white text-base">No bookings found</h3>
              <p className="text-xs text-amber-200/70 max-w-sm mx-auto">
                You do not have any {bookingFilter !== 'all' ? bookingFilter : ''} bookings at the moment.
              </p>
              <Link
                to="/equipment"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#9c5221] text-white text-xs font-bold hover:bg-[#b86328] transition shadow-md shadow-[#9c5221]/30"
              >
                Explore Gear Catalog
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Personal Information</h3>
              <p className="text-xs text-amber-200/70">Update your contact information for equipment verification</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#3b271a]">
                <h4 className="text-xs font-bold text-amber-200/80 uppercase tracking-wider mb-2">Delivery Address</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={profileData.street}
                    onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={profileData.state}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-bold shadow-md shadow-[#9c5221]/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-xl space-y-6 h-fit">
            <div>
              <h3 className="text-base font-bold text-white">Security & Credentials</h3>
              <p className="text-xs text-amber-200/70">Update your account login password</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-bold shadow-md shadow-[#9c5221]/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#3b271a]">
            <div>
              <h3 className="text-base font-bold text-white">Notification History</h3>
              <p className="text-xs text-amber-200/70">Real-time alerts regarding your rental requests and returns</p>
            </div>
            <button
              onClick={async () => {
                await api.put('/notifications/read-all');
                fetchNotifications();
                addToast('All notifications marked as read', 'info');
              }}
              className="text-xs font-semibold text-[#e0a96d] hover:text-amber-300 hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          {loadingNotifs ? (
            <LoadingSpinner text="Loading notifications..." />
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-[#3b271a]">
              {notifications.map((n) => (
                <div key={n._id} className={`py-4 space-y-1 ${!n.isRead ? 'bg-[#2c1d14]/70 px-3 rounded-xl border border-[#422d1f]' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{n.title}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-amber-200/70">
              No notifications yet. You'll receive updates when your bookings are approved or updated.
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {activeReviewModal && (
        <ReviewModal
          equipmentId={activeReviewModal.equipmentId}
          equipmentName={activeReviewModal.equipmentName}
          isOpen={!!activeReviewModal}
          onClose={() => setActiveReviewModal(null)}
          onReviewAdded={() => {
            fetchBookings();
          }}
        />
      )}

      {/* Payment Modal */}
      {activePaymentModal && (
        <PaymentModal
          booking={activePaymentModal}
          isOpen={!!activePaymentModal}
          onClose={() => setActivePaymentModal(null)}
          onPaymentSuccess={() => {
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};

export default UserDashboardPage;
