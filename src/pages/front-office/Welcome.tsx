import type { User } from "@/types/userTypes";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import JulieProfil from "../../assets/julie_doublet.svg";
import Placeholder from "../../assets/image/image.png";
import UserContext from "@/context/UserContext";
import Loc from "../../assets/icon/loc.svg";
import Search from "../../assets/icon/loupe.svg";
import Mic from "../../assets/icon/microphone.svg";
import { RestaurantVariety } from "../../components/restaurant/RestaurantVariety";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { Link } from "react-router";
// import Filters from "../../assets/icon/filters.svg";

const UserTest: User = {
  firstname: "Julie",
  lastname: "Doublet",
  profile_picture_url: JulieProfil,
  email: "julie.doublet@exemple.com",
  phone_number: "0678912345",
  address_id: 1,
  is_active: true,
  friends: [
    {
      id: 1,
      firstname: "Tatiana",
      lastname: "Bergson",
      image: JulieProfil,
    },
    {
      id: 2,
      firstname: "Julien",
      lastname: "Triplet",
      image: JulieProfil,
    },
  ],
  diet: ["Sans produits Laitier"],
  registered_restaurant: [
    {
      id: 1,
      owner_id: 1,
      email: "restaurant@google.com",
      phone_number: "0123456789",
      description: "sweet restaurant",
      logo_url: Placeholder,
      price_range: "20€",
      capacity: 50,
      average_rating: 4.5,
      total_reviews: 5,
      is_active: true,
      accepts_reservations: true,
      name: "Restaurant A",
      cuisine_type: "Italienne",
      openingHours: ["8-12h"],
      cover_image_url: Placeholder,
      address_id: 1,
      location: {
        lat: 45.757732,
        lng: 4.83635,
      },
    },
    {
      id: 2,
      owner_id: 1,
      email: "restaurant@google.com",
      phone_number: "0123456789",
      description: "sweet restaurant",
      logo_url: Placeholder,
      price_range: "20€",
      capacity: 50,
      average_rating: 4.5,
      total_reviews: 5,
      is_active: true,
      accepts_reservations: true,
      name: "Restaurant B",
      cuisine_type: "Française",
      openingHours: ["9-13h", "18-23h"],
      cover_image_url: Placeholder,
      address_id: 1,
      location: {
        lat: 45.75415373451574,
        lng: 4.841085166752054,
      },
    },
    {
      id: 3,
      owner_id: 1,
      email: "restaurant@google.com",
      phone_number: "0123456789",
      description: "sweet restaurant",
      logo_url: Placeholder,
      price_range: "20€",
      capacity: 50,
      average_rating: 4.5,
      total_reviews: 5,
      is_active: true,
      accepts_reservations: true,
      address_id: 1,
      name: "Restaurant C",
      cuisine_type: "Espagnol",
      openingHours: ["9-23h"],
      cover_image_url: Placeholder,
      location: {
        lat: 46.75415373451574,
        lng: 4.841085166752054,
      },
    },
  ],
};

export default function Welcome() {
  const { setUser, user } = useContext(UserContext);

  useEffect(() => {
    setUser(UserTest);
  }, [setUser]);

  setUser(UserTest);

  interface SelectedButtonProps {
    name: string;
  }

  function SelectedButton({ name }: SelectedButtonProps) {
    const [selected, setSelected] = useState(false);

    return (
      <Button
        className={
          selected
            ? "bg-primary text-secondary rounded-full "
            : "bg-secondary border-2 border-primary rounded-full text-secondary-foreground font-thin"
        }
        onClick={() =>
          selected === true ? setSelected(false) : setSelected(true)
        }
      >
        {name}
      </Button>
    );
  }

  return (
    <main className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto">
      <section className="px-5">
        <h2 className="pt-4 text-3xl font-title text-start">
          Bonjour, {user && user.firstname}
        </h2>
        <h3 className="text-2xl font-title">
          Qu’est-ce qu’on mange aujourd’hui ?
        </h3>
      </section>
      {/* bellow to turn into a component */}
      <section className="w-full px-5">
        <p className="flex flex-row items-center gap-2 text-[12px] pb-3">
          <img src={Loc} alt="localisation point" className="size-3" /> Lieu
          choisi : Jean Macé
        </p>
        <article className="bg-primary flex flex-row w-full p-4 rounded-phone gap-2">
          <img
            src={Search}
            alt="click to look for the location you want"
            className="size-8"
          />
          <Button
            className="w-[80%] mr-2 bg-secondary text-foreground rounded-button"
            aria-placeholder="Recherche"
          />
          <img src={Mic} alt="microphone" className="size-7" />
          {/* <img
            src={Filters}
            alt="Search's settings and filters"
            className="size-7"
          /> */}
        </article>
      </section>
      <section className="flex flex-col w-screen gap-4">
        <section className="bg-primary flex w-full gap-8 overflow-x-auto p-3">
          {RestaurantVariety.map((variety: { name: string; image: string }) => (
            <div
              key={variety.name}
              className="flex flex-col gap-2 items-center"
            >
              <img src={variety.image} alt={variety.name} className="size-16" />
              <p className="font-title text-[15px] text-secondary">
                {variety.name}
              </p>
            </div>
          ))}
        </section>
        <section className="flex w-full gap-4 overflow-x-auto px-5">
          <SelectedButton name={"Promotions"} />
          <SelectedButton name={"Les mieux notés"} />
          <SelectedButton name={"Prix"} />
          <SelectedButton name={"Allergies"} />
          <SelectedButton name={"Régimes alimentaire"} />
          <SelectedButton name={"Restrictions alimentaire"} />
        </section>
      </section>
      <section className="w-full pt-5">
        <article className="w-full flex flex-row justify-between pb-2 px-5 ">
          <h4 className="text-xl font-title">Restaurant les mieux notés</h4>
          <Link to="/restaurants" className="text-[14px] underline font-light">
            Tout voir
          </Link>
        </article>
        <section className="flex flex-row w-full gap-8 overflow-x-auto px-5">
          {user &&
            user.registered_restaurant &&
            user.registered_restaurant.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                profileList={false}
              />
            ))}
        </section>
      </section>
      <section className="w-full pt-5">
        <article className="w-full flex flex-row justify-between px-5 pb-2">
          <h4 className="text-xl font-title">Vous y avez déjà mangé</h4>
          <Link to="/restaurants" className="text-[14px] underline font-light">
            Tout voir
          </Link>
        </article>
        <section className="flex flex-row w-full gap-8 px-5 overflow-x-auto">
          {user &&
            user.registered_restaurant &&
            user.registered_restaurant.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                profileList={false}
              />
            ))}
        </section>
      </section>
    </main>
  );
}
