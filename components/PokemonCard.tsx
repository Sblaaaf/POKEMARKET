
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Coins, Star, Zap, Shield } from 'lucide-react';
import { Pokemon, Rarity } from '../types';
import { RARITY_CONFIG, TYPE_COLORS } from '../constants';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSell?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleDeck?: (id: string) => void;
  onEvolve?: (id: string) => void;
  isInDeck?: boolean;
  interactive?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSell, onToggleFavorite, onToggleDeck, onEvolve, isInDeck, interactive = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);
  
  const glossX = useSpring(useTransform(mouseX, [0, 100], [0, 100]), springConfig);
  const glossY = useSpring(useTransform(mouseY, [0, 100], [0, 100]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(((event.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    mouseX.set(50);
    mouseY.set(50);
  };

  const rarityInfo = RARITY_CONFIG[pokemon.rarity];

  const getEvolveCost = () => {
    if (pokemon.rarity === Rarity.COMMON) return 10;
    if (pokemon.rarity === Rarity.RARE) return 20;
    if (pokemon.rarity === Rarity.EPIC) return 30;
    return 0;
  };

  const evolveCost = getEvolveCost();
  const canEvolve = pokemon.rarity !== Rarity.LEGENDARY && pokemon.rarity !== Rarity.COLLECTOR;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      // Fix: cast style to any to avoid rotateX/rotateY type errors
      style={{ rotateX, rotateY, perspective: 1000 } as any}
      className="relative w-full max-w-[280px] aspect-[2/3] group cursor-pointer"
    >
      <div className={`relative w-full h-full rounded-xl overflow-hidden border-4 ${rarityInfo.borderColor} ${rarityInfo.color} shadow-2xl transition-all duration-300 flex flex-col p-3 gap-2`}>
        
        {isInDeck && (
          <div className="absolute top-2 left-2 z-40 bg-white text-blue-600 px-2 py-0.5 rounded-full text-[9px] font-black shadow-lg flex items-center gap-1 border border-blue-100">
             <Shield size={10} fill="currentColor" /> SQUAD
          </div>
        )}

        {pokemon.isShiny && (
          <motion.div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
            style={{
              background: useTransform(
                [glossX, glossY],
                ([gx, gy]) => {
                  const valX = gx as number;
                  const valY = gy as number;
                  return `radial-gradient(circle at ${valX}% ${valY}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%), 
                          linear-gradient(${valX + valY + 45}deg, transparent 40%, rgba(255,255,255,0.15) 48%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 52%, transparent 60%)`;
                }
              )
            }}
          />
        )}

        <div className="flex justify-end items-start z-30">
          <div className="flex gap-1">
            {onToggleDeck && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleDeck(pokemon.instanceId); }}
                className={`p-1 rounded-lg transition-all ${isInDeck ? 'bg-blue-500 text-white' : 'bg-black/20 text-white/50 hover:text-white'}`}
                title={isInDeck ? "Retirer de l'équipe" : "Ajouter à l'équipe"}
              >
                <Shield size={16} />
              </button>
            )}
            {onEvolve && canEvolve && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEvolve(pokemon.instanceId); }}
                  className="bg-blue-600/80 hover:bg-blue-500 text-white p-1 rounded-lg transition-all flex items-center gap-1 group/evolve shadow-lg"
                  title={`Évoluer pour ${evolveCost} Tokens`}
                >
                  <Zap size={14} className="group-hover/evolve:animate-bounce" />
                  <span className="text-[10px] font-black pr-1">{evolveCost}</span>
                </button>
            )}
            {onToggleFavorite && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(pokemon.instanceId); }}
                className="text-yellow-400 p-1 rounded-full hover:bg-black/20 transition-colors"
              >
                <Star size={18} className={`transition-all ${pokemon.isFavorite ? 'fill-current text-yellow-300' : 'text-white/50'}`} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-lg overflow-hidden relative flex items-center justify-center border border-white/20">
            <div className={`absolute inset-0 opacity-20 ${rarityInfo.color}`} />
            <img 
              src={pokemon.imageUrl} 
              alt={pokemon.name} 
              className={`w-full h-full object-contain p-4 drop-shadow-2xl transform transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
        </div>

        <div className="z-30 text-white space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="font-bold capitalize text-sm tracking-wide truncate drop-shadow-md">
              {pokemon.name}
            </h3>
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm ${rarityInfo.textColor}`}>
              {rarityInfo.label}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map(type => (
              <span key={type} className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded ${TYPE_COLORS[type] || 'bg-slate-500'} shadow-sm`}>
                {type}
              </span>
            ))}
          </div>

          <div className="pt-1.5 flex justify-between items-center border-t border-white/20 mt-1">
            <div className="flex items-center gap-1">
              <Coins size={12} className="text-yellow-400" />
              <span className="text-xs font-bold">{pokemon.resaleValue}</span>
            </div>
            
            {onSell && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSell(pokemon.instanceId); }}
                className="flex items-center gap-1 text-[10px] font-bold bg-green-600 text-white hover:bg-green-500 px-2 py-1 rounded-lg transition-all shadow-md group/btn"
              >
                <Coins size={10} />
                <span>VENDRE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PokemonCard;
