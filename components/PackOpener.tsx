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
  const [quantity, setQuantity] = useState(1);

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
        cost = PACK_COST * quantity;
        numPacks = quantity;
        break;
      case 'guaranteed':
        cost = GUARANTEED_PACK_COST;
        break;
      case 'collector':
        cost = GUARANTEED_COLLECTOR_PACK_COST;
        break;
    }

    if (tokens < cost) return;

    setIsOpening(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // FIX: Explicitly type the async function's return to satisfy the type predicate below.
    // This prevents TypeScript from inferring a too-specific type for `instanceId`.
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

  return (
    <div id="pack-opener-container" className="w-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-4xl w-full text-center space-y-8">
        {!result && !isOpening && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8 items-start"
          >
            {/* Standard Pack */}
            <div className="md:col-span-2 space-y-4 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h2 className="text-3xl font-black text-white">Booster Standard</h2>
              <div className="relative mx-auto w-48 h-64 bg-slate-800 rounded-2xl border-4 border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl group cursor-pointer" onClick={() => handleOpenPack('standard')}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-800 opacity-80" />
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-black -translate-y-1/2 z-10" /><div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-4 border-black z-20 flex items-center justify-center"><div className="w-8 h-8 bg-slate-200 rounded-full border-2 border-slate-400" /></div>
                <Sparkles className="absolute top-4 right-4 text-white opacity-40 group-hover:opacity-100 transition-opacity" /><div className="z-30 mt-32 text-white font-black text-xl italic tracking-widest drop-shadow-lg">BOOSTER</div>
              </div>
              <div className="flex items-center justify-center gap-4">
                 <label htmlFor="quantity" className="text-slate-400 font-bold">Quantité:</label>
                 <select id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white">
                    {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
                 </select>
              </div>
              <button onClick={() => handleOpenPack('standard')} disabled={tokens < (PACK_COST * quantity)} className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl ${tokens >= (PACK_COST * quantity) ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                <ShoppingBag size={24} /> ACHETER ({PACK_COST * quantity} TOKENS)
              </button>
            </div>

            {/* Guaranteed & Collector Packs */}
            <div className="space-y-6">
              <div className="space-y-4 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <h3 className="text-2xl font-black text-amber-400">Booster Garanti</h3>
                <p className="text-slate-400 text-sm">Garantit une carte Rare, Épique ou Légendaire.</p>
                <button onClick={() => handleOpenPack('guaranteed')} disabled={tokens < GUARANTEED_PACK_COST} className={`w-full py-3 rounded-xl font-black text-base flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl ${tokens >= GUARANTEED_PACK_COST ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  <ShieldCheck size={20} /> ({GUARANTEED_PACK_COST} TOKENS)
                </button>
              </div>
              <div className="space-y-4 p-6 bg-slate-900/50 border border-fuchsia-500/30 rounded-2xl">
                <h3 className="text-2xl font-black text-fuchsia-400">Collector Garanti</h3>
                <p className="text-slate-400 text-sm">Garantit une carte Collector.</p>
                <button onClick={() => handleOpenPack('collector')} disabled={tokens < GUARANTEED_COLLECTOR_PACK_COST} className={`w-full py-3 rounded-xl font-black text-base flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl ${tokens >= GUARANTEED_COLLECTOR_PACK_COST ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  <Gem size={20} /> ({GUARANTEED_COLLECTOR_PACK_COST} TOKENS)
                </button>
              </div>
            </div>
            {tokens < PACK_COST && <p className="text-red-400 text-sm font-bold md:col-span-3">Solde insuffisant pour le booster standard</p>}
          </motion.div>
        )}

        {isOpening && (
          <div className="flex flex-col items-center gap-6 py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-24 h-24 border-8 border-red-600 border-t-slate-800 rounded-full" />
            <div className="space-y-2"><h3 className="text-2xl font-black text-white italic animate-pulse">OUVERTURE DU PACK...</h3><p className="text-slate-400">Le destin est en marche</p></div>
          </div>
        )}

        <AnimatePresence>
          {result && !isOpening && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-8">
                {result.map((pokemon, index) => (
                  <motion.div
                    key={pokemon.instanceId}
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 120, delay: index * 0.1 }}
                  >
                    <PokemonCard pokemon={pokemon} interactive={false} />
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setResult(null)} className="mt-8 text-slate-400 hover:text-white font-bold py-2 transition-colors">Ouvrir un autre pack</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PackOpener;
