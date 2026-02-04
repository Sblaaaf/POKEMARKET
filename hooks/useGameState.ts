
import { useState, useEffect, useCallback } from 'react';
import { GameState, Pokemon, BalanceEntry, Rarity, ToastMessage, ToastType, Transaction, DailyMission, Auction } from '../types';
import { INITIAL_TOKENS, RARITY_CONFIG, ACHIEVEMENTS, DEFAULT_MISSIONS } from '../constants';
import { fetchEvolutionData } from '../services/pokeApi';

export const useGameState = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('pokemarket_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old state if needed
      if (!parsed.pokedex) parsed.pokedex = [];
      if (!parsed.activeAuctions) parsed.activeAuctions = [];
      return parsed;
    }
    
    return {
      tokens: INITIAL_TOKENS,
      collection: [],
      balanceHistory: [{ timestamp: Date.now(), amount: INITIAL_TOKENS }],
      transactionHistory: [],
      deck: [],
      pokedex: [],
      activeAuctions: [],
      dailyMissions: DEFAULT_MISSIONS,
      totalSpent: 0,
      totalEarned: 0,
      unlockedAchievements: [],
      theme: 'dark'
    };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const addTransaction = useCallback((type: Transaction['type'], pokemonName: string, amount: number) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      pokemonName,
      amount,
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      transactionHistory: [newTransaction, ...prev.transactionHistory].slice(0, 50)
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('pokemarket_state', JSON.stringify(state));
  }, [state]);

  const updatePokedex = (pokemons: Pokemon[]) => {
    setState(prev => {
      const newIds = pokemons.map(p => p.id).filter(id => !prev.pokedex.includes(id));
      if (newIds.length === 0) return prev;
      return { ...prev, pokedex: [...prev.pokedex, ...newIds] };
    });
  };

  // Auction Bid Simulation Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.activeAuctions.length === 0) return prev;
        
        const now = Date.now();
        let tokensGained = 0;
        let finishedAuctions: string[] = [];

        const updatedAuctions = prev.activeAuctions.map(auction => {
          if (auction.endTime <= now) {
            if (!auction.isFinished) {
              tokensGained += auction.currentBid;
              finishedAuctions.push(auction.pokemon.name);
              return { ...auction, isFinished: true };
            }
            return auction;
          }

          // Chance to bid
          if (Math.random() > 0.7) {
            const increment = Math.max(1, Math.floor(auction.pokemon.resaleValue * 0.1));
            return {
              ...auction,
              currentBid: auction.currentBid + increment,
              highestBidder: ['Red', 'Blue', 'Leaf', 'Ash', 'Gary', 'Misty', 'Brock'][Math.floor(Math.random() * 7)]
            };
          }
          return auction;
        });

        // Cleanup finished auctions
        const remainingAuctions = updatedAuctions.filter(a => !a.isFinished);
        
        if (tokensGained > 0) {
          const newTokens = prev.tokens + tokensGained;
          finishedAuctions.forEach(name => {
             addToast(`Enchère terminée ! ${name} vendu.`, 'success');
             addTransaction('auction_win', name, tokensGained);
          });
          return {
            ...prev,
            tokens: newTokens,
            totalEarned: prev.totalEarned + tokensGained,
            activeAuctions: remainingAuctions,
            balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory)
          };
        }

        return { ...prev, activeAuctions: updatedAuctions };
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [addToast, addTransaction]);

  const startAuction = (pokemon: Pokemon, durationSec: number) => {
    const newAuction: Auction = {
      id: crypto.randomUUID(),
      pokemon,
      currentBid: pokemon.resaleValue,
      highestBidder: 'Prix de départ',
      endTime: Date.now() + durationSec * 1000,
      isFinished: false
    };

    setState(prev => ({
      ...prev,
      collection: prev.collection.filter(p => p.instanceId !== pokemon.instanceId),
      deck: prev.deck.filter(id => id !== pokemon.instanceId),
      activeAuctions: [...prev.activeAuctions, newAuction]
    }));

    addToast(`${pokemon.name} est en vente aux enchères !`, 'info');
  };

  // Mission progress updater
  const updateMissionProgress = useCallback((type: DailyMission['type'], amount: number = 1) => {
    setState(prev => {
      let rewardedAmount = 0;
      const newMissions = prev.dailyMissions.map(m => {
        if (m.type === type && !m.isCompleted) {
          const newProgress = m.progress + amount;
          const isNowCompleted = newProgress >= m.goal;
          if (isNowCompleted) {
            rewardedAmount += m.reward;
            addToast(`Mission Complétée : ${m.description} (+${m.reward} $)`, 'success');
          }
          return { ...m, progress: newProgress, isCompleted: isNowCompleted };
        }
        return m;
      });

      if (rewardedAmount > 0) {
        const newTokens = prev.tokens + rewardedAmount;
        addTransaction('mission_reward', 'Mission Quotidienne', rewardedAmount);
        return { 
          ...prev, 
          dailyMissions: newMissions, 
          tokens: newTokens,
          balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory)
        };
      }
      return { ...prev, dailyMissions: newMissions };
    });
  }, [addToast, addTransaction]);

  const updateBalanceHistory = (newAmount: number, history: BalanceEntry[]) => {
    const newEntry: BalanceEntry = { timestamp: Date.now(), amount: newAmount };
    return [...history, newEntry].slice(-20);
  };

  const handlePurchase = (pokemons: Pokemon[], cost: number) => {
    setState(prev => {
      const newTokens = prev.tokens - cost;
      return {
        ...prev,
        tokens: newTokens,
        collection: [...pokemons, ...prev.collection],
        balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory),
        totalSpent: prev.totalSpent + cost
      };
    });
    addTransaction('buy', `${pokemons.length} Pokémon`, cost);
    updateMissionProgress('buy', pokemons.length);
    updatePokedex(pokemons);
    addToast(`${pokemons.length} booster(s) ouvert(s) !`, 'success');
  };

  const handleSell = (pokemon: Pokemon) => {
    setState(prev => {
      const newTokens = prev.tokens + pokemon.resaleValue;
      return {
        ...prev,
        tokens: newTokens,
        collection: prev.collection.filter(p => p.instanceId !== pokemon.instanceId),
        deck: prev.deck.filter(id => id !== pokemon.instanceId),
        balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory),
        totalEarned: prev.totalEarned + pokemon.resaleValue
      };
    });
    addTransaction('sell', pokemon.name, pokemon.resaleValue);
    updateMissionProgress('sell', 1);
    addToast(`Vendu ${pokemon.name} pour ${pokemon.resaleValue} tokens.`, 'info');
  };

  const handleBattleWin = (tokensWon: number) => {
    setState(prev => {
      const newTokens = prev.tokens + tokensWon;
      const newUnlockedAchievements = [...prev.unlockedAchievements];
      if (!newUnlockedAchievements.includes('battle_master')) {
        newUnlockedAchievements.push('battle_master');
        addToast("Succès Débloqué : Champion d'Arène !", 'success');
      }
      return {
        ...prev,
        tokens: newTokens,
        unlockedAchievements: newUnlockedAchievements,
        balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory)
      };
    });
    addTransaction('battle_win', 'Combat Gagné', tokensWon);
    updateMissionProgress('battle', 1);
    addToast(`Victoire ! Vous avez gagné ${tokensWon} tokens.`, 'success');
  };

  const handleToggleFavorite = (instanceId: string) => {
    setState(prev => ({
      ...prev,
      collection: prev.collection.map(p =>
        p.instanceId === instanceId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    }));
  };

  const handleToggleDeck = (instanceId: string) => {
    setState(prev => {
      const isInDeck = prev.deck.includes(instanceId);
      if (!isInDeck && prev.deck.length >= 6) {
        addToast("Équipe complète (max 6) !", "error");
        return prev;
      }
      const newDeck = isInDeck 
        ? prev.deck.filter(id => id !== instanceId)
        : [...prev.deck, instanceId];
      addToast(isInDeck ? "Retiré de l'équipe" : "Ajouté à l'équipe", "info");
      return { ...prev, deck: newDeck };
    });
  };

  const handleEvolve = async (instanceId: string): Promise<boolean> => {
    const pokemon = state.collection.find(p => p.instanceId === instanceId);
    if (!pokemon) return false;
    let cost = (pokemon.rarity === Rarity.COMMON) ? 10 : (pokemon.rarity === Rarity.RARE) ? 20 : (pokemon.rarity === Rarity.EPIC) ? 30 : 0;
    if (cost === 0 || state.tokens < cost) { addToast("Impossible ou fond insuffisant", "error"); return false; }

    const evolvedData = await fetchEvolutionData(pokemon.id);
    if (!evolvedData) { addToast("Pas d'évolution connue", "error"); return false; }

    const nextRarity = (pokemon.rarity === Rarity.COMMON) ? Rarity.RARE : (pokemon.rarity === Rarity.RARE) ? Rarity.EPIC : Rarity.LEGENDARY;
    const values = RARITY_CONFIG[nextRarity].possibleValues;
    const newResaleValue = values[Math.floor(Math.random() * values.length)];

    const evolvedPokemon: Pokemon = {
      ...pokemon,
      id: evolvedData.id,
      name: evolvedData.name,
      imageUrl: evolvedData.imageUrl,
      types: evolvedData.types,
      rarity: nextRarity,
      resaleValue: newResaleValue,
      timestamp: Date.now(),
    };

    setState(prev => {
      const newTokens = prev.tokens - cost;
      return {
        ...prev,
        tokens: newTokens,
        collection: prev.collection.map(p => p.instanceId === instanceId ? evolvedPokemon : p),
        balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory),
        totalSpent: prev.totalSpent + cost
      };
    });
    updatePokedex([evolvedPokemon]);
    addTransaction('evolve', evolvedPokemon.name, cost);
    updateMissionProgress('evolve', 1);
    addToast(`${pokemon.name} a évolué en ${evolvedPokemon.name} !`, 'success');
    return true;
  };

  const handleFreeTokens = () => {
    setState(prev => {
      const newTokens = prev.tokens + 10;
      return { ...prev, tokens: newTokens, balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory) };
    });
    addToast("+10 Tokens cadeaux !", 'success');
  };

  const toggleTheme = () => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));

  return {
    state,
    toasts,
    handlePurchase,
    handleSell,
    handleToggleFavorite,
    handleToggleDeck,
    handleEvolve,
    handleFreeTokens,
    handleBattleWin,
    startAuction,
    toggleTheme
  };
};
