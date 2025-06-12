import {
  getEvent,
  getArtworkByEventID,
  getEventDates,
  getEventLocations,
  getSMKFilterCat,
} from "@/lib/api";

import EventFilterAndList from "@/components/global/filter/EventFilterAndList";

export default async function Dashboard() {
  const eventListRaw = await getEvent();
  const eventsDates = await getEventDates();
  const eventsLocations = await getEventLocations();
  const categories = await getSMKFilterCat();

  const eventListWithArtwork = await Promise.all(
    eventListRaw.map(async (event) => {
      let artImgsData = [];

      if (event.artworkIds && event.artworkIds.length > 0) {
        artImgsData = await Promise.all(
          event.artworkIds.map(async (artworkId) => {
            try {
              const imgData = await getArtworkByEventID(artworkId);
              return imgData;
            } catch (error) {
              console.error(
                `Fejl ved hentning af billede med ID ${artworkId}:`,
                error
              );
              return null;
            }
          })
        );
        artImgsData = artImgsData.filter((img) => img !== null);
      }

      return {
        ...event,
        artImgs: artImgsData,
      };
    })
  );
  console.log("dashboard: ", eventListWithArtwork);
  return (
    <main>
      <EventFilterAndList
        initialEvents={eventListWithArtwork}
        availableDates={eventsDates}
        availableLocations={eventsLocations}
      />
    </main>
  );
}
