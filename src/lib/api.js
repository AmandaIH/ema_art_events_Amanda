// ASYNC SERVER FRA DANNIE ENDPOINTS

import { asyncDates, asyncEvents, asyncLocations, smkArt } from "./endpoints";

export async function getEvent() {
  const dataEvents = await fetch(`${asyncEvents}?limit=*`); //skift url med eksterne server side når det er deployet
  const dataevent = await dataEvents.json();
  return dataevent;
}

export async function getEventId(id) {
  const dataEventsids = await fetch(`${asyncEvents}` + `/${id}`); //skift url med eksterne server side når det er deployet
  const dataeventid = await dataEventsids.json();
  return dataeventid;
}

export async function getEventDates() {
  const EventsDates = await fetch(`${asyncDates}`);
  const eventsdates = await EventsDates.json();
  return eventsdates;
}

export async function getEventLocations() {
  const EventsLocations = await fetch(`${asyncLocations}`);
  const eventslocations = await EventsLocations.json();
  return eventslocations;
}

// SMK ENDPOINTS / Mixet

export async function getSMK() {
  const datasSMK = await fetch(`${smkArt}/search/?keys=*&offset=0&rows=10`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dataSMK = await datasSMK.json();
  const SMKItems = dataSMK.items;
  return SMKItems;
}

// MODIFICERET: getSMKImg funktionen til at håndtere filtre og et højere antal rækker
export async function getSMKImg(filters = []) {
  // <-- Tilføjet 'filters' parameter med standardværdi
  const filterString =
    filters.length > 0 ? `&filters=[${filters.join("],[")}]` : "";
  // Sæt et højt antal rækker (f.eks. 500 eller 1000) for at hente mange billeder
  const url = `${smkArt}/search?keys=*&offset=0&rows=500${filterString}&filters=[has_image:true]`; // <-- Rows sat til 500, og filterString tilføjet

  const datasSMK = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const dataSMK = await datasSMK.json();
  const SMKimages = dataSMK.items;
  const totalFound = dataSMK.totalFound; // Inkluder totalFound, hvis du vil vise det på klienten

  return { items: SMKimages, totalFound: totalFound }; // Returner et objekt med items og totalFound
}

export async function getArtworkByEventID(objectNumber) {
  const url = `${smkArt}?object_number=${objectNumber}`;
  const data = await fetch(url)
    .then((res) => res.json())
    .then((data) => data.items[0]);

  return data;
}
export async function getAllArtworksByEventID(objectNumber) {
  const url = `${smkArt}?object_number=${objectNumber}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// Filter (getSMKFilter behøves ikke længere, da getSMKImg nu håndterer filtrering)
// Eksisterende getSMKFilter kan fjernes eller beholdes, hvis den bruges andre steder.
// Hvis den kun bruges her, kan den fjernes.
export async function getSMKFilter(filter, hasImg) {
  const { items } = await fetch(
    `${smkArt}/search/?keys=*${filter && `&filters=${filter}`}${
      hasImg ? "&filters=[has_image:true]" : ""
    }&offset=0&rows=100`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());
  return items;
}

export async function getSMKFilterCat() {
  const {
    facets: { artist, techniques },
  } = await fetch(
    `${smkArt}/search/?keys=*&filters=[has_image:true]&filters=[object_names:maleri]&facets=techniques&facets=artist`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  const categories = [
    {
      name: "artist",
      label: { singular: "Kunstner", plural: "Kunstnere" },
      items: artist.toSorted(),
    },
    {
      name: "techniques",
      label: { singular: "Teknik", plural: "Teknikker" },
      items: techniques.toSorted(),
    },
  ];
  return categories;
}

// --------------------------------   Til Event Create, Edit og Delete   --------------------------------------------//

export async function createEvent(indhold) {
  await fetch(asyncEvents, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(indhold),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

export async function updateEvent(id, eventData) {
  const response = await fetch(`${asyncEvents}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });
  return response; // Returnerer nu hele Response-objektet
}
export async function deleteEvent(id) {
  const response = await fetch(`${asyncEvents}/${id}`, {
    method: "DELETE",
  });
  return response.json(); // Denne kan forblive som den er, hvis du kun bruger den til at få bekræftelse
}
