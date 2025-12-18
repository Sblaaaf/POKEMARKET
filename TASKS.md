
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

---

## 🚀 Roadmap & Axes d'Amélioration Suggérés

### V1.4 - Prochaines Étapes Suggérées

- [ ] **Fonctionnalité d'Évolution (À CONFIRMER)**
  - [ ] Si l'API le permet de manière simple, créer une fonction d'évolution pour les Pokémon de la collection.
    - [ ] Au clic sur la carte, un bouton "Évoluer" apparaît.
    - [ ] Le coût en tokens serait progressif en fonction de la rareté (max 30 tokens).
    - [ ] L'évolution augmente la valeur de revente de la carte et met à jour son image.

- [ ] **Amélioration de l'Expérience Utilisateur (UX)**
  - [ ] **Notifications "Toast" :** Ajouter des notifications non-bloquantes pour les actions réussies (achat, vente) pour un feedback visuel clair.
  - [ ] **Indicateurs de chargement :** Afficher un indicateur de chargement plus subtil sur les boutons d'achat pendant la recherche d'un Pokémon.

- [ ] **Fonctionnalités de Collection**
  - [ ] **Statistiques par carte :** En cliquant sur une carte, afficher des détails supplémentaires (date d'obtention, nombre de fois possédée...).

- [ ] **Optimisations Techniques**
  - [ ] **Refactoring :** Isoler la logique de gestion de l'état (`state`) dans `App.tsx` dans un hook personnalisé (ex: `useGameState`) pour nettoyer le composant principal.
  - [ ] **Accessibilité (A11y) :** Ajouter des attributs ARIA aux éléments interactifs (boutons, filtres) pour améliorer la navigation pour les utilisateurs de lecteurs d'écran.
