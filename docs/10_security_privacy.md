# Security and Privacy

## RGPD
- Base legale: execution du contrat et obligation legale
- Minimisation: collecter uniquement donnees academiques necessaires
- Droit d'acces et d'effacement via procedure interne
- Retention par type de document (voir plus bas)

## Auth
- Email + mot de passe, hash Argon2 (Supabase)
- Reset password par email
- Verrouillage progressif apres tentatives echouees

## RLS
- RLS activee sur toutes les tables
- Helper `auth.user_establishment_id()`
- Policies par role (lecture/edition limitees)

## Audit logs
- Log des actions sensibles (connexion, export, upload justificatifs)
- Table `audit_logs` (V2) ou logs applicatifs Vercel

## Chiffrement
- TLS en transit
- Chiffrement au repos gere par Supabase
- URLs signees pour telechargements

## Retention
- Notes: 5 ans
- Absences: 3 ans
- Documents administratifs: 5 ans (selon type)
- Logs applicatifs: 12 mois

## Securite applicative
- Security headers (CSP, HSTS, X-Frame-Options)
- Validation stricte des inputs
- Pas de secrets dans le client

## Incident response (MVP)
- Detection via monitoring
- Rotation des clefs et invalidation sessions
- Communication a l'etablissement pilote
