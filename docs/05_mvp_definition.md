# MVP Definition

## In Scope
- Auth (login, logout, reset password)
- Planning (jour/semaine)
- Notes (consultation, moyenne)
- Absences (liste + justificatifs)
- Documents (telechargement)
- Profil etudiant (consultation)
- Offline-first (planning + notes)

## Out of Scope
- Import legacy
- Notifications push
- Multi-langue
- Messaging interne
- Paiement ou facturation

## Criteres d'acceptation
### Auth
- Login email/mot de passe
- Redirection basee sur role
- Session persistante et securisee

### Planning
- Vue jour mobile et semaine desktop
- Filtrage par classe / eleve
- Cache offline 24h

### Notes
- Liste evaluations par matiere
- Calcul moyenne ponderee
- Export bulletin PDF

### Absences
- Liste absences par eleve
- Upload justificatif < 5MB
- Statut en attente / valide / refuse

### Documents
- Telechargement securise
- Acces base sur role

### Profil
- Affichage infos principales
- Edition minimale (telephone, adresse)
