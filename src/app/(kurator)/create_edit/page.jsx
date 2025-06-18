import KuratorForm from "@/components/kurator_create_edit/KuratorForm";

import {
  getEvent,
  getEventId,
  getEventLocations,
  getSMKImg,
  getSMKFilterCat,
  getArtworkByEventID,
} from "@/lib/api";

export default async function CreateEditEventPage({ searchParams }) {
  // Henter alle billeder fra SMK API. Dette er data, der potentielt kan bruges i formularen
  // til at vælge billeder til et event.
  const initialImagesData = await getSMKImg();
  // Sikrer, at 'images' altid er et array, selvom 'initialImagesData.items' skulle være null/undefined.
  const images = initialImagesData.items || [];

  // Henter alle eksisterende events. Dette kunne bruges til validering eller referencer.
  const events = await getEvent();
  // Henter alle tilgængelige lokationer for events. Dette bruges sandsynligvis til en dropdown i formularen.
  const locations = await getEventLocations();

  const { eventId } = searchParams; // searchParams er allerede et objekt, behøver ikke 'await'.
  let prevData = null; // Variabel til at holde eksisterende eventdata, hvis vi er i redigeringstilstand.
  let prevSelectedArtworkDetails = []; // Variabel til at holde detaljer om kunstværker, der allerede er knyttet til eventet.

  // 3. Logik for redigeringstilstand.
  // Hvis 'eventId' er til stede, betyder det, at vi skal redigere et eksisterende event.
  if (eventId) {
    // Henter alle detaljer for det eksisterende event fra API'en.
    prevData = await getEventId(eventId);

    // <-- NY LOGIK: Henter detaljer for de kunstværker, der allerede er tilknyttet dette event.
    // Denne del er vigtig for at forudfylde formularen med de korrekte billeder i redigeringstilstand.
    if (prevData && prevData.artworkIds && prevData.artworkIds.length > 0) {
      // Brug Promise.all for at hente detaljer for alle kunstværker parallelt.
      // Dette er meget mere effektivt end at hente dem en efter en (sekventielt).
      prevSelectedArtworkDetails = await Promise.all(
        prevData.artworkIds.map(async (objectNumber) => {
          try {
            // Forsøger at hente detaljer for det specifikke kunstværk.
            return await getArtworkByEventID(objectNumber);
          } catch (error) {
            // Fejlhåndtering: Hvis hentningen af et kunstværk fejler.
            console.error(
              `Fejl ved hentning af billeddetaljer for ${objectNumber}:`,
              error
            );
            return null; // Returnerer null, så vi kan filtrere det fra senere.
          }
        })
      );
      // Filtrer eventuelle null-værdier fra (dvs. de kunstværker, hvis hentning fejlede).
      prevSelectedArtworkDetails = prevSelectedArtworkDetails.filter(Boolean);
    }
  }

  // Henter filterkategorier for SMK billederne. Bruges til at filtrere billedvalget i formularen.
  const filterCategories = await getSMKFilterCat();

  // 4. Returnerer JSX'en for siden.
  // 'main' elementet indeholder sidens primære indhold.
  return (
    <main>
      {/* Overskrift for siden. Tekst- og styling-klasser fra Tailwind CSS. */}
      <h1 className="text-blue-500 justify-self-center p-4">
        Opret/rediger begivenhed
      </h1>
      {/* KuratorForm-komponenten: Dette er selve formularen.
          Den modtager alle de data, der er hentet på serveren, som props.
          Fordi KuratorForm sandsynligvis indeholder interaktive elementer (inputfelter, billedvælgere),
          vil det typisk være en "Client Component" (markeret med "use client" inde i dens egen fil).
          Server Komponenter (denne fil) kan problemfrit sende data til Client Komponenter via props.
      */}
      <KuratorForm
        images={images} // Alle SMK billeder til at vælge imellem.
        events={events} // Eksisterende events (muligvis til validering).
        locations={locations} // Tilgængelige event-lokationer.
        prevData={prevData} // Eksisterende eventdata (hvis vi redigerer).
        filterCategories={filterCategories} // Kategorier til at filtrere SMK billeder.
        prevSelectedArtworkDetails={prevSelectedArtworkDetails} // Detaljer om forvalgte kunstværker, hvis redigering.
      />
    </main>
  );
}
