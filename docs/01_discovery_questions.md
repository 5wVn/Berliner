# Discovery Questions

1. Q: Quels etablissements doivent etre supportes au Day-1 ?
   R: Pilote avec 3 etablissements (campus differents), extensible ensuite.
2. Q: Faut-il une isolation par base de donnees ?
   R: Non, base partagee avec RLS et establishment_id dans toutes les tables.
3. Q: Priorite UX mobile ou desktop ?
   R: Mobile first, desktop en second.
4. Q: Quelles sont les 5 roles exacts ?
   R: Eleve, Professeur, Scolarite, Responsable pedagogique, Entreprise/Tuteur.
5. Q: Authentification federated (SSO) requise ?
   R: Non, email/mot de passe pour le MVP.
6. Q: Quels modules critiques Day-1 ?
   R: Planning, Notes, Absences, Documents, Profil, Auth.
7. Q: Volumetrie et pics ?
   R: 1000-5000 utilisateurs, pics a la rentree et aux resultats.
8. Q: Exigence offline ?
   R: Oui, planning et notes consultables hors ligne.
9. Q: Donnees legacy a importer ?
   R: Pas au Day-1, donnees saisies nativement.
10. Q: Niveau RGPD attendu ?
    R: Standard academique, retention definie, audit minimal.
11. Q: Tolerance a la latence ?
    R: Faible, cible FCP < 1.5s sur mobile.
12. Q: Mode multi-role par utilisateur ?
    R: A confirmer, non requis pour le MVP.
