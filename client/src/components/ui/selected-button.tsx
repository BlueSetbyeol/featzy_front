import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

interface SelectedButtonProps {
  filterType: string;
  setSelectFilters: Dispatch<SetStateAction<string[]>>;
  selectFilters: string[];
}

export default function SelectedButton({
  filterType,
  setSelectFilters,
  selectFilters,
}: SelectedButtonProps) {
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState("default");
  const isSelected = value !== "default";

  const handleClick = (filterType: string) => {
    if (selected === true) {
      setSelected(false);
    } else {
      setSelected(true);
    }

    if (filterType !== "default") {
      selectFilters.push(filterType);
      setSelectFilters(selectFilters);
    }
  };

  {
    if (filterType === "Prix") {
      return (
        <Select
          value={value}
          onValueChange={(val) => {
            setValue(val);
            handleClick(val);
          }}
        >
          <SelectTrigger
            className={cn(
              "!h-7 text-[1em] rounded-[5px] px-3 border-0",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <SelectValue
              placeholder={filterType}
              className="text-[1em] font-ligth"
            />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectGroup>
              <SelectItem value="default">{filterType}</SelectItem>
              <SelectItem value="€">€</SelectItem>
              <SelectItem value="€€">€€</SelectItem>
              <SelectItem value="€€€">€€€</SelectItem>
              <SelectItem value="€€€€">€€€€</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
  }

  return (
    <Button
      className={
        selected
          ? "bg-primary text-primary-foreground text-[1em] rounded-[5px] h-7 px-3"
          : "bg-secondary text-muted-foreground text-[1em] rounded-[5px] h-7 px-3"
      }
      onClick={() => handleClick(filterType)}
    >
      {filterType}
    </Button>
  );
}
