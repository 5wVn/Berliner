"use client";

import UnicornScene from "unicornstudio-react/next";

// Fond animé Unicorn Studio (WebGL) — fixe, plein écran, derrière l'UI.
// IMPORTANT : on utilise `z-0` (PAS un z-index négatif), sinon le fond passe
// derrière le fond opaque du <body> et devient invisible. Le contenu de
// l'app est mis au-dessus en `z-10`. `pointer-events-none` => ne bloque jamais
// les clics.
export function UnicornBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <UnicornScene
        projectId="YxfXlIoK9giMIqIf2zJr"
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js"
        width="100%"
        height="100%"
      />
    </div>
  );
}
