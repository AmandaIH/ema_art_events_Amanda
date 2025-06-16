import { getEvent, getEventDates, getEventLocations } from "@/lib/api";
import EventGallery from "@/components/global/EventGallery";
import EventFilterDropdown from "@/components/global/filter/EventFilterDropdown";
import CustomButton from "@/components/global/CustomButton";

export default async function Dashboard({ searchParams }) {
  console.log("hej");

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
      <h1 className="text-blue-500 justify-self-center p-4">
        Kurator dashboard
      </h1>
      <Filter activeDate={dato} activeLocation={lokation} />
      <EventGallery data={data} isDashboardPage={true} />
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
      <CustomButton type="submit" text="Find"></CustomButton>
    </form>
  );
}
