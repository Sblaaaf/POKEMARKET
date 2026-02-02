
export enum Rarity {
  COMMON = 'Commun',
  RARE = 'Rare',
  EPIC = 'Épique',
  LEGENDARY = 'Légendaire',
  COLLECTOR = 'Collector'
}

export interface Pokemon {
  instanceId: string;
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  rarity: Rarity;
  isShiny: boolean;
  resaleValue: number;
  timestamp: number;
  isFavorite?: boolean;
}

export interface BalanceEntry {
  timestamp: number;
  amount: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'evolve';
  pokemonName: string;
  amount: number;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface GameState {
  tokens: number;
  collection: Pokemon[];
  balanceHistory: BalanceEntry[];
  transactionHistory: Transaction[];
  deck: string[]; // instanceIds
  totalSpent: number;
  totalEarned: number;
  unlockedAchievements: string[];
  theme: 'dark' | 'light';
}

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
