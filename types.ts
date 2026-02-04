
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
  type: 'buy' | 'sell' | 'evolve' | 'battle_win' | 'mission_reward' | 'auction_win';
  pokemonName: string;
  amount: number;
  timestamp: number;
}

export interface DailyMission {
  id: string;
  description: string;
  reward: number;
  isCompleted: boolean;
  type: 'buy' | 'sell' | 'evolve' | 'battle';
  goal: number;
  progress: number;
}

export interface Auction {
  id: string;
  pokemon: Pokemon;
  currentBid: number;
  highestBidder: string;
  endTime: number;
  isFinished: boolean;
}

export interface GameState {
  tokens: number;
  collection: Pokemon[];
  balanceHistory: BalanceEntry[];
  transactionHistory: Transaction[];
  deck: string[]; // instanceIds
  pokedex: number[]; // Unique IDs discovered
  activeAuctions: Auction[];
  dailyMissions: DailyMission[];
  totalSpent: number;
  totalEarned: number;
  unlockedAchievements: string[];
  theme: 'dark' | 'light';
  lastMissionReset?: number;
}

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
