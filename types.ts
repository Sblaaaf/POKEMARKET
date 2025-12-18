
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

export interface GameState {
  tokens: number;
  collection: Pokemon[];
  balanceHistory: BalanceEntry[];
  totalSpent: number;
  totalEarned: number;
}