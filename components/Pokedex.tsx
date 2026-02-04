
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Info, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

interface PokedexProps {
  discovered: number[];
}

const TOTAL_POKEMON = 1025;
const PER_PAGE = 50;

const Pokedex: React.FC<PokedexProps> = ({ discovered }) => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const completion = ((discovered.length / TOTAL_POKEMON) * 100).toFixed(1);
  const totalPages = Math.ceil(TOTAL_POKEMON / PER_PAGE);

  const entries = useMemo(() => {
    return Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);
  }, []);

  const filteredEntries = entries.filter(id => {
    if (!searchTerm) return true;
    return id.toString().includes(searchTerm);
  });

  const displayedEntries = filteredEntries.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const M = motion as any;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase">Pokedex Global</h2>
            <p className="text-slate-400 text-lg font-medium">Suivez votre progression vers la collection complète de tous les Pokémon connus.</p>
          </div>
          <div className="bg-slate-950/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center min-w-[200px]">
             <div className="text-5xl font-black text-red-500">{completion}%</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Completion ({discovered.length} / {TOTAL_POKEMON})</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par ID..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setPage(Math.max(0, page - 1))} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-white hover:bg-slate-800 transition-all"><ChevronLeft /></button>
           <span className="text-xs font-black text-slate-400">PAGE {page + 1} / {totalPages}</span>
           <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-white hover:bg-slate-800 transition-all"><ChevronRight /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
        {displayedEntries.map(id => {
          const isDiscovered = discovered.includes(id);
          return (
            <M.div 
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 p-2 relative group overflow-hidden ${isDiscovered ? 'bg-slate-900 border-slate-700' : 'bg-slate-950 border-slate-900 opacity-50'}`}
            >
              <span className="absolute top-2 left-2 text-[8px] font-black text-slate-600">#{id.toString().padStart(4, '0')}</span>
              {isDiscovered ? (
                <>
                  <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`} 
                    alt="Pokemon" 
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors pointer-events-none" />
                </>
              ) : (
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                   <Info size={24} className="text-slate-700" />
                </div>
              )}
            </M.div>
          );
        })}
      </div>
    </div>
  );
};

export default Pokedex;
