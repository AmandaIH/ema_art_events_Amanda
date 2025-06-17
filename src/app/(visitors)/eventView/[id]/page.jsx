// src/app/eventView/page.jsx
// Denne fil definerer EventView-siden, som viser detaljer om et specifikt event.
// Den er designet som en "Server Komponent", hvilket er standardadfærd for filer i 'app' mappen i Next.js.
// Dette betyder, at dens kode kører på serveren, før HTML'en sendes til brugerens browser,
// hvilket muliggør direkte datahentning fra en database eller API uden klient-side kald (f.eks. fetch i useEffect).

import OpacityTextBox from "@/components/global/OpacityTextBox"; // Komponent til at vise tekst i en transparent boks.
import TicketCounter from "@/components/global/TicketCounter"; // Klient-komponent, der håndterer valg af billetter og tilføjelse til kurv.
import { getEventId, getArtworkByEventID } from "@/lib/api"; // Funktioner til datahentning fra din API. Disse kører på serveren.
import Placeholder from "@/app/assets/img/placeholder.png"; // Importerer et standard placeholder-billede, hvis et kunstværks billede mangler.
import Gallery from "@/components/eventView/Gallery"; // Komponent til at vise en samling af kunstværker i et galleri.
import CustomButton from "@/components/global/CustomButton"; // Din tilpassede knapkomponent (som kan være en Client Komponent).

// Hovedkomponenten for EventView-siden. Den er en 'async' funktion, hvilket er typisk for Server Komponenter,
// da de ofte udfører asynkrone datahentningsoperationer.
// 'params' og 'searchParams' er specielle props i Next.js App Router.
// - 'params': Bruges til dynamiske segmenter i URL'en (f.eks. [id] i '/events/[id]'). Antages her at være event-ID'et.
// - 'searchParams': Bruges til URL query-parametre (f.eks. ?backgroundArtworkId=abc).
export default async function EventView({ params, searchParams }) {
  // Destrukturerer 'id' fra 'params'. Dette 'id' er sandsynligvis event-ID'et.
  const { id } = params; // Du havde 'await params', men 'params' er et objekt, der allerede er klar, ikke et Promise.

  // Destrukturerer 'backgroundArtworkId' fra 'searchParams'.
  // Dette bruges til at specificere, hvilket kunstværk der skal bruges som baggrundsbillede for siden.
  const { backgroundArtworkId } = searchParams; // Du havde 'await searchParams', men 'searchParams' er et objekt, der allerede er klar.

  // Henter eventdetaljer fra API'en baseret på event-ID'et. Dette sker på serveren.
  const dataeventid = await getEventId(id);

  // Fejlhåndtering: Hvis eventet ikke blev fundet (f.eks. ugyldigt ID).
  if (!dataeventid) {
    return (
      <div className="event-view-background w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Eventet blev ikke fundet.</p>
      </div>
    );
  }

  // Initialiserer en tom array til at gemme detaljer om kunstværkerne.
  let allArtworkDetails = [];
  // Tjekker om eventet har tilknyttede kunstværk-ID'er.
  if (dataeventid.artworkIds && dataeventid.artworkIds.length > 0) {
    // Hvis der er kunstværk-ID'er, hentes detaljer for hvert kunstværk parallelt.
    // 'Promise.all' venter på, at alle asynkrone 'getArtworkByEventID' kald er færdige.
    allArtworkDetails = await Promise.all(
      dataeventid.artworkIds.map(async (artworkId) => {
        // Henter detaljer for et specifikt kunstværk.
        const artwork = await getArtworkByEventID(artworkId);

        // Returnerer et objekt med de relevante detaljer for hvert kunstværk.
        return {
          id: artworkId,
          // 'imageUrl': Bruges som det primære billede (f.eks. baggrund). Bruger thumbnail for at undgå store billeder.
          // Fallback til Placeholder.src, hvis artwork?.image_thumbnail er undefined.
          imageUrl: artwork?.image_thumbnail || Placeholder.src,
          // 'thumbnail': Bruges specifikt i galleriet, hvis du har brug for en mindre version separat.
          thumbnail: artwork?.image_thumbnail,
          // 'suggested_bg_color': Henter den foreslåede baggrundsfarve (første element i array'en, hvis den findes).
          // Fallback til en standard grå farve, hvis farven mangler.
          suggested_bg_color: artwork?.suggested_bg_color?.[0] || "#f0f0f0",
          // 'title': Henter titlen på kunstværket (første titel i array'en, hvis den findes).
          // Fallback til "Ukendt Titel", hvis titlen mangler.
          title: artwork?.titles?.[0]?.title || "Ukendt Titel",
        };
      })
    );
  }

  // Bestemmer hvilket kunstværk der skal bruges som baggrund for siden.
  let currentArtworkForBackground = null;
  // Hvis 'backgroundArtworkId' er specificeret i URL'en, forsøger vi at finde det matchende kunstværk.
  if (backgroundArtworkId) {
    currentArtworkForBackground = allArtworkDetails.find(
      (art) => art.id === backgroundArtworkId
    );
  }

  // Hvis intet specifikt kunstværk blev fundet til baggrund, og der er kunstværker tilknyttet eventet,
  // bruges det første kunstværk i listen som standard baggrund.
  if (!currentArtworkForBackground && allArtworkDetails.length > 0) {
    currentArtworkForBackground = allArtworkDetails[0];
  }

  // Formatterer eventdatoen til en dansk streng.
  const eventDate = dataeventid.date
    ? new Date(dataeventid.date).toLocaleDateString("da-DK")
    : "Ukendt dato";
  // Henter lokationsnavnet, med fallback hvis det mangler.
  const eventLocationName = dataeventid.location?.name || "Ukendt lokation";

  // Titlen for OpacityTextBox'en.
  const opacityBoxTitle = `${eventDate} - ${eventLocationName}`;
  // Indholdet for OpacityTextBox'en (eventets beskrivelse).
  const opacityBoxContent = `${dataeventid.description}`;

  // Samler eventdetaljer i et objekt, der kan sendes til TicketCounter-komponenten.
  // Dette objekt sikrer, at alle nødvendige informationer er samlet ét sted.
  const eventDetailsForCounter = {
    id: dataeventid.id,
    title: dataeventid.title,
    date: dataeventid.date,
    location: dataeventid.location,
    pricePerTicket: dataeventid.pricePerTicket || 45, // Standardpris, hvis ingen er angivet.
    description: dataeventid.description,
    time: dataeventid.time,
    totalTickets: dataeventid.location?.maxGuests, // Total antal pladser.
    bookedTickets: dataeventid.bookedTickets, // Antal allerede bookede billetter.
    artImgs: allArtworkDetails, // Alle kunstværksdetaljer (inkluderer nu imageUrl, som er thumbnail).
  };

  // Hovedreturn for komponenten, der renderes som HTML.
  return (
    // Yderste div, der fungerer som baggrund for hele siden.
    // Stylingen er in-line for dynamisk at sætte baggrundsbillede og farve.
    <div
      className="event-view-background w-full h-screen overflow-hidden"
      style={{
        // Sætter baggrundsbillede, hvis et kunstværk er valgt til baggrund, ellers "none".
        backgroundImage: currentArtworkForBackground?.imageUrl
          ? `url(${currentArtworkForBackground.imageUrl})`
          : "none",
        // Sætter baggrundsfarve, hvis foreslået, ellers en standard grå.
        backgroundColor: currentArtworkForBackground?.suggested_bg_color
          ? currentArtworkForBackground.suggested_bg_color
          : "#f0f0f0",
        backgroundSize: "cover", // Sikrer, at billedet dækker hele elementet.
        backgroundPosition: "center", // Centrerer billedet.
        backgroundRepeat: "no-repeat", // Forhindrer billedet i at gentages.
        // Tilføjer en blød overgangseffekt, når baggrundsbillede eller farve ændrer sig.
        transition:
          "background-image 0.5s ease-in-out, background-color 0.5s ease-in-out",
      }}
    >
      {/* Hovedindholdet på siden, placeret over baggrunden. */}
      {/* Bruger CSS Grid til layout for at placere elementer præcist. */}
      <main className="z-20 w-full p-6 grid lg:grid-cols-2 grid-rows-[1fr_1fr_auto] gap-4">
        {/* Eventtitel. */}
        <h1 className="text-blue-500 bg-white opacity-80 rounded-md p-4 h-fit w-fit col-start-1 col-end-3 place-self-center">
          {dataeventid.title}
        </h1>
        {/* Sektion for knap, eventbeskrivelse og billet tæller. */}
        <section className="col-start-1 row-start-2 h-full flex flex-col justify-end items-start">
          {/* Knap til at navigere tilbage til events-siden. */}
          <CustomButton
            text="Tilbage til begivenheder"
            className="text-lg text-white underline hover:bg-blue-500 mb-8"
            link="/events" // Bruges som link, da 'link' prop'en er angivet.
          />

          {/* OpacityTextBox, der viser eventdato, lokation og beskrivelse. */}
          <OpacityTextBox
            title={opacityBoxTitle} // Titel: Dato - Lokation.
            content={opacityBoxContent} // Indhold: Eventbeskrivelse.
            className="p-4 max-w-md mb-4" // Styling for boksen.
            maxContentHeightClasses="overflow-y-auto" // Gør indholdet scrollbart, hvis det er for langt.
          />

          {/* TicketCounter-komponenten, hvor brugere kan vælge antal billetter.
              Denne er en Client Komponent, da den håndterer interaktion og opdateringer af kurv-state. */}
          <TicketCounter
            eventId={dataeventid.id}
            totalTickets={dataeventid.location?.maxGuests}
            bookedTickets={dataeventid.bookedTickets}
            pricePerTicket={dataeventid.pricePerTicket || 45}
            eventDetails={eventDetailsForCounter} // Sender alle relevante eventdetaljer.
          />
        </section>

        {/* Sektion for kunstværksgalleriet. */}
        <section className="col-start-1 md:col-start-1 row-start-3 justify-self-center md:justify-self-center self-end mb-4 mr-4">
          {/* Galleri-komponenten, der viser de tilknyttede kunstværker. */}
          <Gallery galleryData={allArtworkDetails} />
        </section>
      </main>
    </div>
  );
}
