
import React, { useState } from 'react';
import { LayoutDashboard, Library, ShoppingBag, TrendingUp, Menu, X, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  navigateTo: (tab: string) => void;
  tokens: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, navigateTo, tokens }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'shop', icon: ShoppingBag, label: 'Market' },
    { id: 'collection', icon: Library, label: 'Collection' },
    { id: 'analytics', icon: TrendingUp, label: 'Statistiques' },
  ];

  const handleNavClick = (id: string) => {
    navigateTo(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header Toggle (Only visible on mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 px-4 flex items-center justify-between z-[60] pointer-events-none">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="pointer-events-auto w-12 h-12 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Persistent Desktop Sidebar */}
      <aside id="sidebar-desktop" className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-800/50 z-[70] flex-col shadow-2xl">
        <SidebarContent activeTab={activeTab} handleNavClick={handleNavClick} menuItems={menuItems} />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.aside
              id="sidebar-mobile-drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-800/50 z-[80] flex flex-col shadow-2xl lg:hidden"
            >
              <SidebarContent activeTab={activeTab} handleNavClick={handleNavClick} menuItems={menuItems} />
            </motion.aside>
            <motion.div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[75] lg:hidden"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Extracted internal content for reuse between fixed and drawer versions
const SidebarContent = ({ activeTab, handleNavClick, menuItems }: any) => (
  <>
    <div className="p-10 flex flex-col items-center text-center gap-2">
      <div className="relative group">
        <div className="absolute -inset-2 bg-red-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative w-16 h-16 bg-red-600 rounded-full flex items-center justify-center border-[3px] border-slate-950 shadow-2xl">
          <div className="w-6 h-6 bg-white rounded-full border-[2px] border-slate-950 shadow-inner" />
          <div className="absolute w-full h-1 bg-slate-950 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <h1 className="font-black text-2xl tracking-tighter text-white italic">
        POKÉ<span className="text-red-600">MARKET</span>
      </h1>
    </div>

    <nav className="flex-1 px-6 space-y-2 mt-4">
      {menuItems.map((item: any) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 group ${
            activeTab === item.id
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20 scale-[1.02]'
              : 'text-slate-500 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-600 group-hover:text-red-500 transition-colors'} />
          <span className="text-sm tracking-wide">{item.label}</span>
          {activeTab === item.id && (
            <motion.div 
              layoutId="active-pill"
              className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
            />
          )}
        </button>
      ))}
    </nav>

    <div className="p-8 border-t border-slate-900/50 mt-auto bg-slate-950/50 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-bold text-slate-400">SERVEURS ONLINE</span>
          </div>
          <a href="https://github.com" target="_blank" className="flex items-center gap-2 text-slate-600 hover:text-white text-[11px] font-bold transition-colors group">
            <Github size={14} className="group-hover:rotate-12 transition-transform" />
            <span>VERSION 1.2.0 - BETA</span>
          </a>
        </div>
    </div>
  </>
);

export default Sidebar;
