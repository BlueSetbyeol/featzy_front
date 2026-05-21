import type { User } from "@/types/userTypes";
import { useContext, useState } from "react";
import { Link } from "react-router";
import UserContext from "@/context/UserContext";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import SearchingLoc from "@/components/map/SearchingLoc";
import { RestaurantVariety } from "../../components/restaurant/RestaurantVariety";
import type { Restaurant } from "@/types/restaurantTypes";
import { RestaurantApi } from "@/services/RestaurantApi";
import { ArrowRight } from "lucide-react";
import SelectedButton from "@/components/ui/selected-button";

import JulieProfil from "../../assets/julie_doublet.svg";
import Placeholder from "../../assets/image/image.png";

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
      name: "Restaurant A",
      cuisine_type: "Italienne",
      // opening_hours: ["8-12h"],
      cover_image_url: Placeholder,
      address: {
        id: 1,
        street: "rue des oies",
        zipcode: "69902",
        city: "Lyon",
        country: "France",
        latitude: 45.757732,
        longitude: 4.83635,
      },
      price_range_label: "",
      allow_pre_order: true,
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
      name: "Restaurant B",
      cuisine_type: "Française",
      // opening_hours: ["9-13h", "18-23h"],
      cover_image_url: Placeholder,
      address: {
        id: 1,
        street: "rue des oies",
        zipcode: "69906",
        city: "Lyon",
        country: "France",
        latitude: 45.75415373451574,
        longitude: 4.841085166752054,
      },
      price_range_label: "",
      allow_pre_order: true,
    },
    {
      id: 3,
      email: "restaurant@google.com",
      phone_number: "0123456789",
      description: "sweet restaurant",
      logo_url: Placeholder,
      price_range: "20€",
      capacity: 50,
      average_rating: 4.5,
      total_reviews: 5,
      is_active: true,
      address: {
        id: 1,
        street: "rue des oies",
        zipcode: "69907",
        city: "Lyon",
        country: "France",
        latitude: 45.747764,
        longitude: 4.837241,
      },
      name: "Restaurant C",
      cuisine_type: "Espagnol",
      // opening_hours: ["9-23h"],
      cover_image_url: Placeholder,
      price_range_label: "",
      allow_pre_order: true,
    },
  ],
};

export default function Welcome() {
  const { user } = useContext(UserContext);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  async function getAllRestaurant() {
    const restaurantList = await RestaurantApi.getAll();
    setRestaurants(restaurantList);
  }

  if (restaurants.length <= 1) {
    getAllRestaurant();
  }

  return (
    <main className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar pb-4">
      <section className="px-5 bg-primary w-screen">
        <h2 className="pt-4 font-text text-start text-background">
          Bonjour, {user && user.user.firstname}
        </h2>
        <h1 className="font-title text-background text-start font-light">
          Qu’est-ce qu’on mange aujourd’hui ?
        </h1>
        <SearchingLoc />
      </section>
      <section className="flex flex-col w-screen gap-3">
        <section className="flex w-full gap-8 overflow-x-auto no-scrollbar px-5">
          {RestaurantVariety.map((variety: { name: string; image: string }) => (
            <div
              key={variety.name}
              className="flex flex-col gap-2 items-center"
            >
              <img src={variety.image} alt={variety.name} className="size-16" />
              <p className="">{variety.name}</p>
            </div>
          ))}
        </section>
        <section className="flex w-full gap-4 overflow-x-auto no-scrollbar px-5">
          <SelectedButton name={"Promotions"} />
          <SelectedButton name={"Les mieux notés"} />
          <SelectedButton name={"Prix"} />
          <SelectedButton name={"Allergies"} />
          <SelectedButton name={"Régimes alimentaire"} />
          <SelectedButton name={"Restrictions alimentaire"} />
        </section>
      </section>
      <section className="w-full pt-2">
        <article className="w-full flex flex-row justify-between pb-2 px-5 ">
          <h2 className="font-title">Restaurant les mieux notés</h2>
          <Link to="/restaurants">
            {/* TODO faire un tri dans les restaurants proposé */}
            <ArrowRight className="size-4" />
          </Link>
        </article>
        <section className="flex flex-row w-full gap-8 overflow-x-auto no-scrollbar px-5">
          {restaurants &&
            restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                profileList={false}
              />
            ))}
        </section>
      </section>
      <section className="w-full pt-2">
        <article className="w-full flex flex-row justify-between px-5 pb-2">
          <h2 className="font-title">Vous y avez déjà mangé</h2>
          <Link to="/restaurants">
            {/* TODO faire un tri dans les restaurants proposé */}
            <ArrowRight className="size-4" />
          </Link>
        </article>
        <section className="flex flex-row w-full gap-8 px-5 overflow-x-auto no-scrollbar">
          {user &&
            UserTest.registered_restaurant &&
            UserTest.registered_restaurant.map((restaurant) => (
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
