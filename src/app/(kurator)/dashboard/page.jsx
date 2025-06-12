import {
  getEventDates,
  getEventLocations,
  getAllArtworksDataPrevent,
} from "@/lib/api";

import EventFilterAndList from "@/components/global/filter/EventFilterAndList";

export default async function Dashboard() {
  const eventsDates = await getEventDates();
  const eventsLocations = await getEventLocations();
  const eventDataWithArtworks = await getAllArtworksDataPrevent();

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
