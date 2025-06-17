// app/paymentpage/page.jsx
// Denne fil definerer din betalingsside.
// "use client" direkivet øverst indikerer, at dette er en Client Component.
// Det betyder, at den kører i brugerens browser og kan bruge React Hooks som useState,
// samt interagere med browser-specifikke API'er og tredjepartsbiblioteker, der kræver klient-side JavaScript.

"use client";

import Step from "@/components/kurator_create_edit/Step"; // Sandsynligvis en UI-komponent til at vise trin i en proces (ikke direkte brugt i denne snippet, men importeret).
import PersonalForm from "@/components/paymentpage/PersonalForm"; // Formularkomponenten, hvor brugeren indtaster personlige oplysninger og betalingsdetaljer.
import OpacityTextBox from "@/components/global/OpacityTextBox"; // En generisk komponent til at vise tekst med en transparent baggrund.

// Import af React Hooks og Next.js specifikke funktioner/hooks.
import { useState } from "react"; // 'useState' til at styre lokal komponent-tilstand.
import useCartStore from "@/stores/ticketStore"; // Din Zustand store til at administrere vognens indhold (billetter).
import { useRouter } from "next/navigation"; // Hook fra Next.js til at håndtere navigation programmatisk.
import Image from "next/image"; // Next.js' optimerede billedkomponent.

// Hovedkomponenten for betalingssiden.
export default function PaymentPage() {
  // Henter 'items' (indholdet af indkøbskurven) fra din globale Zustand store.
  // Dette udløser en re-render, hvis 'items' ændrer sig i storen.
  const { items } = useCartStore();
  // Initialiserer Next.js router-objektet for at navigere programmatisk.
  const router = useRouter();
  // 'currentStep' state til at holde styr på, hvilket trin brugeren er på i betalingsprocessen (standard 1).
  const [currentStep, setCurrentStep] = useState(1);
  // 'selectedEventDetails' state til at gemme detaljerne om det event, der er i kurven.
  // Dette vil blive sat baseret på indholdet af 'items'.
  const [selectedEventDetails, setSelectedEventDetails] = useState(null); // Initialiseres til null.

  // ***** VI har diskuteret denne useEffect tidligere. Den er her stadig, men jeg kommenterer den ud,
  // ***** da vi talte om, hvordan den KUNNE undgås ved at flytte logikken op i render-fasen.
  // ***** Hvis du vælger at beholde den, er det vigtigt at forklare, hvorfor du gjorde det.
  // useEffect(() => {
  //   // Denne effekt kører, når 'items' eller 'router' ændrer sig efter den første rendering.
  //   if (items.length > 0) {
  //     // Hvis der er varer i kurven, tager vi det første event (antager en enkelt event-type pr. transaktion).
  //     const eventToDisplay = items[0];
  //     // Opdaterer state med event-detaljerne. Dette vil udløse en re-render.
  //     setSelectedEventDetails(eventToDisplay);
  //   } else {
  //     // Hvis kurven er tom, omdirigeres brugeren til '/events' siden.
  //     // Dette forhindrer brugere i at komme direkte til betalingssiden uden noget i kurven.
  //     router.push("/events");
  //   }
  // }, [items, router]); // Afhængigheds-array: Effekten genkøres, hvis 'items' eller 'router' objektet ændrer sig.

  // ***** Hvis du vil undgå useEffect, ville du gøre det her i stedet (flyttet op):
  if (items.length === 0) {
    router.push("/events"); // Omdiriger øjeblikkeligt, hvis kurven er tom.
    return null; // Stop renderingen af resten af komponenten, da vi omdirigerer.
  }
  // Hvis vi når hertil, ved vi, at items.length > 0, så vi kan trygt antage det første element.
  // Og så behøves setSelectedEventDetails state ikke længere, da data er direkte tilgængelige.
  // const eventDetails = items[0];

  // Callback-funktion, der kaldes, når betalingen er bekræftet i PersonalForm-komponenten.
  const handleConfirmPayment = () => {
    setCurrentStep(2); // Opdaterer trinnet til 2 (f.eks. for en visuel indikator).
    router.push("/paymentconfirmation"); // Omdirigerer brugeren til bekræftelsessiden.
  };

  // Indhold til OpacityTextBox'en.
  // Bruger 'selectedEventDetails' (hvis den er sat) til at formatere en streng med ordreoversigten.
  // Hvis 'selectedEventDetails' stadig er null (før useEffect kører, eller hvis der er problemer), vises en standardtekst.
  const opacityTextBoxContent = selectedEventDetails
    ? // Betinget rendering: Hvis eventdetaljer er tilgængelige, opbyg strengen.
      `Event: ${selectedEventDetails.title}\n\n` +
      `Dato: ${selectedEventDetails.date || "N/A"}\n\n` + // Hvis dato mangler, vis "N/A".
      `Sted: ${selectedEventDetails.location?.name || "N/A"}, ${
        // Bruger optional chaining (?) for at undgå fejl, hvis location er undefined.
        selectedEventDetails.location?.address || "N/A"
      }\n\n` +
      `Antal billetter: ${selectedEventDetails.quantity}\n\n` +
      `Pris pr. billet: ${selectedEventDetails.pricePerTicket} DKK`
    : // Ellers, vis en loading/fejlmeddelelse.
      "Indlæser eventdetaljer eller ingen events valgt...";

  // Mock data for baggrundsfarve og billede. Disse er statiske og ikke relateret til eventdetaljerne i denne version.
  const mockBackgroundColor = "#401F0C"; // En hårdkodet baggrundsfarve.
  const imageUrl =
    "https://iip-thumb.smk.dk/iiif/jp2/9g54xm869_KMS1-cropped.tif.jp2/full/!1024,/0/default.jpg"; // En hårdkodet billed-URL.

  // Returnerer JSX for sidens UI.
  return (
    <>
      {/* <main> elementet indeholder sidens primære indhold. */}
      {/* Klasserne 'container mx-auto py-8 z-10' bruges til at centrere indholdet, give padding, og sætte z-index. */}
      <main className="container mx-auto py-8 z-10">
        {/* En flex-container, der arrangerer børn enten i en kolonne (på små skærme) eller række (på medium skærme og opefter). */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Hovedindholdsområdet for formularen. Den fylder 2/3 af bredden på medium skærme. */}
          <div className="flex-grow md:w-2/3">
            {/* PersonalForm-komponenten, hvor brugeren udfylder betalingsinformation. */}
            <PersonalForm
              className="mt-12" // Top margin for styling.
              onPaymentConfirmed={handleConfirmPayment} // Callback, der udløses, når formularen bekræfter betaling.
              selectedEventDetails={selectedEventDetails} // Sender de hentede eventdetaljer til formularen.
            />
          </div>

          {/* Sidebar-området, der fylder 1/3 af bredden på medium skærme og opefter. */}
          <aside className="md:w-1/3">
            {/* OpacityTextBox-komponenten, der viser ordreoversigten. */}
            <OpacityTextBox
              title="Din ordreoversigt" // Titel for tekstboksen.
              content={opacityTextBoxContent} // Det dynamisk genererede indhold med event- og billetdetaljer.
              className="h-[15rem] flex-col w-[15rem] leading-relaxed" // Styling for tekstboksen.
            />
          </aside>
        </div>
      </main>
    </>
  );
}
