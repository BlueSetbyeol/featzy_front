import { Link, useLocation } from "react-router";
import WelcomeHere from "../assets/icon/maison.svg";
import MapIconHere from "../assets/icon/carte.svg";
import ProfilIconHere from "../assets/icon/profil.svg";
import BookingHere from "../assets/icon/reservation.svg";
import Welcome from "../assets/icon/maison_selected.svg";
import MapIcon from "../assets/icon/carte_selected.svg";
import ProfilIcon from "../assets/icon/profil_selected.svg";
import Booking from "../assets/icon/reservation_selected.svg";

export default function Navbar() {
  const MenuItems = [
    { name: "Accueil", link: "/", image: Welcome, selected: WelcomeHere },
    {
      name: "Réservation",
      link: "/reservation",
      image: Booking,
      selected: BookingHere,
    },
    { name: "Carte", link: "/map", image: MapIcon, selected: MapIconHere },
    {
      name: "Profil",
      link: "/profil",
      image: ProfilIcon,
      selected: ProfilIconHere,
    },
  ];
  const location = useLocation();

  return (
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
