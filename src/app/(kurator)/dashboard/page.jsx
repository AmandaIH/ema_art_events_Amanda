// dashboard/page.jsx
// Dette er hovedsiden for dit dashboard. I Next.js App Router er sider som denne som udgangspunkt Server Components.
// Det betyder, at de kører på serveren, før HTML'en sendes til brugerens browser.

import { getEvent, getEventDates, getEventLocations } from "@/lib/api";
// Importerer funktioner til at hente data. Disse funktioner vil køre på serveren.
// - getEvent: Henter alle events.
// - getEventDates: Henter alle tilgængelige datoer for events.
// - getEventLocations: Henter alle tilgængelige lokationer for events.

import EventGallery from "@/components/global/EventGallery";
// Importerer en komponent, der er ansvarlig for at vise en samling af eventkort.

import EventFilterDropdown from "@/components/global/filter/EventFilterDropdown";
// Importerer komponenten for de individuelle filter-dropdowns.
// Selvom denne komponent vil være en Client Component (pga. interaktion), kan den importeres her i en Server Component.

import CustomButton from "@/components/global/CustomButton";
// Importerer din tilpassede knapkomponent, som også er en Client Component.

// Standard eksport af en Next.js side-komponent.
// Den er markeret som 'async', hvilket yderligere bekræfter, at den er en Server Component, der kan udføre asynkrone operationer (som datahentning) direkte.
// 'searchParams' er en speciel prop fra Next.js, der automatisk giver adgang til URL'ens query-parametre (f.eks. ?dato=2024-01-01&lokation=København).
export default async function Dashboard({ searchParams }) {
  console.log("hej"); // En simpel log-udskrift. Denne vil kun vises i din terminal (server-siden), da det er en Server Component.

  // Destrukturerer 'dato' og 'lokation' fra 'searchParams'.
  // Hvis URL'en f.eks. er '/dashboard?dato=2024-01-01&lokation=København', vil 'dato' være "2024-01-01" og 'lokation' være "København".
  const { dato, lokation } = searchParams;

  // Henter alle events fra din API. Denne operation udføres på serveren.
  const eventsData = await getEvent();

  // Start på den betingede filtreringslogik. Dette er en ternær operator, der vælger, hvordan 'eventsData' skal filtreres.
  const data =
    // Første betingelse: Er både 'dato' og 'lokation' angivet, og er ingen af dem lig med "all"?
    dato && dato !== "all" && lokation && lokation !== "all"
      ? // Hvis JA, filtrer events, hvor både dato OG lokation matcher præcist de angivne værdier.
        eventsData.filter(
          (event) => event.date === dato && event.location.name === lokation
        )
      : // Anden betingelse (hvis den første var falsk): Er ENTEN 'dato' ELLER 'lokation' angivet (og ikke "all")?
        (dato && dato !== "all") || (lokation && lokation !== "all")
        ? // Hvis JA, filtrer events, hvor enten dato ELLER lokation matcher.
          eventsData.filter(
            (event) => event.date === dato || event.location.name === lokation
          )
        : // Tredje betingelse (hvis begge ovenstående var falske): Ingen specifikke filtre er valgt (eller de er "all").
          // Returner alle events uden filtrering.
          eventsData;

  // Render HTML-strukturen for dashboard-siden.
  return (
    <main>
      <h1 className="text-blue-500 justify-self-center p-4">
        Kurator dashboard
      </h1>
      {/* Renderer 'Filter' komponenten. Denne komponent er defineret længere nede i denne samme fil
          og er også en Server Component.
          Den får de aktuelt valgte 'dato' og 'lokation' som props. */}
      <Filter activeDate={dato} activeLocation={lokation} />
      {/* Renderer 'EventGallery' komponenten, der viser de filtrerede (eller alle) events.
          'isDashboardPage={true}' er en prop, der sandsynligvis bruges til at tilpasse visningen
          af eventkortene specifikt for dashboard-miljøet (f.eks. visning af rediger/slet knapper). */}
      <EventGallery data={data} isDashboardPage={true} />
    </main>
  );
}

// Lokal Server Komponent: Filter
// Denne komponent er defineret inden for den samme fil som Dashboard og er også en Server Component.
// Dens primære opgave er at hente de *mulige* filtermuligheder (datoer og lokationer) og derefter
// at opbygge og rendere formular-elementerne (dropdowns) for filtrering.
async function Filter({ activeDate, activeLocation }) {
  // Henter listen over alle tilgængelige eventdatoer fra API'en.
  const dates = await getEventDates();
  // Henter listen over alle tilgængelige eventlokationer fra API'en.
  const locations = await getEventLocations();

  // Forbereder en array af objekter, der beskriver de forskellige filterkategorier.
  // Disse data vil blive sendt som props til 'EventFilterDropdown' komponenterne.
  const filterData = [
    {
      name: "dato", // Navnet på dette filterfelt (bliver til 'name' attributten i HTML, bruges i URL som 'dato=...')
      label: { singular: "Dato", plural: "Datoer" }, // Labels til at vise i UI'en for brugeren.
      items: dates.toSorted(), // De faktiske mulige dato-valg, sorteret.
      active: activeDate, // Den dato, der er aktivt valgt lige nu (fra URL'en, via props).
    },
    {
      name: "lokation", // Navnet på lokationsfilterfeltet.
      label: { singular: "Lokation", plural: "Lokationer" }, // Labels for lokation.
      // Mapper lokationsobjekter til kun at have deres navne, og sorterer dem.
      items: locations.map((location) => location.name).toSorted(),
      active: activeLocation, // Den lokation, der er aktivt valgt lige nu.
    },
  ];

  // Render en HTML-formular.
  return (
    <form
      action="/dashboard" // 'action' attributten angiver, at formularen skal sendes til '/dashboard' ruten.
      // Når denne formular submittes, vil Next.js fange det og gen-rendere '/dashboard/page.jsx' med de nye formularværdier
      // som opdaterede 'searchParams' i URL'en. Dette udløser en fuld server-side re-render.
      className="flex flex-row items-center gap-4 px-2 py-1 mb-8"
    >
      {/* Mapper over 'filterData' array'et for at rendere en 'EventFilterDropdown' for hver filterkategori. */}
      {filterData.map((filter, id) => {
        // 'key={id}' er vigtig for Reacts performance ved rendering af lister.
        // Spreader alle egenskaber fra 'filter' objektet (name, label, items, active) som props til 'EventFilterDropdown'.
        return <EventFilterDropdown key={id} {...filter} />;
      })}
      {/* En knap af typen 'submit'. Når denne knap klikkes, vil den indsende formularen. */}
      <CustomButton type="submit" text="Find"></CustomButton>
    </form>
  );
}
// Bemærk: 'Filter' er ikke eksporteret her, da den kun bruges lokalt i denne fil af 'Dashboard'-komponenten.
// Standard eksporten for filen er 'Dashboard'.
