import {
  getAllArtworksByEventID,
  getEvent,
  getEventDates,
  getEventLocations,
  getNeededArtworkDataPrEvent,
} from "@/lib/api";

import EventFilterAndList from "@/components/global/filter/EventFilterAndList";

export default async function Dashboard() {
  //Til Filter
  const eventsDates = await getEventDates();
  const eventsLocations = await getEventLocations();

  //Til Content
  const eventsData = await getEvent();

  const eventDataWithArtworks = await Promise.all(
    eventsData.map(async (event) => {
      const imageData = await getAllArtworksByEventID(event.artworkIds);
      return [[event], [imageData]];
    })
  );

  const noget = await getNeededArtworkDataPrEvent();
  console.log("combinedArray", eventDataWithArtworks, "noget", noget);
  return (
    <main>
      <EventFilterAndList
        initialEvents={eventDataWithArtworks}
        availableDates={eventsDates}
        availableLocations={eventsLocations}
      />
    </main>
  );
}
