import { getArtworkByEventID } from "@/lib/api"; // Importerer en funktion til at hente kunstværksdata baseret på et event-ID.
import Image from "next/image"; // Importerer Next.js' optimerede Image-komponent for billedhåndtering.
import EventItemText from "./EventItemText"; // Importerer EventItemText-komponenten, som håndterer event-tekstdetaljerne.

// EventItem er en asynkron funktionel komponent.
// 'async' er vigtigt her, da den udfører en asynkron datahentning med 'await getArtworkByEventID'.
const EventItem = async ({
  id, // Eventets unikke ID.
  title, // Eventets titel.
  description, // Eventets beskrivelse.
  date, // Eventets dato.
  location, // Lokationsobjekt for eventet.
  address, // Adressen for eventet.
  totalTickets, // Totale antal billetter til eventet.
  bookedTickets, // Antal bookede billetter til eventet.
  artworkIds, // En array af IDs for kunstværker associeret med eventet (vi bruger den første).
  isDashboardPage, // Boolean, der angiver om kortet vises på dashboard-siden.
}) => {
  // Henter data for det første kunstværk i 'artworkIds' array'en.
  // Bruger await, da 'getArtworkByEventID' er en asynkron funktion.
  const { image_thumbnail, image_width, image_height, suggested_bg_color } =
    await getArtworkByEventID(artworkIds[0]);

  return (
    // <article> er et semantisk HTML5-element, der repræsenterer et uafhængigt, selvstændigt indholdsstykke (som et blogindlæg, nyhedsartikel eller, i dette tilfælde, et event-kort).
    // Klasserne bruger Tailwind CSS's "@container"-queries (f.eks. `@max-[474px]:grid-cols-1`)
    // Dette gør kortet responsivt:
    // - Under 475px bredde: Grid med 1 kolonne og auto-højde rækker (stakker elementerne vertikalt).
    // - Over 475px bredde: Grid med 2 kolonner og 1 række (placerer elementerne side om side).
    <article className="grid @max-[474px]:grid-cols-1 @max-[474px]:grid-rows-auto @min-[475px]:grid-cols-2 @min-[475px]:grid-rows-1 ">
      {/* <figure> er et semantisk HTML5-element, der bruges til selvstændigt indhold, der typisk refereres til fra hovedteksten.
          Her bruges det til billeddelen af kortet. */}
      {/* 'max-w-[210px] h-[325px]' sætter maksimale dimensioner for figuren. */}
      {/* 'md:col-1' placerer figuren i den første kolonne på medium skærme og op. */}
      {/* Internt grid: 1 kolonne, 3 rækker, bruges til at overlappe billedet med en farvet baggrund. */}
      <figure className="max-w-[210px] h-[325px] md:col-1 grid grid-cols-1 grid-rows-3 ">
        {/* Dette <div> skaber en farvet baggrund/pladsholder bag billedet. */}
        {/* 'max-w-[180px] h-[250px] rounded-sm' sætter dimensioner og afrundede hjørner. */}
        {/* 'row-span-2 row-start-1 col-start-1' placerer det i grid'et og får det til at strække sig over 2 rækker. */}
        {/* Den dynamiske baggrundsfarve kommer fra kunstværksdata, falder tilbage til grå (#CCCCCC) hvis ingen farve er foreslået. */}
        <div
          className={`max-w-[180px] h-[250px] rounded-sm row-span-2 row-start-1 col-start-1`}
          style={{
            backgroundColor: suggested_bg_color?.[0] || "#CCCCCC", // Bruger den første foreslåede baggrundsfarve eller standard grå.
          }}
        ></div>

        {/* Dette <div> indeholder selve kunstværksbilledet. */}
        {/* 'max-w-[180px] h-[250px] col-1' dimensioner og kolonneplacering. */}
        {/* 'row-start-2 row-span-2 self-end justify-self-end' placerer og justerer billedet inden for figurens grid,
            så det overlapper den farvede baggrund. 'self-end' justerer det til bunden af rækken,
            'justify-self-end' justerer det til højre i kolonnen. */}
        <div className=" max-w-[180px] h-[250px] col-1 row-start-2 row-span-2 self-end justify-self-end rounded-lg">
          {/* Next.js Image-komponent for optimeret billedgengivelse. */}
          <Image
            src={image_thumbnail} // Stien til billedet.
            alt={title || "Event billede"} // Alternativ tekst for tilgængelighed.
            width={image_width} // Billedets originale bredde.
            height={image_height} // Billedets originale højde.
            className=" h-full object-cover rounded-lg" // 'h-full' får billedet til at fylde 100% af sin forælderhøjde.
            // 'object-cover' sikrer, at billedet dækker området uden at blive strakt.
            // 'rounded-lg' giver afrundede hjørner.
            priority={false} // Angiver, at billedet ikke er højeste prioritet for indlæsning (kan optimeres for performance).
          />
        </div>
      </figure>

      {/* Inkluderer EventItemText-komponenten for at vise tekstinformationen om eventet. */}
      {/* Alle relevante props fra EventItem videregives til EventItemText. */}
      <EventItemText
        id={id}
        title={title}
        description={description}
        date={date}
        location={location}
        address={address}
        totalTickets={totalTickets}
        bookedTickets={bookedTickets}
        isDashboardPage={isDashboardPage}
      ></EventItemText>
    </article>
  );
};

export default EventItem; // Eksporterer EventItem-komponenten.
