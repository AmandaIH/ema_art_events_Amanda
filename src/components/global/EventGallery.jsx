// import CustomButton from "./CustomButton";
import React from "react";
import EventItem from "./EventItem";
// import Link from "next/link";

const EventGallery = ({ data }) => {
  // const pathname = usePathname();
  // const isDashboardPage = pathname === "/dashboard";

  return (
    <div className="@container">
      <section className="grid grid-cols-1 grid-rows-auto @min-[775px]:grid-cols-2 gap-(--space-4rem)">
        {!data ? (
          <p className="text-gray-500 text-center col-span-full">
            Ingen events matcher dine filtre.
          </p>
        ) : (
          data.map((event, id) => {
            return (
              <EventItem key={id} {...event}>
                {/* {isDashboardPage && (
                  <div className="mt-4 flex gap-2">
                    <Link href={`/create_edit?eventId=${dataevent.id}`}>
                      <CustomButton text="Rediger" />
                    </Link>
                  </div>
                )} */}
              </EventItem>
            );
          })
        )}
        {/* {displayedEvents.length > 0 ? (
          displayedEvents.map((dataevent) => {
            const locationName =
              availableLocations.find((loc) => loc.id === dataevent.locationId)
                ?.name || "Ukendt lokation";
            return (
              <EventItem
                key={dataevent.id}
                title={dataevent.title}
                description={dataevent.description}
                date={dataevent.date}
                locationName={locationName}
                address={dataevent.address}
                totalTickets={dataevent.totalTickets}
                bookedTickets={dataevent.bookedTickets}
                artImgs={dataevent.artImgs}
                showTicketCounter={true}
              >
                {isDashboardPage && (
                  <div className="mt-4 flex gap-2">
                    <Link href={`/create_edit?eventId=${dataevent.id}`}>
                      <CustomButton text="Rediger" />
                    </Link>
                  </div>
                )}
              </EventItem>
            );
          })
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            Ingen events matcher dine filtre.
          </p>
        )} */}
      </section>
    </div>
  );
};

export default EventGallery;
