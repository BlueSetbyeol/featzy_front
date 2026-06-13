import api from "@/lib/axios";
import type { Review } from "@/types/reservationTypes";

export const reviewApi = {
  /** Dépôt d'avis — exige une réservation completed à laquelle l'utilisateur a participé */
  create: async (
    restaurantId: number | string,
    payload: { reservation_id: number; rating: number; comment?: string | null },
  ): Promise<Review> => {
    const { data } = await api.post<{ data: Review }>(
      `/restaurants/${restaurantId}/reviews`,
      payload,
    );
    return data.data;
  },

  update: async (
    id: number | string,
    payload: { rating?: number; comment?: string | null },
  ): Promise<Review> => {
    const { data } = await api.patch<{ data: Review }>(`/reviews/${id}`, payload);
    return data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};
