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
  isDashboardPage,
}) => {
  const { image_thumbnail, image_width, image_height, suggested_bg_color } =
    await getArtworkByEventID(artworkIds[0]);

  return (
    <article className="grid grid-cols-1 grid-rows-auto md:grid-cols-2 md:grid-rows-1 gap-(--space-2rem)">
      <figure className="md:col-1 grid grid-cols-6 grid-rows-6  @max-[1020px]:justify-self-end ">
        <div
          className={`rounded-sm row-start-1 -row-end-2 col-start-1 -col-end-2 w-full justify-self-center `}
          style={{
            backgroundColor: suggested_bg_color?.[0] || "#CCCCCC",
          }}
        ></div>

        <div className=" col-start-2 -col-end-1 row-start-2 -row-end-1 self-end justify-self-end rounded-lg h-[250px] ">
          <Image
            src={image_thumbnail}
            alt={title || "Event billede"}
            // height={image_height}
            // width={image_width}
            height={500}
            width={500}
            className=" h-full object-cover rounded-lg"
            priority={true}
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
        isDashboardPage={isDashboardPage}
      ></EventItemText>
    </article>
  );
};

export default EventItem;
