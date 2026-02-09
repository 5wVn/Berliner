# Charte Graphique & Design System - Berliner

## 1. Vision & Identité
**"Berliner"** adopte une esthétique **"Swiss Style" (Style Typographique International)** modernisée : propre, lisible, structurée par des grilles, et centrée sur le contenu. L'objectif est l'efficacité et la clarté pour une utilisation mobile quotidienne.

*   **Mots-clés :** Clarté, Efficacité, Modernité, Robustesse.
*   **Approche :** Mobile-First, Contenu avant tout, Navigation au pouce.

---

## 2. Typographie (Police)
Nous avons choisi une typographie avec une forte personnalité géométrique.

**Police Principale : [Belanosima](https://fonts.google.com/specimen/Belanosima)**
*   **Pourquoi ?** Géométrique, moderne et lisible. Elle offre un caractère distinctif tout en restant très claire sur les interfaces mobiles.
*   **Usage :**
    *   **Titres :** Belanosima (Bold 700) - Pour une structure visuelle forte.
    *   **Corps :** Belanosima (Regular 400) - Pour le contenu.

**Échelle Typographique :**
*   H1: 28px (Bold)
*   H2: 24px (SemiBold)
*   H3: 20px (Medium)
*   Body: 17px (Regular) - *Base 17px pour la lisibilité*
*   Caption: 15px (Regular)

---

## 3. Palette de Couleurs
Une palette neutre et contrastée, conçue pour supporter le "Dark Mode" et l'accessibilité (WCAG AA).

### Couleurs Primaires (Identité)
*   **Brand Primary (Indigo) :** `#4F46E5` (Indigo 600)
    *   *Usage :* Boutons principaux, liens actifs, éléments de marque.
*   **Brand Surface (Dark Navy) :** `#0F172A` (Slate 900)
    *   *Usage :* En-têtes, navigation, contraste fort.

### Couleurs Neutres (Structure)
*   **Background (Light) :** `#F8FAFC` (Slate 50) - *Pas de blanc pur pour éviter l'éblouissement.*
*   **Surface (Card) :** `#FFFFFF` (White)
*   **Border :** `#E2E8F0` (Slate 200)
*   **Text Primary :** `#1E293B` (Slate 800)
*   **Text Secondary :** `#64748B` (Slate 500)

### Couleurs Sémantiques (Feedback)
*   **Success (Validé, Présent) :** `#10B981` (Emerald 500)
*   **Warning (En attente) :** `#F59E0B` (Amber 500)
*   **Error (Refusé, Absent) :** `#EF4444` (Red 500)
*   **Info (Information) :** `#3B82F6` (Blue 500)

---

## 4. Style Graphique & UI

### Layout "Bento" (Cartes)
L'interface est composée de conteneurs (cartes) clairement délimités.
*   **Bordures :** Fines (1px), couleur Slate-200.
*   **Ombres :** Très légères ou inexistantes (Flat Design) pour la performance. `shadow-sm` maximum.
*   **Arrondis :** `rounded-xl` (12px) ou `rounded-2xl` (16px) pour un aspect moderne et amical.

### Iconographie
**Style :** Outline / Stroke (Traits fins).
**Librairie recommandée :** [Lucide React](https://lucide.dev/)
*   Traits de 1.5px ou 2px.
*   Arrondis cohérents avec les boutons.

### Mobile-First UX Patterns
1.  **Bottom Navigation :** Navigation principale en bas de l'écran (Pouce).
2.  **Touch Targets :** Tous les éléments interactifs font minimum 44x44px.
3.  **Actions Flottantes (FAB) :** Pour les actions principales (ex: "Justifier une absence").
4.  **Skeleton Screens :** Chargement progressif pour une sensation de vitesse instantanée.

---

## 5. Exemple d'Application (Tailwind CSS)

```jsx
// Exemple de bouton primaire
<button className="bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all">
  Connexion
</button>

// Exemple de carte (Note)
<div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
  <div className="flex justify-between items-center">
    <h3 className="text-slate-800 font-semibold">Mathématiques</h3>
    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">16/20</span>
  </div>
  <p className="text-slate-500 text-sm mt-1">Devoir surveillé #3</p>
</div>
```
