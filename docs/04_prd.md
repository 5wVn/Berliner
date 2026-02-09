# PRD - Portail Etudiant Multi-Etablissements

## Resume
Portail unique pour 5 roles, mobile-first, offline-first, avec isolation stricte des donnees par etablissement.

## Probleme
- Portails actuels lents et peu intuitifs sur mobile
- Donnees cloisonnees difficiles a isoler entre etablissements
- Absence d'experience offline fiable

## Objectifs
- Supplanter MyGES en experience mobile et performance
- Garantir isolation multi-tenant par RLS
- Livrer un MVP en 8-10 semaines

## Non-objectifs (MVP)
- Integrations SI legacy
- Notifications push avancees
- Messagerie interne

## Utilisateurs et roles
- Eleve, Professeur, Scolarite, Responsable pedagogique, Entreprise/Tuteur

## Fonctionnalites MVP
- Authentification securisee
- Planning
- Notes
- Absences + justificatifs
- Documents administratifs
- Profil etudiant

## Exigences non fonctionnelles
- Lighthouse mobile > 90
- FCP < 1.5s, TTI < 3s
- Offline-first pour planning et notes
- Accessibilite WCAG 2.1 AA

## Mesures de succes
- Temps de chargement percu < 2s sur 4G
- Taux d'erreur auth < 0.5%
- Satisfaction utilisateur (NPS) > 30 sur pilote

## Dependencies
- Supabase (Auth, Postgres, Storage)
- Vercel (Edge + Functions)
- next-pwa + Workbox

## Risques majeurs
- Complexite RLS
- Volumetrie Supabase
- Conflits offline
