// DROPDOWN

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterDropdown({
  name,
  label: { singular, plural },
  items,
  action,
}) {
  return (
    <Select onValueChange={(e) => action(e, name)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Filtrer efter ${singular.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{plural}</SelectLabel>
          <SelectItem value="all">Alle {plural.toLowerCase()}</SelectItem>
          {items.map((item, id) => {
            if (isNaN(item))
              return (
                <SelectItem value={item} key={id}>
                  {item}
                </SelectItem>
              );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
