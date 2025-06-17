import React from "react";

const StepIndicator = ({ currentStep, totalSteps, stepNames }) => {
  return (
    // 1. Hovedcontainer for hele trinindikatoren
    // role="navigation": Fortæller skærmlæseren, at dette element er en navigationskomponent.
    // aria-label="Trin i proces": Giver en beskrivende label til navigationskomponenten.
    // Dette hjælper brugere med skærmlæsere med at forstå formålet med denne sektion.
    <div
      className="flex justify-center items-center my-8"
      role="navigation"
      aria-label="Trin i proces"
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={`flex flex-col items-center mx-2`}>
            {/* 2. Cirklen for hvert trin (f.eks. "1", "2")
                aria-current="step": Dette er super vigtigt!
                Hvis trinnet er det AKTUELLE trin (index === currentStep - 1),
                fortæller aria-current="step" skærmlæseren, at dette er brugerens nuværende position
                i navigationsstien eller processen. Skærmlæseren vil typisk annoncere noget i stil med
                "Trin 1, aktuelt trin" eller "Trin Bekræftelse, aktuelt trin".
            */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                ${index < currentStep ? "bg-blue-500" : "bg-gray-400"}
                ${index === currentStep - 1 ? "ring-2 ring-blue-800" : ""}`}
              // Sæt aria-current="step" KUN på det aktuelle trin
              aria-current={index === currentStep - 1 ? "step" : undefined}
              // aria-label kan også tilføjes for at give en mere detaljeret beskrivelse af trinnet,
              // især hvis nummeret alene ikke er nok. Her kombineres nummer og navn.
              aria-label={`Trin ${index + 1}: ${stepNames && stepNames[index] ? stepNames[index] : ""}`}
            >
              {index + 1}
            </div>
            {stepNames && stepNames[index] && (
              <p
                className={`mt-2 text-sm text-center
                  ${index < currentStep ? "text-blue-500 font-semibold" : "text-gray-600"}`}
              >
                {stepNames[index]}
              </p>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`flex-grow h-1 rounded-full mx-2
                ${index < currentStep - 1 ? "bg-blue-500" : "bg-gray-400"}`}
              style={{ maxWidth: "40px" }}
              // Linjen er primært visuel. Den behøver normalt ikke en ARIA-label,
              // da dens funktion (forbinde trin) er implicit fra konteksten af de mærkede trin.
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
