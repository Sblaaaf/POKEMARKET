
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Coins, Star } from 'lucide-react';
import { Pokemon } from '../types';
import { RARITY_CONFIG, TYPE_COLORS } from '../constants';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSell?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  interactive?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSell, onToggleFavorite, interactive = true }) => {
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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative w-full max-w-[280px] aspect-[2/3] group cursor-pointer"
    >
      <div className={`relative w-full h-full rounded-xl overflow-hidden border-4 ${rarityInfo.borderColor} ${rarityInfo.color} shadow-2xl transition-all duration-300 flex flex-col p-3 gap-2`}>
        
        {/* Shiny Bug Fix: Use 'overlay' which is less harsh than 'color-dodge' and avoids chromatic aberration. */}
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

        {pokemon.isShiny && (
          <div className="absolute inset-0 z-20 pointer-events-none opacity-40 overflow-hidden">
             {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}>
                  <Sparkles size={12} className="text-white" />
                </div>
             ))}
          </div>
        )}

        <div className="flex justify-between items-start z-30">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm ${rarityInfo.textColor}`}>
            {rarityInfo.label}
          </span>
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(pokemon.instanceId); }}
              className="text-yellow-400 p-1 rounded-full hover:bg-black/20 transition-colors"
              aria-label="Toggle favorite"
            >
              <Star size={18} className={`transition-all ${pokemon.isFavorite ? 'fill-current text-yellow-300' : 'text-white/50'}`} />
            </button>
          )}
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-lg overflow-hidden relative flex items-center justify-center border border-white/20">
            <div className={`absolute inset-0 opacity-20 ${rarityInfo.color}`} />
            <img 
              src={pokemon.imageUrl} 
              alt={pokemon.name} 
              className={`w-full h-full object-contain p-4 drop-shadow-2xl transform transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
        </div>

        <div className="z-30 text-white space-y-2">
          <h3 className="font-bold capitalize text-lg tracking-wide truncate drop-shadow-md">
            {pokemon.name}
          </h3>
          
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map(type => (
              <span key={type} className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${TYPE_COLORS[type] || 'bg-slate-500'} shadow-sm`}>
                {type}
              </span>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-white/20 mt-1">
            <div className="flex items-center gap-1">
              <Coins size={14} className="text-yellow-400" />
              <span className="text-sm font-bold">{pokemon.resaleValue}</span>
            </div>
            
            {onSell && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSell(pokemon.instanceId); }}
                className="flex items-center gap-1.5 text-xs font-bold bg-green-600 text-white hover:bg-green-500 px-3 py-1.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 group/btn"
              >
                <Coins size={12} />
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
