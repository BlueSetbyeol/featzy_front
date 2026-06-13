import { Link, useLocation } from "react-router";
import WelcomeHere from "../assets/icon/home.svg";
import MapIconHere from "../assets/icon/map.svg";
import ProfilIconHere from "../assets/icon/profil.svg";
import BookingHere from "../assets/icon/reservation.svg";
import Welcome from "../assets/icon/home_selected.svg";
import MapIcon from "../assets/icon/map_selected.svg";
import ProfilIcon from "../assets/icon/profil_selected.svg";
import Booking from "../assets/icon/reservation_selected.svg";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

export default function Navbar() {
  const { user } = useContext(UserContext);

  const MenuItems = [
    { name: "Accueil", link: "/", image: Welcome, selected: WelcomeHere },
    { name: "Carte", link: "/map", image: MapIcon, selected: MapIconHere },
    {
      name: "Réservation",
      link: user ? "/my-reservation" : "/login",
      image: Booking,
      selected: BookingHere,
    },
    {
      name: "Profil",
      link: user ? "/profil" : "/login",
      image: ProfilIcon,
      selected: ProfilIconHere,
    },
  ];
  const location = useLocation();

  return (
    // absolute z-99999 si on veut la navbar au dessus, mais elle est pas clickable
    <nav className="w-full h-[8vh] bg-primary shadow-md flex items-center justify-evenly px-4">
      {MenuItems.map((item, index) => (
        <Link to={item.link} key={index} className="flex flex-col items-center">
          {location.pathname === item.link ? (
            <img
              src={item.image}
              alt={item.name}
              className="size-7 cursor-pointer"
            />
          ) : (
            <img
              src={item.selected}
              alt={item.name}
              className="size-7 cursor-pointer"
            />
          )}
          <p className="text-primary-foreground text-xs">{item.name}</p>
        </Link>
      ))}
    </nav>
  );
}
