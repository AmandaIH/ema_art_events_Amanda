import Image from "next/image";
import CustomButton from "../components/global/CustomButton";

import ReadMore from "@/components/global/ReadMore";
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

      <main className="relative z-10 grid grid-cols-2 grid-rows-2 w-full">
        <div className="bg-black opacity-90 col-start-1 col-end-2 row-start-1 row-end-3 grid grid-cols-[2fr_1fr] grid-rows-1 max-w-[500px] h-full">
          <section className="col-start-1 col-end-2 row-start-2 row-end-3 z-4 text-white pl-4 pb-4">
            <h2 className="mb-4 mt-20">Lys og mørke</h2>
            <h3>d. 05.05.2025</h3>
            <p className="mt-4 mb-4">
              En udstilling der udforsker abstrakte kunstformer gennem
              forskellige medier.
            </p>
            <ReadMore isHome={true} />

            <CustomButton
              className="text-md h-fit w-fit col-start-1 row-start-4 mt-16"
              text="Se alle begivenheder"
              link="/events"
            />
          </section>
        </div>
        <div className="col-start-1 col-end-3 row-start-1 place-self-center z-3 mb-8">
          <h1 className="h-fit bg-white opacity-90 text-blue-500 rounded-md text-text-h1 p-4 ">
            Statens Museum for Kunst
          </h1>
          <p className="text-white bg-blue-500 opacity-90 rounded-md p-2 w-fit mt-2">
            Udforsk kunst, begivenheder og oplevelser på Statens Museum for
            Kunst.
          </p>
        </div>
      </main>
    </>
  );
}
