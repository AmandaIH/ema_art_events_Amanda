"use client";

import Image from "next/image";
import Placeholder from "@/app/assets/img/placeholder.png";
import EventItemText from "./EventItemText";

const EventItem = (dataevent) => {
  const artImgs = dataevent.artImgs;

  const primaryArtImg = artImgs && artImgs.length > 0 ? artImgs[0] : null;

  const imageUrl = primaryArtImg?.image_thumbnail || Placeholder.src;

  return (
    <article className="grid @max-[474px]:grid-cols-1 @max-[474px]:grid-rows-auto @min-[475px]:grid-cols-2 @min-[475px]:grid-rows-1">
      <figure className="max-w-[210px] h-[325px] md:col-1 grid grid-cols-1 grid-rows-3 ">
        <div
          className={`max-w-[180px] h-[250px] rounded-sm row-span-2 row-start-1 col-start-1`}
          style={{
            backgroundColor:
              primaryArtImg?.suggested_bg_color?.[0] || "#CCCCCC",
          }}
        ></div>

        <div className=" max-w-[180px] h-[250px] col-1 row-start-2 row-span-2 self-end justify-self-end rounded-lg">
          <Image
            src={imageUrl}
            alt={primaryArtImg?.title || dataevent.title || "Event billede"}
            width={500}
            height={500}
            className=" h-full object-cover rounded-lg"
            priority={false}
          />
        </div>
      </figure>

      <EventItemText
        {...dataevent}
        totalTickets={dataevent.location?.maxGuests}
        bookedTickets={dataevent.bookedTickets}
        artImg={primaryArtImg}
      ></EventItemText>
    </article>
  );
};

export default EventItem;
