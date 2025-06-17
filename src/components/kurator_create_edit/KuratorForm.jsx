// Direktiv, der fortæller Next.js, at dette er en "Client Component".
// Det betyder, at koden her (JavaScript, state, effekter, event handlers)
// kører i brugerens browser. Dette er nødvendigt for interaktivitet.
"use client";

// Importerer ikoner fra 'react-icons' biblioteket.
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Importerer React Hooks for at håndtere state, overgange og referencer til DOM-elementer.
import { useState, useTransition, useRef } from "react";
// Importerer 'useForm' fra 'react-hook-form' biblioteket til formularhåndtering.
import { useForm } from "react-hook-form";
// Importerer Next.js' optimerede Image komponent.
import Image from "next/image";
// Importerer 'useRouter' hook fra Next.js for programmatisk navigation.
import { useRouter } from "next/navigation";
// Importerer 'useActionState' hook fra React (til eksperimentel brug i React 19 / Canary).
// Dette hook bruges til at håndtere state og returnere resultater fra server actions.
import { useActionState } from "react";

// Importerer Shadcn UI komponenter. Disse er præ-designede, tilgængelige
// og genanvendelige UI-komponenter til inputfelter, dropdowns, m.m.
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, // Hovedkomponent for at omvikle din formular for React Hook Form integration.
  FormControl, // Wrapper for inputfelter.
  FormDescription, // Valgfri tekst under et inputfelt.
  FormField, // Håndterer binding af inputfelter til formularstate og validering.
  FormItem, // Hovedcontainer for et enkelt formularfelt.
  FormLabel, // Label for inputfelt.
  FormMessage, // Viser valideringsfejlmeddelelser.
} from "@/components/ui/form";
import {
  Select, // Dropdown komponent.
  SelectContent, // Indhold for dropdown (liste af items).
  SelectItem, // Individuelt element i dropdown.
  SelectTrigger, // Knap der åbner dropdown.
  SelectValue, // Viser den aktuelt valgte værdi.
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Generisk label komponent.

// Lokale komponenter/assets
import Placeholder from "../../app/assets/img/placeholder.png"; // Standard billede, hvis et andet ikke kan indlæses.

// Importér filter-relaterede komponenter og actions
import { filterData } from "@/components/global/filter/actions"; // Server action til filtrering af data.
import Filter from "@/components/global/filter/Filter"; // Filter UI komponent.
import CustomButton from "../global/CustomButton"; // Brugerdefineret knap komponent.

// Importér de ændrede API-kald for at oprette og opdatere events.
import { createEvent, updateEvent } from "@/lib/api";

// KuratorForm er en Client Component, der tager flere props.
// Disse props er leveret af den overordnede Server Component (CreateEditEventPage).
const KuratorForm = ({
  images: initialImages, // Alle tilgængelige billeder fra SMK API.
  locations, // Liste over event lokationer.
  prevData, // Eksisterende event data, hvis vi er i redigeringstilstand.
  filterCategories, // Kategorier til at filtrere SMK billeder.
  prevSelectedArtworkDetails, // Detaljer om billeder, der allerede er valgt for eventet.
}) => {
  // Initialiserer 'react-hook-form' til formularhåndtering.
  // 'defaultValues' sætter de oprindelige værdier for formularfelterne.
  // Hvis 'prevData' eksisterer (redigeringstilstand), bruges dens værdier; ellers tomme strenge.
  const form = useForm({
    defaultValues: {
      title: prevData?.title || "", // Eventtitel.
      date: prevData?.date || "", // Eventdato.
      locationId: prevData?.locationId?.toString() || "", // Lokations-ID (konverteres til string, da select forventer string).
      description: prevData?.description || "", // Eventbeskrivelse.
    },
  });

  // Destrukturerer metoder fra 'form' objektet for nem adgang.
  const { handleSubmit, control, getValues } = form;

  // State til at holde ID'er (object_number) for de billeder, brugeren har valgt.
  // Initialiseres med tidligere valgte billeder, hvis i redigeringstilstand.
  const [selectedImages, setSelectedImages] = useState(
    prevData?.artworkIds || []
  );

  // State til at holde *detaljerede objekter* for de billeder, brugeren har valgt.
  // Dette er nyttigt for at vise thumbnail, titel mv. i sektionen for valgte billeder.
  // Initialiseres med data fra 'prevSelectedArtworkDetails' (leveret af Server Komponent).
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(
    prevSelectedArtworkDetails || []
  );

  // 'useActionState' Hook (React 19 / Canary):
  // Bruges til at integrere en "Server Action" (filterData) med Client Components state.
  // - filterData: Den server action, der skal kaldes.
  // - { active: [], data: initialImages || [], totalFound: initialImages?.length || 0 }: Initial state.
  // - [filterState, formAction, isFiltering]:
  //   - filterState: Den nuværende state efter at action er kørt.
  //   - formAction: En funktion, der kan sendes til en form's 'action' prop, eller kaldes direkte.
  //   - isFiltering: Boolean, der er sand, mens action kører.
  const [filterState, formAction, isFiltering] = useActionState(filterData, {
    active: [], // Aktive filtre (ikke brugt direkte her, men returneres af server action).
    data: initialImages || [], // De filtrerede billeddata.
    totalFound: initialImages?.length || 0, // Antal fundne billeder.
  });

  // 'useTransition' Hook (React):
  // Bruges til at markere state-opdateringer som "ikke-blokerende overgange".
  // Dette holder UI'et responsivt under potentielt lange opdateringer (som datafiltrering).
  // - isPending: Boolean, sand når en overgang er i gang.
  // - startTransition: Funktion til at omvikle state-opdateringer, der skal være overgange.
  const [isPending, startTransition] = useTransition();

  // Billeder, der aktuelt skal vises i galleriet, baseret på filterState.
  const displayedImages = filterState.data;

  // States til at håndtere fejl- og succesmeddelelser, der vises til brugeren.
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // useRef Hook:
  // Bruger en ref til at henvise til HTML <form> elementet.
  // Dette bruges til at scrolle siden til toppen efter submit (både succes og fejl).
  const formRef = useRef(null);

  // PAGINERING STATES OG LOGIK
  const [currentPage, setCurrentPage] = useState(1); // Nuværende side i billedgalleriet.
  const imagesPerPage = 15; // Antal billeder, der skal vises per side.

  // Filtrerer de *allerede valgte* billeder fra listen over de billeder, der skal vises.
  // Dette forhindrer, at et billede vises to gange (i valgte og i galleriet).
  const filteredDisplayedImages = displayedImages.filter(
    (img) => !selectedImages.includes(img.object_number)
  );

  // Beregner start- og slutindeks for billederne på den aktuelle side.
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  // Udtrækker de billeder, der skal vises på den aktuelle side.
  const currentImagesForGallery = filteredDisplayedImages.slice(
    indexOfFirstImage,
    indexOfLastImage
  );

  // Beregner det samlede antal sider for paginering.
  const totalPages = Math.ceil(filteredDisplayedImages.length / imagesPerPage);

  // Funktion til at ændre den aktuelle side.
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Initialiserer Next.js' router for navigation.
  const router = useRouter();

  // Event handler for når brugeren klikker på et billede i galleriet eller i valgte billeder.
  const handleImageClick = (img) => {
    // Opdaterer 'selectedImages' state.
    setSelectedImages((prevSelectedImages) => {
      // Tjekker om billedet allerede er valgt.
      const isCurrentlySelected = prevSelectedImages.includes(
        img.object_number
      );

      let newSelectedImageIds;
      if (isCurrentlySelected) {
        // Hvis billedet allerede er valgt, fjerner vi det.
        newSelectedImageIds = prevSelectedImages.filter(
          (item) => item !== img.object_number
        );
      } else {
        // Hvis billedet ikke er valgt, skal vi tjekke lokationens maksimale antal billeder.
        // Henter den valgte lokation fra formularen (via react-hook-form's getValues).
        const selectedLocation = locations.find(
          (loc) => loc.id.toString() === getValues("locationId")
        );

        // Validering: Tjekker om et maksimum antal billeder er defineret for lokationen,
        // og om det nuværende antal valgte billeder overskrider dette maksimum.
        if (
          selectedLocation &&
          selectedLocation.maxArtworks &&
          prevSelectedImages.length >= selectedLocation.maxArtworks
        ) {
          // Viser en alert (da det er en klient-side validering).
          alert(
            `Du kan kun vælge op til ${selectedLocation.maxArtworks} billeder for denne lokation.`
          );
          return prevSelectedImages; // Returnerer den uændrede liste.
        }
        // Tilføjer det nye billedes object_number til listen over valgte billeder.
        newSelectedImageIds = [...prevSelectedImages, img.object_number];
      }

      // Opdaterer 'selectedArtworkDetails' state baseret på 'selectedImages' ændring.
      setSelectedArtworkDetails((prevDetails) => {
        if (isCurrentlySelected) {
          // Hvis billedet er blevet fravalgt, fjern dets detaljer.
          return prevDetails.filter(
            (detail) => detail.object_number !== img.object_number
          );
        } else {
          // Hvis billedet er blevet valgt, tilføj dets detaljer, men kun hvis det ikke allerede er der.
          if (
            !prevDetails.some(
              (detail) => detail.object_number === img.object_number
            )
          ) {
            return [...prevDetails, img];
          }
          return prevDetails; // Returner uændret, hvis det allerede er der.
        }
      });

      return newSelectedImageIds; // Returner den opdaterede liste af billed-ID'er.
    });
  };

  // Event handler for, når formularen sendes.
  const onSubmit = async (data) => {
    // Nulstil tidligere fejl- og succesmeddelelser.
    setErrorMessage(null);
    setSuccessMessage(null);

    // Konstruer payload'en (data) der skal sendes til API'en.
    const payload = {
      title: data.title,
      date: data.date,
      locationId: data.locationId,
      description: data.description,
      artworkIds: selectedImages, // De valgte billed-ID'er.
    };

    try {
      let response;
      // Bestem om der skal oprettes eller opdateres baseret på om 'prevData' eksisterer.
      if (prevData && prevData.id) {
        // Opdaterer et eksisterende event.
        response = await updateEvent(prevData.id, payload);
      } else {
        // Opretter et nyt event.
        response = await createEvent(payload);
      }

      // Tjekker om API-kaldet var succesfuldt (HTTP status 2xx).
      if (response.ok) {
        const result = await response.json(); // Parser svaret fra API'en.

        // Sæt succesmeddelelse.
        setSuccessMessage(
          `Eventet er ${prevData ? "opdateret" : "oprettet"} succesfuldt!`
        );

        // SCROLL OG REDIRECTION LOGIK:
        // Scroll til toppen af formularen for at vise succesmeddelelsen.
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth", // Jævn scroll-animation.
            block: "start", // Justerer toppen af elementet til toppen af visningsporten.
          });
        }
        // Forsinket redirection til dashboard. Giver brugeren tid til at læse succesmeddelelsen.
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000); // 3 sekunders forsinkelse.
      } else {
        // Hvis API-kaldet ikke var succesfuldt, håndter fejl.
        const errorData = await response.json(); // Parser fejlsvaret.
        console.error("Fejl ved event handling via API-rute:", errorData); // Log fejl til konsol.

        // Konstruer fejlmeddelelse til brugeren.
        let message = "Ukendt fejl.";
        if (
          errorData.message &&
          errorData.message.includes("conflict: another event already exists")
        ) {
          message = "Der findes allerede et event på denne dato og lokation."; // Specifik fejlmeddelelse.
        } else if (errorData.message) {
          message = errorData.message; // Brug API'ens fejlmeddelelse, hvis den findes.
        }
        setErrorMessage(`Fejl: ${message}`); // Sæt fejlmeddelelse.

        // Scroll til toppen af formularen ved fejl for at vise fejlmeddelelsen.
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    } catch (error) {
      // Håndterer netværksfejl (f.eks. ingen internetforbindelse).
      console.error("Netværksfejl ved submit af event til API-rute:", error);
      setErrorMessage(
        "Netværksfejl: Kunne ikke oprette/opdatere event. Tjek din internetforbindelse."
      );
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Event handler for når en filterkategori vælges.
  const handleFilterSelection = (value, name) => {
    let newFilters = [];
    if (value !== "all") {
      // Hvis "all" ikke er valgt, opbyg filterstrengen (f.eks. "category:maleri").
      newFilters = [`${name}:${value}`];
    }
    // 'startTransition' omvikler kaldet til server action 'formAction'.
    // Dette gør filterprocessen ikke-blokerende for UI'et.
    startTransition(() => {
      formAction(newFilters); // Kalder server action for at filtrere billeder.
      setCurrentPage(1); // Nulstil pagineringen til side 1, når filtre ændres.
    });
  };

  return (
    // 'Form' komponent fra Shadcn UI, wrapper for at integrere med React Hook Form.
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)} // Håndterer formularsubmit, kalder 'onSubmit' funktionen.
        className="space-y-8 p-4" // Styling med Tailwind CSS.
        ref={formRef} // Tilknytter useRef til formularen for at kunne scrolle til den.
      >
        {/* Vis fejlmeddelelse, hvis 'errorMessage' state er sat. */}
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert" // ARIA role for at markere som et alert-besked for tilgængelighed.
          >
            <span className="block sm:inline">{errorMessage}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setErrorMessage(null)} // Gør det muligt at lukke meddelelsen.
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
        {/* Vis succesmeddelelse, hvis 'successMessage' state er sat. */}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Succes! </strong>
            <span className="block sm:inline">{successMessage}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setSuccessMessage(null)}
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
        {/* Formularfelter (Titel, Dato, Lokation, Beskrivelse) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          {/* FormField for Titel */}
          <FormField
            control={control} // Fra useForm, forbinder feltet til formularens state.
            name="title" // Navnet på feltet i formularen (f.eks. data.title).
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titel</FormLabel>
                <FormControl>
                  <Input placeholder="Begivenhedens titel" {...field} />
                </FormControl>
                <FormDescription></FormDescription>{" "}
                {/* Tom beskrivelse, kan udfyldes. */}
                <FormMessage /> {/* Viser valideringsfejl her. */}
              </FormItem>
            )}
          />
          {/* FormField for Dato */}
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dato</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                  {/* Sørg for at 'value' er en string, selvom den er tom. */}
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* FormField for Lokation (Dropdown) */}
          <FormField
            control={control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokation</FormLabel>
                <Select
                  onValueChange={field.onChange} // Opdaterer formularens state, når valg ændres.
                  defaultValue={field.value} // Sætter standardværdien.
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg en lokation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Mapper over lokationer for at skabe SelectItem for hver. */}
                    {locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id.toString()} // Værdien skal være en streng.
                      >
                        {location.name} (Max billeder: {location.maxArtworks}){" "}
                        {/* Viser navn og max billeder. */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* FormField for Beskrivelse */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivelse</FormLabel>
              <FormControl>
                <Textarea placeholder="Beskrivelse af eventet" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Valgte Billeder Sektion */}
        <div className="space-y-4 border p-4 rounded-lg">
          <Label className="text-lg font-semibold">Valgte Billeder</Label>
          {/* Betinget rendering: Hvis der er valgte billeder, vis dem. Ellers vis en besked. */}
          {selectedArtworkDetails.length > 0 ? (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {selectedArtworkDetails.map((img) => (
                <div
                  key={`selected-${img.object_number}`} // Unik nøgle for hvert valgt billede.
                  onClick={() => handleImageClick(img)} // Gør billedet klikbart for at fjerne det.
                  className="relative aspect-square overflow-hidden rounded-md cursor-pointer ring-4 ring-blue-500 group" // Stylingen indikerer "valgt".
                >
                  <Image
                    src={img.image_thumbnail || img.image_native || Placeholder} // Fallback til placeholder.
                    alt={img.titles?.[0]?.title || "Valgt billede"} // Billedets alt-tekst.
                    fill // Fyld forælder-div'en.
                    sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px" // Responsive billedstørrelser.
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-50" // Hover-effekter.
                  />
                  {/* Overlays for visuel feedback, når billedet er valgt. */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center text-xs px-2 break-words">
                      {img.titles?.[0]?.title || "Ukendt titel"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Ingen billeder er valgt endnu.</p>
          )}
        </div>
        {/* GALLERI SECTION MED FILTER OG PAGINERING */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">
            Filtrer billeder fra SMK
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8">
            {/* Filter-kolonne */}
            <div className="md:col-span-1">
              {filterCategories && filterCategories.length > 0 ? (
                // Sender filterkategorier og filterfunktionen til Filter-komponenten.
                <Filter data={filterCategories} fn={handleFilterSelection} />
              ) : (
                <p>Ingen filterkategorier fundet.</p>
              )}
            </div>
            {/* Billedgalleri-kolonne */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {/* Betinget rendering af billeder, loading-status eller ingen billeder. */}
                {currentImagesForGallery.length > 0 ? (
                  currentImagesForGallery.map((img) => {
                    // Tjekker om et billede allerede er valgt for at vise visuel feedback.
                    const isSelected = selectedImages.includes(
                      img.object_number
                    );
                    return (
                      <div
                        key={img.object_number}
                        onClick={() => handleImageClick(img)} // Gør billedet klikbart for at vælge/fravalgte.
                        className={`relative aspect-square overflow-hidden rounded-md cursor-pointer group
                          ${
                            isSelected // Dynamisk styling baseret på valgstatus.
                              ? "ring-4 ring-blue-500" // Blå ring hvis valgt.
                              : "opacity-75 hover:opacity-100" // Let falmet, men lyser op ved hover, hvis ikke valgt.
                          }
                          transition-all duration-200 ease-in-out
                          ${isSelected ? "order-first" : ""} `} // Valgte billeder vises først (kan være nyttigt, men ikke altid synligt pga. filtrering).
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
                        {/* Vis grøn "✓" hvis billedet er valgt. */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                            <span className="text-white text-3xl">✓</span>
                          </div>
                        )}
                        {/* Overlay for at vise titel ved hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-center text-xs px-2 break-words">
                            {img.titles?.[0]?.title || "Ukendt titel"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : // Hvis der ikke er billeder at vise, tjek om vi stadig filtrerer/indlæser.
                isFiltering || isPending ? (
                  <p className="md:col-span-full text-center">
                    Indlæser billeder...
                  </p>
                ) : (
                  // Hvis ingen billeder, og ingen indlæsning, vis besked.
                  <p className="md:col-span-full text-center text-gray-500">
                    Ingen billeder fundet med de valgte filtre.
                  </p>
                )}
              </div>
              {/* PAGINERINGSKNAPPER */}
              {totalPages > 1 && ( // Vis pagineringsknapper kun hvis der er mere end 1 side.
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <CustomButton
                    onClick={() => paginate(currentPage - 1)} // Gå til forrige side.
                    disabled={currentPage === 1 || isFiltering || isPending} // Deaktiver hvis første side eller indlæser.
                    variant="outline"
                    type="button"
                    text={<FaArrowLeft />} // Venstre pil ikon.
                  ></CustomButton>
                  <span className="text-gray-700">
                    Side {currentPage} af {totalPages}{" "}
                    {/* Viser aktuel side / total sider. */}
                  </span>
                  <CustomButton
                    onClick={() => paginate(currentPage + 1)} // Gå til næste side.
                    disabled={
                      currentPage === totalPages || isFiltering || isPending
                    } // Deaktiver hvis sidste side eller indlæser.
                    variant="outline"
                    type="button"
                    text={<FaArrowRight />} // Højre pil ikon.
                  ></CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <CustomButton
          type="submit" // Submit-knap for formularen.
          text="Gem"
          className="w-fit text-xl mr-2"
        ></CustomButton>
        <CustomButton text="Annuller" className="w-fit text-xl bg-black" />{" "}
        {/* Annuller-knap. */}
      </form>
    </Form>
  );
};

export default KuratorForm; // Eksporterer komponenten.
