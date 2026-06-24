import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import ToGo from "../../../assets/icon/to_go.svg";
import ToEat from "../../../assets/icon/to_eat.svg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Item, ItemContent, ItemDescription } from "@/components/ui/item";
import { RestaurantApi } from "@/api/RestaurantApi";
import { extractApiError } from "@/lib/axios";
import type { Availability } from "@/types/reservationTypes";

export type SelectedSlot = {
  service_id: number;
  service_name: string;
  reserved_at: string;
  time: string;
};

interface ReservationTimePlaceProps {
  numberOfGuest: string;
  setNumberOfGuest: (numberOfGuest: string) => void;
  venue: "eat" | "go";
  setVenue: (venue: "eat" | "go") => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  earlyCommandChoice: "oui" | "non";
  setEarlyCommandChoice: (venue: "oui" | "non") => void;
  selectedSlot: SelectedSlot | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<SelectedSlot | null>>;
  slotsRefreshKey: number;
}

export default function ReservationTimePlace({
  numberOfGuest,
  setNumberOfGuest,
  venue,
  setVenue,
  date,
  setDate,
  earlyCommandChoice,
  setEarlyCommandChoice,
  selectedSlot,
  setSelectedSlot,
  slotsRefreshKey,
}: ReservationTimePlaceProps) {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const numberOfParties: number[] = [];

  function hasParties(a: number, b: number) {
    let i = a;
    for (i; i <= b; i++) {
      numberOfParties.push(i);
    }
    return numberOfParties;
  }

  hasParties(1, 10);

  useEffect(() => {
    if (!id || !date) {
      setAvailabilities([]);
      setSelectedSlot(null);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    RestaurantApi.getAvailability(id, {
      date: format(date, "yyyy-MM-dd"),
      party_size: Number(numberOfGuest),
    })
      .then((data) => {
        if (cancelled) return;
        setAvailabilities(data);
        setSelectedSlot((current) =>
          current &&
          data.some(
            (availability) =>
              availability.service.id === current.service_id &&
              availability.slots.some(
                (slot) => slot.reserved_at === current.reserved_at,
              ),
          )
            ? current
            : null,
        );
      })
      .catch((error) => {
        if (cancelled) return;
        setAvailabilities([]);
        setSelectedSlot(null);
        toast.error(extractApiError(error).message);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, date, numberOfGuest, slotsRefreshKey, setSelectedSlot]);

  const servicesWithSlots = availabilities.filter(
    (availability) => availability.slots.length > 0,
  );

  return (
    <>
      <article className="w-full flex flex-col items-start">
        <p className="my-2">Comment voulez-vous réserver ?</p>
        <RadioGroup
          className="w-full"
          value={venue}
          onValueChange={(value: "eat" | "go") => setVenue(value)}
        >
          <FieldLabel
            htmlFor="to_eat"
            className="has-data-[state=checked]:border-card-foreground has-data-[state=checked]:bg-muted"
          >
            <Field
              orientation="horizontal"
              className='flex flex-row items-center justify-between &[data-slot="field"]:p-0'
            >
              <FieldContent className="flex flex-row items-center gap-1">
                <FieldDescription className="sr-only">
                  Commande sur place
                </FieldDescription>
                <img src={ToEat} alt="Manger à emporter" className="size-5" />
                <p>Sur place</p>
              </FieldContent>
              <RadioGroupItem value="eat" id="to_eat" />
            </Field>
          </FieldLabel>
          <FieldLabel
            htmlFor="to_go"
            className="has-data-[state=checked]:border-card-foreground has-data-[state=checked]:bg-muted"
          >
            <Field
              orientation="horizontal"
              className="flex flex-row items-center justify-between"
            >
              <FieldContent className="flex flex-row items-center gap-1">
                <FieldDescription className="sr-only">
                  Commande à emporter
                </FieldDescription>
                <img src={ToGo} alt="Manger à emporter" className="size-5" />
                <p>A emporter</p>
              </FieldContent>
              <RadioGroupItem value="go" id="to_go" />
            </Field>
          </FieldLabel>
        </RadioGroup>
        <p className="my-2">Voulez-vous précommander le repas ?</p>
        <RadioGroup
          className="w-full"
          value={earlyCommandChoice}
          onValueChange={(value: "oui" | "non") => setEarlyCommandChoice(value)}
        >
          <FieldLabel
            htmlFor="to_command_early"
            className="has-data-[state=checked]:border-card-foreground has-data-[state=checked]:bg-muted"
          >
            <Field
              orientation="horizontal"
              className='flex flex-row items-center justify-between &[data-slot="field"]:p-0'
            >
              <FieldContent className="flex flex-row items-center gap-1">
                <FieldDescription className="sr-only">
                  Commande en ligne
                </FieldDescription>
                <p>Oui</p>
              </FieldContent>
              <RadioGroupItem value="oui" id="to_command_early" />
            </Field>
          </FieldLabel>

          {venue === "eat" && (
            <FieldLabel
              htmlFor="to_not_command_early"
              className="has-data-[state=checked]:border-card-foreground has-data-[state=checked]:bg-muted"
            >
              <Field
                orientation="horizontal"
                className="flex flex-row items-center justify-between"
              >
                <FieldContent className="flex flex-row items-center gap-1">
                  <FieldDescription className="sr-only">
                    Commande sur place
                  </FieldDescription>
                  <p>Non</p>
                </FieldContent>
                <RadioGroupItem value="non" id="to_not_command_early" />
              </Field>
            </FieldLabel>
          )}

          {earlyCommandChoice === "oui" && venue === "eat" && (
            <Item variant="outline" className="p-3">
              <ItemContent>
                <ItemDescription className="sr-only">
                  Avertissements
                </ItemDescription>
                <p className="text-primary text-[0.8em] text-start">
                  Attention : vous avez choisi de précommander votre repas.
                  Votre réservation ne sera confirmée que lorsque tous vos
                  co-mangeurs auront validé leur commande
                </p>
              </ItemContent>
            </Item>
          )}
        </RadioGroup>
        <Separator className="my-4" />
        <FieldGroup className="m-full flex flex-row gap-2">
          <Field className="w-[5em] border-border">
            <FieldLabel htmlFor="date-picker-optional">Nombre</FieldLabel>
            <Select
              value={numberOfGuest}
              onValueChange={(val) => {
                setNumberOfGuest(val);
              }}
            >
              <SelectTrigger className="border-border">
                <SelectValue
                  placeholder={numberOfGuest}
                  className="text-[1em] font-ligth"
                />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectGroup>
                  {numberOfParties.map((number, index) => (
                    <SelectItem value={number.toString()} key={index}>
                      {number}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field className="w-[18em]">
            <FieldLabel htmlFor="date-picker">Date</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="border-border">
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-32 justify-between font-normal"
                >
                  {date ? format(date, "PPP") : "Aujourd'hui"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  defaultMonth={date}
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
        </FieldGroup>
        <Separator className="my-4" />
        <section className="w-full flex flex-col items-start gap-2">
          {!date && (
            <p className="text-muted-foreground text-start">
              Choisissez une date pour voir les créneaux disponibles
            </p>
          )}
          {date && loadingSlots && (
            <p className="text-muted-foreground text-start">
              Chargement des créneaux…
            </p>
          )}
          {date && !loadingSlots && servicesWithSlots.length === 0 && (
            <p className="text-muted-foreground text-start">
              Aucun créneau disponible pour cette date
            </p>
          )}
          {date &&
            !loadingSlots &&
            servicesWithSlots.map((availability) => (
              <article
                key={availability.service.id}
                className="w-full flex flex-col items-start"
              >
                <p className="my-1">{availability.service.name}</p>
                <section className="w-full py-2 flex flex-row gap-2 overflow-x-auto no-scrollbar">
                  {availability.slots.map((slot) => {
                    const isSelected =
                      selectedSlot?.service_id === availability.service.id &&
                      selectedSlot?.reserved_at === slot.reserved_at;
                    return (
                      <button
                        type="button"
                        key={slot.reserved_at}
                        onClick={() =>
                          setSelectedSlot({
                            service_id: availability.service.id,
                            service_name: availability.service.name,
                            reserved_at: slot.reserved_at,
                            time: slot.time,
                          })
                        }
                        className={
                          isSelected
                            ? "rounded-[0.5em] p-2 bg-primary text-primary-foreground border border-primary"
                            : "rounded-[0.5em] p-2 bg-background border border-border"
                        }
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </section>
              </article>
            ))}
        </section>
      </article>
    </>
  );
}
