import ProfileNavigation from "./ProfileNavigation";
import AddContact from "../../assets/icon/contact_add.svg";
import AddContactBlack from "../../assets/icon/contact_add_black.svg";
import FakeUserPicture from "../../assets/julie_doublet.svg";
import Search from "../../assets/icon/search.svg";
import { useContext, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
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
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ContactCard from "./contact/ContactCard";
import type { FriendMember } from "@/types/reservationTypes";
import UserContext from "@/context/UserContext";

export default function ProfileSettings() {
  const { user } = useContext(UserContext);
  console.log(user);

  const userFriends: FriendMember[] = [];

  // function handleDeleteClick(index: number) {
  //   // TODO A mettre en relation avec l'API
  //   userFriends.splice(
  //     userFriends.findIndex((a) => a.id === index),
  //     1,
  //   );

  //   return userFriends;
  // }

  const [filter, setFilter] = useState("");

  function handleFilterSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO appeler la liste des contacts par nom, numéro de tel ou email
    //setFilter(resultat)
  }

  const [searchContact, setSearchContact] = useState<string | undefined>();

  function handleSearchContactSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO appeler la liste des utilisateurs par nom, numéro de tel ou email
    //setSearchContact(résultat)
  }

  function handleAddToContactClick() {
    // TODO appeler fonction pour ajouter une personne dans les contacts de l'utilisateur
  }

  const [phoneContactToAdd, setPhoneContactToAdd] = useState([]);

  function handleSearchPhoneContact(e: { preventDefault: () => void }) {
    e.preventDefault();
    //appel des contacts de l'appareil de l'utilisateur
    setPhoneContactToAdd([]);
  }

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Contacts"} />
      </nav>
      <main className="h-[87%] w-screen px-5 flex flex-col gap-3 pb-4">
        <section className="w-full px-3 flex flex-row items-center justify-between">
          <p>{userFriends.length} contacts</p>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="rounded-sm">
                <img src={AddContact} alt="ajouter un contact" />
                Ajouter
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full px-4">
              <div className="mx-auto w-full max-w-sm px-0">
                <DrawerHeader className="flex flex-col items-start w-full px-0">
                  <DrawerDescription className="sr-only">
                    Ajouter un contact
                  </DrawerDescription>
                  <section className="flex flex-row justify-between items-center w-full">
                    <DrawerTitle>Ajouter un contact</DrawerTitle>
                    <DrawerClose asChild>
                      <Button variant="ghost">
                        <X className="size-6" />
                      </Button>
                    </DrawerClose>
                  </section>
                  <DrawerDescription className="sr-only">
                    Invite une personne avec son nom, email ou téléphone.
                  </DrawerDescription>
                  <p>Invite une personne avec son nom, email ou téléphone.</p>
                </DrawerHeader>
                <Tabs defaultValue="manual" className="w-full py-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="manual" className="rounded-sm">
                      Saisie Manuelle
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="rounded-sm" disabled>
                      Contacts Téléphone
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="manual"
                    onClick={(e) => handleSearchPhoneContact(e)}
                  >
                    <p className="text-start mb-1">Contact</p>
                    <input
                      type="text"
                      className="bg-background w-full p-2 mb-5 rounded-sm text-foreground text-[0.9em] focus:border-foreground border"
                      placeholder={
                        searchContact ??
                        "Prénom, nom, adresse email ou téléphone"
                      }
                      onChange={(e) => {
                        setSearchContact(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchContactSubmit(e);
                        }
                      }}
                    />
                    <DrawerFooter className="w-full px-0">
                      <DrawerClose asChild>
                        <Button>Ajouter le contact</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </TabsContent>
                  <TabsContent value="phone" className="py-4">
                    {phoneContactToAdd &&
                      phoneContactToAdd.length > 0 &&
                      phoneContactToAdd.map((_contact, index) => (
                        <Card
                          className="w-full flex flex-row justify-between items-center p-4"
                          key={index}
                        >
                          <div className="w-[80%] flex flex-row gap-4 items-center">
                            <img
                              src={FakeUserPicture}
                              alt="People's profile picture"
                              className="size-14"
                            />
                            <div className="text-start">
                              <p className="font-medium text-[0.9em]">
                                Firstname Lastname
                              </p>
                              <p className="font-ligth text-muted-foreground">
                                first.last@gmail.com
                              </p>
                            </div>
                          </div>
                          <DrawerClose asChild>
                            <button
                              type="button"
                              onClick={() => handleAddToContactClick()}
                            >
                              <img
                                src={AddContactBlack}
                                alt="ajouter cette personne dans votre liste de contact"
                                className="size-5"
                              />
                            </button>
                          </DrawerClose>
                        </Card>
                      ))}
                  </TabsContent>
                </Tabs>
              </div>
            </DrawerContent>
          </Drawer>
        </section>
        <Card className="bg-background flex flex-row w-full p-2 mb-5 rounded-sm gap-2">
          <img
            src={Search}
            alt="click to look for the location you want"
            className="size-6 pt-1"
          />
          <input
            type="text"
            id="search-contact"
            className="w-[80%] mr-2 pl-4 text-foreground rounded-sm focus:border-foreground border-0"
            placeholder={filter ?? "Rechercher un contact"}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilterSubmit(e);
              }
            }}
          />
        </Card>
        {userFriends.length > 0 ? (
          userFriends.map((friend) => (
            <ContactCard
              friend={friend}
              // handleDeleteClick={handleDeleteClick}
              key={friend.id}
              profileOrResa={"profil"}
              // numberOfGuest=""
            />
          ))
        ) : (
          <section className="w-full h-full pt-5 flex flex-col justify-center gap-8">
            <p>Tu n'as pas encore ajouter des contact</p>
          </section>
        )}
      </main>
    </>
  );
}
