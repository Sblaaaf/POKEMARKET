
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Zap, Trophy, Skull, RefreshCw, Star } from 'lucide-react';
import { Pokemon } from '../types';
import { RARITY_CONFIG } from '../constants';
import PokemonCard from './PokemonCard';

interface BattleSimulatorProps {
  squad: Pokemon[];
  onWin: (tokens: number) => void;
}

const BattleSimulator: React.FC<BattleSimulatorProps> = ({ squad, onWin }) => {
  const [isFighting, setIsFighting] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [userHealth, setUserHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [battleResult, setBattleResult] = useState<'win' | 'loss' | null>(null);
  // Fix: cast motion to any to avoid JSX property errors
  const M = motion as any;

  const calculatePower = (p: Pokemon) => {
    const base = p.resaleValue;
    const mult = (RARITY_CONFIG[p.rarity] as any).powerMultiplier || 1;
    return Math.floor(base * mult);
  };

  const squadPower = squad.reduce((sum, p) => sum + calculatePower(p), 0);
  const enemyPowerBase = 150 + Math.random() * 200; // Scalable later

  const startBattle = async () => {
    if (squad.length === 0) return;
    
    setIsFighting(true);
    setBattleLog(["Le combat commence !"]);
    setUserHealth(100);
    setEnemyHealth(100);
    setBattleResult(null);

    // Simulated rounds
    for (let i = 1; i <= 5; i++) {
      await new Promise(r => setTimeout(r, 1000));
      
      const userStrike = Math.floor((squadPower / 10) * (0.8 + Math.random() * 0.4));
      const enemyStrike = Math.floor((enemyPowerBase / 10) * (0.8 + Math.random() * 0.4));
      
      setEnemyHealth(prev => Math.max(0, prev - userStrike));
      setUserHealth(prev => Math.max(0, prev - enemyStrike));
      
      setBattleLog(prev => [
        `Round ${i}: Votre équipe inflige ${userStrike} dégâts. L'adversaire riposte avec ${enemyStrike}.`,
        ...prev
      ]);

      if (userHealth <= 0 || enemyHealth <= 0) break;
    }

    setIsFighting(false);
    if (userHealth > enemyHealth) {
      setBattleResult('win');
      onWin(15 + Math.floor(squadPower / 50));
    } else {
      setBattleResult('loss');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-amber-900 rounded-[2.5rem] p-8 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Swords size={300} /></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest">Arène de Combat</div>
          <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter leading-none uppercase">Squad Clash<br/>Simulator</h2>
          <p className="text-orange-100 text-lg font-medium opacity-80">Lancez votre équipe de 6 Pokémon dans l'arène. La puissance totale est calculée selon la rareté et la valeur de vos cartes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {battleResult ? (
                <M.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 z-20">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${battleResult === 'win' ? 'bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]'}`}>
                    {battleResult === 'win' ? <Trophy size={48} /> : <Skull size={48} />}
                  </div>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter">{battleResult === 'win' ? 'Victoire !' : 'Défaite...'}</h3>
                  <button onClick={() => setBattleResult(null)} className="px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all">RETOUR</button>
                </M.div>
              ) : isFighting ? (
                <div className="w-full flex flex-col items-center gap-12 z-20">
                   <div className="w-full max-w-md space-y-4">
                      <div className="flex justify-between items-end"><span className="text-xs font-black uppercase text-blue-400">VOTRE SQUAD</span><span className="text-xl font-black">{userHealth}%</span></div>
                      <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700"><M.div className="h-full bg-blue-500" initial={{ width: "100%" }} animate={{ width: `${userHealth}%` }} /></div>
                      
                      <div className="py-4 flex justify-center"><Swords size={40} className="text-red-500 animate-bounce" /></div>

                      <div className="flex justify-between items-end"><span className="text-xs font-black uppercase text-red-400">ADVERSAIRE</span><span className="text-xl font-black">{enemyHealth}%</span></div>
                      <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700"><M.div className="h-full bg-red-500" initial={{ width: "100%" }} animate={{ width: `${enemyHealth}%` }} /></div>
                   </div>
                </div>
              ) : (
                <div className="text-center space-y-8 z-20">
                  <div className="flex items-center justify-center gap-10">
                     <div className="flex flex-col items-center">
                        <div className="text-4xl font-black text-blue-400">{squadPower}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Puissance Squad</div>
                     </div>
                     <Swords className="text-slate-700" size={32} />
                     <div className="flex flex-col items-center">
                        <div className="text-4xl font-black text-red-500">???</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Puissance Ennemie</div>
                     </div>
                  </div>
                  {squad.length > 0 ? (
                    <button onClick={startBattle} className="px-12 py-5 bg-red-600 text-white font-black rounded-[2rem] shadow-xl shadow-red-600/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-4 text-xl"><Zap size={24} />DÉMARRER LE COMBAT</button>
                  ) : (
                    <p className="text-slate-500 font-bold">Ajoutez des membres à votre Squad pour combattre !</p>
                  )}
                </div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/5 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] h-[200px] overflow-y-auto font-mono text-xs space-y-2">
             <div className="sticky top-0 bg-slate-900 pb-2 mb-2 border-b border-slate-800 font-bold uppercase text-[10px] text-slate-500 tracking-widest">Journal de Combat</div>
             {battleLog.map((log, i) => <div key={i} className="text-slate-400"><span className="text-slate-600 mr-2">[{battleLog.length - i}]</span>{log}</div>)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem]">
             <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tighter"><Shield size={20} className="text-blue-500" />Votre Squad ({squad.length}/6)</h3>
             <div className="space-y-4">
                {squad.map(p => (
                   <div key={p.instanceId} className="flex items-center gap-4 p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-contain" />
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-xs truncate capitalize">{p.name}</h4>
                            <span className="text-[8px] font-black text-blue-400">PWR {calculatePower(p)}</span>
                         </div>
                         <div className="text-[8px] text-slate-500 uppercase font-black">{p.rarity}</div>
                      </div>
                   </div>
                ))}
                {squad.length === 0 && <p className="text-slate-600 text-center py-10 text-xs italic">Aucun membre sélectionné</p>}
             </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-slate-800 p-6 rounded-[2rem] text-center space-y-4">
             <Trophy size={40} className="mx-auto text-yellow-500" />
             <h3 className="font-black text-white uppercase tracking-tighter">Récompenses de Victoire</h3>
             <p className="text-xs text-slate-400 leading-relaxed">Les victoires vous rapportent des tokens basés sur votre puissance. Les combattants d'élite peuvent amasser une fortune !</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleSimulator;
