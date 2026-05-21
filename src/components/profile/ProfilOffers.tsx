import ProfileNavigation from "./ProfileNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import OfferTabs from "../ui/offer-tabs";

export default function ProfileOffers() {
  const { user } = useContext(UserContext);

  // TODO récupéré les offres et remises en fonction de user et remplacé dans le component "OfferTabs"

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Bons & remises"} />
      </nav>
      <main className="h-[87%] w-screen px-5 flex flex-col gap-3 pb-4">
        <Tabs defaultValue="bons">
          <TabsList variant="line">
            <TabsTrigger value="bons" className="after:border">
              Bons({user?.user.id})
            </TabsTrigger>
            <TabsTrigger value="remises">Remises({user?.user.id})</TabsTrigger>
          </TabsList>
          <TabsContent value="bons">
            <OfferTabs title={"bons"} offers={[]} />
          </TabsContent>
          <TabsContent value="remises">
            <OfferTabs title={"remises"} offers={[]} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
