import React from "react";

// tre 'props' (egenskaber) som input:
// - currentStep: Det nuværende trin i processen (f.eks. 1 for det første trin, 2 for det andet).
// - totalSteps: Det samlede antal trin i processen.
// - stepNames: En valgfri array af strenge, der indeholder navne for hvert trin (f.eks. ["Oplysninger", "Bekræftelse", "Betaling"]).
const StepIndicator = ({ currentStep, totalSteps, stepNames }) => {
  return (
    // 1. Hovedcontainer for hele trinindikatoren.
    // role="navigation": Dette er en ARIA-attribut (Accessible Rich Internet Applications).
    // Den fortæller skærmlæsere, at dette element er en navigationskomponent, hvilket hjælper brugeren med at forstå sidens struktur.
    // aria-label="Trin i proces": En anden ARIA-attribut. Den giver en mere beskrivende label (navn) til navigationskomponenten,
    // som læses op af skærmlæsere, f.eks. "Trin i proces navigation". Dette er vigtigt, da en <div> normalt ikke har en semantisk rolle.
    <div
      className="flex justify-center items-center my-8"
      role="navigation"
      aria-label="Trin i proces"
    >
      {/* 2. Loop gennem hvert trin for at rendere cirkler og forbindelseslinjer.
          Array.from({ length: totalSteps }): Opretter en array med længden af 'totalSteps'.
          For eksempel, hvis totalSteps er 3, skaber den [undefined, undefined, undefined].
          .map((_, index) => ...): itererer over denne array.
          '_' (underscore) betyder, at vi ikke bruger selve elementets værdi, kun dets 'index' (0, 1, 2...).
          'React.Fragment key={index}': bruger React.Fragment, fordi jeg vil returnere to elementer (cirklen og linjen)
          for hvert trin, og de skal have en 'key' når de er i en liste. Fragmentet renderes ikke som et HTML-element.
      */}
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={`flex flex-col items-center mx-2`}>
            {/* 4. Selve cirklen for hvert trin (f.eks. "1", "2", "3"). */}
            {/* Dynamiske klasser baseret på trin-status: */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                ${index < currentStep ? "bg-blue-500" : "bg-gray-400"} `}
              // Baggrundsfarve:
              // - Hvis trinnet er FÆRDIGT (index er mindre end currentStep), så er farven "blue-500" (markeret som færdig).
              // - Ellers (hvis trinnet er det aktuelle eller fremtidige), er farven "gray-400".

              // ${index === currentStep - 1 ? "ring-2 ring-blue-800" : ""}
              // Ring (cirkel) omkring det AKTUELLE trin:
              // - Hvis dette er det aktuelle trin (index er lig med currentStep minus 1, fordi index starter ved 0),
              //   så tilføjes en blå ring for at fremhæve det visuelt.

              // aria-current="step": Dette er super vigtigt for tilgængelighed!
              // - Hvis trinnet er det AKTUELLE trin (index === currentStep - 1),
              //   fortæller aria-current="step" skærmlæseren, at dette er brugerens nuværende position
              //   i navigationsstien eller processen.
              // - Skærmlæseren vil typisk annoncere noget i stil med "Trin 1, aktuelt trin" eller "Trin Bekræftelse, aktuelt trin".
              // - Hvis det ikke er det aktuelle trin, sættes den til 'undefined', da attributten ikke skal være der.
              aria-current={index === currentStep - 1 ? "step" : undefined}
              // aria-label: Giver en mere detaljeret beskrivelse af *dette specifikke trin* til skærmlæsere.
              // Det kombinerer trinnummeret (index + 1) med navnet på trinnet (hvis det findes i stepNames).
              aria-label={`Trin ${index + 1}: ${
                stepNames && stepNames[index] ? stepNames[index] : ""
              }`}
            >
              {index + 1}
              {/* Viser trinnummeret inde i cirklen (f.eks. "1", "2"). */}
            </div>
            {/* 5. Trinnavn (teksten under cirklen). */}
            {/* {stepNames && stepNames[index] && ...}: Render kun p-tag'en, hvis stepNames-array'en eksisterer
                OG der er et navn for dette specifikke index. Dette forhindrer fejl, hvis navne mangler. */}
            {stepNames && stepNames[index] && (
              <p
                className={`mt-2 text-sm text-center
                  ${
                    index < currentStep
                      ? "text-blue-500 font-semibold" // Hvis trinnet er færdigt, er teksten blå og fed.
                      : "text-gray-600" // Ellers er teksten grå.
                  }`}
              >
                {stepNames[index]}
                {/* Viser navnet på trinnet (f.eks. "Oplysninger"). */}
              </p>
            )}
          </div>
          {/* 6. Forbindelseslinjen mellem trin-cirklerne. */}
          {/* {index < totalSteps - 1 && ...}: Render kun en linje, hvis det IKKE er det sidste trin.
              Der skal ikke være en linje efter den sidste cirkel. */}
          {index < totalSteps - 1 && (
            <div
              className={`flex-grow h-1 rounded-full mx-2
                ${
                  index < currentStep - 1
                    ? "bg-blue-500" // Hvis linjen repræsenterer et FÆRDIGT skridt (bag det aktuelle), er den blå.
                    : "bg-gray-400" // Ellers er den grå.
                }`}
              style={{ maxWidth: "40px" }} // Begrænser linjens maksimale bredde.
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator; // Eksporterer komponenten, så den kan bruges i andre filer.
