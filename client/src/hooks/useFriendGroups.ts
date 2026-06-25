import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { friendGroupApi } from "@/api/friendGroupApi";
import { queryKeys } from "@/lib/queryKeys";
import type {
  StoreFriendGroupPayload,
  UpdateFriendGroupPayload,
} from "@/types/friendGroupTypes";

export function useFriendGroups(page = 1) {
  return useQuery({
    queryKey: [...queryKeys.friendGroups.list(), page],
    queryFn: () => friendGroupApi.getAll(page),
  });
}

export function useFriendGroup(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.friendGroups.detail(id ?? ""),
    queryFn: () => friendGroupApi.getOne(id as number | string),
    enabled: id !== undefined && id !== "",
  });
}

function useInvalidateFriendGroups() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.friendGroups.all() });
}

export function useCreateFriendGroup() {
  const invalidate = useInvalidateFriendGroups();
  return useMutation({
    mutationFn: (payload: StoreFriendGroupPayload) =>
      friendGroupApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateFriendGroup() {
  const invalidate = useInvalidateFriendGroups();
  return useMutation({
    mutationFn: (vars: {
      id: number | string;
      payload: UpdateFriendGroupPayload;
    }) => friendGroupApi.update(vars.id, vars.payload),
    onSuccess: invalidate,
  });
}

export function useDeleteFriendGroup() {
  const invalidate = useInvalidateFriendGroups();
  return useMutation({
    mutationFn: (id: number | string) => friendGroupApi.remove(id),
    onSuccess: invalidate,
  });
}

export function useSyncFriendGroupMembers() {
  const invalidate = useInvalidateFriendGroups();
  return useMutation({
    mutationFn: (vars: { id: number | string; memberIds: number[] }) =>
      friendGroupApi.syncMembers(vars.id, vars.memberIds),
    onSuccess: invalidate,
  });
}

export function useRemoveFriendGroupMember() {
  const invalidate = useInvalidateFriendGroups();
  return useMutation({
    mutationFn: (vars: { id: number | string; userId: number }) =>
      friendGroupApi.removeMember(vars.id, vars.userId),
    onSuccess: invalidate,
  });
}
