import React from "react";

const StepIndicator = ({ currentStep, totalSteps, stepNames }) => {
  return (
    <div
      className="flex justify-center items-center my-8"
      role="navigation" // For skærmlæsere: markerer som navigationskomponent
      aria-label="Trin i proces" // For skærmlæsere: giver en beskrivende etiket
    >
      {/* Mapper igennem hvert trin for at rendere cirkler og forbindelseslinjer */}
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={`flex flex-col items-center mx-2`}>
            {/* Cirklen der repræsenterer et trin (f.eks. "1", "2") */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                ${index < currentStep ? "bg-blue-500" : "bg-gray-400"} `} // Blå hvis trinnet er gennemført, ellers grå
              aria-current={index === currentStep - 1 ? "step" : undefined} // Markerer det aktuelle trin for skærmlæsere
              aria-label={`Trin ${index + 1}: ${
                stepNames && stepNames[index] ? stepNames[index] : ""
              }`} // Beskriver trinnet for skærmlæsere
            >
              {index + 1} {/* Viser trinnummeret */}
            </div>
            {/* Trinnavn (teksten under cirklen) */}
            {stepNames && stepNames[index] && (
              <p
                className={`mt-2 text-sm text-center
                  ${
                    index < currentStep
                      ? "text-blue-500 font-semibold" // Blå og fed hvis trinnet er gennemført
                      : "text-gray-600" // Ellers grå
                  }`}
              >
                {stepNames[index]}
              </p>
            )}
          </div>
          {/* Forbindelseslinjen mellem trin-cirklerne */}
          {index < totalSteps - 1 && ( // Viser kun linjen, hvis det ikke er det sidste trin
            <div
              className={`flex-grow h-1 rounded-full mx-2
                ${
                  index < currentStep - 1
                    ? "bg-blue-500" // Blå hvis linjen repræsenterer et gennemført trin
                    : "bg-gray-400" // Ellers grå
                }`}
              style={{ maxWidth: "40px" }} // Begrænser linjens bredde
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
