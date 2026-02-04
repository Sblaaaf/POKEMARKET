
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Coins, Library, Star, Gift, Award, CheckCircle2, History, Target, PieChart as PieIcon } from 'lucide-react';
import { GameState, Rarity } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface DashboardProps {
  state: GameState;
  onFreeTokens: () => void;
}

const RARITY_COLORS: { [key in Rarity]: string } = {
  [Rarity.COMMON]: '#94a3b8',
  [Rarity.RARE]: '#3b82f6',
  [Rarity.EPIC]: '#9333ea',
  [Rarity.LEGENDARY]: '#f59e0b',
  [Rarity.COLLECTOR]: '#d946ef',
};

const Dashboard: React.FC<DashboardProps> = ({ state, onFreeTokens }) => {
  const collectionValue = state.collection.reduce((sum, p) => sum + p.resaleValue, 0);
  const shinyCount = state.collection.filter(p => p.isShiny).length;
  const buySellRatio = state.totalSpent > 0 ? (state.totalEarned / state.totalSpent).toFixed(2) : '0.00';

  const balanceData = (state.balanceHistory || []).map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tokens: entry.amount
  }));

  const rarityData = Object.values(Rarity).map(rarity => ({
    name: rarity,
    value: state.collection.filter(p => p.rarity === rarity).length,
  })).filter(d => d.value > 0);

  // Type Distribution Data
  const typesMap: Record<string, number> = {};
  state.collection.forEach(p => {
    p.types.forEach(t => {
      typesMap[t] = (typesMap[t] || 0) + 1;
    });
  });
  const typeData = Object.entries(typesMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  const isDark = state.theme === 'dark';

  return (
    <div id="dashboard-container" className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Valeur Collection', value: collectionValue, icon: Coins, color: 'text-yellow-500' },
          { label: 'Total Pokémon', value: state.collection.length, icon: Library, color: 'text-blue-500' },
          { label: 'Cartes Shiny', value: shinyCount, icon: Star, color: 'text-purple-500' },
          { label: 'Ratio Profit', value: `${buySellRatio}x`, icon: TrendingUp, color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 ${stat.color}`}><stat.icon size={24} /></div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-sm">
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3"><Target size={24} className="text-red-500" />Missions Quotidiennes</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.dailyMissions.map((mission) => (
                   <div key={mission.id} className={`p-5 rounded-2xl border transition-all flex flex-col gap-4 ${mission.isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-500/5 dark:border-green-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'}`}>
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{mission.description}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black mt-1 tracking-wider">Récompense: {mission.reward} $</p>
                         </div>
                         {mission.isCompleted && <CheckCircle2 size={16} className="text-green-500" />}
                      </div>
                      <div className="space-y-1.5">
                         <div className="flex justify-between text-[10px] font-black tracking-widest"><span className="text-slate-400">PROGRESSION</span><span className="text-slate-700 dark:text-white">{mission.progress} / {mission.goal}</span></div>
                         <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${mission.isCompleted ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (mission.progress / mission.goal) * 100)}%` }} /></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3"><PieIcon size={24} className="text-blue-500" />Distribution par Type</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }} contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '12px', color: isDark ? '#f8fafc' : '#0f172a' }} />
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-sm">
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3"><Award size={24} className="text-amber-500" />Succès</h3>
             <div className="grid grid-cols-1 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                   const isUnlocked = state.unlockedAchievements.includes(ach.id);
                   return (
                      <div key={ach.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${isUnlocked ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 opacity-40 grayscale'}`}>
                         <div className="text-2xl shrink-0">{ach.icon}</div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="font-bold text-slate-800 dark:text-white text-xs">{ach.title}</h4>
                               {isUnlocked && <CheckCircle2 size={12} className="text-amber-500" />}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-1">{ach.description}</p>
                         </div>
                      </div>
                   )
                })}
             </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><PieIcon size={20} className="text-purple-500" />Rareté Collection</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rarityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {rarityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={RARITY_COLORS[entry.name as Rarity]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-sm">
             <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3"><History size={20} className="text-blue-500" />Historique</h3>
             <div className="space-y-3">
                {state.transactionHistory.slice(0, 5).map((t) => (
                   <div key={t.id} className="flex justify-between items-center text-[10px] py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="text-slate-400 dark:text-slate-500 capitalize font-bold">{t.type}</span>
                      <span className={`font-black ${t.type.includes('win') || t.type.includes('sell') ? 'text-green-500' : 'text-red-500'}`}>{t.amount} $</span>
                   </div>
                ))}
                {state.transactionHistory.length === 0 && <p className="text-slate-400 italic text-[10px] text-center py-4">Aucune transaction</p>}
             </div>
          </div>
        </div>
      </div>
      
      <button onClick={onFreeTokens} className="fixed bottom-6 right-6 z-50 p-4 bg-yellow-400 text-yellow-900 rounded-full shadow-2xl opacity-80 hover:opacity-100 hover:scale-110 active:scale-90 transition-all duration-300" title="Obtenir 10 tokens gratuits !"><Gift size={24} /></button>
    </div>
  );
};

export default Dashboard;
