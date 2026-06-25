import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { userApi } from "@/api/userApi";
import { queryKeys } from "@/lib/queryKeys";

/** Restaurants favoris en pagination infinie (page → page) */
export function useFavorites() {
  return useInfiniteQuery({
    queryKey: queryKeys.favorites.list(),
    queryFn: ({ pageParam }) => userApi.getFavorites(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });
}

function useInvalidateFavorites() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all() });
    // L'attribut is_favorited des restaurants listés doit aussi se rafraîchir
    queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.all() });
  };
}

export function useAddFavorite() {
  const invalidate = useInvalidateFavorites();
  return useMutation({
    mutationFn: (restaurantId: number) => userApi.addFavorite(restaurantId),
    onSuccess: invalidate,
  });
}

export function useRemoveFavorite() {
  const invalidate = useInvalidateFavorites();
  return useMutation({
    mutationFn: (restaurantId: number) => userApi.removeFavorite(restaurantId),
    onSuccess: invalidate,
  });
}
