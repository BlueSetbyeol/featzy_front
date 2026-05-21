import api, { initCsrf } from "@/lib/axios";
import type { Restaurant } from "@/types/restaurantTypes";
import type { listResponse, uniqueResponse } from "@/types/responsesTypes";

export const RestaurantApi = {
  // Browse or Read a Restaurant

  getAll: async (): Promise<Restaurant[]> => {
    const { data } = await api.get<listResponse<Restaurant>>("/restaurants");
    return data.data.data;
  },

  getOne: async (id: string): Promise<Restaurant> => {
    const { data } = await api.get<uniqueResponse<Restaurant>>(
      `/restaurants/${id}`,
    );
    return data.data;
  },

  // C.E.D. a Restaurant

  createRestaurant: async (payload: Restaurant): Promise<Restaurant> => {
    const { data } = await api.post("/restaurants", payload);
    return data.data;
  },

  editRestaurant: async (payload: Restaurant): Promise<Restaurant> => {
    await initCsrf();
    const { data } = await api.post(`/restaurants/${payload.id}`, payload);
    return data.data;
  },

  // patchRestaurant: async (payload: Restaurant): Promise<Restaurant> => {
  //   await initCsrf();
  //   const { data } = await api.post(`/restaurants/${payload.id}`, payload);
  //   return data.data;
  // },

  revokeRestaurant: async (id: string): Promise<void> => {
    await api.delete(`/restaurant/${id}`);
  },
};
