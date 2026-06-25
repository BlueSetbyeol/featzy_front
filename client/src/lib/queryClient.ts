import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { extractApiError } from "@/lib/axios";

/** Statut HTTP d'une erreur axios, ou undefined si erreur non-HTTP */
function httpStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

/**
 * Client unique partagé par toute l'application.
 *
 * - On ne réessaie pas les erreurs client (4xx) : un 401/403/404/422 ne se
 *   résout pas en rejouant la requête.
 * - L'interceptor axios (lib/axios.ts) gère déjà la redirection /login sur 401.
 * - Les erreurs de query sont remontées via un toast global, sauf 401
 *   (bootstrap de session) et les queries marquées `meta.silent`. Les
 *   mutations conservent leur gestion fine côté composant (erreurs 422…).
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const status = httpStatus(error);
      if (status === 401) return;
      if (query.meta?.silent === true) return;
      toast.error(extractApiError(error).message);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = httpStatus(error);
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
