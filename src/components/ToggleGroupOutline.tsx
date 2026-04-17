import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ToggleGroupOutlineProps {
  left: string;
  right: string;
  setShowMap: (value: boolean) => void;
}

export default function ToggleGroupOutline({
  left,
  right,
  setShowMap,
}: ToggleGroupOutlineProps) {
  return (
    <ToggleGroup
      variant="outline"
      type="single"
      defaultValue={left}
      className="z-10 w-9/10 h-auto absolute bottom-22 left-1/2 -translate-x-1/2 rounded-phone shadow-lg bg-background"
    >
      <ToggleGroupItem
        value={left}
        aria-label={`Toggle to ${left}`}
        onClick={() => setShowMap(false)}
        className="w-1/2"
      >
        {left}
      </ToggleGroupItem>
      <ToggleGroupItem
        value={right}
        aria-label={`Toggle to ${right}`}
        onClick={() => setShowMap(true)}
        className="w-1/2"
      >
        {right}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
