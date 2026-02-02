
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PackOpener from './components/PackOpener';
import Collection from './components/Collection';
import Dashboard from './components/Dashboard';
import PokemonCard from './components/PokemonCard';
import ConfirmationDialog from './components/ConfirmationDialog';
import ToastContainer from './components/Toast';
import { Pokemon } from './types';
import { PACK_COST } from './constants';
import { useGameState } from './hooks/useGameState';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [packResult, setPackResult] = useState<Pokemon[] | null>(null);
  const [pokemonForSale, setPokemonForSale] = useState<Pokemon | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);

  const {
    state,
    toasts,
    handlePurchase,
    handleSell,
    handleToggleFavorite,
    handleEvolve,
    handleFreeTokens
  } = useGameState();

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

  const initiateSell = (instanceId: string) => {
    const pokemon = state.collection.find(p => p.instanceId === instanceId);
    if (pokemon) setPokemonForSale(pokemon);
  };

  const confirmSell = () => {
    if (!pokemonForSale) return;
    handleSell(pokemonForSale);
    setPokemonForSale(null);
  };
  
  const cancelSell = () => {
    setPokemonForSale(null);
  };

  const triggerEvolve = async (instanceId: string) => {
    setIsEvolving(true);
    await handleEvolve(instanceId);
    setIsEvolving(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'shop':
        return <PackOpener tokens={state.tokens} onPurchase={handlePurchase} result={packResult} setResult={setPackResult} />;
      case 'collection':
        return <Collection collection={state.collection} onSell={initiateSell} onToggleFavorite={handleToggleFavorite} onEvolve={triggerEvolve} />;
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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

      <ToastContainer toasts={toasts} />

      {isEvolving && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600/30 blur-[100px] rounded-full animate-pulse" />
                <div className="relative w-32 h-32 bg-slate-900 rounded-full border-4 border-blue-500 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-spin-slow" />
                    <ShoppingBag className="text-blue-500 animate-bounce absolute" size={48} />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-white italic tracking-tighter">ÉVOLUTION...</h2>
                <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px]">Transformation de la structure moléculaire</p>
            </div>
        </div>
      )}

      <ConfirmationDialog pokemon={pokemonForSale} onConfirm={confirmSell} onCancel={cancelSell} />
    </div>
  );
};

export default App;
