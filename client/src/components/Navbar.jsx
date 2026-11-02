import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import {
  Layers,
  Bell,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Calendar,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifs = async () => {
        try {
          const res = await api.get('/notifications');
          if (res.data?.data) {
            setNotifications(res.data.data.slice(0, 5));
            setUnreadCount(res.data.unreadCount || 0);
          }
        } catch (e) {
          // ignore
        }
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-[#e0a96d] ${
      isActive ? 'text-[#e0a96d] font-bold' : 'text-stone-300'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#1c130d]/95 backdrop-blur-md border-b border-[#382619]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8c4a1e] via-[#ab5b25] to-[#c27838] flex items-center justify-center text-white shadow-md shadow-[#8c4a1e]/30 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Rent<span className="text-[#e0a96d]">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-amber-200/60 uppercase tracking-wider -mt-1">
                Equipment Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/equipment" className={navLinkClasses}>
              Browse Gear
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              Contact
            </NavLink>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-[#2d1f15] transition relative cursor-pointer"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-[#c27838] text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-[#1c130d] animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#241810] rounded-2xl shadow-2xl border border-[#422d1f] py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200 text-white">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-[#382619]">
                        <span className="font-semibold text-sm text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-[#e0a96d] hover:underline font-medium cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-[#382619]">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-amber-200/60">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n._id}
                              to={n.link || '/dashboard/bookings'}
                              onClick={() => setNotificationsOpen(false)}
                              className={`block px-4 py-3 hover:bg-[#2f1f15] transition text-left ${
                                !n.isRead ? 'bg-[#332216]' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-semibold text-white">{n.title}</span>
                                <span className="text-[10px] text-amber-200/50">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-stone-300 line-clamp-2">{n.message}</p>
                            </Link>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-[#382619] text-center">
                        <Link
                          to="/dashboard/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-semibold text-[#e0a96d] hover:text-[#f3c28b]"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-[#422d1f] hover:border-[#8c4a1e] hover:bg-[#2d1f15] transition text-left cursor-pointer"
                  >
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-semibold text-white leading-tight">
                        {user.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] font-medium text-[#e0a96d] uppercase">
                        {user.role}
                      </div>
                    </div>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#c27838]/40"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#8c4a1e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#241810] rounded-2xl shadow-2xl border border-[#422d1f] py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200 text-white">
                      <div className="px-4 py-2 border-b border-[#382619]">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-amber-200/60 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-200 bg-[#352317] hover:bg-[#452e1f] transition"
                          >
                            <Shield className="w-4 h-4 text-[#e0a96d]" />
                            Admin Control Portal
                          </Link>
                        )}
                        <Link
                          to="/dashboard/bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-200 hover:bg-[#2f1f15] transition"
                        >
                          <Calendar className="w-4 h-4 text-stone-400" />
                          My Bookings & Rentals
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-200 hover:bg-[#2f1f15] transition"
                        >
                          <User className="w-4 h-4 text-stone-400" />
                          Profile Settings
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-[#382619]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-[#351915] transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-stone-300 hover:text-[#e0a96d] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#9c5221] hover:bg-[#b86328] shadow-md shadow-[#9c5221]/30 transition hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-300 hover:bg-[#2d1f15] md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#382619] bg-[#1c130d] px-4 pt-3 pb-6 space-y-3 text-white">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-200 hover:text-[#e0a96d]"
          >
            Home
          </NavLink>
          <NavLink
            to="/equipment"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-200 hover:text-[#e0a96d]"
          >
            Browse Gear
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-200 hover:text-[#e0a96d]"
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-200 hover:text-[#e0a96d]"
          >
            Contact
          </NavLink>

          {isAuthenticated && (
            <div className="pt-3 border-t border-[#382619] space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-[#e0a96d]"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-stone-200 font-medium"
              >
                User Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="block w-full text-left py-2 text-sm text-rose-400 font-medium cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
