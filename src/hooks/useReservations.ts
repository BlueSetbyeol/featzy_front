import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { reservationApi } from "@/api/reservationApi";
import { queryKeys } from "@/lib/queryKeys";
import type { StoreReservationPayload } from "@/types/reservationTypes";

/** Réservations organisées par l'utilisateur, en pagination infinie */
export function useMyReservations(options?: { enabled?: boolean }) {
  return useInfiniteQuery({
    queryKey: queryKeys.reservations.mine(),
    queryFn: ({ pageParam }) => reservationApi.getMine(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    enabled: options?.enabled ?? true,
  });
}

export function useReservation(
  id: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.reservations.detail(id ?? ""),
    queryFn: () => reservationApi.getOne(id as number | string),
    enabled: id !== undefined && id !== "" && (options?.enabled ?? true),
  });
}

export function useMyInvitations() {
  return useInfiniteQuery({
    queryKey: queryKeys.reservations.invitations(),
    queryFn: ({ pageParam }) => reservationApi.getMyInvitations(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });
}

export function useCreateReservation(restaurantId: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StoreReservationPayload) =>
      reservationApi.create(restaurantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.mine() });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number | string; reason?: string }) =>
      reservationApi.cancel(vars.id, vars.reason),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.detail(vars.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
    },
  });
}

export function useInviteParticipants() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      reservationId: number | string;
      user_ids?: number[];
      friend_group_id?: number;
    }) =>
      reservationApi.inviteParticipants(vars.reservationId, {
        user_ids: vars.user_ids,
        friend_group_id: vars.friend_group_id,
      }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.detail(vars.reservationId),
      });
    },
  });
}

export function useRemoveParticipant(reservationId: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (participantId: number) =>
      reservationApi.removeParticipant(reservationId, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.detail(reservationId),
      });
    },
  });
}

export function useRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: number | string;
      status: "accepted" | "declined";
    }) => reservationApi.rsvp(vars.id, vars.status),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.detail(vars.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.invitations(),
      });
    },
  });
}
