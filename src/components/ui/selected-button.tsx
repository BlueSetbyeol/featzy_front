import { useState } from "react";
import { Button } from "./button";

interface SelectedButtonProps {
  name: string;
}

export default function SelectedButton({ name }: SelectedButtonProps) {
  const [selected, setSelected] = useState(false);

  return (
    <Button
      className={
        selected
          ? "bg-primary text-primary-foreground rounded-sm "
          : "bg-secondary rounded-sm text-muted-foreground font-ligth text-[0.9em] h-7"
      }
      onClick={() =>
        selected === true ? setSelected(false) : setSelected(true)
      }
    >
      {name}
    </Button>
  );
}
