
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  // Fix: cast motion to any to avoid JSX property errors
  const M = motion as any;

  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-xs">
      <AnimatePresence>
        {toasts.map((toast) => (
          <M.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
              'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}
          >
            <div className="shrink-0">
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <p className="text-sm font-bold flex-1 leading-tight">{toast.message}</p>
          </M.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
