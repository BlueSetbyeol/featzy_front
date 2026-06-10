import { Card } from "@/components/ui/card";
import type { Menu } from "@/types/restaurantTypes";

interface RestaurantMenusProps {
  restaurantMenu: Record<string, Menu[]>;
}

export default function RestaurantMenus({
  restaurantMenu,
}: RestaurantMenusProps) {
  return (
    <>
      {restaurantMenu &&
        Object.entries(restaurantMenu).map(([category, dishes]) => (
          <section
            key={category}
            className="flex flex-col gap-3 items-start pb-4"
          >
            <h2>{category}</h2>
            {dishes.map((dish) => (
              <Card
                className="w-full rounded-sm flex flex-row justify-between p-4 gap-3"
                key={dish.id}
              >
                <section className="flex flex-col items-start max-w-4/5">
                  <p className="text-start">{dish.name}</p>
                  <p className="text-start text-muted-foreground font-light">
                    {dish.description}
                  </p>
                </section>
                <p className="text-end">{dish.price} €</p>
              </Card>
            ))}
          </section>
        ))}
    </>
  );
}
