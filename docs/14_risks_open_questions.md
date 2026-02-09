# Risks and Open Questions

## Risks
- Performance Supabase a volumetrie: indexation aggressive, pagination, monitoring queries
- Complexite RLS: tests automatises, revue secu, templates
- Offline sync conflicts: last-write-wins MVP, UI de resolution V2
- Adoption utilisateurs: pilotes, formation, support
- Pics de charge rentree: load testing k6, scaling Vercel/Supabase

## Open Questions
1. Migration donnees legacy: import CSV assiste ou saisie manuelle ?
2. Rollover annees academiques: automatique ou manuel ?
3. Multi-langue: FR seulement MVP ou EN Day-1 ?
4. Roles composites: un user peut-il avoir plusieurs roles ?
5. Workflow notes: validation requise avant publication eleves ?
