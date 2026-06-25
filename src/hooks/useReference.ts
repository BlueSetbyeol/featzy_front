import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/referenceApi";
import { queryKeys } from "@/lib/queryKeys";

/** Catalogues de référence : quasi statiques → staleTime long */
const REFERENCE_STALE_TIME = 60 * 60_000;

export function useCuisineTypes() {
  return useQuery({
    queryKey: queryKeys.reference.cuisineTypes(),
    queryFn: referenceApi.getCuisineTypes,
    staleTime: REFERENCE_STALE_TIME,
  });
}

export function useAllergens() {
  return useQuery({
    queryKey: queryKeys.reference.allergens(),
    queryFn: referenceApi.getAllergens,
    staleTime: REFERENCE_STALE_TIME,
  });
}

export function useDietaryPreferences() {
  return useQuery({
    queryKey: queryKeys.reference.dietaryPreferences(),
    queryFn: referenceApi.getDietaryPreferences,
    staleTime: REFERENCE_STALE_TIME,
  });
}
