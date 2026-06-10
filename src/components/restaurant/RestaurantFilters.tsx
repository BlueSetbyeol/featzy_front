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
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { ButtonGroup } from "../ui/button-group";
import { useState } from "react";

export default function RestaurantFilters() {
  const [price, setPrice] = useState([0, 25]);
  const midPercent = (price[0] + price[1]) / 2 / 100;

  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [selectedAvis, setSelectedAvis] = useState<number | null>(null);
  const [selectedHoraire, setSelectedHoraire] = useState<string>("Tous");
  const [selectedPersonnes, setSelectedPersonnes] = useState<number | null>(
    null,
  );
  const [selectedCuisines, setSelectedCuisines] = useState<string>("Tout");

  const cuisines = [
    "Tout",
    "Américaine",
    "Asiatique",
    "Chinoise",
    "Crêperie",
    "Française",
    "Hamburger",
    "Indienne",
    "Italienne",
    "Japonaise",
    "Marocaine",
    "Pizza",
    "Brasserie",
    "Fruits de mer",
    "Steak",
    "Sushis",
    "Thaï",
    "Vietnamienne",
  ];

  const filters = {
    price,
    note: selectedNote,
    avis: selectedAvis,
    horaire: selectedHoraire,
    personnes: selectedPersonnes,
    cuisine: selectedCuisines,
  };

  function handleResetFilters() {
    setPrice([0, 25]);
    setSelectedNote(null);
    setSelectedAvis(null);
    setSelectedHoraire("Tous");
    setSelectedPersonnes(null);
    setSelectedCuisines("Tout");
  }

  function handleFilterSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO faire une ou plusieurs variables pour récupérer les filtres et les passer dans un state qui est remonté à Welcome/Map via SearchingLoc
    console.log(filters);
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
      <DrawerContent
        className="w-full max-w-sm h-screen"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
          <section className="my-1">
            <Label htmlFor="slider-restaurant-price">
              Prix par personne (moyenne)
            </Label>
            <div
              className="flex flex-row relative h-12 my-2"
              style={{ left: `calc(${midPercent * 100}% - 3rem)` }}
            >
              <Button className="bg-muted rounded-sm z-5 text-accent-foreground font-light">
                {price[0]} € à {price[1]} €
              </Button>
              <hr className="absolute w-0 h-0 border-8 border-muted rounded-none rounded-br-[5px] z-2 bottom-2 left-11 translate-y-[23%] -translate-x-1/2 rotate-45 scale-[1.4] " />
            </div>
            <Slider
              id="slider-restaurant-price"
              value={price}
              onValueChange={setPrice}
              min={0}
              max={100}
              step={25}
              className="mx-auto w-full max-w-xs **:data-[slot=slider-track]:bg-muted-foreground **:data-[slot=slider-track]:h-0.5 **:data-[slot=slider-range]:bg-muted **:data-[slot=slider-thumb]:bg-muted **:data-[slot=slider-thumb]:border-muted **:data-[slot=slider-thumb]:size-3"
            />
          </section>
          <section className="my-2 w-full shrink-0">
            <Label htmlFor="buttons-restaurant-notes">Notes</Label>
            <ButtonGroup
              className="my-2 w-full rounded-sm"
              id="buttons-restaurant-notes"
            >
              {[null, 3.5, 4.0, 4.5, 5.0].map((note) => (
                <Button
                  key={note ?? "Toutes"}
                  variant="outline"
                  className={
                    selectedNote === note ? "bg-secondary flex-1" : "flex-1"
                  }
                  onClick={() => setSelectedNote(note)}
                >
                  {note === null ? (
                    "Toutes"
                  ) : (
                    <>
                      <Star className="text-accent fill-accent size-[1em]" />{" "}
                      {note}
                    </>
                  )}
                </Button>
              ))}
            </ButtonGroup>
          </section>
          <section className="my-2 w-full shrink-0">
            <Label htmlFor="buttons-restaurant-avis">Nombre d'avis</Label>
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
            <Label htmlFor="buttons-restaurant-time">Horaire</Label>
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
              Nombre de personne
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
              {cuisines.map((cuisine) => (
                <Button
                  key={cuisine}
                  variant="ghost"
                  onClick={() =>
                    selectedCuisines === cuisine
                      ? setSelectedCuisines("Tout")
                      : setSelectedCuisines(cuisine)
                  }
                  className={
                    selectedCuisines === cuisine
                      ? "bg-secondary rounded-none"
                      : "bg-background rounded-none border-[0.5px]"
                  }
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </section>
          <DrawerFooter className="w-full px-0 pb-4 flex flex-row">
            <DrawerClose asChild className="w-[48%]">
              <DrawerClose asChild className="w-[48%]">
                <Button variant={"secondary"} onClick={handleResetFilters}>
                  Effacer
                </Button>
              </DrawerClose>
            </DrawerClose>
            <DrawerClose asChild className="w-[48%]">
              <Button
                type="button"
                onClick={(e) => handleFilterSubmit(e)}
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
