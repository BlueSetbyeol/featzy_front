import { Card } from "../ui/card";
import ProfileNavigation from "./ProfileNavigation";

export default function ProfileLegals() {
  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Mentions Légales"} />
      </nav>
      <main className="h-[87%] w-screen px-5 flex flex-col gap-4 pb-4 overflow-y-auto no-scrollbar">
        <Card className="p-4 text-start gap-2">
          <h2>Éditeur de l'application</h2>
          <div>
            <p className="text-[0.9em] text-muted-foreground">Featzy</p>
            <p className="text-[0.9em] text-muted-foreground">
              SAS 79 Rue du Dauphiné
            </p>
            <p className="text-[0.9em] text-muted-foreground">
              69003 Lyon, France
            </p>
          </div>
        </Card>
        <Card className="p-4 text-start gap-2">
          <h2>Notifications Push</h2>
          <section>
            <div className="w-full flex justify-between">
              <p className="text-[0.9em] text-muted-foreground">Cédric Copy</p>
              <p className="text-[0.9em] text-muted-foreground">
                Designer UX/UI
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-[0.9em] text-muted-foreground">
                Prudence Fournet
              </p>
              <p className="text-[0.9em] text-muted-foreground">
                Directrice artistique
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-[0.9em] text-muted-foreground">
                Romain Aumeran
              </p>
              <p className="text-[0.9em] text-muted-foreground">Marketing</p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-[0.9em] text-muted-foreground">
                Valentine Lefevre
              </p>
              <p className="text-[0.9em] text-muted-foreground">
                Directrice Marketing
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-[0.9em] text-muted-foreground">
                Jessica Couble
              </p>
              <p className="text-[0.9em] text-muted-foreground">
                Développeuse Front-End
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-[0.9em] text-muted-foreground">
                Vincent Guilbert
              </p>
              <p className="text-[0.9em] text-muted-foreground">
                Développeur Back-End
              </p>
            </div>
          </section>
        </Card>
        <Card className="p-4 text-start gap-2">
          <h2>Hébergement</h2>
          <p className="text-[0.9em] text-muted-foreground">Hébergé par ...</p>
        </Card>
        <Card className="p-4 text-start gap-2">
          <h2>Données personnelles</h2>
          <p className="text-[0.9em] text-muted-foreground">
            L’application peut utiliser des cookies pour améliorer la
            navigation.
          </p>
        </Card>
        <Card className="p-4 text-start gap-2">
          <h2>Contact</h2>
          <p className="text-[0.9em] text-muted-foreground">
            featzy26@gmail.com
          </p>
        </Card>
      </main>
    </>
  );
}
