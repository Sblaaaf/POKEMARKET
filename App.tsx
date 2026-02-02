
import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PackOpener from './components/PackOpener';
import Collection from './components/Collection';
import Dashboard from './components/Dashboard';
import PokemonCard from './components/PokemonCard';
import ConfirmationDialog from './components/ConfirmationDialog';
import { GameState, Pokemon, BalanceEntry } from './types';
import { INITIAL_TOKENS, PACK_COST } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [packResult, setPackResult] = useState<Pokemon[] | null>(null);
  const [pokemonForSale, setPokemonForSale] = useState<Pokemon | null>(null);
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('pokemarket_state');
    if (saved) return JSON.parse(saved);
    
    return {
      tokens: INITIAL_TOKENS,
      collection: [],
      balanceHistory: [{ timestamp: Date.now(), amount: INITIAL_TOKENS }],
      totalSpent: 0,
      totalEarned: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('pokemarket_state', JSON.stringify(state));
  }, [state]);

  const updateBalanceHistory = (newAmount: number) => {
    const newEntry: BalanceEntry = { timestamp: Date.now(), amount: newAmount };
    return [...state.balanceHistory, newEntry].slice(-20);
  };
  
  const navigateTo = (tab: string) => {
      if (activeTab === 'shop' && tab !== 'shop') {
          setPackResult(null);
      }
      setActiveTab(tab);
  };

  const handleQuickPackClick = () => {
      if (activeTab === 'shop' && packResult && packResult.length > 0) {
          setPackResult(null);
      } else {
          navigateTo('shop');
      }
  };

  const handlePurchase = (pokemons: Pokemon[], cost: number) => {
    setState(prev => {
      const newTokens = prev.tokens - cost;
      return {
        ...prev,
        tokens: newTokens,
        collection: [...pokemons, ...prev.collection],
        balanceHistory: updateBalanceHistory(newTokens),
        totalSpent: prev.totalSpent + cost
      };
    });
  };

  const initiateSell = (instanceId: string) => {
    const pokemon = state.collection.find(p => p.instanceId === instanceId);
    if (pokemon) setPokemonForSale(pokemon);
  };

  const confirmSell = () => {
    if (!pokemonForSale) return;
    setState(prev => {
      const newTokens = prev.tokens + pokemonForSale.resaleValue;
      return {
        ...prev,
        tokens: newTokens,
        collection: prev.collection.filter(p => p.instanceId !== pokemonForSale.instanceId),
        balanceHistory: updateBalanceHistory(newTokens),
        totalEarned: prev.totalEarned + pokemonForSale.resaleValue
      };
    });
    setPokemonForSale(null);
  };
  
  const cancelSell = () => {
    setPokemonForSale(null);
  };

  const handleToggleFavorite = (instanceId: string) => {
    setState(prev => ({
      ...prev,
      collection: prev.collection.map(p =>
        p.instanceId === instanceId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    }));
  };
  
  const handleFreeTokens = () => {
    setState(prev => {
      const newTokens = prev.tokens + 10;
      return {
        ...prev,
        tokens: newTokens,
        balanceHistory: updateBalanceHistory(newTokens)
      };
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'shop':
        return <PackOpener tokens={state.tokens} onPurchase={handlePurchase} result={packResult} setResult={setPackResult} />;
      case 'collection':
        return <Collection collection={state.collection} onSell={initiateSell} onToggleFavorite={handleToggleFavorite} />;
      case 'analytics':
        return <Dashboard state={state} onFreeTokens={handleFreeTokens} />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 lg:p-20 text-white relative overflow-hidden shadow-2xl border border-white/10 text-center">
                <div className="absolute -top-24 -right-24 p-8 opacity-5 rotate-12"><div className="w-96 h-96 bg-white rounded-full border-[40px] border-white flex items-center justify-center"><div className="w-full h-12 bg-white" /></div></div>
                <div className="relative items-center flex flex-col gap-8 justify-center z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-end gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Connection</span></div>
                    <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-[0.9]">DOMINE LE<br/>POKÉ-MARKET</h2>
                    <div className="flex flex-wrap items-center justify-center gap-4"><p className="text-red-500 bg-white px-5 py-2 rounded-2xl inline-block font-black shadow-2xl text-lg">VALEUR TOTALE: {state.collection.reduce((sum, p) => sum + p.resaleValue, 0)} $</p><p className="text-white/60 font-bold text-sm tracking-widest uppercase">{state.collection.length} CARTES POSSÉDÉES</p></div>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <button onClick={() => navigateTo('shop')} className="bg-white text-red-600 px-12 py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center gap-4 text-lg"><ShoppingBag size={24} />BOOSTER PACK</button>
                        <button onClick={() => navigateTo('collection')} className="bg-slate-950/40 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-[1.5rem] font-bold hover:bg-slate-950/60 transition-all flex items-center gap-4 text-lg">COLLECTION</button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-10">
               <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-[2.5rem] p-10">
                  <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3"><div className="w-2 h-10 bg-red-600 rounded-full" />Analytiques du Marché</h3>
                  <Dashboard state={state} onFreeTokens={handleFreeTokens} />
               </div>
               <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-[2.5rem] p-10 flex flex-col">
                  <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3"><div className="w-2 h-10 bg-blue-600 rounded-full" />Dernière Pièce Rare</h3>
                  <div className="flex-1 flex items-center justify-center py-6">
                    {state.collection.length > 0 ? (
                      <div className="relative group"><div className="absolute -inset-10 bg-red-600/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" /><PokemonCard pokemon={state.collection[0]} interactive={true} /></div>
                    ) : (
                      <div className="text-center py-12">
                         <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-inner"><ShoppingBag className="text-slate-700" size={32} /></div>
                         <p className="text-slate-500 font-bold text-lg">Ta vitrine attend sa première carte...</p>
                         <button onClick={() => navigateTo('shop')} className="text-red-500 font-black mt-4 hover:underline">Acheter maintenant</button>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="app-container" className="min-h-screen bg-slate-950 selection:bg-red-500/30">
      <Sidebar activeTab={activeTab} navigateTo={navigateTo} tokens={state.tokens} />
      
      <div className="flex flex-col relative h-screen lg:ml-72">
        <TopBar tokens={state.tokens} activeTab={activeTab} navigateTo={navigateTo} onQuickPackClick={handleQuickPackClick} packCost={PACK_COST} />
        
        <main id="main-content" className="flex-1 p-4 lg:p-12 lg:mt-8 mt-20 lg:pt-14 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto pb-20">
            {renderContent()}
          </div>
        </main>
      </div>

      <ConfirmationDialog pokemon={pokemonForSale} onConfirm={confirmSell} onCancel={cancelSell} />
    </div>
  );
};

export default App;
