import { SignIn } from "@clerk/nextjs";
export default function Page() {
  return (
    <main className="place-content-center">
      <SignIn />
    </main>
  );
}
