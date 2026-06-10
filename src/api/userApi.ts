import api from "@/lib/axios";
import type { listResponse, uniqueResponse } from "@/types/responsesTypes";
import type { UserFavoriteRestaurant } from "@/types/userTypes";

export const userApi = {
  getAllFavoriteRestaurant: async (): Promise<UserFavoriteRestaurant[]> => {
    const { data } =
      await api.get<listResponse<UserFavoriteRestaurant>>("/favorites");
    return data.data.data;
  },

  getOneFavorite: async (
    restaurantId: number,
  ): Promise<UserFavoriteRestaurant> => {
    const { data } = await api.get<uniqueResponse<UserFavoriteRestaurant>>(
      `/favorites/${restaurantId}`,
    );
    return data.data;
  },

  addRemoveOneFavoriteRestaurant: async (
    restaurantId: number,
  ): Promise<uniqueResponse<{ favorited: boolean }>> => {
    const { data } = await api.post<uniqueResponse<{ favorited: boolean }>>(
      `/favorites/${restaurantId}`,
    );
    return data;
  },
};
