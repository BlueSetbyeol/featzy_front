// import type { Restaurant } from "@/types/restaurantTypes";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../ui/field";
import { Star } from "lucide-react";

// interface RestaurantReviewProps {
//   restaurant: Restaurant;
// }

export default function RestaurantReview() {
  //     {
  //   restaurant,
  // }: RestaurantReviewProps

  // TODO : add real review from restaurant

  return (
    <>
      <Card className="p-4 rounded-sm mt-5">
        <FieldSet className="w-full max-w-xs">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="feedback">
                Donner une note et un avis
              </FieldLabel>
              <div className="flex flex-row gap-2">
                <Star className="text-accent" />
                <Star className="text-accent" />
                <Star className="text-accent" />
                <Star className="text-accent" />
                <Star className="text-accent" />
              </div>
              <Textarea
                id="feedback"
                placeholder="Ton ressentie après avoir passé ce restaurant ?"
                rows={10}
                className="text-[0.9em] min-h-24"
              />
              <Button className="rounded-sm text-[0.9em] mt-2">
                Publier ton avis
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Card>
      <Card className="p-4 rounded-sm mt-3 gap-2">
        <section className="flex flex-row gap-2">
          <Star className="text-accent fill-accent" />
          <p>5</p>
        </section>
        <section>
          <p className="text-muted-foreground text-start">
            Service rapide, équipe agréable et plats délicieux.
          </p>
          <div className="flex flex-row gap-2 text-muted-foreground font-light">
            <p>Julie</p> <p>il y a 2 jours</p>
          </div>
        </section>
      </Card>
    </>
  );
}
