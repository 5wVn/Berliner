# Charte Graphique & Design System - Berliner (v2.0 - Airy & Vibrant)

Cette charte définit la nouvelle identité visuelle de **Berliner** : une interface **aérée, colorée et accessible**, conçue pour être agréable au quotidien tout en restant professionnelle.

## 1. Philosophie Design : "Airy & Vibrant"

Nous nous éloignons du style purement utilitaire pour aller vers quelque chose de plus **organique et accueillant**.

*   **Aéré (Airy) :** L'espace vide est une fonctionnalité. On laisse respirer le contenu. On augmente les marges, les paddings et l'interlignage.
*   **Vibrant & Harmonieux :** Le "Light Mode" n'est pas gris triste. Il est vivant, avec des touches de couleurs (Teal, Violet, Rose) qui s'harmonisent avec notre Indigo identitaire.
*   **Gros & Accessible (Big & Bold) :** Les éléments interactifs sont grands, faciles à toucher. Les textes sont lisibles. On ne plisse pas les yeux.
*   **Profondeur Subtile (Glassy) :** Utilisation de transparences légères et de flous (`backdrop-blur`) pour créer une hiérarchie sans lourdeur.

---

## 2. Palette de Couleurs "Harmonie Indigo"

Notre base reste l'Indigo, mais elle est enrichie par des couleurs analogues et complémentaires douces.

### Couleurs Principales
*   **Primary (Indigo)**
    *   `Indigo-600 (#4F46E5)` : Action principale, Marque forte.
    *   `Indigo-500 (#6366F1)` : Hover, Accents vifs.
    *   `Indigo-50 (#EEF2FF)` : Fonds subtils, zones actives légères.

### Accents (La touche "Vibrant")
Ces couleurs sont utilisées pour dynamiser l'interface (badges, graphiques, indicateurs, fonds décoratifs).
*   **Teal (Turquoise) - L'énergie calme**
    *   `Teal-500 (#14b8a6)` : Succès, Validation, Éléments positifs.
    *   `Teal-50 (#f0fdfa)` : Fonds de badges positifs.
*   **Violet - La profondeur**
    *   `Violet-500 (#8b5cf6)` : Données secondaires, Grades moyens.
    *   `Violet-50 (#f5f3ff)` : Fonds décoratifs.
*   **Rose - L'urgence douce**
    *   `Rose-500 (#f43f5e)` : Alertes, Retards, Erreurs (moins agressif que le rouge pur).
    *   `Rose-50 (#fff1f2)` : Fonds d'alerte.

### Neutres & Structure
*   **Background** : `#F8FAFC` (Slate 50) enrichi par un motif "Dot Grid" coloré très subtil.
*   **Surface** : Blanc pur avec légère transparence (`bg-white/80`).
*   **Textes** : `Slate-900` (Titres), `Slate-600` (Corps). Jamais de noir pur (`#000`).

---

## 3. Typographie "Big & Readable"

On augmente l'échelle de base pour un confort de lecture maximal.

**Polices :**
1.  **Fira Sans (Bold Italic)** : Pour les titres. Donne du caractère et du mouvement.
2.  **Montserrat** : Pour le texte. Géométrique et moderne.

**Échelle (Revue à la hausse) :**
*   **H1 (Page Title) :** `text-3xl` (30px) ou `text-4xl` (36px).
*   **H2 (Section) :** `text-2xl` (24px).
*   **H3 (Card Title) :** `text-xl` (20px).
*   **Body Base :** `text-base` (17px) - *Notre standard minimum pour le contenu.*
*   **Body Small :** `text-sm` (15px) - *Uniquement pour les métadonnées secondaires.*
*   **Micro :** `text-xs` (13px) - *Usage très rare.*

---

## 4. Composants UI (Le Style "Airy")

### Les Cartes (Cards)
Elles sont le cœur de l'interface "Bento".
*   **Forme :** Très arrondies (`rounded-2xl` = 24px).
*   **Matière :** Verre dépoli (`bg-white/80` + `backdrop-blur-md`).
*   **Bordure :** Très fine et subtile (`border-slate-200`).
*   **Ombre :** Douce et diffuse (`shadow-lg` avec couleur légère).
*   **Padding :** Généreux ! `p-7` (28px) minimum. On ne colle pas le contenu aux bords.

### Les Boutons (Buttons)
Ils appellent au clic.
*   **Taille :** Hauteur de 48px (`h-12`) minimum pour le standard. 56px (`h-14`) pour les actions majeures.
*   **Forme :** `rounded-xl` (16px). Presque des "pillules" mais avec un peu de structure.
*   **Feedback :** Effet d'enfoncement au clic (`active:scale-95`).

### Les Badges (Tags)
*   Couleurs pastels (`bg-indigo-100 text-indigo-700`).
*   Arrondis complets (`rounded-full`).
*   Texte en `font-bold`.

---

## 5. Règles d'Espacement (Spacing)

L'air est aussi important que le contenu.
*   **Gap (Grilles) :** Minimum `gap-6` (24px) entre les cartes.
*   **Section Spacing :** `space-y-8` (32px) entre les grands blocs.
*   **Interlignage :** `leading-relaxed` pour le texte courant.

---

## 6. Accessibilité (A11y)

*   **Contraste :** On utilise les variantes `600` ou `700` des couleurs (Teal, Violet, Rose) pour le texte sur fond blanc, jamais le `500` (trop clair).
*   **Focus :** Anneaux de focus (`ring`) visibles et colorés (Indigo).
*   **Cibles tactiles :** Rien en dessous de 44x44px. C'est la loi.

---

## 7. Exemple de Code (Tailwind)

```tsx
// Une Carte "Airy"
<div className="
  relative overflow-hidden
  rounded-2xl
  border border-slate-200
  bg-white/80 backdrop-blur-md
  p-7
  shadow-sm transition-shadow hover:shadow-md
">
  <h3 className="font-heading text-xl font-bold italic text-slate-900">
    Mon Cours
  </h3>
  <p className="mt-2 text-base leading-relaxed text-slate-600">
    Description du cours avec de l'espace pour respirer.
  </p>
  
  <div className="mt-6 flex gap-3">
    <button className="
      h-12 px-6
      rounded-xl
      bg-indigo-600 text-white font-semibold
      shadow-glow-indigo-soft
      active:scale-95 transition-transform
    ">
      Voir les détails
    </button>
  </div>
</div>
```
