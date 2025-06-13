import { getArtworkByEventID } from "@/lib/api";
import Image from "next/image";
import EventItemText from "./EventItemText";

const EventItem = async ({
  id,
  title,
  description,
  date,
  location,
  address,
  totalTickets,
  bookedTickets,
  artworkIds,
}) => {
  const { image_thumbnail, image_width, image_height, suggested_bg_color } =
    await getArtworkByEventID(artworkIds[0]);

  return (
    <article className="grid @max-[474px]:grid-cols-1 @max-[474px]:grid-rows-auto @min-[475px]:grid-cols-2 @min-[475px]:grid-rows-1">
      <figure className="max-w-[210px] h-[325px] md:col-1 grid grid-cols-1 grid-rows-3 ">
        <div
          className={`max-w-[180px] h-[250px] rounded-sm row-span-2 row-start-1 col-start-1`}
          style={{
            backgroundColor: suggested_bg_color?.[0] || "#CCCCCC",
          }}
        ></div>

        <div className=" max-w-[180px] h-[250px] col-1 row-start-2 row-span-2 self-end justify-self-end rounded-lg">
          <Image
            src={image_thumbnail}
            alt={title || "Event billede"}
            width={image_width}
            height={image_height}
            className=" h-full object-cover rounded-lg"
            priority={false}
          />
        </div>
      </figure>

      <EventItemText
        id={id}
        title={title}
        description={description}
        date={date}
        location={location}
        address={address}
        totalTickets={totalTickets}
        bookedTickets={bookedTickets}
      ></EventItemText>
    </article>
  );
};

export default EventItem;
