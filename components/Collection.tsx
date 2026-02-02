
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fixed: Replaced missing ArrowDownWideEqual and ArrowUpWideEqual with ArrowDown and ArrowUp
import { LayoutGrid, GalleryHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, SortAsc, SortDesc, Search, Star, ArrowDown, ArrowUp } from 'lucide-react';
import { Pokemon, Rarity } from '../types';
import { TYPE_COLORS } from '../constants';
import PokemonCard from './PokemonCard';

interface CollectionProps {
  collection: Pokemon[];
  onSell: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEvolve: (id: string) => void;
}

const Collection: React.FC<CollectionProps> = ({ collection, onSell, onToggleFavorite, onEvolve }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'value' | 'rarity'>('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Extract all available types for the filter
  const allTypes = Array.from(new Set(collection.flatMap(p => p.types))).sort();

  const filteredCollection = collection.filter(p => {
    const matchesRarity = filterRarity === 'all' || p.rarity === filterRarity;
    const matchesType = filterType === 'all' || p.types.includes(filterType);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || p.isFavorite;
    return matchesRarity && matchesType && matchesSearch && matchesFavorites;
  }).sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    
    let comparison = 0;
    if (sortBy === 'value') comparison = b.resaleValue - a.resaleValue;
    else if (sortBy === 'newest') comparison = b.timestamp - a.timestamp;
    else if (sortBy === 'rarity') {
        const rarities = [Rarity.COLLECTOR, Rarity.LEGENDARY, Rarity.EPIC, Rarity.RARE, Rarity.COMMON];
        comparison = rarities.indexOf(a.rarity) - rarities.indexOf(b.rarity);
    }

    return sortOrder === 'desc' ? comparison : -comparison;
  });

  useEffect(() => {
    if (filteredCollection.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredCollection.length) {
      setCurrentIndex(filteredCollection.length - 1);
    }
  }, [filteredCollection.length, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [searchTerm, filterRarity, filterType, sortBy, sortOrder, showFavoritesOnly]);

  const nextSlide = () => {
    if (filteredCollection.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % filteredCollection.length);
  };
  
  const prevSlide = () => {
    if (filteredCollection.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + filteredCollection.length) % filteredCollection.length);
  };
  
  const goToStart = () => setCurrentIndex(0);
  const goToEnd = () => {
    if (filteredCollection.length > 0) {
      setCurrentIndex(filteredCollection.length - 1);
    }
  };

  if (collection.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-2 border-slate-700">
           <Search size={40} className="text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ta collection est vide</h2>
        <p className="text-slate-400 max-w-xs">Achète ton premier booster dans le market pour commencer ton aventure !</p>
      </div>
    );
  }

  const currentItem = filteredCollection[currentIndex];

  return (
    <div id="collection-container" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="sticky top-[-1px] z-30 pt-4 pb-6 bg-slate-950 shadow-2xl border-b border-slate-800/50 -mx-4 px-4 lg:-mx-12 lg:px-12 transition-all">
        <div className="flex flex-col gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-[1.5rem] border border-slate-800 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="flex bg-slate-800 rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'}`}><LayoutGrid size={20} /></button>
                <button onClick={() => setViewMode('carousel')} className={`p-2 rounded-lg transition-all ${viewMode === 'carousel' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'}`}><GalleryHorizontal size={20} /></button>
              </div>
              <div className="relative flex-1 min-w-[200px]">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <input type="text" placeholder="Rechercher..." className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 placeholder:text-slate-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs font-bold ${showFavoritesOnly ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}><Star size={14} className={showFavoritesOnly ? 'fill-current' : ''} /> Favoris</button>
              <div className="h-8 w-px bg-slate-800 mx-1 hidden lg:block" />
              <div className="flex items-center gap-2 flex-1 lg:flex-none">
                <Filter size={16} className="text-slate-400 shrink-0" />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs lg:text-sm focus:outline-none appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat">
                  <option value="all">Tous Types</option>
                  {allTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)} className="w-full lg:w-auto bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs lg:text-sm focus:outline-none appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat">
                <option value="all">Raretés</option>
                {Object.values(Rarity).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-3">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortAsc size={16} className="text-slate-400 shrink-0" />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs lg:text-sm focus:outline-none appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.15rem_1.15rem] bg-[right_0.4rem_center] bg-no-repeat">
                    <option value="newest">Plus récents</option><option value="value">Valeur</option><option value="rarity">Rareté</option>
                  </select>
                </div>
                <button 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  title={sortOrder === 'asc' ? 'Ascendant' : 'Descendant'}
                >
                  {sortOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                </button>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filteredCollection.length} Pokémon trouvés</p>
          </div>
        </div>
      </div>

      {filteredCollection.length === 0 ? (
        <div className="text-center py-20 text-slate-500 italic">Aucun Pokémon ne correspond à ces critères</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center pb-20 mt-4">
          {filteredCollection.map(pokemon => (
            <motion.div key={pokemon.instanceId} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <PokemonCard 
                pokemon={pokemon} 
                onSell={onSell} 
                onToggleFavorite={onToggleFavorite} 
                onEvolve={onEvolve}
              />
            </motion.div>
          ))}
        </div>
      ) : currentItem ? (
        <div className="relative flex flex-col items-center justify-center min-h-[60vh] py-8 gap-8">
          <div className="flex items-center gap-8 w-full max-w-5xl justify-center">
            <div className="hidden md:flex flex-col gap-4">
               <button onClick={goToStart} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors shadow-lg"><ChevronsLeft /></button>
               <button onClick={prevSlide} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors shadow-lg"><ChevronLeft size={32} /></button>
            </div>

            <div className="relative w-full max-w-[320px] h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div key={currentItem.instanceId} initial={{ opacity: 0, x: 100, rotateY: 45 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -100, rotateY: -45 }} transition={{ type: "spring", damping: 15 }} className="absolute inset-0 flex items-center justify-center">
                  <PokemonCard 
                    pokemon={currentItem} 
                    onSell={onSell} 
                    onToggleFavorite={onToggleFavorite} 
                    onEvolve={onEvolve}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden md:flex flex-col gap-4">
               <button onClick={goToEnd} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors shadow-lg"><ChevronsRight /></button>
               <button onClick={nextSlide} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors shadow-lg"><ChevronRight size={32} /></button>
            </div>
          </div>

          <div className="flex items-center gap-6 md:hidden">
             <button onClick={prevSlide} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400"><ChevronLeft /></button>
             <span className="text-white font-bold">{currentIndex + 1} / {filteredCollection.length}</span>
             <button onClick={nextSlide} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400"><ChevronRight /></button>
          </div>

          <div className="text-center bg-slate-900/50 px-8 py-4 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
             <h2 className="text-2xl font-black text-white capitalize tracking-tighter">{currentItem.name}</h2>
             <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{currentItem.rarity}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-xs font-bold text-yellow-500">{currentItem.resaleValue} Tokens</span>
             </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Collection;
