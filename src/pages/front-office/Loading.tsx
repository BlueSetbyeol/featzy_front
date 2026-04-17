import Logo from "../../assets/logo.svg";
import HamburLogo from "../../assets/icon/hamburger_logo.svg";

export default function Loading() {
  return (
    <article className="flex flex-col items-center justify-center w-screen h-screen bg-primary">
      <img src={HamburLogo} alt="Logo's Hamburger" className="pl-45 pb-5" />
      <img src={Logo} alt="Featzy's logo" className="btn_basic" />
      <p className="mt-4 text-secondary font-title">
        Partager un repas n'a jamais été aussi Easy
      </p>
    </article>
  );
}
