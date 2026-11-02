import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const DatabaseBanner = () => {
  const { dbStatus } = useAuth();
  const [expanded, setExpanded] = useState(false);

  if (dbStatus.isConnected) {
    return (
      <div className="bg-[#1c120a] text-amber-200 text-xs py-1.5 px-4 border-b border-[#382315]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong className="text-white">Database:</strong> Connected to MongoDB Atlas Cloud ({dbStatus.host || 'Atlas Cluster'})
            </span>
          </div>
          <span className="hidden md:inline-block text-amber-300 font-mono">
            DB: {dbStatus.dbName || 'renthub'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2d180d] text-amber-100 text-xs border-b border-[#4d2a17] transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">MongoDB Atlas Notice:</strong> Cloud database connection pending. Set your{' '}
              <code className="bg-[#422413] text-amber-200 px-1 py-0.5 rounded font-mono">MONGO_URI</code> in{' '}
              <code className="bg-[#422413] text-amber-200 px-1 py-0.5 rounded font-mono">server/.env</code>.
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 font-semibold underline underline-offset-2 shrink-0 cursor-pointer text-amber-300"
          >
            {expanded ? 'Hide Info' : 'Connection Instructions'}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-2.5 pt-2.5 border-t border-[#4d2a17] text-amber-200/90 text-xs space-y-1.5 bg-[#1f1008] p-3 rounded-lg">
            <p className="font-semibold text-white">How to connect MongoDB Atlas:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your MongoDB Atlas dashboard at <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="underline font-bold text-amber-300">cloud.mongodb.com</a>.</li>
              <li>Under Network Access, ensure IP Address <code className="bg-[#381c0d] px-1 rounded font-mono text-amber-200">0.0.0.0/0</code> is whitelisted.</li>
              <li>Under Database Access, create a user and copy the connection string.</li>
              <li>Paste it into <code className="bg-[#381c0d] px-1 rounded font-mono text-amber-200">server/.env</code> as: <code className="bg-[#381c0d] px-1 rounded font-mono text-amber-200">MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/renthub</code></li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseBanner;
