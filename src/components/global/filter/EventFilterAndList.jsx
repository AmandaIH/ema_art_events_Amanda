"use client";

import EventFilterDropdown from "./EventFilterDropdown";
import EventGallery from "../EventGallery";

export default function EventFilterAndList({
  initialEvents,
  availableDates,
  availableLocations,
  data,
  //Fra visitor site
  selectedDateValue,
  selectedLocationValue,
}) {
  return (
    <>
      <aside className="flex flex-row items-center gap-4 px-2 py-1 mb-8">
        <EventFilterDropdown
          name="date"
          label={{ singular: "Dato", plural: "Datoer" }}
          items={availableDates}
          onValueChange={(value) => handleFilterSelection(value, "date")}
          selectedValue={selectedDateValue}
        />
        <EventFilterDropdown
          name="locationId"
          label={{ singular: "Lokation", plural: "Lokationer" }}
          items={availableLocations}
          onValueChange={(value) => handleFilterSelection(value, "locationId")}
          selectedValue={selectedLocationValue}
        />
      </aside>

      <EventGallery
        isDashboardPage={true}
        dataevent={initialEvents}
        // displayedEvents={filterState.data}
        availableLocations={availableLocations}
      />
    </>
  );
}
