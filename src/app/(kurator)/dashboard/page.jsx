import { getEvent, getEventDates, getEventLocations } from "@/lib/api";
import EventGallery from "@/components/global/EventGallery";
import EventFilterDropdown from "@/components/global/filter/EventFilterDropdown";

export default async function Dashboard({ searchParams }) {
  const { dato, lokation } = await searchParams;
  console.log("date før", dato);

  const eventsData = await getEvent();

  const data =
    dato && dato !== "all" && lokation && dato !== "all"
      ? eventsData.filter(
          (event) => event.date === dato && event.location.name === lokation
        )
      : (dato && dato !== "all") || (lokation && dato !== "all")
      ? eventsData.filter(
          (event) => event.date === dato || event.location.name === lokation
        )
      : eventsData;

  return (
    <main>
      <Filter activeDate={dato} activeLocation={lokation} />
      <EventGallery data={data} />
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
      action="/dashboard"
      className="flex flex-row items-center gap-4 px-2 py-1 mb-8"
    >
      {filterData.map((filter, id) => {
        return <EventFilterDropdown key={id} {...filter} />;
      })}
      <button>Submit</button>
    </form>
  );
}
