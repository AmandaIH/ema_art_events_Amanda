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
  const initialImagesData = await getSMKImg(); // Henter alle SMK billeder
  const images = initialImagesData.items || []; // Sikrer, at 'images' er et array

  const events = await getEvent(); // Henter alle events
  const locations = await getEventLocations(); // Henter lokationer
  const { eventId } = await searchParams; // Fanger eventId fra URL'en for redigering
  let prevData = null;
  let prevSelectedArtworkDetails = [];

  if (eventId) {
    prevData = await getEventId(eventId); // Henter eksisterende eventdata
    // <-- NY LOGIK: Hent detaljer for forvalgte billeder, hvis eventId findes
    if (prevData && prevData.artworkIds && prevData.artworkIds.length > 0) {
      // Brug Promise.all for parallel hentning for bedre performance
      prevSelectedArtworkDetails = await Promise.all(
        prevData.artworkIds.map(async (objectNumber) => {
          try {
            return await getArtworkByEventID(objectNumber);
          } catch (error) {
            console.error(
              `Fejl ved hentning af billeddetaljer for ${objectNumber}:`,
              error
            );
            return null; // Returner null ved fejl, filtreres senere
          }
        })
      );
      // Filtrer eventuelle null-værdier fra, hvis en hentning fejlede
      prevSelectedArtworkDetails = prevSelectedArtworkDetails.filter(Boolean);
    }
  }

  const filterCategories = await getSMKFilterCat();

  return (
    <main>
      <h1 className="text-blue-500 justify-self-center p-4">
        Opret/rediger begivenhed
      </h1>
      <KuratorForm
        images={images}
        events={events}
        locations={locations}
        prevData={prevData}
        filterCategories={filterCategories}
        prevSelectedArtworkDetails={prevSelectedArtworkDetails}
      />
    </main>
  );
}
