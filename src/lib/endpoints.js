const serverURL = process.env.NEXT_PUBLIC_SERVER;
//const serverURL = process.env.SERVER;
export const asyncEvents = serverURL + "/events";
export const asyncDates = serverURL + "/dates";
export const asyncLocations = serverURL + "/locations";

const smkURL = "https://api.smk.dk/api/v1";
export const smkArt = smkURL + "/art";
