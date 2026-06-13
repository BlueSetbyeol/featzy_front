import { useState } from "react";
import { Card } from "@/components/ui/card";
import Logo from "../../assets/logo_white.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserLogin from "@/components/auth/UserLogin";
import UserRegistration from "@/components/auth/UserRegistration";

export default function Login() {
  const [tab, setTab] = useState("connexion");

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen gap-4 pb-4">
      <section className="w-full flex flex-col items-center justify-center">
        <img src={Logo} alt="Featzy's logo" className="w-[12em]" />
        <p className="text-primary font-title">Partager un repas, c'est Easy</p>
      </section>
      <Card className="p-4 w-[90%] h-min-[60%]">
        <Tabs value={tab} onValueChange={setTab} className="w-full rounded-sm">
          <TabsList className="w-full">
            <TabsTrigger value="connexion" className="rounded-sm text-[1em]">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="inscription" className="rounded-sm text-[1em]">
              Inscription
            </TabsTrigger>
          </TabsList>
          <TabsContent value="connexion">
            <UserLogin />
          </TabsContent>
          <TabsContent value="inscription">
            <UserRegistration onRegistered={() => setTab("connexion")} />
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
