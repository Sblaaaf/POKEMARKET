
import React, { useState } from 'react';
import { LayoutDashboard, Library, ShoppingBag, TrendingUp, Menu, X, Github, Shield, Moon, Sun, Swords, Grid, Gavel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  navigateTo: (tab: string) => void;
  tokens: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, navigateTo, tokens, theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const M = motion as any;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'pokedex', icon: Grid, label: 'Pokedex Global' },
    { id: 'deck', icon: Shield, label: 'Mon Équipe' },
    { id: 'battle', icon: Swords, label: 'Arène Combat' },
    { id: 'auctions', icon: Gavel, label: 'Enchères' },
    { id: 'analytics', icon: TrendingUp, label: 'Statistiques' },
    { id: 'shop', icon: ShoppingBag, label: 'Market' },
    { id: 'collection', icon: Library, label: 'Collection' },
  ];

  const handleNavClick = (id: string) => {
    navigateTo(id);
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 px-4 flex items-center justify-between z-[100] pointer-events-none">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="pointer-events-auto w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-white transition-all shadow-xl"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/50 z-[70] flex-col shadow-2xl">
        <SidebarContent activeTab={activeTab} handleNavClick={handleNavClick} menuItems={menuItems} theme={theme} toggleTheme={toggleTheme} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden">
            <M.div 
              key="mobile-overlay"
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
            />
            <M.aside 
              key="mobile-sidebar"
              initial={{ x: -300 }} 
              animate={{ x: 0 }} 
              exit={{ x: -300 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/50 flex flex-col shadow-2xl"
            >
              <SidebarContent activeTab={activeTab} handleNavClick={handleNavClick} menuItems={menuItems} theme={theme} toggleTheme={toggleTheme} />
            </M.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({ activeTab, handleNavClick, menuItems, theme, toggleTheme }: any) => (
  <>
    <div className="p-10 flex flex-col items-center text-center gap-2">
      <div className="relative group">
        <div className="absolute -inset-2 bg-red-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative w-16 h-16 bg-red-600 rounded-full flex items-center justify-center border-[3px] border-white dark:border-slate-950 shadow-2xl">
          <div className="w-6 h-6 bg-white rounded-full border-[2px] border-slate-900 shadow-inner" />
          <div className="absolute w-full h-1 bg-slate-900 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <h1 className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white italic">POKÉ<span className="text-red-600">MARKET</span></h1>
    </div>

    <nav className="flex-1 px-6 space-y-1 mt-4">
      {menuItems.map((item: any) => (
        <button 
          key={item.id} 
          onClick={() => handleNavClick(item.id)} 
          className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-bold transition-all duration-300 group ${activeTab === item.id ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20 scale-[1.02]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'}`}
        >
          <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-600 group-hover:text-red-500 transition-colors'} />
          <span className="text-xs tracking-wide uppercase">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="p-6 space-y-6 border-t border-slate-200 dark:border-slate-900/50 mt-auto bg-slate-50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-900 rounded-xl">
           <span className="text-[10px] font-black text-slate-500 uppercase px-2">Thème</span>
           <button onClick={toggleTheme} className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
              <div className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500'}`}><Moon size={14} /></div>
              <div className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500'}`}><Sun size={14} /></div>
           </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marché Ouvert</span>
          </div>
          <a href="#" className="flex items-center gap-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white text-[9px] font-bold transition-colors group uppercase tracking-widest">
            <Github size={12} />
            <span>VERSION 1.8.1 - STABLE</span>
          </a>
        </div>
    </div>
  </>
);

export default Sidebar;
