
import { useState, useEffect, useCallback } from 'react';
import { GameState, Pokemon, BalanceEntry, Rarity, ToastMessage, ToastType, Transaction } from '../types';
import { INITIAL_TOKENS, RARITY_CONFIG, ACHIEVEMENTS } from '../constants';
import { fetchEvolutionData } from '../services/pokeApi';

export const useGameState = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('pokemarket_state');
    if (saved) return JSON.parse(saved);
    
    return {
      tokens: INITIAL_TOKENS,
      collection: [],
      balanceHistory: [{ timestamp: Date.now(), amount: INITIAL_TOKENS }],
      transactionHistory: [],
      deck: [],
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

  // Dynamic Market Logic: Prices fluctuate every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.collection.length === 0) return prev;
        
        const newCollection = prev.collection.map(p => {
          // Random fluctuation between -10% and +10%
          const change = 0.9 + Math.random() * 0.2;
          const newValue = Math.max(1, Math.round(p.resaleValue * change));
          return { ...p, resaleValue: newValue };
        });

        return { ...prev, collection: newCollection };
      });
      addToast("Le marché a fluctué ! Vérifiez vos prix.", "warning");
    }, 60000);

    return () => clearInterval(interval);
  }, [addToast]);

  // Check achievements
  useEffect(() => {
    const newAchievements: string[] = [];
    
    if (state.collection.length >= 1 && !state.unlockedAchievements.includes('first_card')) {
      newAchievements.push('first_card');
    }
    if (state.collection.length >= 10 && !state.unlockedAchievements.includes('collector_10')) {
      newAchievements.push('collector_10');
    }
    if (state.collection.some(p => p.isShiny) && !state.unlockedAchievements.includes('shiny_hunter')) {
      newAchievements.push('shiny_hunter');
    }
    if (state.totalEarned >= 500 && !state.unlockedAchievements.includes('tycoon')) {
      newAchievements.push('tycoon');
    }
    if (state.collection.filter(p => p.types.includes('fire')).length >= 3 && !state.unlockedAchievements.includes('fire_master')) {
      newAchievements.push('fire_master');
    }

    if (newAchievements.length > 0) {
      setState(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, ...newAchievements]
      }));
      newAchievements.forEach(id => {
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) addToast(`Succès Débloqué : ${ach.title} !`, 'success');
      });
    }
  }, [state.collection, state.totalEarned, state.unlockedAchievements, addToast]);

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
    addToast(`${pokemons.length} booster(s) ouvert(s) !`, 'success');
  };

  const handleSell = (pokemon: Pokemon) => {
    setState(prev => {
      const newTokens = prev.tokens + pokemon.resaleValue;
      return {
        ...prev,
        tokens: newTokens,
        collection: prev.collection.filter(p => p.instanceId !== pokemon.instanceId),
        deck: prev.deck.filter(id => id !== pokemon.instanceId), // Remove from deck if sold
        balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory),
        totalEarned: prev.totalEarned + pokemon.resaleValue
      };
    });
    addTransaction('sell', pokemon.name, pokemon.resaleValue);
    addToast(`Vendu ${pokemon.name} pour ${pokemon.resaleValue} tokens.`, 'info');
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

    let cost = 0;
    let nextRarity = pokemon.rarity;

    if (pokemon.rarity === Rarity.COMMON) { cost = 10; nextRarity = Rarity.RARE; }
    else if (pokemon.rarity === Rarity.RARE) { cost = 20; nextRarity = Rarity.EPIC; }
    else if (pokemon.rarity === Rarity.EPIC) { cost = 30; nextRarity = Rarity.LEGENDARY; }
    else {
      addToast("Stade maximal atteint !", "error");
      return false;
    }

    if (state.tokens < cost) {
      addToast("Tokens insuffisants !", "error");
      return false;
    }

    const evolvedData = await fetchEvolutionData(pokemon.id);
    if (!evolvedData) {
      addToast("Pas d'évolution connue !", "error");
      return false;
    }

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

    addTransaction('evolve', evolvedPokemon.name, cost);
    addToast(`${pokemon.name} a évolué en ${evolvedPokemon.name} !`, 'success');
    return true;
  };

  const handleFreeTokens = () => {
    setState(prev => {
      const newTokens = prev.tokens + 10;
      return {
        ...prev,
        tokens: newTokens,
        balanceHistory: updateBalanceHistory(newTokens, prev.balanceHistory)
      };
    });
    addToast("+10 Tokens cadeaux !", 'success');
  };

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  return {
    state,
    toasts,
    handlePurchase,
    handleSell,
    handleToggleFavorite,
    handleToggleDeck,
    handleEvolve,
    handleFreeTokens,
    toggleTheme
  };
};
