
import { Rarity, DailyMission } from './types';

export const INITIAL_TOKENS = 100;
export const PACK_COST = 5;
export const GUARANTEED_PACK_COST = 30;
export const GUARANTEED_COLLECTOR_PACK_COST = 100;

export const ACHIEVEMENTS = [
  { id: 'first_card', title: 'Premiers Pas', description: 'Obtenir votre première carte.', icon: '🎴' },
  { id: 'collector_10', title: 'Collectionneur', description: 'Posséder 10 cartes différentes.', icon: '📚' },
  { id: 'shiny_hunter', title: 'Chasseur de Shiny', description: 'Trouver votre premier Pokémon Shiny.', icon: '✨' },
  { id: 'tycoon', title: 'Magnat du Marché', description: 'Gagner plus de 500 tokens au total.', icon: '💰' },
  { id: 'fire_master', title: 'Maître du Feu', description: 'Posséder 3 Pokémon de type Feu.', icon: '🔥' },
  { id: 'battle_master', title: 'Champion d\'Arène', description: 'Gagner votre premier combat de Squad.', icon: '⚔️' },
];

export const DEFAULT_MISSIONS: DailyMission[] = [
  { id: 'mission_buy', description: 'Ouvrir 5 boosters', reward: 15, isCompleted: false, type: 'buy', goal: 5, progress: 0 },
  { id: 'mission_sell', description: 'Vendre 3 Pokémon', reward: 10, isCompleted: false, type: 'sell', goal: 3, progress: 0 },
  { id: 'mission_battle', description: 'Gagner 2 combats', reward: 25, isCompleted: false, type: 'battle', goal: 2, progress: 0 },
];

export const RARITY_CONFIG = {
  [Rarity.COMMON]: {
    chance: 0.60,
    color: 'bg-slate-400',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-200',
    possibleValues: [1],
    label: 'Commun',
    powerMultiplier: 1
  },
  [Rarity.RARE]: {
    chance: 0.25,
    color: 'bg-blue-500',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-100',
    possibleValues: [5, 10],
    label: 'Rare',
    powerMultiplier: 1.5
  },
  [Rarity.EPIC]: {
    chance: 0.09,
    color: 'bg-purple-600',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-100',
    possibleValues: [15, 20, 25, 30],
    label: 'Épique',
    powerMultiplier: 2.5
  },
  [Rarity.LEGENDARY]: {
    chance: 0.04,
    color: 'bg-amber-500',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-100',
    possibleValues: [35, 40, 45],
    label: 'Légendaire',
    powerMultiplier: 5
  },
  [Rarity.COLLECTOR]: {
    chance: 0.02,
    color: 'bg-fuchsia-500',
    borderColor: 'border-fuchsia-300',
    textColor: 'text-fuchsia-100',
    possibleValues: [50],
    label: 'Collector',
    powerMultiplier: 10
  }
};

export const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  psychic: 'bg-pink-500',
  ice: 'bg-cyan-300',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  fairy: 'bg-rose-400',
  normal: 'bg-stone-400',
  fighting: 'bg-red-700',
  flying: 'bg-sky-400',
  poison: 'bg-purple-500',
  ground: 'bg-amber-700',
  rock: 'bg-yellow-800',
  bug: 'bg-lime-600',
  ghost: 'bg-violet-800',
  steel: 'bg-slate-500'
};
