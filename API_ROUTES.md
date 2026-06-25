# Documentation des routes API

**Base URL :** `http://localhost/api/v1`  
**Authentification :** Session Laravel (Sanctum). Dans Postman, activer **"Automatically follow redirects"** et **"Save cookies"**. Toutes les requêtes authentifiées nécessitent le header `X-XSRF-TOKEN` (récupéré depuis le cookie `XSRF-TOKEN` après login).

**Format des réponses :**
```json
{ "success": true, "data": {...}, "message": "..." }
```
En cas d'erreur : `{ "success": false, "message": "...", "errors": {...} }`

---

## Sommaire

- [Auth](#1-auth)
- [Sessions](#2-sessions)
- [Profil utilisateur](#3-profil-utilisateur)
- [Notifications](#4-notifications)
- [Restaurants (public)](#5-restaurants-public)
- [Restaurants (owner)](#6-restaurants-owner)
- [Horaires d'ouverture](#7-horaires-douverture)
- [Menus (public)](#8-menus-public)
- [Menus (owner)](#9-menus-owner)
- [Articles de menu (owner)](#10-articles-de-menu-owner)
- [Favoris](#11-favoris)
- [Réservations (client)](#12-réservations-client)
- [Réservations (owner)](#13-réservations-owner)

---

## Valeurs des enums

| Enum | Valeurs acceptées |
|------|-------------------|
| `price_range` | `€` · `€€` · `€€€` · `€€€€` |
| `category` (item) | `entree` · `plat` · `dessert` · `boisson` · `accompagnement` · `autre` |
| `day_of_week` | `0` (dim) · `1` (lun) · `2` (mar) · `3` (mer) · `4` (jeu) · `5` (ven) · `6` (sam) |
| `bill_split_type` | `individual` · `equal_split` · `custom` |
| `status` (réservation) | `pending` · `confirmed` · `cancelled` · `completed` · `no_show` |
| `invitation status` | `accepted` · `declined` |

---

## 1. Auth

### POST `/auth/register`
Crée un compte utilisateur et connecte automatiquement la session.

**Auth requise :** Non  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `firstname` | string | Oui | max:100 |
| `lastname` | string | Oui | max:100 |
| `email` | string | Oui | email unique |
| `password` | string | Oui | min:8, confirmé |
| `password_confirmation` | string | Oui | identique à `password` |
| `phone_number` | string | Oui | max:20 |

**Réponse 201 :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean@example.com",
    "phone_number": "0612345678",
    "profile_picture_url": null,
    "is_active": true,
    "email_verified_at": null,
    "last_login_at": null,
    "created_at": "2026-04-07T10:00:00.000000Z"
  },
  "message": "Compte créé avec succès."
}
```

---

### POST `/auth/login`
Authentifie un utilisateur et ouvre une session.

**Auth requise :** Non  
**Body (JSON) :**

| Champ | Type | Requis |
|-------|------|--------|
| `email` | string | Oui |
| `password` | string | Oui |

**Réponse 200 :** Même structure que `/register` avec `message: "Connexion réussie."`

**Erreur 401 :** Identifiants incorrects  
**Erreur 403 :** Compte désactivé

---

### POST `/auth/logout`
Termine la session courante.

**Auth requise :** Oui  
**Body :** Aucun  
**Réponse 204 :** Aucun contenu

---

### GET `/auth/me`
Retourne les informations de l'utilisateur authentifié.

**Auth requise :** Oui  
**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean@example.com",
    "phone_number": "0612345678",
    "profile_picture_url": null,
    "is_active": true,
    "email_verified_at": "2026-04-07T10:00:00.000000Z",
    "last_login_at": "2026-04-07T10:00:00.000000Z",
    "created_at": "2026-04-07T10:00:00.000000Z",
    "address": null
  }
}
```

---

### POST `/auth/email/verify`
Vérifie l'adresse email via le token reçu par email.

**Auth requise :** Non  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `token` | string | Oui | exactement 64 caractères |

**Réponse 200 :** `{ "success": true, "data": null, "message": "Email vérifié avec succès." }`

---

### POST `/auth/password/forgot`
Envoie un email de réinitialisation de mot de passe.

**Auth requise :** Non  
**Body (JSON) :**

| Champ | Type | Requis |
|-------|------|--------|
| `email` | string | Oui |

**Réponse 200 :** `{ "success": true, "data": null, "message": "Si cet email existe, un lien de réinitialisation a été envoyé." }`

> Toujours 200 même si l'email n'existe pas (sécurité).

---

### POST `/auth/password/reset`
Réinitialise le mot de passe avec le token reçu par email.

**Auth requise :** Non  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `token` | string | Oui | |
| `email` | string | Oui | email |
| `password` | string | Oui | min:8, confirmé |
| `password_confirmation` | string | Oui | identique à `password` |

**Réponse 200 :** `{ "success": true, "data": null, "message": "Mot de passe réinitialisé avec succès." }`

---

## 2. Sessions

### GET `/auth/sessions`
Liste toutes les sessions actives de l'utilisateur.

**Auth requise :** Oui  
**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123...",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0...",
      "last_activity": 1712484000,
      "is_current": true
    }
  ]
}
```

---

### DELETE `/auth/sessions`
Révoque toutes les sessions sauf la session courante.

**Auth requise :** Oui  
**Body :** Aucun  
**Réponse 204 :** Aucun contenu

---

### DELETE `/auth/sessions/{id}`
Révoque une session spécifique (impossible de révoquer la session courante).

**Auth requise :** Oui  
**Paramètre URL :** `id` — identifiant de session (string)  
**Réponse 204 :** Aucun contenu  
**Erreur 403 :** Session introuvable ou tentative de révoquer la session courante

---

## 3. Profil utilisateur

### PUT `/profile`
Met à jour le profil de l'utilisateur connecté. Tous les champs sont optionnels.

**Auth requise :** Oui  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `firstname` | string | Non | max:100 |
| `lastname` | string | Non | max:100 |
| `phone_number` | string | Non | max:20 |
| `profile_picture_url` | string | Non | URL valide, max:500 |
| `current_password` | string | Cond. | requis si `new_password` présent |
| `new_password` | string | Non | min:8, confirmé |
| `new_password_confirmation` | string | Cond. | requis si `new_password` présent |
| `address.street` | string | Non | max:255 |
| `address.zipcode` | string | Non | max:20 |
| `address.city` | string | Non | max:100 |
| `address.country` | string | Non | max:100 |
| `address.latitude` | numeric | Non | entre -90 et 90 |
| `address.longitude` | numeric | Non | entre -180 et 180 |
| `address.additional_info` | string\|null | Non | max:255 |

**Réponse 200 :** Objet `UserResource` avec `message: "Profil mis à jour."`  
**Erreur 422 :** Mot de passe actuel incorrect

---

### DELETE `/profile`
Supprime (anonymise RGPD) le compte de l'utilisateur connecté et invalide la session.

**Auth requise :** Oui  
**Body :** Aucun  
**Réponse 204 :** Aucun contenu

> L'email est remplacé par `deleted_{id}@deleted.local`, nom/prénom par "Deleted User".

---

## 4. Notifications

### GET `/notifications`
Liste les notifications paginées (20/page) — non lues d'abord.

**Auth requise :** Oui  
**Query params :** `?page=1`  
**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "uuid...",
        "type": "App\\Notifications\\ReservationCreatedNotification",
        "notifiable_type": "App\\Models\\User",
        "notifiable_id": 1,
        "data": { "reservation_id": 5, "message": "..." },
        "read_at": null,
        "created_at": "2026-04-07T10:00:00.000000Z"
      }
    ],
    "total": 3,
    "per_page": 20,
    "last_page": 1
  }
}
```

---

### POST `/notifications/read-all`
Marque toutes les notifications non lues comme lues.

**Auth requise :** Oui  
**Body :** Aucun  
**Réponse 200 :** `{ "success": true, "data": null, "message": "Toutes les notifications marquées comme lues." }`

---

### PATCH `/notifications/{id}/read`
Marque une notification spécifique comme lue.

**Auth requise :** Oui  
**Paramètre URL :** `id` — UUID de la notification  
**Réponse 200 :** `{ "success": true, "data": null, "message": "Notification marquée comme lue." }`  
**Erreur 404 :** Notification introuvable

---

### DELETE `/notifications/{id}`
Supprime une notification.

**Auth requise :** Oui  
**Paramètre URL :** `id` — UUID de la notification  
**Réponse 204 :** Aucun contenu  
**Erreur 404 :** Notification introuvable

---

## 5. Restaurants (public)

### GET `/restaurants`
Recherche et liste les restaurants actifs avec filtres optionnels.

**Auth requise :** Non  
**Query params :**

| Paramètre | Type | Requis | Contraintes |
|-----------|------|--------|-------------|
| `query` | string | Non | max:255 — recherche dans nom/description |
| `lat` | numeric | Non | -90 à 90, requis avec `lng` |
| `lng` | numeric | Non | -180 à 180, requis avec `lat` |
| `radius_km` | numeric | Non | 1 à 100 (défaut selon config) |
| `price_range` | string | Non | `€` · `€€` · `€€€` · `€€€€` |
| `cuisine_type` | string | Non | max:100 |
| `per_page` | integer | Non | 1 à 100 |

**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Le Bon Coin",
      "description": "...",
      "email": "contact@leboncoin.fr",
      "phone_number": "0123456789",
      "cuisine_type": "Française",
      "price_range": "€€",
      "price_range_label": "Modéré",
      "capacity": 50,
      "allow_pre_order": true,
      "average_rating": 4.5,
      "total_reviews": 120,
      "is_active": true,
      "logo_url": "https://...",
      "cover_image_url": "https://...",
      "distance_km": 1.2,
      "created_at": "2026-01-01T00:00:00.000000Z"
    }
  ]
}
```

---

### GET `/restaurants/{id}`
Retourne le détail d'un restaurant avec son adresse et ses horaires.

**Auth requise :** Non  
**Paramètre URL :** `id` — integer  
**Réponse 200 :** Objet restaurant avec `address` et `opening_hours` chargés  
**Erreur 404 :** Restaurant introuvable ou inactif

**Structure `address` :**
```json
{
  "street": "12 rue de la Paix",
  "zipcode": "75001",
  "city": "Paris",
  "country": "France",
  "latitude": 48.8698,
  "longitude": 2.3311,
  "additional_info": null
}
```

**Structure `opening_hours` (tableau) :**
```json
[
  {
    "day_of_week": 1,
    "day_name": "Lundi",
    "opening_time": "11:30",
    "closing_time": "14:30",
    "service_label": "Déjeuner",
    "is_closed": false
  }
]
```

---

### GET `/restaurants/{id}/opening-hours`
Liste les horaires d'ouverture d'un restaurant.

**Auth requise :** Non  
**Paramètre URL :** `id` — integer  
**Réponse 200 :** Tableau `OpeningHoursResource` (voir structure ci-dessus)

---

### GET `/restaurants/{id}/menus`
Liste les menus actifs d'un restaurant (sans les articles).

**Auth requise :** Non  
**Paramètre URL :** `id` — integer  
**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Menu du midi",
      "description": "...",
      "is_active": true
    }
  ]
}
```

---

### GET `/restaurants/{id}/availability`
Vérifie la disponibilité d'un restaurant pour une date/heure et un nombre de couverts.

**Auth requise :** Oui  
**Paramètre URL :** `id` — integer  
**Query params :**

| Paramètre | Type | Requis | Format |
|-----------|------|--------|--------|
| `datetime` | string | Oui | `2026-04-15 19:30:00` |
| `guests` | integer | Oui | min:1 |

**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "available": true,
    "remaining_seats": 12
  }
}
```

---

## 6. Restaurants (owner)

> Ces routes nécessitent le rôle **owner**.

### POST `/owner/restaurants`
Crée un nouveau restaurant.

**Auth requise :** Oui (owner)  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `name` | string | Oui | max:200 |
| `email` | string | Non | email, max:255 |
| `phone_number` | string | Non | max:20 |
| `description` | string\|null | Non | |
| `price_range` | string | Oui | `€` · `€€` · `€€€` · `€€€€` |
| `capacity` | integer | Oui | min:1 |
| `allow_pre_order` | boolean | Non | défaut: false |
| `cuisine_type` | string\|null | Non | max:100 |
| `logo_url` | string\|null | Non | URL, max:500 |
| `cover_image_url` | string\|null | Non | URL, max:500 |
| `address.street` | string | Oui | max:255 |
| `address.zipcode` | string | Oui | max:20 |
| `address.city` | string | Oui | max:100 |
| `address.country` | string | Non | max:100 |
| `address.latitude` | numeric | Oui | -90 à 90 |
| `address.longitude` | numeric | Oui | -180 à 180 |
| `address.additional_info` | string\|null | Non | max:255 |

**Réponse 201 :** Objet restaurant avec `address`, `message: "Restaurant créé avec succès."`  
**Erreur 403 :** Non autorisé (pas owner)

---

### PUT `/owner/restaurants/{id}`
Met à jour un restaurant existant. Tous les champs sont optionnels.

**Auth requise :** Oui (owner du restaurant)  
**Paramètre URL :** `id` — integer  
**Body (JSON) :** Mêmes champs que `POST /owner/restaurants`, tous optionnels  
**Réponse 200 :** Objet restaurant mis à jour avec `message: "Restaurant mis à jour."`  
**Erreur 403 :** Non propriétaire  
**Erreur 404 :** Restaurant introuvable

---

### DELETE `/owner/restaurants/{id}`
Supprime (soft delete) un restaurant.

**Auth requise :** Oui (owner du restaurant)  
**Paramètre URL :** `id` — integer  
**Réponse 204 :** Aucun contenu  
**Erreur 403 / 404**

---

### GET `/owner/restaurants/{id}/dashboard`
Tableau de bord du restaurant : nombre de menus, articles actifs, articles en faible stock.

**Auth requise :** Oui (owner du restaurant)  
**Paramètre URL :** `id` — integer  
**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "menu_count": 3,
    "active_items": 24,
    "low_stock_items": [
      {
        "id": 5,
        "name": "Saumon",
        "price": 18.5,
        "category": "plat",
        "category_label": "Plat principal",
        "stock_quantity": 3,
        "is_available": true,
        "image_url": null
      }
    ]
  }
}
```

> `low_stock_items` : articles avec `stock_quantity` entre 1 et 5 inclus.

---

## 7. Horaires d'ouverture

### PUT `/owner/restaurants/{id}/opening-hours`
Crée ou met à jour les horaires d'un restaurant (upsert complet).

**Auth requise :** Oui (owner du restaurant)  
**Paramètre URL :** `id` — integer  
**Body (JSON) :**

```json
{
  "hours": [
    {
      "day_of_week": 1,
      "opening_time": "11:30",
      "closing_time": "14:30",
      "service_label": "Déjeuner",
      "is_closed": false
    },
    {
      "day_of_week": 1,
      "opening_time": "19:00",
      "closing_time": "22:30",
      "service_label": "Dîner",
      "is_closed": false
    },
    {
      "day_of_week": 0,
      "is_closed": true
    }
  ]
}
```

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `hours` | array | Oui | tableau d'objets |
| `hours.*.day_of_week` | integer | Oui | 0 (dim) à 6 (sam) |
| `hours.*.opening_time` | string | Cond. | `HH:MM`, requis si `is_closed` != true |
| `hours.*.closing_time` | string | Cond. | `HH:MM`, requis si `is_closed` != true, après `opening_time` |
| `hours.*.service_label` | string\|null | Non | max:50 (ex: "Déjeuner", "Dîner") |
| `hours.*.is_closed` | boolean | Non | défaut: false |

**Réponse 200 :** Tableau des horaires mis à jour avec `message: "Horaires mis à jour."`

---

## 8. Menus (public)

### GET `/menus/{id}`
Retourne un menu avec tous ses articles.

**Auth requise :** Non  
**Paramètre URL :** `id` — integer  
**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Menu du midi",
    "description": "Entrée + plat + dessert",
    "is_active": true,
    "items": [
      {
        "id": 3,
        "name": "Salade César",
        "description": "...",
        "price": 9.5,
        "category": "entree",
        "category_label": "Entrée",
        "image_url": null,
        "stock_quantity": null,
        "is_available": true
      }
    ]
  }
}
```

> `stock_quantity: null` signifie stock illimité.

---

## 9. Menus (owner)

### POST `/owner/restaurants/{id}/menus`
Crée un menu pour un restaurant.

**Auth requise :** Oui (owner du restaurant)  
**Paramètre URL :** `id` — integer (restaurant)  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `name` | string | Oui | max:255 |
| `description` | string\|null | Non | |
| `is_active` | boolean | Non | défaut: true |

**Réponse 201 :** Objet menu avec `message: "Menu créé avec succès."`

---

### PUT `/owner/menus/{id}`
Met à jour un menu.

**Auth requise :** Oui (owner du restaurant propriétaire)  
**Paramètre URL :** `id` — integer (menu)  
**Body (JSON) :** Mêmes champs que `POST`, tous optionnels  
**Réponse 200 :** Objet menu avec items, `message: "Menu mis à jour."`

---

### DELETE `/owner/menus/{id}`
Supprime un menu.

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer  
**Réponse 204 :** Aucun contenu

---

## 10. Articles de menu (owner)

### POST `/owner/menus/{id}/items`
Ajoute un article à un menu.

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer (menu)  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `name` | string | Oui | max:200 |
| `description` | string\|null | Non | |
| `price` | numeric | Oui | min:0 |
| `category` | string | Oui | `entree` · `plat` · `dessert` · `boisson` · `accompagnement` · `autre` |
| `stock_quantity` | integer\|null | Non | min:0, null = illimité |
| `is_available` | boolean | Non | défaut: true |
| `image_url` | string\|null | Non | URL, max:500 |

**Réponse 201 :** Objet article avec `message: "Article créé avec succès."`

---

### PUT `/owner/items/{id}`
Met à jour un article.

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer  
**Body (JSON) :** Mêmes champs que `POST`, tous optionnels  
**Réponse 200 :** Objet article mis à jour avec `message: "Article mis à jour."`

---

### DELETE `/owner/items/{id}`
Supprime un article.

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer  
**Réponse 204 :** Aucun contenu

---

### PATCH `/owner/items/{id}/stock`
Ajuste le stock d'un article par delta (positif ou négatif).

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `delta` | integer | Oui | positif (réapprovisionnement) ou négatif (consommation) |
| `reason` | string | Oui | max:255 |

**Exemple :** `{ "delta": -3, "reason": "Vente du soir" }`  
**Réponse 200 :** Objet article avec stock mis à jour, `message: "Stock ajusté."`

---

## 11. Favoris

### GET `/favorites`
Liste les restaurants favoris de l'utilisateur connecté.

**Auth requise :** Oui  
**Réponse 200 :**
```json
{
  "success": true,
  "data": [
    {
      "restaurant_id": 1,
      "restaurant": { ...RestaurantResource... }
    }
  ]
}
```

---

### POST `/favorites/{restaurantId}`
Ajoute ou retire un restaurant des favoris (toggle).

**Auth requise :** Oui  
**Paramètre URL :** `restaurantId` — integer  
**Body :** Aucun  
**Réponse 200 :**
```json
{ "success": true, "data": { "favorited": true }, "message": "Ajouté aux favoris." }
```
ou
```json
{ "success": true, "data": { "favorited": false }, "message": "Retiré des favoris." }
```
**Erreur 404 :** Restaurant introuvable

---

## 12. Réservations (client)

### GET `/reservations`
Liste toutes les réservations de l'utilisateur (en tant qu'organisateur ou participant).

**Auth requise :** Oui  
**Réponse 200 :** Tableau de `ReservationResource` trié par date décroissante

**Structure `ReservationResource` :**
```json
{
  "id": 1,
  "restaurant": { ...RestaurantResource... },
  "organizer": { ...UserResource... },
  "reservation_datetime": "2026-04-15T19:30:00.000000Z",
  "number_of_guests": 4,
  "status": "pending",
  "status_label": "En attente",
  "bill_split_type": "equal_split",
  "bill_split_type_label": "Partage égal",
  "table_number": null,
  "special_requests": "Allergie aux noix",
  "cancellation_reason": null,
  "confirmed_at": null,
  "cancelled_at": null,
  "participants": [
    {
      "user": { ...UserResource... },
      "guest_name": null,
      "invitation_status": "pending",
      "invitation_status_label": "En attente"
    }
  ],
  "created_at": "2026-04-07T10:00:00.000000Z"
}
```

---

### POST `/reservations`
Crée une nouvelle réservation.

**Auth requise :** Oui  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `restaurant_id` | integer | Oui | doit exister dans `restaurants` |
| `reservation_datetime` | string | Oui | date future, format `2026-04-15 19:30:00` |
| `number_of_guests` | integer | Oui | 1 à 100 |
| `bill_split_type` | string | Non | `individual` · `equal_split` · `custom` |
| `friend_group_id` | integer\|null | Non | doit exister dans `friend_groups` |
| `special_requests` | string\|null | Non | max:1000 |

**Réponse 201 :** `ReservationResource` avec restaurant, address et participants chargés, `message: "Réservation créée avec succès."`  
**Erreur 409 :** Pas de disponibilité (NoAvailabilityException)  
**Erreur 422 :** Restaurant fermé à ce créneau (RestaurantClosedException)

---

### GET `/reservations/{id}`
Retourne le détail d'une réservation.

**Auth requise :** Oui (organisateur ou participant)  
**Paramètre URL :** `id` — integer  
**Réponse 200 :** `ReservationResource` complet  
**Erreur 403 :** Non autorisé  
**Erreur 404 :** Introuvable

---

### PUT `/reservations/{id}`
Modifie une réservation (uniquement si statut `pending`).

**Auth requise :** Oui (organisateur uniquement)  
**Paramètre URL :** `id` — integer  
**Body (JSON) :**

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `reservation_datetime` | string | Non | date future |
| `number_of_guests` | integer | Non | 1 à 100 |
| `special_requests` | string\|null | Non | max:1000 |

**Réponse 200 :** `ReservationResource` mis à jour  
**Erreur 403 :** Non autorisé ou statut invalide

---

### DELETE `/reservations/{id}`
Annule une réservation.

**Auth requise :** Oui (organisateur)  
**Paramètre URL :** `id` — integer  
**Body (JSON, optionnel) :**

| Champ | Type | Requis |
|-------|------|--------|
| `cancellation_reason` | string | Non |

**Réponse 204 :** Aucun contenu  
**Erreur 403 :** Non autorisé ou transition de statut invalide

---

### POST `/reservations/{id}/invitation/respond`
Répond à une invitation de réservation (en tant que participant invité).

**Auth requise :** Oui (participant invité)  
**Paramètre URL :** `id` — integer (réservation)  
**Body (JSON) :**

| Champ | Type | Requis | Valeurs |
|-------|------|--------|---------|
| `status` | string | Oui | `accepted` · `declined` |

**Réponse 200 :** `{ "success": true, "data": null, "message": "Invitation Acceptée." }`  
**Erreur 403 :** L'utilisateur n'est pas invité à cette réservation

---

## 13. Réservations (owner)

> Ces routes nécessitent le rôle **owner** et que le restaurant appartienne à l'utilisateur.

### GET `/owner/restaurants/{id}/reservations`
Liste les réservations d'un restaurant avec filtres optionnels.

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer (restaurant)  
**Query params (optionnels) :**

| Paramètre | Exemple | Description |
|-----------|---------|-------------|
| `status` | `pending` | Filtrer par statut |
| `date` | `2026-04-15` | Filtrer par date |

**Réponse 200 :** Tableau de `ReservationResource`

---

### POST `/owner/reservations/{id}/confirm`
Confirme une réservation (transition `pending` → `confirmed`).

**Auth requise :** Oui (owner du restaurant)  
**Paramètre URL :** `id` — integer  
**Body :** Aucun  
**Réponse 200 :** `ReservationResource` avec `message: "Réservation confirmée."`  
**Erreur 422 :** Transition de statut invalide

---

### POST `/owner/reservations/{id}/decline`
Refuse une réservation (transition `pending` → `cancelled`).

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer  
**Body :** Aucun  
**Réponse 200 :** `ReservationResource` avec `message: "Réservation refusée."`

---

### POST `/owner/reservations/{id}/complete`
Marque une réservation comme terminée (transition `confirmed` → `completed`).

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer  
**Body :** Aucun  
**Réponse 200 :** `ReservationResource` avec `message: "Réservation terminée."`

---

### POST `/owner/reservations/{id}/no-show`
Enregistre un no-show (transition `confirmed` → `no_show`).

**Auth requise :** Oui (owner)  
**Paramètre URL :** `id` — integer  
**Body :** Aucun  
**Réponse 200 :** `ReservationResource` avec `message: "No-show enregistré."`

---

## Codes HTTP utilisés

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Ressource créée |
| 204 | Succès sans contenu (delete/logout) |
| 401 | Non authentifié |
| 403 | Non autorisé (droits insuffisants) |
| 404 | Ressource introuvable |
| 409 | Conflit (ex: pas de disponibilité) |
| 422 | Données invalides / transition impossible |

---

## Transitions de statut des réservations

```
pending  →  confirmed  (owner: confirm)
pending  →  cancelled  (owner: decline / client: cancel)
confirmed → completed  (owner: complete)
confirmed → cancelled  (owner ou client)
confirmed → no_show    (owner: no-show)
```

Les statuts `completed`, `cancelled` et `no_show` sont terminaux (aucune transition possible).
