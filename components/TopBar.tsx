
import React from 'react';
import { Coins, ShoppingBag, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopBarProps {
  tokens: number;
  activeTab: string;
  navigateTo: (tab: string) => void;
  onQuickPackClick: () => void;
  packCost: number;
}

const TopBar: React.FC<TopBarProps> = ({ tokens, activeTab, navigateTo, onQuickPackClick, packCost }) => {
  const isDashboard = activeTab === 'dashboard';
  // Fix: cast motion to any to avoid JSX property errors
  const M = motion as any;

  return (
    <header id="top-bar" className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 z-40 pl-20 pr-6 lg:px-10 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        {!isDashboard && (
          <M.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-bold text-sm">Retour</span>
          </M.button>
        )}
        <div className="flex flex-col">
          <h2 className="text-white font-black text-sm lg:text-base uppercase tracking-wider hidden sm:block">
            {activeTab === 'dashboard' ? 'Tableau de bord' : 
             activeTab === 'shop' ? 'Market' : 
             activeTab === 'collection' ? 'Ma Collection' : 'Analyses'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Balance Preview */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-black text-[10px] shadow-lg shadow-yellow-500/20">
            $
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-black text-sm lg:text-lg">{tokens}</span>
            <span className="text-slate-500 text-[9px] font-bold uppercase">Tokens</span>
          </div>
        </div>

        {/* Quick Pack Shortcut */}
        <M.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onQuickPackClick}
          disabled={tokens < packCost}
          className={`relative group flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-2xl font-black text-xs lg:text-sm transition-all shadow-xl ${
            tokens >= packCost 
              ? 'bg-red-600 text-white shadow-red-600/30 hover:bg-red-500' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <ShoppingBag size={18} className={tokens >= packCost ? 'animate-bounce group-hover:animate-none' : ''} />
          <span className="hidden md:inline">BOOSTER RAPIDE</span>
          <span className="md:hidden">PACK</span>
          {tokens >= packCost && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </M.button>
      </div>
    </header>
  );
};

export default TopBar;
