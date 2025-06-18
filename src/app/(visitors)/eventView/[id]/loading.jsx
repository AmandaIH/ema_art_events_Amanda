export default function Loading() {
  return (
    // role="status": Fortæller skærmlæseren, at dette element indeholder en statusmeddelelse,
    // aria-live="polite": Fortæller skærmlæseren, at ændringer i dette områdes indhold
    // skal annonceres til brugeren på en "høflig" måde, dvs. uden at afbryde igangværende oplæsning,
    // men så snart skærmlæseren er klar. Dette er ideelt for ikke-kritiske opdateringer som loading-indikatorer.
    <div
      className="flex justify-center items-center h-screen"
      role="status"
      aria-live="polite"
    >
      <p className="text-xl text-gray-600">Indlæser begivenhed...</p>

      {/* Spinneren er et visuelt element. Den tilhørende tekst i <p>-tagget og ARIA-attributterne
          på den ydre container er tilstrækkelige til at formidle loading-status for skærmlæsere her.
          Man kunne tilføje aria-hidden="true" til spinneren, hvis den kun er dekorativ og teksten er primær. */}
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
