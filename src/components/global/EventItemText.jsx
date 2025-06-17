import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Importerer de nødvendige Shadcn/UI Card-komponenter.

import ReadMore from "./ReadMore"; // Importerer en underkomponent til "Læs mere"-funktionalitet.
import EditDelete from "./EditDelete"; // Importerer en underkomponent til "Rediger/Slet"-funktionalitet (til dashboard).

// EventItemText er en asynkron funktionel komponent, der modtager event-data som props.
// 'async' indikerer, at den potentielt kan udføre asynkrone operationer (f.eks. datahentning),
// men i dette konkrete snippet bruges det ikke aktivt.
const EventItemText = async ({
  id, // Unikt ID for eventet, bruges sandsynligvis til at linke til detaljesider eller for redigering/sletning.
  title, // Titlen på eventet.
  location, // Lokationsobjekt (forventes at have en 'name' property).
  description, // Beskrivelse af eventet.
  date, // Dato for eventet (format afhænger af, hvordan det sendes ind).
  address, // Adressen for eventet.
  isDashboardPage, // Boolean, der afgør om kortet vises på dashboard-siden (true) eller en anden side (false).
}) => {
  return (
    // Card-komponenten fra Shadcn/UI, der fungerer som container for event-detaljerne.
    // 'md:col-2' bruges sandsynligvis til grid-layout på medium skærme (fra Tailwind CSS).
    // 'max-w-[30ch]' begrænser den maksimale bredde baseret på tegn for læsbarhed.
    // 'minWidth: "250px"' sikrer, at kortet aldrig bliver smallere end 250px.
    <Card className={`md:col-2 max-w-[30ch]`} style={{ minWidth: "250px" }}>
      {/* CardHeader bruges til overskrifter og metadata øverst på kortet. */}
      {/* 'p-4 pb-2 relative' giver padding og positionering. */}
      <CardHeader className="p-4 pb-2 relative">
        {/* CardTitle viser eventets titel. 'mb-1 text-xl' giver margin-bottom og en skriftstørrelse på 20px. */}
        <CardTitle className="mb-1 text-xl">{title}</CardTitle>
        {/* CardDescription viser datoen. 'mb-1' giver margin-bottom. */}
        <CardDescription className="mb-1">{date}</CardDescription>
        {/* CardDescription viser et fast tidspunkt "17.00". */}
        <CardDescription>{"17.00"}</CardDescription>
      </CardHeader>
      {/* CardContent indeholder hovedindholdet af kortet. */}
      {/* 'p-4 pt-0' giver padding, men fjerner top-padding. */}
      <CardContent className="p-4 pt-0">
        {/* Viser lokationens navn. */}
        <p className="">{location.name}</p>
        {/* Viser adressen med margin-bottom. */}
        <p className="mb-4">{address}</p>
        {/* Viser beskrivelsen med margin-bottom. */}
        <p className="mb-2">{description}</p>
      </CardContent>
      {/* CardFooter bruges til handlinger eller yderligere information nederst på kortet. */}
      {/* Klassen justeres dynamisk baseret på 'isDashboardPage' prop'en. */}
      {/* Hvis 'isDashboardPage' er sand: flex-col (elementer stables vertikalt), items-start (venstrejusteret), gap-2. */}
      {/* Ellers: flex-row (elementer side om side), items-center (centreret vertikalt), justify-between (fordelt med plads imellem). */}
      <CardFooter
        className={`flex items-center justify-between p-4 ${
          isDashboardPage
            ? "flex-col items-start gap-2"
            : "flex-row items-center justify-between"
        }`}
      >
        {/* Betinget rendering af knapper baseret på 'isDashboardPage'. */}
        {/* Hvis IKKE dashboard-side, vises 'ReadMore' komponenten. */}
        {!isDashboardPage ? (
          <ReadMore id={id} isHome={false} /> // 'id' sendes til link/datahentning, 'isHome' bruges sandsynligvis til yderligere betinget logik.
        ) : (
          // Hvis det ER dashboard-siden, vises 'EditDelete' komponenten.
          <EditDelete id={id} /> // 'id' sendes til redigerings/sletningsfunktioner.
        )}
      </CardFooter>
    </Card>
  );
};

export default EventItemText; // Eksporterer komponenten til brug andre steder i applikationen.
