
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, ShieldCheck, Gem } from 'lucide-react';
import { fetchPokemonData, getRandomId } from '../services/pokeApi';
import { Rarity, Pokemon } from '../types';
import { PACK_COST, GUARANTEED_PACK_COST, GUARANTEED_COLLECTOR_PACK_COST, RARITY_CONFIG } from '../constants';
import PokemonCard from './PokemonCard';

interface PackOpenerProps {
  tokens: number;
  onPurchase: (pokemons: Pokemon[], cost: number) => void;
  result: Pokemon[] | null;
  setResult: (pokemons: Pokemon[] | null) => void;
}

const PackOpener: React.FC<PackOpenerProps> = ({ tokens, onPurchase, result, setResult }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [stdQty, setStdQty] = useState(1);
  const [guarQty, setGuarQty] = useState(1);
  const [collQty, setCollQty] = useState(1);
  // Fix: cast motion to any to avoid JSX property errors
  const M = motion as any;

  const determineRarity = (): Rarity => {
    const rand = Math.random();
    if (rand < 0.02) return Rarity.COLLECTOR;
    if (rand < 0.06) return Rarity.LEGENDARY;
    if (rand < 0.15) return Rarity.EPIC;
    if (rand < 0.40) return Rarity.RARE;
    return Rarity.COMMON;
  };

  const determineGuaranteedRarity = (): Rarity => {
    const rand = Math.random();
    if (rand < 0.10) return Rarity.LEGENDARY;
    if (rand < 0.35) return Rarity.EPIC;
    return Rarity.RARE;
  };

  const calculateResaleValue = (rarity: Rarity): number => {
    const values = RARITY_CONFIG[rarity].possibleValues;
    return values[Math.floor(Math.random() * values.length)];
  };

  const handleOpenPack = async (packType: 'standard' | 'guaranteed' | 'collector') => {
    let cost = 0;
    let numPacks = 1;

    switch (packType) {
      case 'standard':
        cost = PACK_COST * stdQty;
        numPacks = stdQty;
        break;
      case 'guaranteed':
        cost = GUARANTEED_PACK_COST * guarQty;
        numPacks = guarQty;
        break;
      case 'collector':
        cost = GUARANTEED_COLLECTOR_PACK_COST * collQty;
        numPacks = collQty;
        break;
    }

    if (tokens < cost) return;

    setIsOpening(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const packPromises = Array(numPacks).fill(0).map(async (): Promise<Pokemon | null> => {
      const id = getRandomId();
      const pokeData = await fetchPokemonData(id);

      if (!pokeData) return null;

      let rarity: Rarity;
      if (packType === 'collector') rarity = Rarity.COLLECTOR;
      else if (packType === 'guaranteed') rarity = determineGuaranteedRarity();
      else rarity = determineRarity();
      
      const isShiny = [Rarity.EPIC, Rarity.LEGENDARY, Rarity.COLLECTOR].includes(rarity);
      const resaleValue = calculateResaleValue(rarity);

      return {
        instanceId: crypto.randomUUID(),
        ...pokeData,
        rarity, isShiny, resaleValue,
        timestamp: Date.now(),
      };
    });

    const newPokemons = (await Promise.all(packPromises)).filter((p): p is Pokemon => p !== null);

    if (newPokemons.length > 0) {
      setResult(newPokemons);
      onPurchase(newPokemons, cost);
    }
    
    setIsOpening(false);
  };

  const qtyOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div id="pack-opener-container" className="w-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-4xl w-full text-center space-y-8">
        {!result && !isOpening && (
          <M.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          >
            {/* Standard Pack */}
            <div className="lg:col-span-1 space-y-4 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col">
              <h2 className="text-2xl font-black text-white">Standard</h2>
              <div className="relative mx-auto w-32 h-44 bg-slate-800 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl group cursor-pointer" onClick={() => handleOpenPack('standard')}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-800 opacity-80" />
                <div className="absolute top-1/2 left-0 right-0 h-3 bg-black -translate-y-1/2 z-10" />
                <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-black z-20 flex items-center justify-center">
                  <div className="w-5 h-5 bg-slate-200 rounded-full border border-slate-400" />
                </div>
                <div className="z-30 mt-20 text-white font-black text-[10px] italic tracking-widest drop-shadow-lg uppercase">Booster</div>
              </div>
              
              <div className="flex-1 flex flex-col justify-end space-y-4">
                <div className="flex items-center justify-between px-2">
                   <label htmlFor="stdQty" className="text-slate-500 font-bold text-xs uppercase tracking-tighter">Quantité</label>
                   <select id="stdQty" value={stdQty} onChange={e => setStdQty(Number(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none">
                      {qtyOptions.map(q => <option key={q} value={q}>{q}</option>)}
                   </select>
                </div>
                <button onClick={() => handleOpenPack('standard')} disabled={tokens < (PACK_COST * stdQty)} className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl ${tokens >= (PACK_COST * stdQty) ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  <ShoppingBag size={18} /> {PACK_COST * stdQty} $
                </button>
              </div>
            </div>

            {/* Guaranteed Pack */}
            <div className="lg:col-span-1 space-y-4 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col">
              <h2 className="text-2xl font-black text-amber-400">Garanti</h2>
              <div className="relative mx-auto w-32 h-44 bg-slate-800 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl group cursor-pointer" onClick={() => handleOpenPack('guaranteed')}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 opacity-80" />
                <div className="absolute top-1/2 left-0 right-0 h-3 bg-black -translate-y-1/2 z-10" />
                <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-black z-20 flex items-center justify-center">
                  <ShieldCheck className="text-amber-500" size={16} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-end space-y-4">
                <p className="text-slate-500 text-[10px] font-bold uppercase">Rare à Légendaire</p>
                <div className="flex items-center justify-between px-2">
                   <label htmlFor="guarQty" className="text-slate-500 font-bold text-xs uppercase tracking-tighter">Quantité</label>
                   <select id="guarQty" value={guarQty} onChange={e => setGuarQty(Number(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm focus:ring-1 focus:ring-amber-500 outline-none">
                      {qtyOptions.map(q => <option key={q} value={q}>{q}</option>)}
                   </select>
                </div>
                <button onClick={() => handleOpenPack('guaranteed')} disabled={tokens < (GUARANTEED_PACK_COST * guarQty)} className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl ${tokens >= (GUARANTEED_PACK_COST * guarQty) ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  <ShieldCheck size={18} /> {GUARANTEED_PACK_COST * guarQty} $
                </button>
              </div>
            </div>

            {/* Collector Pack */}
            <div className="lg:col-span-1 space-y-4 p-6 bg-slate-900/50 border border-fuchsia-500/20 rounded-3xl flex flex-col">
              <h2 className="text-2xl font-black text-fuchsia-400">Collector</h2>
              <div className="relative mx-auto w-32 h-44 bg-slate-800 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl group cursor-pointer" onClick={() => handleOpenPack('collector')}>
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-fuchsia-900 opacity-80" />
                <div className="absolute top-1/2 left-0 right-0 h-3 bg-black -translate-y-1/2 z-10" />
                <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-black z-20 flex items-center justify-center">
                  <Gem className="text-fuchsia-500" size={16} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-end space-y-4">
                <p className="text-slate-500 text-[10px] font-bold uppercase">Collector Garanti</p>
                <div className="flex items-center justify-between px-2">
                   <label htmlFor="collQty" className="text-slate-500 font-bold text-xs uppercase tracking-tighter">Quantité</label>
                   <select id="collQty" value={collQty} onChange={e => setCollQty(Number(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm focus:ring-1 focus:ring-fuchsia-500 outline-none">
                      {qtyOptions.map(q => <option key={q} value={q}>{q}</option>)}
                   </select>
                </div>
                <button onClick={() => handleOpenPack('collector')} disabled={tokens < (GUARANTEED_COLLECTOR_PACK_COST * collQty)} className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl ${tokens >= (GUARANTEED_COLLECTOR_PACK_COST * collQty) ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  <Gem size={18} /> {GUARANTEED_COLLECTOR_PACK_COST * collQty} $
                </button>
              </div>
            </div>

            {tokens < PACK_COST && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest lg:col-span-3">Solde insuffisant pour un booster</p>}
          </M.div>
        )}

        {isOpening && (
          <div className="flex flex-col items-center gap-6 py-12">
            <M.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-24 h-24 border-8 border-red-600 border-t-slate-800 rounded-full" />
            <div className="space-y-2"><h3 className="text-2xl font-black text-white italic animate-pulse uppercase tracking-tighter">Ouverture des Packs...</h3><p className="text-slate-400 font-bold text-sm uppercase tracking-widest opacity-60">Le destin est en marche</p></div>
          </div>
        )}

        <AnimatePresence>
          {result && !isOpening && (
            <M.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-6">
                {result.map((pokemon, index) => (
                  <M.div
                    key={pokemon.instanceId}
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 120, delay: index * 0.05 }}
                  >
                    <PokemonCard pokemon={pokemon} interactive={false} />
                  </M.div>
                ))}
              </div>
              <button onClick={() => setResult(null)} className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700">Retour au Market</button>
            </M.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PackOpener;
