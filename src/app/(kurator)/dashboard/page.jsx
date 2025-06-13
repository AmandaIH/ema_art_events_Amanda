import {
  getEvent,
  getEventDates,
  getEventLocations,
  getSMKFilterCat,
} from "@/lib/api";
import EventGallery from "@/components/global/EventGallery";
import EventFilterDropdown from "@/components/global/filter/EventFilterDropdown";

export default async function Dashboard() {
  // Modtag searchparams
  // brug searchParamsne til at lave en ny fetch request med filtreret data der matcher searchParams
  // Done

  //Til Content
  const eventsData = await getEvent();

  // console.log("initialEvents", initialEvents);
  // const pathname = usePathname();
  // const [filterState, formAction, isFiltering] = useActionState(filterEvents, {
  //   active: [],
  //   data: data,
  //   totalFound: initialEvents.length,
  // });

  // const handleFilterSelection = (value, name) => {
  //   let currentFilters = filterState.active.filter(
  //     (f) => !f.startsWith(`${name}:`)
  //   );
  //   let newFilters = [...currentFilters];

  //   if (value !== "all") {
  //     newFilters.push(`${name}:${value}`);
  //   }

  //   startTransition(() => {
  //     formAction(newFilters);
  //   });
  // };

  // const selectedDateValue =
  //   filterState.active.find((f) => f.startsWith("date:"))?.split(":")[1] ||
  //   "all";
  // const selectedLocationValue =
  //   filterState.active
  //     .find((f) => f.startsWith("locationId:"))
  //     ?.split(":")[1] || "all";
  // console.log(
  //   "EventFilterandList",
  //   "filterState",
  //   filterState,
  //   "initialEvents.filterState.data",
  //   initialEvents.filterState
  // );

  return (
    <main>
      <Filter />
      <EventGallery
        data={eventsData}
        // displayedEvents={filterState.data}
        // availableLocations={availableLocations}
      />
    </main>
  );
}

async function Filter() {
  const dates = await getEventDates();
  const locations = await getEventLocations();

  const dateFilterData = {
    name: "dato",
    label: { singular: "Dato", plural: "Datoer" },
    items: dates.toSorted(),
  };
  const locationFilterData = {
    name: "lokation",
    label: { singular: "Lokation", plural: "Lokationer" },
    items: locations.toSorted(),
  };

  // Omkrans dropdown-komponenterne med en form, hvor action="/dashboard?"
  return (
    <form
      action="/dashboard"
      className="flex flex-row items-center gap-4 px-2 py-1 mb-8"
    >
      <EventFilterDropdown {...dateFilterData} />
      <EventFilterDropdown {...locationFilterData} />
    </form>
  );

  // Tilbage til page ->
  // return (
  //   <aside className="flex flex-row items-center gap-4 px-2 py-1 mb-8">
  //     <EventFilterDropdown
  //       name="date"
  //       label={{ singular: "Dato", plural: "Datoer" }}
  //       items={availableDates}
  //       onValueChange={(value) => handleFilterSelection(value, "date")}
  //       selectedValue={selectedDateValue}
  //     />
  //     <EventFilterDropdown
  //       name="locationId"
  //       label={{ singular: "Lokation", plural: "Lokationer" }}
  //       items={availableLocations}
  //       onValueChange={(value) => handleFilterSelection(value, "locationId")}
  //       selectedValue={selectedLocationValue}
  //     />
  //     {isFiltering && <p className="ml-4 text-blue-600">Indlæser events...</p>}
  //   </aside>
  // );
}
