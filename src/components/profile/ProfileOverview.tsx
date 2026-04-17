import ArrowRight from "../../assets/icon/arrow_right.svg";
import RestaurantCard from "../restaurant/RestaurantCard";
import Parameters from "../../assets/icon/parameters.svg";
import { Link } from "react-router";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

export default function ProfileOverview() {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && (
        <>
          <nav className="flex flex-row justify-between w-screen h-20 gap-3 px-5 mt-8">
            <div className="flex gap-3">
              <img
                src={user.profile_picture_url}
                alt={`${user.firstname} ${user.lastname} profil picture`}
                className="size-12"
              />
              <h1>
                {user.firstname} {user.lastname}
              </h1>
            </div>
            <Link type="button" to="/profil/settings">
              <img
                src={Parameters}
                alt="Profil parameters"
                className="size-12"
              />
            </Link>
          </nav>
          <section className="h-[87%] flex flex-col items-start px-5 overflow-y-auto overflow-x-hidden w-full">
            <section className="flex flex-col w-full py-4">
              <Link
                to="contacts"
                className="w-full bg-secondary text-foreground text-[20px] flex justify-between items-center py-3"
              >
                <p>Contacts</p>
                <img src={ArrowRight} alt="Go into Contacts menu" />
              </Link>
              <Link
                to="diet"
                className="w-full bg-secondary text-foreground text-[20px] flex justify-between items-center py-3"
              >
                <p>Préférences Alimentaires</p>
                <img src={ArrowRight} alt="Go into Contacts menu" />
              </Link>
              <Link
                to="favorites"
                className="w-full bg-secondary text-foreground text-[20px] flex justify-between items-center py-3"
              >
                <p>Enregistrés</p>
                <img src={ArrowRight} alt="Go into Contacts menu" />
              </Link>
            </section>
            <section className="flex w-full gap-4 overflow-x-auto">
              {user.registered_restaurant &&
                user.registered_restaurant.map((restaurant, index) => (
                  <RestaurantCard
                    restaurant={restaurant}
                    key={index}
                    profileList={true}
                  />
                ))}
            </section>
          </section>
        </>
      )}
    </>
  );
}
