
# PokéMarket : Spécification & Tasks

Ce document sert de spécification pour le développement du Poké-Market Dashboard. Toutes les nouvelles demandes de fonctionnalités et améliorations doivent être ajoutées ici pour un suivi clair et structuré.

---

## ✅ Historique des Fonctionnalités Implémentées

### V1.0 - Création de l'application de base
- [x] **Système d'Achat & Logique**
- [x] **Interface Utilisateur & Effets Visuels**
- [x] **Gestion de la Collection**
- [x] **Dashboard & Analytics**
- [x] **Stack Technique**

### V1.1 - Améliorations de l'Économie et UX
- [x] **Refonte du système de valeur et de rareté**
- [x] **Nouvelles options d'achat**
- [x] **Fonctionnalités cachées**
- [x] **Correction et Amélioration du système de revente**

### V1.2 - Correctifs et Améliorations UX
- [x] **Correction de la fonction de vente :** Suppression de la boîte de dialogue de confirmation bloquante.
- [x] **Amélioration du "Booster Rapide" :** Le bouton permet désormais de relancer un achat.
- [x] **Nettoyage de l'UI**
- [x] **Technique :** Ajout d'IDs, centralisation de la navigation.

### V1.3 - Nouvelles Fonctionnalités & Améliorations
- [x] **Message de confirmation de vente :** Ajout d'une boîte de dialogue de confirmation non-bloquante avant la vente.
- [x] **Système de favoris :** Permet de marquer des cartes comme "favorites" et de les filtrer.
- [x] **Correction bug UI "Shiny" :** L'aberration chromatique sur l'effet holographique est corrigée.
- [x] **Achat multiple de boosters :** Ajout d'un sélecteur pour acheter jusqu'à 5 packs standards en même temps.
- [x] **Nouveau "Booster Collector Garanti" :** Ajout d'une option d'achat à 100 tokens pour une carte Collector garantie.

### V1.4 - Système d'Évolution
- [x] **Fonctionnalité d'Évolution :** Les Pokémon peuvent maintenant évoluer vers leur stade supérieur.
- [x] **Coûts Dynamiques :** Evolution Common->Rare (10), Rare->Epic (20), Epic->Legendary (30).
- [x] **Mise à jour Visuelle :** Nouvelle interface d'évolution avec silhouette et effets de particules.
- [x] **Intégration PokéAPI :** Recherche automatique dans la chaîne d'évolution.

---

## 🚀 Roadmap & Axes d'Amélioration Suggérés

### V1.5 - Prochaines Étapes Suggérées

- [ ] **Amélioration de l'Expérience Utilisateur (UX)**
  - [ ] **Notifications "Toast" :** Remplacer les alertes JavaScript natives par des notifications non-bloquantes stylisées.
  - [ ] **Effet de Transformation :** Ajouter une transition CSS plus fluide sur la carte lors de l'évolution.

- [ ] **Système de Succès (Achievements)**
  - [ ] Débloquer des titres ou des badges basés sur la collection (ex: "Maître du Feu", "Collectionneur de Légendes").

- [ ] **Fonctionnalités de Tri Avancées**
  - [ ] Filtrer par type de Pokémon (Feu, Eau, etc.) dans la collection.

- [ ] **Optimisations Techniques**
  - [ ] **Refactoring :** Isoler la logique de gestion de l'état dans un hook personnalisé `useGameState`.
