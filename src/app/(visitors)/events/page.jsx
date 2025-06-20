import { getEvent, getEventDates, getEventLocations } from "@/lib/api";

// Importér den nye centrale klientkomponent til event-filtrering og liste-visning
import EventGallery from "@/components/global/EventGallery";
import EventFilterDropdown from "@/components/global/filter/EventFilterDropdown";
import CustomButton from "@/components/global/CustomButton";

export default async function Events({ searchParams }) {
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
  console.log("data: ", data);
  return (
    <main>
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
    <form action="/events" className="flex flex-col md:flex-row  gap-4 mb-8">
      {filterData.map((filter, id) => {
        return <EventFilterDropdown key={id} {...filter} />;
      })}
      <CustomButton type="submit" text="Submit"></CustomButton>
    </form>
  );
}
