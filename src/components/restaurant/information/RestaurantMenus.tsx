import { RestaurantApi } from "@/api/RestaurantApi";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { extractApiError } from "@/lib/axios";
import { formatPrice } from "@/lib/format";
import type { MenuCategory } from "@/types/restaurantTypes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Entrees from "../../../assets/icon/starter.svg";
import Plats from "../../../assets/icon/main-dish.svg";
import Desserts from "../../../assets/icon/desert.svg";
import Boissons from "../../../assets/icon/drink.svg";

interface RestaurantMenusProps {
  restaurantId: number;
}

export default function RestaurantMenus({
  restaurantId,
}: RestaurantMenusProps) {
  const [categories, setCategories] = useState<MenuCategory[]>();
  const [loading, setLoading] = useState(true);

  const categoryIcons = [Entrees, Plats, Desserts, Boissons];

  useEffect(() => {
    let cancelled = false;
    RestaurantApi.getMenu(restaurantId)
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((error) => {
        if (!cancelled) toast.error(extractApiError(error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  if (loading) {
    return (
      <p className="text-start text-muted-foreground py-4">
        Chargement du menu…
      </p>
    );
  }

  const visibleCategories = [...(categories ?? [])]
    .filter((category) => (category.menu_items?.length ?? 0) > 0)
    .sort((a, b) => a.position - b.position);

  if (visibleCategories.length === 0) {
    return (
      <p className="text-start text-muted-foreground py-4">
        Le menu n'est pas encore disponible.
      </p>
    );
  }

  return (
    <>
      {visibleCategories.map((category, index) => (
        <section
          key={category.id}
          className="flex flex-col gap-3 items-start pb-4"
        >
          <div className="flex flex-row gap-1">
            <img
              src={categoryIcons[index]}
              alt="voir les entrées"
              className="size-[2em]"
            />
            <h2>{category.name}</h2>
          </div>

          {[...(category.menu_items ?? [])]
            .sort((a, b) => a.position - b.position)
            .map((item) => (
              <Card
                className="w-full rounded-sm flex flex-row justify-between p-4 gap-3"
                key={item.id}
              >
                <section className="flex flex-col items-start gap-1 max-w-4/5">
                  <p className="text-start">{item.name}</p>
                  {item.description && (
                    <p className="text-start text-muted-foreground font-light">
                      {item.description}
                    </p>
                  )}
                  {(item.is_sold_out || (item.allergens?.length ?? 0) > 0) && (
                    <div className="flex flex-row flex-wrap gap-1">
                      {item.is_sold_out && (
                        <Badge
                          variant="destructive"
                          className="rounded-phone py-0.5 px-1.5 text-[0.8em]"
                        >
                          Épuisé
                        </Badge>
                      )}
                      {item.allergens?.map((allergen) => (
                        <Badge
                          key={allergen.id}
                          variant="secondary"
                          className="rounded-phone py-0.5 px-1.5 text-[0.8em]"
                        >
                          {allergen.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </section>
                <section className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-end">{formatPrice(item.price)}</p>
                  {item.photos[0] && (
                    <img
                      src={item.photos[0].thumb}
                      alt={item.name}
                      className="w-14 h-14 rounded-sm object-cover"
                    />
                  )}
                </section>
              </Card>
            ))}
        </section>
      ))}
    </>
  );
}
