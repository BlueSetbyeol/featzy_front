import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface ProfilNavigationProps {
  step: number;
  setStep: (step: number) => void;
}

export default function ReservationNavigation({
  step,
  setStep,
}: ProfilNavigationProps) {
  const navigate = useNavigate();

  function handleClick(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (step === 1) {
      navigate("/");
    } else {
      setStep(1);
    }
  }

  return (
    <div className="w-full flex flex-row gap-3 px-5 pt-5 items-center">
      <Button
        variant="ghost"
        className="has-[>svg]:px-0 p-0 justify-start items-start"
        onClick={handleClick}
      >
        <ArrowLeft className="size-4" />
      </Button>
      <section className="text-start">
        <h1>Réservation</h1>
        <p className="text-muted-foreground">{step} sur 2 étapes</p>
      </section>
    </div>
  );
}
