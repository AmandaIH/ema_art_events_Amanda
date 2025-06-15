import Image from "next/image";
import CustomButton from "../components/global/CustomButton";
import OpacityTextBox from "../components/global/OpacityTextBox";
export default function Home() {
  const imageUrl =
    "https://iip-thumb.smk.dk/iiif/jp2/s4655m751_kks2020_3_2.tif.jp2/full/!1024,/0/default.jpg";

  return (
    <>
      <div className="home-background-wrapper relative w-full h-full">
        <Image
          src={imageUrl}
          alt="Maleri fra Statens Museum for Kunst"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <main className="relative z-10 p-4 grid grid-cols-2 grid-rows-2">
        <div className="bg-black opacity-90 col-start-1 col-end-2 row-span-full"></div>
        <h1 className="h-fit bg-white text-blue-500 rounded-md text-text-h1 p-4 col-start-1 col-end-3 row-start-1 place-self-center z-3">
          Statens Museum for Kunst
        </h1>

        <section>
          <h2>Lys og mørke</h2>
          <h3>d. 05.05.2025</h3>
          <p>
            En udstilling der udforsker abstrakte kunstformer gennem forskellige
            medier.
          </p>
        </section>

        <CustomButton
          className="text-md h-fit w-fit col-start-1 row-start-4"
          text="Se alle begivenheder"
          link="/events"
        />

        <CustomButton
          className="text-md h-fit w-fit ml-2 row-start-4"
          text="Gå til begivenhed"
          link="http://localhost:3000/eventView/82a0a6d4-a22b-4d3d-974b-f9e28078985a"
        />
      </main>
    </>
  );
}
