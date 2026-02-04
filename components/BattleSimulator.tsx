
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Zap, Trophy, Skull, RefreshCw, Star, Info } from 'lucide-react';
import { Pokemon } from '../types';
import { RARITY_CONFIG } from '../constants';
import { fetchPokemonData, getRandomId } from '../services/pokeApi';

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
  const [enemySquad, setEnemySquad] = useState<any[]>([]);
  const [isLoadingEnemy, setIsLoadingEnemy] = useState(false);

  const M = motion as any;

  const calculatePower = (p: Pokemon) => {
    const base = p.resaleValue;
    const mult = (RARITY_CONFIG[p.rarity] as any).powerMultiplier || 1;
    return Math.floor(base * mult);
  };

  const squadPower = squad.reduce((sum, p) => sum + calculatePower(p), 0);
  const enemyPowerBase = enemySquad.reduce((sum, p) => sum + p.power, 0);

  const generateEnemy = async () => {
    setIsLoadingEnemy(true);
    const newEnemySquad = [];
    const count = Math.max(1, squad.length);
    for (let i = 0; i < count; i++) {
      const id = getRandomId();
      const data = await fetchPokemonData(id);
      if (data) {
        // Random rarity for enemy
        const rands = [0.05, 0.15, 0.4, 0.8, 1];
        const rand = Math.random();
        let powerMult = 1;
        let rarityName = 'Commun';
        if (rand < rands[0]) { powerMult = 10; rarityName = 'Collector'; }
        else if (rand < rands[1]) { powerMult = 5; rarityName = 'Légendaire'; }
        else if (rand < rands[2]) { powerMult = 2.5; rarityName = 'Épique'; }
        else if (rand < rands[3]) { powerMult = 1.5; rarityName = 'Rare'; }
        
        const baseVal = Math.floor(Math.random() * 20) + 5;
        newEnemySquad.push({
          ...data,
          power: Math.floor(baseVal * powerMult),
          rarity: rarityName
        });
      }
    }
    setEnemySquad(newEnemySquad);
    setIsLoadingEnemy(false);
  };

  useEffect(() => {
    if (squad.length > 0 && enemySquad.length === 0) {
      generateEnemy();
    }
  }, [squad]);

  const startBattle = async () => {
    if (squad.length === 0 || enemySquad.length === 0) return;
    
    setIsFighting(true);
    setBattleLog(["Le combat commence !"]);
    let currentUHealth = 100;
    let currentEHealth = 100;
    setUserHealth(100);
    setEnemyHealth(100);
    setBattleResult(null);

    // Predict victory based on power ratio for stability, but simulate with some variance
    const powerRatio = squadPower / Math.max(1, enemyPowerBase);
    
    // Simulated rounds
    for (let i = 1; i <= 6; i++) {
      await new Promise(r => setTimeout(r, 800));
      
      // Fixed logic: Dmg is proportional to power
      // User damage
      const userStrike = Math.floor((squadPower / 12) * (0.9 + Math.random() * 0.4));
      // Enemy damage (scaled to squad power to keep it challenging but fair)
      const enemyStrike = Math.floor((enemyPowerBase / 12) * (0.9 + Math.random() * 0.4));
      
      currentEHealth = Math.max(0, currentEHealth - userStrike);
      currentUHealth = Math.max(0, currentUHealth - enemyStrike);

      setEnemyHealth(currentEHealth);
      setUserHealth(currentUHealth);
      
      setBattleLog(prev => [
        `Tour ${i}: Votre équipe inflige ${userStrike} dégâts. L'ennemi riposte avec ${enemyStrike}.`,
        ...prev
      ]);

      if (currentUHealth <= 0 || currentEHealth <= 0) break;
    }

    setIsFighting(false);
    // Final check based on remaining health or absolute power if it was a draw
    if (currentUHealth > currentEHealth || (currentUHealth === currentEHealth && squadPower >= enemyPowerBase)) {
      setBattleResult('win');
      onWin(Math.floor(20 + squadPower * 0.1));
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
          <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter leading-none uppercase">Squad Clash</h2>
          <p className="text-orange-100 text-lg font-medium opacity-80">Lancez votre équipe de 6 Pokémon dans l'arène. La puissance totale est calculée selon la rareté et la valeur de vos cartes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden shadow-sm">
            <AnimatePresence mode="wait">
              {battleResult ? (
                <M.div key="result" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 z-20">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${battleResult === 'win' ? 'bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]'}`}>
                    {battleResult === 'win' ? <Trophy size={48} className="text-white" /> : <Skull size={48} className="text-white" />}
                  </div>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">{battleResult === 'win' ? 'Victoire !' : 'Défaite...'}</h3>
                  <button onClick={() => { setBattleResult(null); generateEnemy(); }} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-xl">NOUVEAU DÉFI</button>
                </M.div>
              ) : isFighting ? (
                <M.div key="fighting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-10 z-20">
                   <div className="w-full max-w-md space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end"><span className="text-xs font-black uppercase text-blue-500 tracking-widest">VOTRE SQUAD</span><span className="text-xl font-black text-slate-900 dark:text-white">{userHealth}%</span></div>
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                          <M.div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" initial={{ width: "100%" }} animate={{ width: `${userHealth}%` }} />
                        </div>
                      </div>
                      
                      <div className="py-4 flex justify-center relative">
                        <Swords size={48} className="text-red-600 animate-pulse" />
                        <M.div animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-red-600 rounded-full blur-3xl -z-10" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end"><span className="text-xs font-black uppercase text-red-500 tracking-widest">ADVERSAIRE</span><span className="text-xl font-black text-slate-900 dark:text-white">{enemyHealth}%</span></div>
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                          <M.div className="h-full bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]" initial={{ width: "100%" }} animate={{ width: `${enemyHealth}%` }} />
                        </div>
                      </div>
                   </div>
                </M.div>
              ) : (
                <M.div key="prepare" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-10 z-20">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                     <div className="flex flex-col items-center gap-3">
                        <div className="text-5xl font-black text-blue-500 drop-shadow-sm">{squadPower}</div>
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Puissance Squad</div>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full shadow-inner">
                       <Swords className="text-slate-400 dark:text-slate-600" size={32} />
                     </div>
                     <div className="flex flex-col items-center gap-3">
                        {isLoadingEnemy ? (
                          <RefreshCw className="animate-spin text-slate-300" size={40} />
                        ) : (
                          <div className="text-5xl font-black text-red-500 drop-shadow-sm">{enemyPowerBase}</div>
                        )}
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Puissance Ennemie</div>
                     </div>
                  </div>
                  {squad.length > 0 ? (
                    <button onClick={startBattle} className="px-12 py-5 bg-red-600 text-white font-black rounded-[2rem] shadow-2xl shadow-red-600/30 hover:scale-105 transition-all active:scale-95 flex items-center gap-4 text-xl">
                      <Zap size={24} fill="currentColor" />
                      DÉMARRER LE COMBAT
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                      <Info className="text-slate-400" />
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Ajoutez des membres à votre Squad pour combattre !</p>
                    </div>
                  )}
                </M.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/5 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] h-[200px] overflow-y-auto font-mono text-xs space-y-2 shadow-sm">
             <div className="sticky top-0 bg-white dark:bg-slate-900 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 font-black uppercase text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em]">Journal de Combat</div>
             {battleLog.map((log, i) => <div key={i} className="text-slate-600 dark:text-slate-400 py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0"><span className="text-slate-400 dark:text-slate-600 mr-3 font-black">[{battleLog.length - i}]</span>{log}</div>)}
             {battleLog.length === 0 && <p className="text-slate-400 italic text-center py-10 uppercase tracking-widest opacity-50">En attente du signal...</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm">
             <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter"><Shield size={20} className="text-red-500" />Adversaire Actuel</h3>
             <div className="space-y-3">
                {isLoadingEnemy ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl animate-pulse" />
                  ))
                ) : enemySquad.map((p, i) => (
                   <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-contain drop-shadow-md" />
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center">
                            <h4 className="font-bold text-xs truncate capitalize text-slate-900 dark:text-white">{p.name}</h4>
                            <span className="text-[9px] font-black text-red-500">PWR {p.power}</span>
                         </div>
                         <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest">{p.rarity}</div>
                      </div>
                   </div>
                ))}
                {!isLoadingEnemy && enemySquad.length === 0 && <p className="text-slate-400 text-center py-10 text-xs italic">Aucun adversaire en vue</p>}
             </div>
             <button 
                onClick={generateEnemy} 
                disabled={isFighting}
                className="w-full mt-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
             >
                Actualiser l'adversaire
             </button>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/5 dark:from-indigo-900/40 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 p-8 rounded-[2rem] text-center space-y-4 shadow-sm">
             <Trophy size={40} className="mx-auto text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
             <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Récompenses d'Élite</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Les victoires vous rapportent des tokens basés sur votre puissance. Les combattants d'élite peuvent amasser une fortune !</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleSimulator;
