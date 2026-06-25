import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { RestaurantApi, type RestaurantQuery } from "@/api/RestaurantApi";
import { queryKeys } from "@/lib/queryKeys";

/** Page unique paginée (discovery brute) */
export function useRestaurants(query: RestaurantQuery = {}) {
  return useQuery({
    queryKey: queryKeys.restaurants.list(query),
    queryFn: () => RestaurantApi.getAll(query),
  });
}

/**
 * Agrégation de toutes les pages — clé partagée par Welcome, RestaurantList
 * et la carte, donc le cache est mutualisé entre ces écrans.
 */
export function useAllRestaurants(query: RestaurantQuery = {}) {
  return useQuery({
    queryKey: queryKeys.restaurants.allPages(query),
    queryFn: () => RestaurantApi.getAllPages(query),
  });
}

export function useRestaurant(
  id: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.restaurants.detail(id ?? ""),
    queryFn: () => RestaurantApi.getOne(id as number | string),
    enabled: id !== undefined && id !== "" && (options?.enabled ?? true),
  });
}

export function useRestaurantMenu(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.restaurants.menu(id ?? ""),
    queryFn: () => RestaurantApi.getMenu(id as number | string),
    enabled: id !== undefined && id !== "",
  });
}

/** Avis publics en pagination par curseur */
export function useRestaurantReviews(id: number | string | undefined) {
  return useInfiniteQuery({
    queryKey: queryKeys.restaurants.reviews(id ?? ""),
    queryFn: ({ pageParam }) =>
      RestaurantApi.getReviews(id as number | string, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor ?? undefined,
    enabled: id !== undefined && id !== "",
  });
}

export function useAvailability(
  id: number | string | undefined,
  params: { date: string; party_size: number; service_id?: number },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.restaurants.availability(id ?? "", params),
    queryFn: () => RestaurantApi.getAvailability(id as number | string, params),
    enabled: id !== undefined && id !== "" && (options?.enabled ?? true),
  });
}
