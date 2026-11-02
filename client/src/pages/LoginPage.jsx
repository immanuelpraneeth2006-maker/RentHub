import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Mail, Lock, Eye, EyeOff, Shield, User, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-[#22160f] p-8 sm:p-10 rounded-3xl border border-[#3b271a] shadow-2xl text-white">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9c5221] to-[#e0a96d] text-white items-center justify-center shadow-lg shadow-[#9c5221]/30 mb-1">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back to RentHub</h2>
          <p className="text-xs text-amber-200/70">
            Sign in to manage your equipment rentals and bookings
          </p>
        </div>

        {/* Demo Credentials Quick Box */}
        <div className="p-4 rounded-2xl bg-[#180f0a] border border-[#3b271a] space-y-2 text-xs">
          <div className="font-bold text-[#e0a96d] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#e0a96d]" />
            Quick Demo Login Credentials:
          </div>
          <p className="text-[11px] text-amber-200/80">Click below to auto-fill verified accounts:</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@renthub.com', 'admin123')}
              className="py-2 px-2.5 rounded-xl bg-[#2c1d14] border border-[#422d1f] hover:bg-[#9c5221] hover:text-white font-semibold text-[11px] text-stone-200 transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#e0a96d]" /> Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('user@renthub.com', 'user123')}
              className="py-2 px-2.5 rounded-xl bg-[#2c1d14] border border-[#422d1f] hover:bg-[#9c5221] hover:text-white font-semibold text-[11px] text-stone-200 transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#e0a96d]" /> Demo Customer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-200">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-bold text-xs shadow-md shadow-[#9c5221]/30 hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-stone-400 pt-2 border-t border-[#3b271a]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#e0a96d] font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
