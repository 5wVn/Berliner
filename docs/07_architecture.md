# Architecture

## Stack
- Frontend: Next.js 15 App Router, React, TypeScript, Tailwind CSS
- Backend: Supabase (PostgreSQL, Auth, Storage, RLS)
- Deploiement: Vercel (serverless, edge)
- PWA: next-pwa + Workbox

## Vue globale
- App Router pour Server Components et streaming SSR
- Server Actions pour operations data et auth
- RLS au niveau Postgres pour isolation multi-tenant
- Service Worker pour cache offline (planning, notes)

## Diagrammes
- docs/diagrams/architecture_overview.mermaid
- docs/diagrams/auth_flow.mermaid
- docs/diagrams/multi_tenant_isolation.mermaid
- docs/diagrams/pwa_cache_strategy.mermaid

## Decisions cles
- Shared database + establishment_id: cout et operations simplifiees
- RLS pour isolation: barriere securite non contournable
- Offline-first: avantage competitif mobile

## Tradeoffs
- RLS augmente la complexite SQL
- Offline-first introduit une gestion des conflits (post-MVP)
- Server Actions imposent une discipline sur la separation client/serveur
