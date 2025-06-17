// 'create' er funktionen, der bruges til at oprette en ny Zustand store.
import { create } from "zustand";

// Opretter din Zustand store. Vi kalder den 'useCartStore', fordi den vil blive brugt som et React hook i dine komponenter.
// 'create' tager en funktion som argument. Denne funktion definerer din stores 'state' (data) og 'actions' (måder at ændre data på).
// 'set' er en funktion, der bruges til at opdatere din stores state.
// 'get' er en funktion, der bruges til at læse den nuværende state indenfor en action (hvis du skal bruge den til at beregne næste state).
const useCartStore = create((set, get) => ({
  // --- STATE (De data, dit lager holder styr på) ---

  // 'items' er en array, der repræsenterer indholdet af din indkøbskurv.
  // Hvert element i denne array vil sandsynligvis være et event-objekt med billettal osv.
  items: [],

  // --- ACTIONS (De handlinger, du kan udføre på dit lager for at ændre state) ---

  // setEventInCart: En funktion til at tilføje et event til kurven eller opdatere mængden, hvis det allerede er der.
  // Den modtager 'eventDetails' som et objekt, der indeholder information om eventet og den ønskede mængde.
  setEventInCart: (eventDetails) =>
    // 'set' bruges til at opdatere state. Vi sender en funktion til 'set',
    // som modtager den 'state', der er LIGE NU ('state' her refererer til den aktuelle Zustand store state).
    set((state) => {
      // VIGTIGT: Sikkerhed mod datafejl. Sørg for at 'totalTickets' og 'bookedTickets' er TAL.
      // parseFloat forsøger at konvertere til et decimaltal. Hvis det fejler (f.eks. ved "null" eller "undefined"),
      // falder det tilbage til 0. Dette er vigtigt, fordi beregninger kræver tal.
      const total = parseFloat(eventDetails.totalTickets) || 0;
      const booked = parseFloat(eventDetails.bookedTickets) || 0;
      // Beregn hvor mange billetter der er tilbage at sælge.
      const availableTickets = total - booked;

      // Validerer den ønskede 'quantity' (mængde). Sikrer, at den mindst er 1, hvis den er 0 eller null/undefined.
      let validatedQuantity = Math.max(1, eventDetails.quantity || 1);

      // **NY LOGIK HER: VIGTIGT for at forhindre oversalg!**
      // Hvis brugeren forsøger at tilføje flere billetter, end der er tilgængelige,
      // så justerer vi 'validatedQuantity' ned til det maksimale antal tilgængelige billetter.
      if (validatedQuantity > availableTickets) {
        // En advarsel i konsollen, hvis dette sker. Godt til debugging.
        console.warn(
          `[ticketStore] Forsøgte at sætte ${validatedQuantity} billetter, men kun ${availableTickets} er tilgængelige. Justerer tilgængelige billetter.`
        );
        validatedQuantity = availableTickets; // Sæt mængden til det maksimale tilgængelige.
      }

      // Håndter scenariet, hvor eventet er helt udsolgt (0 eller færre billetter tilgængelige).
      if (availableTickets <= 0) {
        console.warn(
          `[ticketStore] Eventet er udsolgt, kan ikke tilføje billetter.`
        );
        // Hvis udsolgt, tøm kurven for dette event (eller generelt for at forhindre tilføjelse).
        // Dette 'return { items: [] }' vil faktisk tømme HELE kurven, hvis du forsøger at tilføje et udsolgt event.
        // Hvis du kun vil forhindre tilføjelsen af det SPECIFIKKE udsolgte event, men beholde andre i kurven,
        // skal du returnere 'state' uændret her, eller returnere 'state.items' som den er.
        // For nuværende funktion vil det rydde.
        return { items: [] };
      }

      // Validerer billetprisen, bruger 45 som standard, hvis den mangler.
      const validatedPrice = eventDetails.pricePerTicket || 45;

      // Find ud af, om det event, vi vil tilføje/opdatere, allerede er i kurven.
      // 'findIndex' returnerer indekset for elementet, hvis det findes, ellers -1.
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === eventDetails.id
      );

      let updatedItems; // En variabel til at holde den nye version af kurven.
      if (existingItemIndex > -1) {
        // Hvis eventet ALLEREDE ER I KURVEN:
        // Vi opdaterer kun det eksisterende element.
        updatedItems = state.items.map(
          (item, index) =>
            // Hvis det er det element, vi vil opdatere (ud fra index), så skab et nyt objekt for det.
            index === existingItemIndex
              ? {
                  ...item, // Bevar alle eksisterende egenskaber for dette item.
                  quantity: validatedQuantity, // Opdater mængden til den validerede mængde.
                  pricePerTicket: validatedPrice, // Opdater prisen (hvis den er ændret).
                  totalTickets: total, // Opdater også total/booked, da de kan ændre sig dynamisk
                  bookedTickets: booked,
                }
              : item // Hvis det ikke er det element, vi vil opdatere, behold det som det er.
        );
      } else {
        // Hvis eventet IKKE ER I KURVEN:
        // Vi tilføjer det nye event til kurven.
        updatedItems = [
          ...state.items, // Tag alle eksisterende elementer fra kurven.
          {
            ...eventDetails, // Spred alle detaljer fra det nye event.
            quantity: validatedQuantity, // Tilføj den validerede mængde.
            pricePerTicket: validatedPrice, // Tilføj den validerede pris.
            totalTickets: total, // Gem de validerede totalTickets i store.
            bookedTickets: booked, // Gem de validerede bookedTickets i store.
          },
        ];
      }

      // Returnerer et NYT state-objekt for Zustand.
      // VIGTIGT: Du skal ALTID returnere et nyt objekt fra 'set'-funktionen for at React/Zustand kan registrere en ændring.
      // Vi opdaterer kun 'items' prop'en i vores state.
      return { items: updatedItems };
    }),

  // incrementTicketQuantity: En action til at øge antallet af billetter for et specifikt event i kurven med 1.
  incrementTicketQuantity: (eventId) =>
    set((state) => {
      // Find det specifikke item, vi vil opdatere.
      const itemToUpdate = state.items.find((item) => item.id === eventId);
      // Hvis item'et ikke findes i kurven, returner den uændrede state.
      if (!itemToUpdate) return state;

      // Sikkerhed: Konverter til tal, hvis de ikke allerede er det.
      const total = parseFloat(itemToUpdate.totalTickets) || 0;
      const booked = parseFloat(itemToUpdate.bookedTickets) || 0;
      const availableTickets = total - booked;

      // Beregn den nye ønskede mængde.
      const newQuantity = itemToUpdate.quantity + 1;

      // **NY LOGIK HER: Forhindre overskridelse af tilgængelige billetter ved inkrementering.**
      // Hvis den nye mængde overstiger de tilgængelige billetter,
      // så tillad ikke inkrementering, og returner den nuværende (uændrede) state.
      if (newQuantity > availableTickets) {
        console.warn(
          `[ticketStore] Kan ikke øge antallet over tilgængelige billetter (${availableTickets}).`
        );
        return state; // Returner den uændrede state, intet sker.
      }

      // Returnerer et nyt state-objekt med opdaterede items.
      return {
        items: state.items.map((item) =>
          // Hvis det er det rigtige item, skab et nyt objekt med opdateret 'quantity'.
          item.id === eventId ? { ...item, quantity: newQuantity } : item
        ),
      };
    }),

  // decrementTicketQuantity: En action til at reducere antallet af billetter for et event.
  // Sikrer, at mængden aldrig går under 1. Hvis mængden bliver 0 (efter subtraktion), fjernes item'et.
  decrementTicketQuantity: (eventId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === eventId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) } // Sætter mængden til minimum 1.
            : item
        )
        // Filtrerer array'en: Behold kun items, hvis deres 'quantity' er større end 0.
        // Dette fjerner et item helt fra kurven, hvis brugeren forsøger at sætte det til 0.
        .filter((item) => item.quantity > 0),
    })),

  // removeEventFromCart: En action til at fjerne et event helt fra kurven, uanset mængde.
  removeEventFromCart: (eventId) =>
    set((state) => ({
      // Filtrerer alle items, og behold kun dem, hvis ID IKKE matcher det eventId, der skal fjernes.
      items: state.items.filter((item) => item.id !== eventId),
    })),

  // clearCart: En action til at rydde hele kurven (fjerne alle items).
  clearCart: () => set({ items: [] }), // Sætter 'items' array'en til en tom array.
}));

// Eksporterer den oprettede store, så den kan importeres og bruges i dine React komponenter.
export default useCartStore;
