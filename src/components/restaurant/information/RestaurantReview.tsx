import { RestaurantApi } from "@/api/RestaurantApi";
import { reservationApi } from "@/api/reservationApi";
import { reviewApi } from "@/api/reviewApi";
import UserContext from "@/context/UserContext";
import { extractApiError } from "@/lib/axios";
import type { Reservation, Review } from "@/types/reservationTypes";
import { Star } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";

interface RestaurantReviewProps {
  restaurantId: number;
}

function relativeDate(dateString: string): string {
  const date = new Date(dateString);
  const diffHours = Math.floor((Date.now() - date.getTime()) / 3_600_000);

  if (diffHours < 1) return "à l'instant";
  if (diffHours < 24) return `il y a ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "hier";
  if (diffDays < 31) return `il y a ${diffDays} jours`;

  return `le ${date.toLocaleDateString("fr-FR")}`;
}

function reservationLabel(reservation: Reservation): string {
  return new Date(reservation.reserved_at).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function RestaurantReview({
  restaurantId,
}: RestaurantReviewProps) {
  const { user } = useContext(UserContext);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [completedReservations, setCompletedReservations] = useState<
    Reservation[]
  >([]);
  const [submittedReservationIds, setSubmittedReservationIds] = useState<
    number[]
  >([]);

  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingReviews(true);
    RestaurantApi.getReviews(restaurantId)
      .then((result) => {
        if (cancelled) return;
        setReviews(result.data);
        setNextCursor(result.meta.next_cursor);
      })
      .catch((error) => {
        if (!cancelled) toast.error(extractApiError(error).message);
      })
      .finally(() => {
        if (!cancelled) setLoadingReviews(false);
      });

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  useEffect(() => {
    if (!user) {
      setCompletedReservations([]);
      return;
    }

    let cancelled = false;
    reservationApi
      .getMine(1)
      .then((result) => {
        if (cancelled) return;
        setCompletedReservations(
          result.data.filter(
            (reservation) =>
              reservation.restaurant_id === restaurantId &&
              reservation.status === "completed",
          ),
        );
      })
      .catch((error) => {
        if (!cancelled) toast.error(extractApiError(error).message);
      });

    return () => {
      cancelled = true;
    };
  }, [user, restaurantId]);

  const eligibleReservations = useMemo(() => {
    const reviewedIds = new Set([
      ...reviews.map((review) => review.reservation_id),
      ...submittedReservationIds,
    ]);
    return completedReservations.filter(
      (reservation) => !reviewedIds.has(reservation.id),
    );
  }, [completedReservations, reviews, submittedReservationIds]);

  async function handleSubmit() {
    if (!selectedReservationId || rating < 1) {
      toast.error("Choisis une réservation et une note avant de publier.");
      return;
    }

    setSubmitting(true);
    try {
      await reviewApi.create(restaurantId, {
        reservation_id: Number(selectedReservationId),
        rating,
        comment: comment.trim() || null,
      });
      setSubmittedReservationIds((ids) => [
        ...ids,
        Number(selectedReservationId),
      ]);
      setSelectedReservationId("");
      setRating(0);
      setComment("");
      toast("Votre avis a été soumis et sera publié après modération");
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {user &&
        (eligibleReservations.length > 0 ? (
          <Card className="p-4 rounded-sm mt-5">
            <FieldSet className="w-full max-w-xs">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="review-comment">
                    Donner une note et un avis
                  </FieldLabel>
                  <Select
                    value={selectedReservationId}
                    onValueChange={setSelectedReservationId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisissez votre réservation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {eligibleReservations.map((reservation) => (
                          <SelectItem
                            key={reservation.id}
                            value={String(reservation.id)}
                          >
                            {reservationLabel(reservation)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-row gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={`Note ${value} sur 5`}
                        onClick={() => setRating(value)}
                      >
                        <Star
                          className={
                            value <= rating
                              ? "text-accent fill-accent"
                              : "text-accent"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    id="review-comment"
                    placeholder="Votre ressenti après avoir testé ce restaurant ?"
                    rows={10}
                    className="text-[0.9em] min-h-24"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    className="rounded-sm text-[0.9em] mt-2"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Publication…" : "Publier Votre avis"}
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </Card>
        ) : (
          <Card className="p-4 rounded-sm mt-5">
            <p className="text-start text-muted-foreground">
              Termine une réservation ici pour laisser un avis
            </p>
          </Card>
        ))}

      {loadingReviews ? (
        <p className="text-start text-muted-foreground py-4">
          Chargement des avis…
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-start text-muted-foreground py-4">
          Aucun avis pour le moment.
        </p>
      ) : (
        <>
          {reviews.map((review) => (
            <Card className="p-4 rounded-sm mt-3 gap-2" key={review.id}>
              <section className="flex flex-row gap-2 items-center">
                <div className="flex flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={
                        value <= review.rating
                          ? "text-accent fill-accent size-4"
                          : "text-accent size-4"
                      }
                    />
                  ))}
                </div>
                <p>{review.rating}</p>
              </section>
              <section>
                {review.comment && (
                  <p className="text-muted-foreground text-start">
                    {review.comment}
                  </p>
                )}
                <div className="flex flex-row gap-2 text-muted-foreground font-light">
                  <p>{review.reviewer?.first_name}</p>
                  <p>{relativeDate(review.created_at)}</p>
                </div>
              </section>
            </Card>
          ))}
          {nextCursor && (
            <Button
              variant="outline"
              className="rounded-sm text-[0.9em] mt-3 w-full"
              disabled={loadingMore}
              onClick={async () => {
                setLoadingMore(true);
                try {
                  const result = await RestaurantApi.getReviews(
                    restaurantId,
                    nextCursor,
                  );
                  setReviews((prev) => [...prev, ...result.data]);
                  setNextCursor(result.meta.next_cursor);
                } catch (error) {
                  toast.error(extractApiError(error).message);
                } finally {
                  setLoadingMore(false);
                }
              }}
            >
              {loadingMore ? "Chargement…" : "Voir plus"}
            </Button>
          )}
        </>
      )}
    </>
  );
}
