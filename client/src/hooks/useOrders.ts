import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { orderApi } from "@/api/reservationApi";
import { queryKeys } from "@/lib/queryKeys";
import type { AddOrderItemPayload } from "@/types/reservationTypes";

/**
 * Ouvre (ou récupère) la commande unique d'une réservation.
 *
 * Le POST /order est idempotent côté back (get-or-create) tant que la
 * réservation est `is_preorder` + `confirmed`, on peut donc l'exposer comme une
 * query. Le caller doit gérer `enabled` pour ne l'appeler que dans ce cas.
 */
export function useOrder(
  reservationId: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.orders.byReservation(reservationId ?? ""),
    queryFn: () => orderApi.open(reservationId as number | string),
    enabled:
      reservationId !== undefined &&
      reservationId !== "" &&
      (options?.enabled ?? true),
  });
}

function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
}

export function useAddOrderItem(orderId: number | string) {
  const invalidate = useInvalidateOrders();
  return useMutation({
    mutationFn: (payload: AddOrderItemPayload) =>
      orderApi.addItem(orderId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateOrderItem() {
  const invalidate = useInvalidateOrders();
  return useMutation({
    mutationFn: (vars: {
      itemId: number | string;
      quantity?: number;
      notes?: string | null;
    }) =>
      orderApi.updateItem(vars.itemId, {
        quantity: vars.quantity,
        notes: vars.notes,
      }),
    onSuccess: invalidate,
  });
}

export function useRemoveOrderItem() {
  const invalidate = useInvalidateOrders();
  return useMutation({
    mutationFn: (itemId: number | string) => orderApi.removeItem(itemId),
    onSuccess: invalidate,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number | string) => orderApi.place(orderId),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.detail(order.reservation_id),
      });
    },
  });
}
