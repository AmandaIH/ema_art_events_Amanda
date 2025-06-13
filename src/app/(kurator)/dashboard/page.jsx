import {
  getAllArtworksByEventID,
  getEvent,
  getEventDates,
  getEventLocations,
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
      console.log("page: ", event);
      const artImages = await getAllArtworksByEventID(event.artworkIds);
      return {
        id: event.id,
        title: event.title,
        date: event.date,
        bookedTickets: event.bookedTickets,
        location: event.location?.name,
        address: event.location?.address,
        description: event.description,
        totalTickets: event.location?.maxGuests,
        artImgs: artImages, // <-- an object with `.items`, likely
      };
    })
  );
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
