import React from "react";

const StepIndicator = ({ currentStep, totalSteps, stepNames }) => {
  return (
    <div className="flex justify-center items-center my-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={`flex flex-col items-center mx-2`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                ${index < currentStep ? "bg-blue-600" : "bg-gray-400"}
                ${index === currentStep - 1 ? "ring-2 ring-blue-800" : ""}`}
            >
              {index + 1}
            </div>
            {stepNames && stepNames[index] && (
              <p
                className={`mt-2 text-sm text-center
                  ${index < currentStep ? "text-blue-700 font-semibold" : "text-gray-600"}`}
              >
                {stepNames[index]}
              </p>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`flex-grow h-1 rounded-full mx-2
                ${index < currentStep - 1 ? "bg-blue-600" : "bg-gray-400"}`}
              style={{ maxWidth: "40px" }} // Kontroller længden af linjen mellem trin
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
