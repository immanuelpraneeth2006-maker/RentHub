import React from 'react';

const StatusBadge = ({ status, type = 'booking' }) => {
  const normalized = (status || '').toLowerCase();

  const bookingStyles = {
    pending: 'bg-[#382310] text-amber-300 border-[#5e3b1c]',
    approved: 'bg-[#183422] text-emerald-300 border-[#275737]',
    active: 'bg-[#182a38] text-sky-300 border-[#29465e]',
    completed: 'bg-[#2b1b36] text-purple-300 border-[#472c59]',
    rejected: 'bg-[#381616] text-rose-300 border-[#5c2424]',
    cancelled: 'bg-[#241710] text-stone-300 border-[#3d271c]',
  };

  const paymentStyles = {
    paid: 'bg-[#183422] text-emerald-300 border-[#275737]',
    completed: 'bg-[#183422] text-emerald-300 border-[#275737]',
    pending: 'bg-[#382310] text-amber-300 border-[#5e3b1c]',
    failed: 'bg-[#381616] text-rose-300 border-[#5c2424]',
    refunded: 'bg-[#1c2238] text-indigo-300 border-[#2e375e]',
  };

  const styleMap = type === 'payment' ? paymentStyles : bookingStyles;
  const currentStyle = styleMap[normalized] || 'bg-[#261912] text-amber-100 border-[#422c1f]';

  const formatText = (txt) => {
    if (!txt) return '';
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
