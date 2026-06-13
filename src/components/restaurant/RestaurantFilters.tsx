import { Star, X } from "lucide-react";
import { Button } from "../ui/button";
import Filters from "../../assets/icon/filters_red.svg";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { ButtonGroup } from "../ui/button-group";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { referenceApi } from "@/api/referenceApi";
import { extractApiError } from "@/lib/axios";
import { priceLevelLabel } from "@/lib/format";
import type { CuisineType } from "@/types/restaurantTypes";
import type { RestaurantQuery } from "@/api/RestaurantApi";

interface RestaurantFiltersProps {
  onApply?: (query: RestaurantQuery) => void;
}

export default function RestaurantFilters({ onApply }: RestaurantFiltersProps) {
  const [priceLevel, setPriceLevel] = useState<1 | 2 | 3 | undefined>();
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<number | undefined>();
  const [cuisines, setCuisines] = useState<CuisineType[]>([]);
  const [selectedAvis, setSelectedAvis] = useState<number | null>(null);
  const [selectedHoraire, setSelectedHoraire] = useState<string>("Tous");
  const [selectedPersonnes, setSelectedPersonnes] = useState<number | null>(
    null,
  );

  const PRICE_LEVELS = [1, 2, 3] as const;
  const MIN_RATINGS = [null, 3.5, 4, 4.5, 5];

  useEffect(() => {
    let cancelled = false;
    referenceApi
      .getCuisineTypes()
      .then((list) => {
        if (!cancelled) setCuisines(list);
      })
      .catch((error) => {
        if (!cancelled) toast.error(extractApiError(error).message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleFilterSubmit() {
    onApply?.({
      filter: {
        ...(priceLevel && { price_level: priceLevel }),
        ...(minRating && { min_rating: minRating }),
        ...(selectedCuisine && { cuisine: selectedCuisine }),
      },
    });
  }

  function handleClear() {
    setPriceLevel(undefined);
    setMinRating(null);
    setSelectedCuisine(undefined);
    onApply?.({});
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="m-0 p-0 w-[2.8em] h-[2.8em] text-background font-light bg-background rounded-sm">
          <img
            src={Filters}
            alt="Search's settings and filters"
            className="size-[1.5em]"
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-sm h-screen">
        <div className="overflow-y-auto no-scrollbar flex-1 px-4 pb-4">
          <DrawerHeader className="flex flex-col items-start w-full px-0">
            <DrawerDescription className="sr-only">Filtres</DrawerDescription>
            <section className="flex flex-row justify-between items-center w-full">
              <DrawerTitle>Filtres</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" className="py-0 px-0">
                  <X className="size-6 p-0" />
                </Button>
              </DrawerClose>
            </section>
            <Separator className="text-light" />
          </DrawerHeader>
          <section className="my-2 w-full shrink-0">
            <Label htmlFor="buttons-restaurant-price">
              Prix par personne (moyenne)
            </Label>
            <ButtonGroup
              className="my-2 w-full rounded-sm"
              id="buttons-restaurant-price"
            >
              <Button
                variant="outline"
                className={
                  priceLevel === undefined ? "p-2.5 bg-secondary" : "p-2.5"
                }
                onClick={() => setPriceLevel(undefined)}
              >
                Tous
              </Button>
              {PRICE_LEVELS.map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  className={
                    priceLevel === level ? "flex-1 bg-secondary" : "flex-1"
                  }
                  onClick={() => setPriceLevel(level)}
                >
                  {priceLevelLabel(level)}
                </Button>
              ))}
            </ButtonGroup>
          </section>
          <section className="my-2 w-full shrink-0">
            <Label htmlFor="buttons-restaurant-notes">Notes</Label>
            <ButtonGroup
              className="my-2 w-full rounded-sm"
              id="buttons-restaurant-notes"
            >
              {MIN_RATINGS.map((rating) => (
                <Button
                  key={rating ?? "Toutes"}
                  variant="outline"
                  className={
                    minRating === rating ? "flex-1 bg-secondary" : "flex-1"
                  }
                  onClick={() => setMinRating(rating)}
                >
                  {rating === null ? (
                    "Toutes"
                  ) : (
                    <>
                      <Star className="text-accent fill-accent size-[1em]" />{" "}
                      {rating.toFixed(1)}
                    </>
                  )}
                </Button>
              ))}
            </ButtonGroup>
          </section>
          <section className="my-2 w-full shrink-0">
            <Label htmlFor="buttons-restaurant-avis">
              Nombre d'avis (soon)
            </Label>
            <ButtonGroup
              className="my-2 w-full rounded-sm"
              id="buttons-restaurant-avis"
            >
              {[null, 100, 200, 300].map((avis) => (
                <Button
                  key={avis ?? "Tout"}
                  variant="outline"
                  className={
                    selectedAvis === avis ? "bg-secondary flex-1" : "flex-1"
                  }
                  onClick={() => setSelectedAvis(avis)}
                >
                  {avis === null ? "Tout" : `+ de ${avis}`}
                </Button>
              ))}
            </ButtonGroup>
          </section>
          <section className="my-2 w-full shrink-0">
            <Label htmlFor="buttons-restaurant-time">Horaire (soon)</Label>
            <ButtonGroup
              className="my-2 w-full rounded-sm"
              id="buttons-restaurant-time"
            >
              {["Tous", "Ouvert", "Perso"].map((horaire) => (
                <Button
                  key={horaire}
                  variant="outline"
                  className={
                    selectedHoraire === horaire
                      ? "bg-secondary flex-1"
                      : "flex-1"
                  }
                  onClick={() => setSelectedHoraire(horaire)}
                >
                  {horaire}
                </Button>
              ))}
            </ButtonGroup>
          </section>
          <section className="my-2 w-full shrink-0">
            <Label htmlFor="buttons-restaurant-number">
              Nombre de personne (soon)
            </Label>
            <ButtonGroup
              className="my-2 w-full rounded-sm"
              id="buttons-restaurant-number"
            >
              {[null, 3, 8, 10].map((nb) => (
                <Button
                  key={nb ?? "Tout"}
                  variant="outline"
                  className={
                    selectedPersonnes === nb ? "bg-secondary flex-1" : "flex-1"
                  }
                  onClick={() => setSelectedPersonnes(nb)}
                >
                  {nb === null ? "Tout" : `+ de ${nb}`}
                </Button>
              ))}
            </ButtonGroup>
          </section>
          <section className="h-auto">
            <Label htmlFor="buttons-restaurant-cuisine">Cuisine</Label>
            <div className="my-2 grid grid-cols-3 w-full rounded-sm border dark:border-input overflow-hidden">
              <Button
                variant="ghost"
                onClick={() => setSelectedCuisine(undefined)}
                className={
                  selectedCuisine === undefined
                    ? "bg-secondary rounded-none"
                    : "bg-background rounded-none border-[0.5px]"
                }
              >
                Tout
              </Button>
              {cuisines.map((cuisine) => (
                <Button
                  key={cuisine.id}
                  variant="ghost"
                  onClick={() =>
                    setSelectedCuisine(
                      selectedCuisine === cuisine.id ? undefined : cuisine.id,
                    )
                  }
                  className={
                    selectedCuisine === cuisine.id
                      ? "bg-secondary rounded-none"
                      : "bg-background rounded-none border-[0.5px]"
                  }
                >
                  {cuisine.name}
                </Button>
              ))}
            </div>
          </section>
          <DrawerFooter className="w-full px-0 pb-4 flex flex-row">
            <DrawerClose asChild className="w-[48%]">
              <Button variant={"secondary"} onClick={handleClear}>
                Effacer
              </Button>
            </DrawerClose>
            <DrawerClose asChild className="w-[48%]">
              <Button
                type="button"
                onClick={handleFilterSubmit}
                className="bg-primary rounded-sm flex items-center justify-center gap-2 p-2"
              >
                Appliquer
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
