# Non-Functional Requirements

## Performance
- Lighthouse mobile > 90
- FCP < 1.5s
- TTI < 3s
- TTFB < 300ms sur pages critiques

## Availability
- 99.5% uptime cible
- Degradation graceful en offline

## Scalability
- 1000-5000 utilisateurs
- Pics a la rentree et aux resultats
- Indexation aggressive et pagination

## Accessibility
- WCAG 2.1 AA
- Navigation clavier complete
- Labels explicites et contrastes suffisants

## Observability
- Logs server actions
- Traces simples (Vercel)
- Dashboard perf (Web Vitals)

## PWA
- Offline-first pour planning/notes
- Cache TTL 24h
- Offline fallback page
