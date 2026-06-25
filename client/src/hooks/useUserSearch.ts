import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/userApi";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Recherche d'utilisateurs à inviter.
 *
 * Le throttle backend est de 30/min : on n'active la requête qu'au-delà de
 * `minLength` caractères. Le composant appelant doit débouncer la valeur de
 * `q` avant de la passer ici (la query se déclenche à chaque changement de q).
 */
export function useSearchUsers(q: string, minLength = 2) {
  const term = q.trim();
  return useQuery({
    queryKey: queryKeys.users.search(term),
    queryFn: () => userApi.searchUsers(term),
    enabled: term.length >= minLength,
    staleTime: 60_000,
  });
}
