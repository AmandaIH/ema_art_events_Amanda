// /app/events/page.jsx
// Vigtigt: INGEN "use client"; her. Dette er en Server Komponent.
import { getEvent, getEventDates, getEventLocations } from "@/lib/api";

// Importér den nye centrale klientkomponent til event-filtrering og liste-visning
import EventGallery from "@/components/global/EventGallery";
import EventFilterDropdown from "@/components/global/filter/EventFilterDropdown";
import CustomButton from "@/components/global/CustomButton";

export default async function Events(searchParams) {
  const { dato, lokation } = await searchParams;

  const eventsData = await getEvent();

  const data =
    dato && dato !== "all" && lokation && lokation !== "all"
      ? eventsData.filter(
          (event) => event.date === dato && event.location.name === lokation
        )
      : (dato && dato !== "all") || (lokation && lokation !== "all")
        ? eventsData.filter(
            (event) => event.date === dato || event.location.name === lokation
          )
        : eventsData;

  return (
    <main>
      <h1 className="text-blue-500 p-4 justify-self-center">
        Udforsk vores begivenheder
      </h1>
      <Filter activeDate={dato} activeLocation={lokation} />
      <EventGallery data={data} isDashboardPage={false} />
    </main>
  );
}

async function Filter({ activeDate, activeLocation }) {
  const dates = await getEventDates();
  const locations = await getEventLocations();

  const filterData = [
    {
      name: "dato",
      label: { singular: "Dato", plural: "Datoer" },
      items: dates.toSorted(),
      active: activeDate,
    },
    {
      name: "lokation",
      label: { singular: "Lokation", plural: "Lokationer" },
      items: locations.map((location) => location.name).toSorted(),
      active: activeLocation,
    },
  ];

  return (
    <form
      action="/events"
      className="flex flex-row items-center gap-4 px-2 py-1 mb-8"
    >
      {filterData.map((filter, id) => {
        return <EventFilterDropdown key={id} {...filter} />;
      })}
      <CustomButton
        type="submit"
        text="Find begivenheder"
        className="bg-blue-500"
      ></CustomButton>
    </form>
  );
}
