import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/api/reviewApi";
import { queryKeys } from "@/lib/queryKeys";

export function useCreateReview(restaurantId: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      reservation_id: number;
      rating: number;
      comment?: string | null;
    }) => reviewApi.create(restaurantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurants.reviews(restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurants.detail(restaurantId),
      });
    },
  });
}

export function useUpdateReview(restaurantId?: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: number | string;
      rating?: number;
      comment?: string | null;
    }) =>
      reviewApi.update(vars.id, { rating: vars.rating, comment: vars.comment }),
    onSuccess: () => {
      if (restaurantId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.restaurants.reviews(restaurantId),
        });
      }
    },
  });
}

export function useDeleteReview(restaurantId?: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => reviewApi.remove(id),
    onSuccess: () => {
      if (restaurantId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.restaurants.reviews(restaurantId),
        });
      }
    },
  });
}
