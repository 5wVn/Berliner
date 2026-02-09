# Backlog MVP - Top 10 Epics

1. Auth & Session Management
- User stories: Login/logout/reset, session persistante, redirection par role
- Definition: Auth stable, erreurs explicites, taux d'echec < 0.5%

2. Multi-Tenant Infrastructure
- User stories: Isolation par etablissement, policies RLS, seeds
- Definition: aucun acces inter-etablissement

3. Planning / Emploi du temps
- User stories: Vue jour/semaine, details session, navigation rapide
- Definition: planning charge < 1.5s, offline ok

4. Notes
- User stories: Liste notes, moyenne, bulletin PDF
- Definition: moyennes correctes, PDF < 500KB

5. Absences
- User stories: Liste absences, upload justificatif, statut
- Definition: upload < 5MB, statut visible

6. Documents
- User stories: Telechargement securise, filtrage par type
- Definition: URLs signees et controle d'acces

7. Profil etudiant
- User stories: Consulter/editer infos basiques
- Definition: validation formulaire, audit minimal

8. Design system UI
- User stories: Composants core, variants, accessibilite
- Definition: composants reutilisables et testes visuellement

9. PWA Offline
- User stories: Cache planning/notes, offline fallback
- Definition: offline stable, TTL 24h

10. Tests & Qualite
- User stories: E2E, unit, integration, RLS tests
- Definition: couverture > 80% sur fonctions critiques
