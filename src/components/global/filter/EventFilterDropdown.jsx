// src/components/global/filter/EventFilterDropdown.jsx
// Denne komponent er ansvarlig for at rendere en enkelt filter-dropdown (f.eks. for datoer eller lokationer).
// Den er en "Client Component", hvilket er angivet med "use client" direkivet øverst.
// Dette betyder, at den kører i brugerens browser, da den håndterer interaktive UI-elementer.

"use client"; // Direktiv, der markerer denne fil og dens komponenter som Client Components.

import {
  Select, // Hovedkomponenten for Shadcn/UI's Select/Dropdown.
  SelectContent, // Container for valgmulighederne, der vises, når dropdown'en åbnes.
  SelectGroup, // En gruppe af SelectItems, der kan bruges til at organisere valgmuligheder.
  SelectItem, // Individuelle valgmuligheder inden i dropdown'en.
  SelectLabel, // En label for en gruppe af SelectItems inden i SelectGroup.
  SelectTrigger, // Den synlige del af dropdown'en, som brugeren klikker på for at åbne den.
  SelectValue, // Viser den aktuelt valgte værdi i SelectTrigger.
} from "@/components/ui/select"; // Importsti for Shadcn/UI Select-komponenterne.

// EventFilterDropdown-komponenten.
// Den modtager props fra den overordnede 'Filter' Server Komponent (som er i dashboard/page.jsx).
export default function EventFilterDropdown({
  name, // 'name' prop'en (f.eks. "dato" eller "lokation"). Dette bliver 'name'-attributten på det underliggende <select> element og bruges til at sende data som en query-parameter i formularen.
  label: { singular, plural }, // Destrukturerer 'label' prop'en for at få 'singular' (f.eks. "Dato") og 'plural' (f.eks. "Datoer").
  items, // En array af de mulige valgmuligheder for dropdown'en (kan være strenge som datoer, eller objekter som lokationer).
  active, // Den aktuelt valgte værdi for dette filter, som kommer fra URL'ens searchParams.
}) {
  return (
    // Shadcn/UI Select-komponenten.
    // 'name' prop'en her er afgørende for, at formularen kan fange værdien af dette filter.
    // 'defaultValue' sætter den indledende værdi af dropdown'en.
    // 'active && active' sikrer, at hvis 'active' er en tom streng eller null, vil 'defaultValue' være null, og placeholderen vises.
    <Select name={name} defaultValue={active && active}>
      {/* SelectTrigger er den synlige del af dropdown'en. */}
      <SelectTrigger className="w-[180px]">
        {/* SelectValue viser den valgte værdi. Hvis intet er valgt, vises placeholder-teksten.
            Teksten er dynamisk baseret på 'singular' label'en. */}
        <SelectValue placeholder={`Filtrer efter ${singular.toLowerCase()}`} />
      </SelectTrigger>
      {/* SelectContent er den container, der dukker op, når dropdown'en åbnes, og indeholder valgmulighederne. */}
      <SelectContent>
        {/* SelectGroup bruges til at gruppere relaterede valgmuligheder. */}
        <SelectGroup>
          {/* SelectLabel giver en overskrift til SelectGroup'en. */}
          <SelectLabel>{plural}</SelectLabel>
          {/* Første valgmulighed: "Alle [plural label]". Dette giver brugeren mulighed for at fjerne filteret for denne kategori. */}
          <SelectItem value="all">Alle {plural.toLowerCase()}</SelectItem>
          {/* Mapper over 'items' array'en for at skabe en SelectItem for hver mulig valgmulighed. */}
          {items.map((item) => {
            // Denne logik håndterer, om 'item' er et simpacelt streng (f.eks. en dato) eller et objekt (f.eks. en lokation med 'id' og 'name').
            const value =
              typeof item === "object" && item !== null ? item.id : item;
            const displayLabel =
              typeof item === "object" && item !== null ? item.name : item;
            return (
              // Hver SelectItem repræsenterer en valgmulighed.
              // 'value' er den faktiske værdi, der sendes, når item'et vælges. Konverteres til streng.
              // 'key' er vigtig for Reacts performance ved rendering af lister, bruger værdien som nøgle.
              <SelectItem value={String(value)} key={String(value)}>
                {displayLabel}{" "}
                {/* Teksten der vises i dropdown'en for dette valg. */}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
