"use client"; // Marker denne komponent som en Client Component, nødvendigt for at bruge hooks som useState og useForm.

// Importer nødvendige ikoner fra react-icons
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Importer React hooks til tilstandsstyring, overgange og referencer
import { useState, useTransition, useRef } from "react";
// Importer useForm fra react-hook-form til formstyring og validering
import { useForm } from "react-hook-form";
// Importer Image-komponenten fra Next.js til optimeret billedhåndtering
import Image from "next/image";
// Importer useRouter fra Next.js til programmatisk navigation
import { useRouter } from "next/navigation";
// Importer useActionState (formodentlig en brugerdefineret hook eller en hook fra et bibliotek til styring af asynkrone handlinger)
import { useActionState } from "react";

// Importer Shadcn UI-komponenter til opbygning af formularen
import { Input } from "@/components/ui/input"; // Inputfeltkomponent
import { Textarea } from "@/components/ui/textarea"; // Tekstområdekomponent
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Komponenter til opbygning af formularer med react-hook-form
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Komponenter til valg-/dropdown-menuer
import { Label } from "@/components/ui/label"; // Label-komponent

// Lokale komponenter/aktiver
import Placeholder from "../../app/assets/img/placeholder.png"; // Placeholder-billede for kunstværker

// Importer filter-relaterede komponenter og serverhandlinger
import { filterData } from "@/components/global/filter/actions"; // Serverhandling til filtrering af data
import Filter from "@/components/global/filter/Filter"; // Filter UI-komponent
import CustomButton from "../global/CustomButton"; // Brugerdefineret knapkomponent

// Importer de ændrede API-kald
import { createEvent, updateEvent } from "@/lib/api";

// Definer KuratorForm funktionskomponenten
const KuratorForm = ({
  images: initialImages, // Indledende liste over billeder (kunstværker)
  locations, // Liste over tilgængelige lokationer
  prevData, // Tidligere begivenhedsdata (til redigering af en eksisterende begivenhed)
  filterCategories, // Kategorier tilgængelige for filtrering af billeder
  prevSelectedArtworkDetails, // Detaljer om tidligere valgte kunstværker (til redigering)
}) => {
  // Initialiser react-hook-form til formstyring
  const form = useForm({
    defaultValues: {
      title: prevData?.title || "", // Sæt standardtitel fra prevData eller tom streng
      date: prevData?.date || "", // Sæt standarddato fra prevData eller tom streng
      locationId: prevData?.locationId?.toString() || "", // Sæt standard lokations-ID fra prevData eller tom streng
      description: prevData?.description || "", // Sæt standardbeskrivelse fra prevData eller tom streng
    },
  });

  // Dekonstruer metoder fra form-objektet
  const { handleSubmit, control, getValues } = form;

  // Tilstand til at gemme objektnumrene for valgte billeder
  const [selectedImages, setSelectedImages] = useState(
    prevData?.artworkIds || [] // Initialiser med kunstværks-ID'er fra prevData eller et tomt array
  );

  // Tilstand til at gemme de fulde detaljer for valgte kunstværker
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(
    prevSelectedArtworkDetails || [] // Initialiser med prevSelectedArtworkDetails eller et tomt array
  );

  // useActionState til styring af asynkron filtrering af data
  const [filterState, formAction, isFiltering] = useActionState(filterData, {
    active: [], // Aktive filtre
    data: initialImages || [], // Filtrerede data (oprindeligt alle billeder)
    totalFound: initialImages?.length || 0, // Samlet antal fundne billeder
  });

  // useTransition til styring af afventende tilstande under UI-opdateringer
  const [isPending, startTransition] = useTransition();

  // Billeder, der aktuelt vises i galleriet baseret på filterState
  const displayedImages = filterState.data;

  // Tilstand til visning af fejl- og succesmeddelelser til brugeren
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Reference til formularelementet for at kunne scrolle til det
  const formRef = useRef(null);

  // PAGINERING STATES OG LOGIK
  const [currentPage, setCurrentPage] = useState(1); // Aktuel side i galleriet
  const imagesPerPage = 15; // Antal billeder, der skal vises per side

  // Filtrer først valgte billeder fra displayedImages, så de ikke vises dobbelt i galleriet
  const filteredDisplayedImages = displayedImages.filter(
    (img) => !selectedImages.includes(img.object_number)
  );

  // Beregn billeder til den aktuelle side baseret på paginering
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImagesForGallery = filteredDisplayedImages.slice(
    indexOfFirstImage,
    indexOfLastImage
  );

  // Beregn det samlede antal sider for paginering
  const totalPages = Math.ceil(filteredDisplayedImages.length / imagesPerPage);

  // Funktion til at ændre den aktuelle side
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Initialiser routeren fra Next.js til navigation
  const router = useRouter();

  // Håndterer klik på et billede i galleriet (til at vælge/afvælge det)
  const handleImageClick = (img) => {
    setSelectedImages((prevSelectedImages) => {
      // Kontrollerer om billedet allerede er valgt
      const isCurrentlySelected = prevSelectedImages.includes(
        img.object_number
      );

      let newSelectedImageIds;
      if (isCurrentlySelected) {
        // Hvis billedet allerede er valgt, fjern det fra listen
        newSelectedImageIds = prevSelectedImages.filter(
          (item) => item !== img.object_number
        );
      } else {
        // Hvis billedet ikke er valgt, tilføj det til listen
        const selectedLocation = locations.find(
          (loc) => loc.id.toString() === getValues("locationId") // Find den valgte lokation baseret på formulardata
        );

        // Validerer om antallet af valgte billeder overstiger lokationens maksimale antal
        if (
          selectedLocation &&
          selectedLocation.maxArtworks &&
          prevSelectedImages.length >= selectedLocation.maxArtworks
        ) {
          // Beholder alert her, da det er en frontend-validering for maksimale billeder
          alert(
            `Du kan kun vælge op til ${selectedLocation.maxArtworks} billeder for denne lokation.`
          );
          return prevSelectedImages; // Returner den tidligere liste af valgte billeder, da intet blev tilføjet
        }
        newSelectedImageIds = [...prevSelectedImages, img.object_number]; // Tilføj billedets objektnummer
      }

      // Opdater de fulde detaljer for valgte kunstværker
      setSelectedArtworkDetails((prevDetails) => {
        if (isCurrentlySelected) {
          // Hvis billedet blev afvalgt, fjern dets detaljer
          return prevDetails.filter(
            (detail) => detail.object_number !== img.object_number
          );
        } else {
          // Hvis billedet blev valgt, tilføj dets detaljer, hvis de ikke allerede er der
          if (
            !prevDetails.some(
              (detail) => detail.object_number === img.object_number
            )
          ) {
            return [...prevDetails, img];
          }
          return prevDetails; // Returner uændrede detaljer, hvis billedet allerede var i listen
        }
      });

      return newSelectedImageIds; // Returner den opdaterede liste af valgte billeders ID'er
    });
  };

  // Håndterer formularindsendelse
  const onSubmit = async (data) => {
    // Nulstil beskeder før et nyt submit-forsøg
    setErrorMessage(null);
    setSuccessMessage(null);

    // Opretter payload til API-kaldet
    const payload = {
      title: data.title,
      date: data.date,
      locationId: data.locationId,
      description: data.description,
      artworkIds: selectedImages, // Inkluderer de valgte kunstværks-ID'er
    };

    console.log("PAYLOAD: ", payload); // Log payload for debugging

    try {
      let response;
      if (prevData && prevData.id) {
        // Hvis prevData eksisterer og har et ID, opdateres en eksisterende begivenhed
        response = await updateEvent(prevData.id, payload);
      } else {
        // Ellers oprettes en ny begivenhed
        response = await createEvent(payload);
      }

      console.log("TEST RESPONSE: ", response); // Log API-svaret

      if (response) {
        // Hvis svaret er succesfuldt
        setSuccessMessage(
          `Eventet er ${prevData ? "opdateret" : "oprettet"} succesfuldt!` // Vis succesmeddelelse
        );
        // Scroll til toppen af formularen ved succes
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        // Forsink omdirigering til dashboardet med 3 sekunder
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        // Hvis svaret indikerer en fejl
        const errorData = await response.json(); // Forsøg at parse fejlmeddelelsen fra JSON
        console.error("Fejl ved event handling via API-rute:", errorData);
        let message = "Ukendt fejl.";
        // Tilpassede fejlmeddelelser baseret på API-svaret
        if (
          errorData.message &&
          errorData.message.includes("conflict: another event already exists")
        ) {
          message = "Der findes allerede et event på denne dato og lokation."; // Kortere tekst
        } else if (errorData.message) {
          message = errorData.message;
        }
        setErrorMessage(`Fejl: ${message}`); // Vis fejlmeddelelse
        // Scroll til toppen af formularen ved fejl
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    } catch (error) {
      // Håndterer netværksfejl eller andre uventede fejl
      console.error("Netværksfejl ved submit af event til API-rute:", error);
      setErrorMessage(
        "Netværksfejl: Kunne ikke oprette/opdatere event. Tjek din internetforbindelse." // Kortere tekst
      );
      // Scroll til toppen af formularen ved fejl
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Håndterer valg af filterkategorier
  const handleFilterSelection = (value, name) => {
    let newFilters = [];
    if (value !== "all") {
      // Hvis et specifikt filter er valgt, opret en ny filterstreng
      newFilters = [`${name}:${value}`];
    }
    // Start en overgang for at opdatere filteret asynkront
    startTransition(() => {
      formAction(newFilters); // Kalder serverhandlingen med de nye filtre
      setCurrentPage(1); // Nulstil til side 1, når filteret ændres
    });
  };

  return (
    // Form-kontekst fra react-hook-form
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)} // Tilknyt handleSubmit til onSubmit-funktionen
        className="space-y-8 p-4" // Styling for formularen
        ref={formRef} // Tilknyt referencen til formularen
      >
        {/* Viser fejlmeddelelse her med Tailwind CSS */}
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert" // Tilgængelighedsrolle for alert
          >
            <span className="block sm:inline">{errorMessage}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setErrorMessage(null)} // Tillader at lukke beskeden ved klik
            >
              {/* SVG for lukkeikon */}
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 0 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        {/* Viser succesmeddelelse her med Tailwind CSS */}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert" // Tilgængelighedsrolle for alert
          >
            <strong className="font-bold">Succes! </strong>
            <span className="block sm:inline">{successMessage}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setSuccessMessage(null)} // Tillader at lukke beskeden ved klik
            >
              {/* SVG for lukkeikon */}
              <svg
                className="fill-current h-6 w-6 text-green-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 0 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          {/* Formfelt for 'Titel' */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titel</FormLabel>
                <FormControl>
                  <Input placeholder="Begivenhedens titel" {...field} />
                </FormControl>
                <FormDescription></FormDescription>{" "}
                {/* Tom beskrivelse, kan udvides */}
                <FormMessage /> {/* Viser valideringsfejlmeddelelser */}
              </FormItem>
            )}
          />
          {/* Formfelt for 'Dato' */}
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dato</FormLabel>
                <FormControl>
                  {/* Input type="date" for datovælger */}
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription></FormDescription>{" "}
                {/* Tom beskrivelse, kan udvides */}
                <FormMessage /> {/* Viser valideringsfejlmeddelelser */}
              </FormItem>
            )}
          />
          {/* Formfelt for 'Lokation' med Select-komponent */}
          <FormField
            control={control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokation</FormLabel>
                <Select
                  onValueChange={field.onChange} // Opdater formfeltets værdi ved valg
                  defaultValue={field.value} // Sæt standardværdi
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg en lokation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Mapper igennem lokationer for at oprette SelectItem for hver */}
                    {locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id.toString()} // Værdien skal være en streng
                      >
                        {location.name} (Max billeder: {location.maxArtworks})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription></FormDescription>{" "}
                {/* Tom beskrivelse, kan udvides */}
                <FormMessage /> {/* Viser valideringsfejlmeddelelser */}
              </FormItem>
            )}
          />
        </div>
        {/* Formfelt for 'Beskrivelse' */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivelse</FormLabel>
              <FormControl>
                <Textarea placeholder="Beskrivelse af eventet" {...field} />
              </FormControl>
              <FormDescription></FormDescription>{" "}
              {/* Tom beskrivelse, kan udvides */}
              <FormMessage /> {/* Viser valideringsfejlmeddelelser */}
            </FormItem>
          )}
        />
        {/* Valgte Billeder Sektion - JUSTERET GRID KLASSER OG SIZES HER */}
        <div className="space-y-4 border p-4 rounded-lg">
          <Label className="text-lg font-semibold">Valgte Billeder</Label>
          {selectedArtworkDetails.length > 0 ? (
            // Hvis der er valgte billeder, vis dem i et responsivt grid
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {selectedArtworkDetails.map((img) => (
                <div
                  key={`selected-${img.object_number}`} // Unik nøgle for hvert element
                  onClick={() => handleImageClick(img)} // Klik for at afvælge billedet
                  className="relative aspect-square overflow-hidden rounded-md cursor-pointer ring-4 ring-blue-500 group" // Styling for valgte billeder
                >
                  <Image
                    src={img.image_thumbnail || img.image_native || Placeholder} // Brug thumbnail, native billede eller placeholder
                    alt={img.titles?.[0]?.title || "Valgt billede"} // Alternativ tekst for tilgængelighed
                    fill // Fyld forældre-div'en
                    sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px" // Billedstørrelser for responsivitet
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-50" // Billede styling og hover-effekter
                  />
                  {/* Overlay med tjekmark for valgte billeder */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  {/* Overlay for titel ved hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center text-xs px-2 break-words">
                      {img.titles?.[0]?.title || "Ukendt titel"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Hvis ingen billeder er valgt, vis en meddelelse
            <p className="text-gray-500">Ingen billeder er valgt endnu.</p>
          )}
        </div>
        {/* GALLERI SECTION MED FILTER OG PAGINERING */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">
            Filtrer billeder fra SMK
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8">
            <div className="md:col-span-1">
              {filterCategories && filterCategories.length > 0 ? (
                // Vis filterkomponenten, hvis der er filterkategorier
                <Filter data={filterCategories} fn={handleFilterSelection} />
              ) : (
                // Ellers vis en meddelelse
                <p>Ingen filterkategorier fundet.</p>
              )}
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {currentImagesForGallery.length > 0 ? (
                  // Vis billederne i galleriet, hvis der er nogen
                  currentImagesForGallery.map((img) => {
                    const isSelected = selectedImages.includes(
                      img.object_number
                    );
                    return (
                      <div
                        key={img.object_number} // Unik nøgle
                        onClick={() => handleImageClick(img)} // Klik for at vælge/afvælge billedet
                        className={`relative aspect-square overflow-hidden rounded-md cursor-pointer group // Tilføjet group-klasse
                          ${
                            isSelected
                              ? "ring-4 ring-blue-500" // Blå ring hvis valgt
                              : "opacity-75 hover:opacity-100" // Mindre opacitet og hover-effekt hvis ikke valgt
                          }
                          transition-all duration-200 ease-in-out
                          ${isSelected ? "order-first" : ""} // Valgte billeder vises først
                        `}
                      >
                        <Image
                          src={
                            img.image_thumbnail ||
                            img.image_native ||
                            Placeholder
                          }
                          alt={img.titles?.[0]?.title || "SMK billede"}
                          fill
                          sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-50"
                        />
                        {isSelected && (
                          // Overlay med tjekmark hvis billedet er valgt
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                            <span className="text-white text-3xl">✓</span>
                          </div>
                        )}
                        {/* Overlay for titel ved hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-center text-xs px-2 break-words">
                            {img.titles?.[0]?.title || "Ukendt titel"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : // Hvis ingen billeder er fundet, vis en indlæsnings- eller ingen billeder-meddelelse
                isFiltering || isPending ? (
                  <p className="md:col-span-full text-center">
                    Indlæser billeder...
                  </p>
                ) : (
                  <p className="md:col-span-full text-center text-gray-500">
                    Ingen billeder fundet med de valgte filtre.
                  </p>
                )}
              </div>
              {/* PAGINERINGSKNAPPER */}
              {totalPages > 1 && ( // Vis pagineringsknapper kun hvis der er mere end én side
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <CustomButton
                    onClick={() => paginate(currentPage - 1)} // Gå til forrige side
                    disabled={currentPage === 1 || isFiltering || isPending} // Deaktiver knap hvis på første side eller filtrering/afventer
                    variant="outline"
                    type="button"
                    text={<FaArrowLeft />} // Venstre pil ikon
                  ></CustomButton>
                  <span className="text-gray-700">
                    Side {currentPage} af {totalPages}
                  </span>
                  <CustomButton
                    onClick={() => paginate(currentPage + 1)} // Gå til næste side
                    disabled={
                      currentPage === totalPages || isFiltering || isPending
                    } // Deaktiver knap hvis på sidste side eller filtrering/afventer
                    variant="outline"
                    type="button"
                    text={<FaArrowRight />} // Højre pil ikon
                  ></CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <CustomButton
          type="submit" // Type "submit" for at indsende formularen
          text="Gem event" // Tekst på knappen
          className="w-fit text-xl" // Styling for knappen
        ></CustomButton>
      </form>
    </Form>
  );
};

export default KuratorForm; // Eksporter komponenten som standard
