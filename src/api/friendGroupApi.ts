import api from "@/lib/axios";
import type {
  FriendGroup,
  StoreFriendGroupPayload,
  UpdateFriendGroupPayload,
} from "@/types/friendGroupTypes";
import type { Paginated } from "@/types/responsesTypes";

export const friendGroupApi = {
  getAll: async (page = 1): Promise<Paginated<FriendGroup>> => {
    const { data } = await api.get<Paginated<FriendGroup>>("/friend-groups", {
      params: { page },
    });
    return data;
  },

  getOne: async (id: number | string): Promise<FriendGroup> => {
    const { data } = await api.get<{ data: FriendGroup }>(
      `/friend-groups/${id}`,
    );
    return data.data;
  },

  create: async (payload: StoreFriendGroupPayload): Promise<FriendGroup> => {
    const { data } = await api.post<{ data: FriendGroup }>(
      "/friend-groups",
      payload,
    );
    return data.data;
  },

  update: async (
    id: number | string,
    payload: UpdateFriendGroupPayload,
  ): Promise<FriendGroup> => {
    const { data } = await api.patch<{ data: FriendGroup }>(
      `/friend-groups/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await api.delete(`/friend-groups/${id}`);
  },

  /** Remplace l'intégralité des membres du groupe par la liste fournie */
  syncMembers: async (
    id: number | string,
    memberIds: number[],
  ): Promise<FriendGroup> => {
    const { data } = await api.put<{ data: FriendGroup }>(
      `/friend-groups/${id}/members`,
      { members: memberIds },
    );
    return data.data;
  },

  removeMember: async (
    id: number | string,
    userId: number,
  ): Promise<void> => {
    await api.delete(`/friend-groups/${id}/members/${userId}`);
  },
};
