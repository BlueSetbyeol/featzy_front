import { Link } from "react-router";
import GoBackArrow from "../../assets/icon/go_back.svg";

interface ProfilNavigationProps {
  content: string;
}

export default function ProfileNavigation({ content }: ProfilNavigationProps) {
  return (
    <div className="w-full h-full flex flex-row justify-between gap-3 px-5 mt-8">
      <Link to="/profil">
        <img src={GoBackArrow} alt="Go back to profil" className="size-10" />
      </Link>
      <div className="w-full ">
        <h1>{content}</h1>
      </div>
    </div>
  );
}
