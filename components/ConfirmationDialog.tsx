
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Pokemon } from '../types';

interface ConfirmationDialogProps {
  pokemon: Pokemon | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ pokemon, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {pokemon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full text-center p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center">
              <AlertTriangle className="text-yellow-500" size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Confirmation de Vente</h2>
              <p className="text-slate-400">
                Vendre <span className="font-bold capitalize text-white">{pokemon.name}</span> ({pokemon.rarity}) pour{' '}
                <span className="font-bold text-yellow-400">{pokemon.resaleValue} Tokens</span> ?
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                <X size={18} />
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Confirmer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
