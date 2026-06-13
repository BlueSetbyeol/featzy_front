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
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Card } from "../ui/card";
import Bons from "../../assets/icon/gifts.svg";
import Remises from "../../assets/icon/offers.svg";

interface OfferTabsProps {
  title: string;
  offers: [];
}

export default function OfferTabs({ title, offers }: OfferTabsProps) {
  function handleOfferSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO ajouter une méthode de paiement en lien avec l'utilisateur actuel
  }
  console.log(offers.length > 0);
  return (
    <>
      {offers.length === 0 || offers.length < 0 ? (
        <Card className="w-full flex flex-col items-center gap-2 p-4">
          <p>
            Vous n'avez aucun
            {title === "bons" ? " bon actif" : "e remise active"}
          </p>
          <img
            src={title === "bons" ? Bons : Remises}
            alt={title === "bons" ? "bon" : "remise"}
            className="size-[5em]"
          />
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="bg-primary rounded-sm text-primary-foreground text-[14px] flex items-center justify-center gap-2 w-full py-2 mt-2"
              >
                <Plus className="size-4 text-primary-foreground" /> Ajouter
              </button>
            </DrawerTrigger>
            <DrawerContent className="w-full max-w-sm px-4">
              <DrawerHeader className="flex flex-col items-start w-full px-0">
                <section className="flex flex-row justify-between items-center w-full">
                  <DrawerTitle>
                    Ajouter un{title === "bons" ? " bon" : "e remise"}
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="p-0">
                      <X className="size-6 p-0" />
                    </Button>
                  </DrawerClose>
                </section>
                <DrawerDescription className="sr-only">
                  Renseigne les informations de t
                  {title === "bons" ? "on bon" : "a remise"}
                </DrawerDescription>
                <p className="text-[0.8em]">
                  Renseigne les informations de t
                  {title === "bons" ? "on bon" : "a remise"}
                </p>
              </DrawerHeader>
              <p>To be determined</p>
              <DrawerFooter className="w-full px-0 pb-4">
                <DrawerClose asChild>
                  <button
                    type="button"
                    onClick={(e) => handleOfferSubmit(e)}
                    className="bg-primary rounded-sm flex items-center justify-center gap-2 p-2"
                  >
                    <p className="text-[12px] text-white">
                      Enregistrer l{title === "bons" ? "e bon" : "a remise"}
                    </p>
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Card>
      ) : (
        <article>
          <h2>Liste des {title === "bons" ? "bons" : "remises"}</h2>
          <section>
            <Card>
              <p>Nom d{title === "bons" ? "u bon" : "e la remise"}</p>
              <p>Valeur d{title === "bons" ? "u bon" : "e la remise"}</p>
            </Card>
          </section>
        </article>
      )}
    </>
  );
}
