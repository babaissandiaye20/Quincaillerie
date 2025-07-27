# 📋 Fonctionnalités à Développer — Gestion Commande d’une Quincaillerie

## 🔐 Authentification & Sécurité
- Connexion obligatoire pour accéder à toutes les fonctionnalités
- Gestion des rôles : Gestionnaire, Responsable Achat, Responsable Paiement

---

## 🧑‍💼 Gestionnaire
- Ajouter, modifier, archiver (désactiver) une catégorie de produits
- Ajouter, modifier, archiver une sous-catégorie
- Ajouter, modifier, archiver un produit (code, désignation, stock, prix unitaire, image, sous-catégorie)
- Ajouter, modifier, archiver un fournisseur (numéro, nom, adresse)

---

## 🛒 Responsable Achat
- Enregistrer une nouvelle commande fournisseur (date, montant, date livraison prévue, date livraison réelle, fournisseur)
- Lister toutes les commandes faites
- Annuler une commande
- Filtrer les commandes par :
  - Date
  - État (Livré, En cours, Payé)
al
---

## 💰 Responsable Paiement
- Enregistrer un paiement pour une commande (max 3 versements égaux, espacés de 5 jours après la date de livraison réelle)
- Voir la liste des commandes en attente de paiement
- Consulter l’historique des versements d’une commande (numéro, date, montant)
- Voir le montant restant dû sur chaque commande
- Voir la dette totale d’un fournisseur

---

## 📊 Statistiques (accès multi-rôles)
- Lister les commandes en cours
- Lister les commandes à livrer dans la journée
- Afficher la dette totale de la quincaillerie envers les fournisseurs
- Afficher les versements effectués dans la journée

---

## 🛠️ Contraintes Métier & Techniques
- Un produit appartient à une sous-catégorie
- Un produit peut être commandé plusieurs fois, le prix d’achat peut varier selon la commande
- Un fournisseur peut livrer plusieurs commandes
- Paiement d’une commande : max 3 versements égaux, espacés de 5 jours après la date de livraison réelle
- Archivage logique (pas de suppression physique)
- Toutes les fonctionnalités sont accessibles uniquement après connexion

---

## 📦 Bonus (optionnel)
- Journalisation des actions (logs)
- Documentation API Swagger
- Gestion des images produits (upload, stockage, chemin) 
