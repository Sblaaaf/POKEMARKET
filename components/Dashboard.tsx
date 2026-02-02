
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Coins, Library, Star, Gift, Award, CheckCircle2, History, ShoppingCart, Banknote } from 'lucide-react';
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

  const balanceData = state.balanceHistory.map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tokens: entry.amount
  }));

  const rarityData = Object.values(Rarity).map(rarity => ({
    name: rarity,
    value: state.collection.filter(p => p.rarity === rarity).length,
  })).filter(d => d.value > 0);

  return (
    <div id="dashboard-container" className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Valeur Collection', value: collectionValue, icon: Coins, color: 'text-yellow-400' },
          { label: 'Total Pokémon', value: state.collection.length, icon: Library, color: 'text-blue-400' },
          { label: 'Cartes Shiny', value: shinyCount, icon: Star, color: 'text-purple-400' },
          { label: 'Ratio Profit', value: `${buySellRatio}x`, icon: TrendingUp, color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className={`p-4 rounded-xl bg-slate-800/50 ${stat.color}`}><stat.icon size={24} /></div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-red-500" />Évolution du Solde</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData}>
                  <defs><linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} itemStyle={{ color: '#f8fafc' }} />
                  <Area type="monotone" dataKey="tokens" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
             <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><History size={24} className="text-blue-500" />Activités Récentes</h3>
             <div className="space-y-3">
                {state.transactionHistory.length > 0 ? state.transactionHistory.slice(0, 10).map((t) => (
                   <div key={t.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${t.type === 'buy' ? 'bg-red-500/20 text-red-400' : t.type === 'sell' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {t.type === 'buy' ? <ShoppingCart size={18} /> : t.type === 'sell' ? <Banknote size={18} /> : <TrendingUp size={18} />}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white capitalize">{t.type === 'buy' ? 'Achat' : t.type === 'sell' ? 'Vente' : 'Évolution'} : {t.pokemonName}</p>
                            <p className="text-[10px] text-slate-500">{new Date(t.timestamp).toLocaleString()}</p>
                         </div>
                      </div>
                      <div className={`text-sm font-black ${t.type === 'buy' ? 'text-red-400' : 'text-green-400'}`}>
                         {t.type === 'buy' ? '-' : '+'}{t.amount} $
                      </div>
                   </div>
                )) : <p className="text-center py-10 text-slate-500 italic">Aucune transaction enregistrée</p>}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
             <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Award size={24} className="text-amber-500" />Succès</h3>
             <div className="grid grid-cols-1 gap-4">
                {ACHIEVEMENTS.map((ach) => {
                   const isUnlocked = state.unlockedAchievements.includes(ach.id);
                   return (
                      <div key={ach.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${isUnlocked ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-950 border-slate-800 opacity-40 grayscale'}`}>
                         <div className="text-2xl shrink-0">{ach.icon}</div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="font-bold text-white text-xs">{ach.title}</h4>
                               {isUnlocked && <CheckCircle2 size={12} className="text-amber-500" />}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight mt-1">{ach.description}</p>
                         </div>
                      </div>
                   )
                })}
             </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Star size={20} className="text-purple-500" />Rareté Collection</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={rarityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{rarityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={RARITY_COLORS[entry.name as Rarity]} />))}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <button onClick={onFreeTokens} className="fixed bottom-4 right-4 z-50 p-3 bg-yellow-500 text-yellow-900 rounded-full shadow-lg opacity-10 hover:opacity-100 transition-all duration-300 transform hover:scale-110" title="Obtenir 10 tokens gratuits !"><Gift size={24} /></button>
    </div>
  );
};

export default Dashboard;
