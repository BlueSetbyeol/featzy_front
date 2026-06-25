import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface ProfilNavigationProps {
  content: string;
}

export default function ProfileNavigation({ content }: ProfilNavigationProps) {
  return (
    <div className="w-full flex flex-row gap-3 px-5 pt-5 items-center">
      <Link to="/profil">
        <ArrowLeft className="size-5" />
      </Link>
      <h1>{content}</h1>
    </div>
  );
}
