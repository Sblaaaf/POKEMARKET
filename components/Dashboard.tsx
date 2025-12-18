
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Coins, Library, Star, Gift } from 'lucide-react';
import { GameState, Rarity } from '../types';
import { RARITY_CONFIG } from '../constants';

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

  // Format data for balance chart
  const balanceData = state.balanceHistory.map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tokens: entry.amount
  }));

  // Format data for rarity pie chart
  const rarityData = Object.values(Rarity).map(rarity => ({
    name: rarity,
    value: state.collection.filter(p => p.rarity === rarity).length,
  })).filter(d => d.value > 0);

  const stats = [
    { label: 'Valeur Collection', value: collectionValue, icon: Coins, color: 'text-yellow-400' },
    { label: 'Total Pokémon', value: state.collection.length, icon: Library, color: 'text-blue-400' },
    { label: 'Cartes Shiny', value: shinyCount, icon: Star, color: 'text-purple-400' },
    { label: 'Ratio Profit', value: `${buySellRatio}x`, icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <div id="dashboard-container" className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className={`p-4 rounded-xl bg-slate-800/50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token History Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
             <TrendingUp size={20} className="text-red-500" />
             Évolution du Solde
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceData}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="tokens" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rarity Distribution Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
             <Star size={20} className="text-purple-500" />
             Rareté Collection
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            {rarityData.length > 0 ? (
               <>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rarityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {rarityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RARITY_COLORS[entry.name as Rarity]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full space-y-2 mt-4">
                  {rarityData.map((entry, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: RARITY_COLORS[entry.name as Rarity] }} />
                         <span className="text-slate-400">{entry.name}</span>
                      </div>
                      <span className="font-bold text-white">{entry.value}</span>
                    </div>
                  ))}
                </div>
               </>
            ) : (
              <p className="text-slate-500 italic text-center">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden free tokens button */}
      <button 
        onClick={onFreeTokens}
        className="fixed bottom-4 right-4 z-50 p-3 bg-yellow-500 text-yellow-900 rounded-full shadow-lg opacity-10 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
        title="Obtenir 10 tokens gratuits !"
        aria-label="Obtenir 10 tokens gratuits"
      >
        <Gift size={24} />
      </button>
    </div>
  );
};

export default Dashboard;
