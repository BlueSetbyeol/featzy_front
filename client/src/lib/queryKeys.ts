import type { RestaurantQuery } from "@/api/RestaurantApi";

/**
 * Fabrique centralisée des clés de cache TanStack Query.
 *
 * Conventions :
 * - `all()` renvoie le préfixe de domaine → sert aux invalidations larges.
 * - Les clés plus spécifiques étendent ce préfixe, donc invalider `all()`
 *   invalide aussi toutes les sous-clés du domaine.
 */
export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },

  reference: {
    cuisineTypes: () => ["reference", "cuisine-types"] as const,
    allergens: () => ["reference", "allergens"] as const,
    dietaryPreferences: () => ["reference", "dietary-preferences"] as const,
  },

  restaurants: {
    all: () => ["restaurants"] as const,
    /** Page unique paginée (discovery) */
    list: (query: RestaurantQuery) => ["restaurants", "list", query] as const,
    /** Agrégation de toutes les pages (Welcome, RestaurantList, carte) */
    allPages: (query: RestaurantQuery) =>
      ["restaurants", "all-pages", query] as const,
    detail: (id: number | string) => ["restaurants", "detail", id] as const,
    menu: (id: number | string) => ["restaurants", "menu", id] as const,
    reviews: (id: number | string) => ["restaurants", "reviews", id] as const,
    /** Préfixe pour invalider toutes les requêtes de disponibilité */
    availabilityAll: () => ["restaurants", "availability"] as const,
    availability: (
      id: number | string,
      params: { date: string; party_size: number; service_id?: number },
    ) => ["restaurants", "availability", id, params] as const,
  },

  favorites: {
    all: () => ["favorites"] as const,
    list: () => ["favorites", "list"] as const,
  },

  reservations: {
    all: () => ["reservations"] as const,
    mine: () => ["reservations", "mine"] as const,
    detail: (id: number | string) => ["reservations", "detail", id] as const,
    invitations: () => ["reservations", "invitations"] as const,
  },

  orders: {
    all: () => ["orders"] as const,
    detail: (id: number | string) => ["orders", "detail", id] as const,
    byReservation: (reservationId: number | string) =>
      ["orders", "by-reservation", reservationId] as const,
  },

  users: {
    search: (q: string) => ["users", "search", q] as const,
  },

  friendGroups: {
    all: () => ["friend-groups"] as const,
    list: () => ["friend-groups", "list"] as const,
    detail: (id: number | string) => ["friend-groups", "detail", id] as const,
  },
} as const;
