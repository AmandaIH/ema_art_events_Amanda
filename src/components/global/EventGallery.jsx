import React from "react";
import EventItem from "./EventItem";
import Link from "next/link";
import CustomButton from "./CustomButton";

const EventGallery = ({ data, isDashboardPage }) => {
  return (
    <div className="@container">
      <section className="grid grid-cols-1 grid-rows-auto @min-[775px]:grid-cols-2 gap-(--space-4rem)">
        {data.length == 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            Ingen events matcher dine filtres.
          </p>
        ) : (
          data.map((event, id) => {
            return (
              <EventItem key={id} {...event} isDashboardPage={isDashboardPage}>
                <div className="mt-4 flex gap-2">
                  <Link href={`/create_edit?eventId=${event.id}`}>
                    <CustomButton text="Rediger" />
                  </Link>
                </div>
              </EventItem>
            );
          })
        )}
      </section>
    </div>
  );
};

export default EventGallery;
