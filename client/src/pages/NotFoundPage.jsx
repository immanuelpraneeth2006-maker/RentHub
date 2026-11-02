import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 text-white">
      <div className="w-16 h-16 rounded-2xl bg-[#22160f] border border-[#3b271a] text-[#e0a96d] flex items-center justify-center font-black text-2xl mb-4 shadow-lg">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">Page Not Found</h1>
      <p className="text-sm text-amber-200/70 max-w-md mx-auto mt-2 mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white font-semibold text-xs transition shadow-md shadow-[#9c5221]/30"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
