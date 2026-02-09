# Contexte

## Vision
Creer un portail etudiant multi-etablissements moderne qui surpasse MyGES en experience utilisateur, performance mobile et simplicite. Le portail doit etre une reference pour la consultation rapide des informations academiques, en particulier sur mobile et en conditions de connectivite degradee.

## Objectifs
- UX mobile prioritaire (PWA, offline-first, interactions rapides)
- Isolation stricte des donnees entre etablissements
- Performance percue excellente (chargement instantane des vues clefs)
- Simplicite d'usage pour 5 roles (Eleve, Professeur, Scolarite, Responsable pedagogique, Entreprise/Tuteur)
- Base technique evolutive (MVP puis V2)

## Contraintes
- Multi-tenant partage (une base, plusieurs etablissements)
- 1000 a 5000 utilisateurs avec pics (rentree, resultats)
- Donnees natives Day-1, aucune integration legacy
- Auth native email/mot de passe
- RGPD standard pour donnees academiques
- Priorite absolue au mobile et au hors-ligne

## Hypotheses validees
- Next.js 15 App Router + Supabase est suffisant pour le MVP
- RLS PostgreSQL garantit une isolation non contournable cote client
- PWA offline-first est un avantage competitif majeur
- TypeScript strict reduit les regressions en production

## Hors scope immediat
- Integrations SI etablissements (SIS/ERP)
- Multi-langue Day-1
- Notifications push avancees
- Messagerie interne (V2)
