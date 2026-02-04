
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Clock, User, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';
import { Auction, Pokemon } from '../types';

interface AuctionHouseProps {
  auctions: Auction[];
  collection: Pokemon[];
  onStartAuction: (p: Pokemon, duration: number) => void;
}

const AuctionHouse: React.FC<AuctionHouseProps> = ({ auctions, collection, onStartAuction }) => {
  const M = motion as any;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-[2.5rem] p-8 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Gavel size={300} /></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest">
            Hôtel des Ventes
          </div>
          <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter leading-none uppercase">Aux Enchères</h2>
          <p className="text-amber-100 text-lg font-medium opacity-80">Mettez vos cartes les plus précieuses aux enchères pour maximiser vos gains. Les collectionneurs se battront pour vos trésors !</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Enchères en cours</h3>
              <span className="bg-slate-900 px-4 py-1 rounded-full text-[10px] font-black text-slate-400 border border-slate-800">{auctions.length} ACTIVES</span>
           </div>

           {auctions.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/30 rounded-[2.5rem] border border-slate-800 border-dashed">
               <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6"><ShoppingBag className="text-slate-600" size={32} /></div>
               <h3 className="text-xl font-bold text-white mb-2">Aucune enchère</h3>
               <p className="text-slate-500 text-sm max-w-xs">Mettez une carte en vente depuis l'onglet de droite pour commencer.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <AnimatePresence>
                 {auctions.map(auction => {
                   const timeLeft = Math.max(0, Math.floor((auction.endTime - Date.now()) / 1000));
                   return (
                     <M.div 
                        key={auction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] space-y-4 hover:border-amber-500/50 transition-all group"
                     >
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center p-2">
                             <img src={auction.pokemon.imageUrl} className="w-full h-full object-contain" alt="Poke" />
                          </div>
                          <div className="flex-1">
                             <h4 className="font-bold text-white capitalize">{auction.pokemon.name}</h4>
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                                <Clock size={12} className="text-amber-500" />
                                <span>{timeLeft}s Restant</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="bg-slate-950/50 p-4 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Dernière Offre</span>
                             <span className="text-xl font-black text-amber-500">{auction.currentBid} $</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Enchérisseur</span>
                             <div className="flex items-center gap-2">
                                <User size={12} className="text-slate-500" />
                                <span className="text-xs font-bold text-white">{auction.highestBidder}</span>
                             </div>
                          </div>
                       </div>
                       <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <M.div 
                            className="h-full bg-amber-500" 
                            initial={{ width: "100%" }} 
                            animate={{ width: "0%" }} 
                            transition={{ duration: timeLeft, ease: "linear" }} 
                          />
                       </div>
                     </M.div>
                   );
                 })}
               </AnimatePresence>
             </div>
           )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
             <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Gavel size={24} className="text-amber-500" />Vendre une carte</h3>
             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {collection.filter(p => p.resaleValue >= 5).map(p => (
                   <button 
                     key={p.instanceId}
                     onClick={() => onStartAuction(p, 60)}
                     className="w-full flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-amber-500 hover:bg-slate-800 transition-all text-left group"
                   >
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-contain" />
                      <div className="flex-1">
                         <h4 className="font-bold text-xs truncate capitalize text-white">{p.name}</h4>
                         <div className="flex items-center gap-2">
                            <TrendingUp size={10} className="text-green-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Valeur: {p.resaleValue} $</span>
                         </div>
                      </div>
                      <Gavel size={16} className="text-slate-600 group-hover:text-amber-500" />
                   </button>
                ))}
                {collection.length === 0 && <p className="text-slate-600 text-center py-10 text-xs italic">Ta collection est vide</p>}
             </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-[2rem] space-y-4">
             <div className="flex items-center gap-3 text-amber-500"><AlertCircle size={20} /><h4 className="font-black text-sm uppercase">Comment ça marche ?</h4></div>
             <p className="text-[11px] text-slate-400 leading-relaxed font-medium">L'enchère commence à la valeur de revente. Les collectionneurs placeront des offres pendant 60 secondes. C'est le meilleur moyen de vendre vos cartes Épiques ou Légendaires à prix d'or !</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionHouse;
