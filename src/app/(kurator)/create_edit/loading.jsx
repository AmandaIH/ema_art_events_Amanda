export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl text-gray-600">Indlæser begivenhed...</p>

      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
