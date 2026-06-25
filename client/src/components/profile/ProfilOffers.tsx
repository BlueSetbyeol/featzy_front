import ProfileNavigation from "./ProfileNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import OfferTabs from "../ui/offer-tabs";

export default function ProfileOffers() {
  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Bons & remises"} />
      </nav>
      <main className="h-[87%] w-screen px-5 flex flex-col gap-3 pb-4">
        <Tabs defaultValue="bons">
          <TabsList variant="line">
            <TabsTrigger value="bons" className="after:border">
              Bons(0)
            </TabsTrigger>
            <TabsTrigger value="remises">Remises(0)</TabsTrigger>
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
