import {
  getArtworkByEventID,
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

  // const eventData = await getEvent();
  // let artImgsPrEvent = [];
  // let artWorkData = [];
  // eventData.map(async (event) => {
  //   console.log("dashboard: ", event);
  //    artImgsPrEvent = await Promise.all(
  //      event.artworksIds.map(async (object_number) => {
  //        artWorkData = await getArtworkByEventID(object_number);
  //      })
  //    );
  // });

  const eventDataWithArtworks = await getNeededArtworkDataPrEvent();
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
