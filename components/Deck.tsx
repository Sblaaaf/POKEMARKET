
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutGrid, Zap, Sparkles } from 'lucide-react';
import { Pokemon } from '../types';
import PokemonCard from './PokemonCard';

interface DeckProps {
  collection: Pokemon[];
  deck: string[];
  onToggleDeck: (id: string) => void;
  onEvolve: (id: string) => void;
  onSell: (id: string) => void;
}

const Deck: React.FC<DeckProps> = ({ collection, deck, onToggleDeck, onEvolve, onSell }) => {
  const squad = deck.map(id => collection.find(p => p.instanceId === id)).filter(Boolean) as Pokemon[];
  // Fix: cast motion to any to avoid JSX property errors
  const M = motion as any;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-[2.5rem] p-8 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={300} /></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest">
            Bêta Squad
          </div>
          <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter leading-none uppercase">Ton Équipe<br/>d'Élite</h2>
          <p className="text-blue-100 text-lg font-medium opacity-80">Sélectionne jusqu'à 6 de tes meilleurs Pokémon pour former ton équipe ultime. Les membres de ton équipe sont marqués dans ta collection.</p>
        </div>
      </div>

      {squad.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/30 rounded-[2.5rem] border border-slate-800 border-dashed">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6"><LayoutGrid className="text-slate-600" size={32} /></div>
          <h3 className="text-2xl font-black text-white mb-2">Aucun membre dans l'équipe</h3>
          <p className="text-slate-400 max-w-xs">Va dans ta collection et clique sur l'icône de bouclier pour ajouter tes champions ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          <AnimatePresence>
            {squad.map((pokemon, index) => (
              <M.div
                key={pokemon.instanceId}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-blue-500/5 blur-2xl rounded-full -z-10 group-hover:bg-blue-500/20 transition-all duration-500" />
                <PokemonCard 
                  pokemon={pokemon} 
                  onToggleDeck={onToggleDeck} 
                  onEvolve={onEvolve}
                  onSell={onSell}
                  isInDeck={true}
                />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full border-4 border-slate-950 flex items-center justify-center font-black text-slate-950 shadow-xl z-50">
                  {index + 1}
                </div>
              </M.div>
            ))}
          </AnimatePresence>
          {squad.length < 6 && (
            <div className="aspect-[2/3] w-full max-w-[280px] rounded-xl border-4 border-slate-800 border-dashed flex flex-col items-center justify-center gap-4 text-slate-600">
               <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center"><LayoutGrid size={24} /></div>
               <p className="font-bold text-sm">Emplacement Libre</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Deck;
