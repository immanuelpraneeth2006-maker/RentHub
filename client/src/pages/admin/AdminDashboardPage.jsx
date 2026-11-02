import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EquipmentFormModal from './EquipmentFormModal';
import {
  Users,
  Layers,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Search,
  XCircle,
  BarChart3,
  Award,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [equipments, setEquipments] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [reports, setReports] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchEquipment = async () => {
    setLoadingEquipment(true);
    try {
      const res = await api.get('/equipment', {
        params: { limit: 100, search: equipmentSearch },
      });
      if (res.data?.data) {
        setEquipments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEquipment(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get('/bookings', {
        params: { status: bookingStatusFilter, search: bookingSearch },
      });
      if (res.data?.data) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data?.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await api.get('/admin/reports');
      if (res.data?.data) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === 'overview') {
      fetchBookings();
    } else if (activeTab === 'equipment') {
      fetchEquipment();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const handleUpdateBookingStatus = async (bookingId, status, note = '') => {
    try {
      await api.put(`/bookings/${bookingId}/status`, {
        status,
        adminNotes: note || `Updated to ${status} by administrator.`,
      });
      addToast(`Booking updated to ${status}. Notification sent to user.`, 'success');
      fetchBookings();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update booking status.';
      addToast(msg, 'error');
    }
  };

  const handleToggleAvailability = async (eq) => {
    try {
      await api.put(`/equipment/${eq._id}`, {
        isAvailable: !eq.isAvailable,
      });
      addToast(
        `Equipment ${!eq.isAvailable ? 'marked Available' : 'marked Unavailable'}`,
        'info'
      );
      fetchEquipment();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to toggle availability.', 'error');
    }
  };

  const handleDeleteEquipment = async (eqId, eqName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${eqName}"?`)) return;

    try {
      await api.delete(`/equipment/${eqId}`);
      addToast('Equipment deleted successfully.', 'info');
      fetchEquipment();
      fetchStats();
    } catch (err) {
      addToast(err.response?.data?.message || 'Cannot delete equipment with active bookings.', 'error');
    }
  };

  const handleToggleBlockUser = async (uId) => {
    try {
      const res = await api.put(`/admin/users/${uId}/toggle-block`);
      addToast(res.data?.message || 'User status updated', 'info');
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white">
      {/* Top Admin Header */}
      <div className="bg-[#1c130d] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#3b271a] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#2c1d14] text-[#e0a96d] border border-[#422d1f] uppercase">
              Administrator Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            RentHub Control Portal
          </h1>
          <p className="text-xs text-amber-200/70 mt-1">
            Manage inventory, verify bookings, oversee active rentals & track platform revenue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingEquipment(null);
              setEquipmentModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-bold shadow-md shadow-[#9c5221]/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Equipment
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#3b271a] gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            activeTab === 'overview'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#e0a96d]" /> Overview & KPIs
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            activeTab === 'bookings'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#e0a96d]" /> Bookings & Approvals ({stats?.pendingBookings ? `${stats.pendingBookings} pending` : 'All'})
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            activeTab === 'equipment'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Layers className="w-4 h-4 text-[#e0a96d]" /> Equipment Inventory ({stats?.totalEquipment || 0})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            activeTab === 'users'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Users className="w-4 h-4 text-[#e0a96d]" /> Registered Users ({stats?.totalUsers || 0})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            activeTab === 'reports'
              ? 'border-[#e0a96d] text-white font-bold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#e0a96d]" /> Financial Reports
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW & KPIS */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-amber-200/70 text-xs font-semibold">
                <span>Rental Revenue</span>
                <DollarSign className="w-4 h-4 text-[#e0a96d]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
              </div>
              <div className="text-[11px] text-[#e0a96d] font-semibold">
                Gross turnover: ₹{stats?.grossTurnover?.toLocaleString('en-IN') || 0}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-amber-200/70 text-xs font-semibold">
                <span>Deposits Held</span>
                <Shield className="w-4 h-4 text-[#e0a96d]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#e0a96d]">
                ₹{stats?.depositsHeld?.toLocaleString('en-IN') || 0}
              </div>
              <div className="text-[11px] text-stone-400">Refundable on return</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-amber-200/70 text-xs font-semibold">
                <span>Pending Approvals</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">
                {stats?.pendingBookings || 0}
              </div>
              <div className="text-[11px] text-amber-300 font-semibold">Awaiting admin review</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#22160f] border border-[#3b271a] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-amber-200/70 text-xs font-semibold">
                <span>Active Rentals</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {stats?.activeRentals || 0}
              </div>
              <div className="text-[11px] text-stone-400">Currently in user possession</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-center">
              <div className="text-xl font-bold text-white">{stats?.totalEquipment || 0}</div>
              <div className="text-xs text-amber-200/70">Total Gear Listed</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-center">
              <div className="text-xl font-bold text-white">{stats?.availableEquipment || 0}</div>
              <div className="text-xs text-amber-200/70">Available to Rent</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-center">
              <div className="text-xl font-bold text-white">{stats?.completedBookings || 0}</div>
              <div className="text-xs text-amber-200/70">Completed Rentals</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-center">
              <div className="text-xl font-bold text-white">{stats?.totalUsers || 0}</div>
              <div className="text-xs text-amber-200/70">Registered Users</div>
            </div>
          </div>

          {/* Pending Approvals Table */}
          <div className="bg-[#22160f] p-6 rounded-3xl border border-[#3b271a] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Bookings Needing Immediate Action</h3>
                <p className="text-xs text-amber-200/70">Requests pending approval from customers</p>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-semibold text-[#e0a96d] hover:text-amber-300 hover:underline cursor-pointer transition"
              >
                View all bookings →
              </button>
            </div>

            {bookings.filter((b) => b.bookingStatus === 'pending').length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#180f0a] text-amber-200/80 uppercase tracking-wider">
                    <tr>
                      <th className="p-3 font-semibold">User</th>
                      <th className="p-3 font-semibold">Equipment</th>
                      <th className="p-3 font-semibold">Dates</th>
                      <th className="p-3 font-semibold">Total Amount</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3b271a]">
                    {bookings
                      .filter((b) => b.bookingStatus === 'pending')
                      .slice(0, 5)
                      .map((b) => (
                        <tr key={b._id} className="hover:bg-[#281a12] transition">
                          <td className="p-3 font-medium text-white">
                            <div>{b.userId?.name || 'Customer'}</div>
                            <div className="text-[10px] text-stone-400">{b.userId?.phone}</div>
                          </td>
                          <td className="p-3 text-stone-300">
                            <div className="text-white font-semibold">{b.equipmentId?.name}</div>
                            <div className="text-[10px] text-stone-400">{b.equipmentId?.brand}</div>
                          </td>
                          <td className="p-3 text-stone-300">
                            {new Date(b.startDate).toLocaleDateString()} –{' '}
                            {new Date(b.endDate).toLocaleDateString()}
                            <div className="text-[10px] text-stone-400">({b.rentalDays} days)</div>
                          </td>
                          <td className="p-3 font-bold text-[#e0a96d]">
                            ₹{b.totalAmount?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'approved')}
                              className="px-3 py-1.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-bold text-[11px] shadow-sm cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl border border-rose-800 text-rose-300 hover:bg-rose-950/40 font-semibold text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-amber-200/70">
                No pending booking requests! All current requests have been processed.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: BOOKINGS & APPROVALS MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === 'bookings' && (
        <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#e0a96d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search user name, email, gear title, or booking ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setBookingStatusFilter(status);
                      fetchBookings();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer whitespace-nowrap transition ${
                      bookingStatusFilter === status
                        ? 'bg-[#9c5221] text-white shadow-sm shadow-[#9c5221]/30'
                        : 'bg-[#180f0a] border border-[#422d1f] text-stone-300 hover:bg-[#2c1d14]'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          {loadingBookings ? (
            <LoadingSpinner text="Loading booking records..." />
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#180f0a] text-amber-200/80 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 font-semibold">Booking ID</th>
                    <th className="p-3 font-semibold">User</th>
                    <th className="p-3 font-semibold">Equipment</th>
                    <th className="p-3 font-semibold">Rental Dates</th>
                    <th className="p-3 font-semibold">Amount</th>
                    <th className="p-3 font-semibold">Booking Status</th>
                    <th className="p-3 font-semibold">Payment</th>
                    <th className="p-3 font-semibold text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b271a]">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-[#281a12] transition">
                      <td className="p-3 font-mono font-bold text-[#e0a96d]">
                        {b._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{b.userId?.name || 'Customer'}</div>
                        <div className="text-[10px] text-stone-400">{b.userId?.email}</div>
                        <div className="text-[10px] text-stone-400">{b.userId?.phone}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{b.equipmentId?.name}</div>
                        <div className="text-[10px] text-stone-400">{b.equipmentId?.category}</div>
                      </td>
                      <td className="p-3 text-stone-300">
                        {new Date(b.startDate).toLocaleDateString()} to{' '}
                        {new Date(b.endDate).toLocaleDateString()}
                        <div className="text-[10px] text-stone-400">{b.rentalDays} days rental</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[#e0a96d]">₹{b.totalAmount?.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-stone-400">Deposit: ₹{b.securityDeposit}</div>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={b.bookingStatus} type="booking" />
                      </td>
                      <td className="p-3">
                        <StatusBadge status={b.paymentStatus} type="payment" />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {b.bookingStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(b._id, 'approved')}
                                className="px-2.5 py-1 rounded-lg bg-[#9c5221] hover:bg-[#b86328] text-white font-bold text-[11px] cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(b._id, 'rejected')}
                                className="px-2.5 py-1 rounded-lg border border-rose-800 text-rose-300 hover:bg-rose-950/40 text-[11px] cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {b.bookingStatus === 'approved' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'active', 'Equipment handed over to customer.')}
                              className="px-2.5 py-1 rounded-lg bg-[#9c5221] hover:bg-[#b86328] text-white font-bold text-[11px] cursor-pointer"
                            >
                              Dispatch / Active
                            </button>
                          )}

                          {b.bookingStatus === 'active' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'completed', 'Gear returned safely. Deposit refunded.')}
                              className="px-2.5 py-1 rounded-lg bg-[#b86328] hover:bg-[#d47634] text-white font-bold text-[11px] cursor-pointer"
                            >
                              Mark Returned
                            </button>
                          )}

                          {['approved', 'pending'].includes(b.bookingStatus) && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'cancelled', 'Cancelled by administrator.')}
                              className="p-1 text-stone-400 hover:text-rose-400 cursor-pointer"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-amber-200/70">
              No bookings found matching current filters.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: EQUIPMENT INVENTORY */}
      {/* ============================================================== */}
      {activeTab === 'equipment' && (
        <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#e0a96d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={equipmentSearch}
                onChange={(e) => {
                  setEquipmentSearch(e.target.value);
                  fetchEquipment();
                }}
                placeholder="Search equipment by name, brand, category..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setEditingEquipment(null);
                setEquipmentModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-bold text-xs shadow-md shadow-[#9c5221]/30 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Equipment
            </button>
          </div>

          {loadingEquipment ? (
            <LoadingSpinner text="Loading equipment catalog..." />
          ) : equipments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#180f0a] text-amber-200/80 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 font-semibold">Equipment Item</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Condition</th>
                    <th className="p-3 font-semibold">Daily Rate</th>
                    <th className="p-3 font-semibold">Deposit</th>
                    <th className="p-3 font-semibold">Rentals</th>
                    <th className="p-3 font-semibold">Availability</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b271a]">
                  {equipments.map((eq) => (
                    <tr key={eq._id} className="hover:bg-[#281a12] transition">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              eq.images?.[0]?.startsWith('http') || eq.images?.[0]?.startsWith('/uploads')
                                ? eq.images[0]
                                : `http://localhost:5000${eq.images?.[0]}`
                            }
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[#180f0a] border border-[#3b271a]"
                          />
                          <div>
                            <div className="font-bold text-white line-clamp-1">{eq.name}</div>
                            <div className="text-[10px] text-stone-400">Brand: {eq.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-stone-300">{eq.category}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#180f0a] border border-[#422d1f] text-amber-200 text-[10px] font-semibold">
                          {eq.condition}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#e0a96d]">
                        ₹{eq.dailyPrice?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-stone-300">
                        ₹{eq.securityDeposit?.toLocaleString('en-IN') || 0}
                      </td>
                      <td className="p-3 font-semibold text-[#e0a96d]">
                        {eq.totalRentals || 0} times
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleAvailability(eq)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                            eq.isAvailable
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800 hover:bg-emerald-900/80'
                              : 'bg-rose-950/70 text-rose-300 border-rose-800 hover:bg-rose-900/80'
                          }`}
                        >
                          {eq.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingEquipment(eq);
                              setEquipmentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:bg-[#2c1d14] hover:text-[#e0a96d] transition cursor-pointer"
                            title="Edit Equipment"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEquipment(eq._id, eq.name)}
                            className="p-1.5 rounded-lg text-stone-400 hover:bg-rose-950/40 hover:text-rose-400 transition cursor-pointer"
                            title="Delete Equipment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-amber-200/70">
              No equipment found. Click "Add Equipment" to populate your catalog.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: USER DIRECTORY */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Registered Users Directory</h3>
              <p className="text-xs text-amber-200/70">Overview of customers, booking counts and account status</p>
            </div>
          </div>

          {loadingUsers ? (
            <LoadingSpinner text="Fetching user accounts..." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#180f0a] text-amber-200/80 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 font-semibold">User</th>
                    <th className="p-3 font-semibold">Contact</th>
                    <th className="p-3 font-semibold">Role</th>
                    <th className="p-3 font-semibold">Bookings Count</th>
                    <th className="p-3 font-semibold">Account Status</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b271a]">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#281a12] transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#9c5221] text-white font-bold flex items-center justify-center">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-[10px] text-stone-400">
                              Joined: {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-stone-200">{u.email}</div>
                        <div className="text-[10px] text-stone-400">{u.phone}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-[#2c1d14] text-[#e0a96d] border border-[#422d1f]'
                              : 'bg-[#180f0a] text-stone-300 border border-[#3b271a]'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#e0a96d]">
                        {u.totalBookings || 0} bookings
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.isBlocked
                              ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {u.isBlocked ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleBlockUser(u._id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                              u.isBlocked
                                ? 'bg-[#9c5221] text-white hover:bg-[#b86328]'
                                : 'border border-rose-800 text-rose-300 hover:bg-rose-950/40'
                            }`}
                          >
                            {u.isBlocked ? 'Activate' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: FINANCIAL & ACTIVITY REPORTS */}
      {/* ============================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#e0a96d]" />
                <h3 className="text-base font-bold text-white">Most Rented Equipment Ranking</h3>
              </div>

              {reports?.topEquipment?.length > 0 ? (
                <div className="space-y-3">
                  {reports.topEquipment.map((eq, i) => (
                    <div
                      key={eq._id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#9c5221] text-white font-bold flex items-center justify-center text-[10px]">
                          #{i + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white truncate max-w-xs">{eq.name}</div>
                          <div className="text-[10px] text-stone-400">{eq.category} • ₹{eq.dailyPrice}/day</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#e0a96d]">{eq.totalRentals} rentals</div>
                        <div className="text-[10px] text-amber-400">★ {eq.averageRating?.toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-200/70">No rental records available yet.</p>
              )}
            </div>

            <div className="bg-[#22160f] p-6 sm:p-8 rounded-3xl border border-[#3b271a] shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#e0a96d]" />
                <h3 className="text-base font-bold text-white">Inventory by Category</h3>
              </div>

              {reports?.categoryDistribution?.length > 0 ? (
                <div className="space-y-3">
                  {reports.categoryDistribution.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#180f0a] border border-[#3b271a] text-xs"
                    >
                      <span className="font-bold text-stone-200">{cat._id}</span>
                      <div className="text-right">
                        <span className="font-bold text-white">{cat.count} units</span>
                        <div className="text-[10px] text-stone-400">
                          Avg: ₹{Math.round(cat.avgPrice)}/day
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-200/70">No categories found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Add/Edit Modal */}
      <EquipmentFormModal
        equipment={editingEquipment}
        isOpen={equipmentModalOpen}
        onClose={() => {
          setEquipmentModalOpen(false);
          setEditingEquipment(null);
        }}
        onSaveSuccess={() => {
          fetchEquipment();
          fetchStats();
        }}
      />
    </div>
  );
};

export default AdminDashboardPage;
