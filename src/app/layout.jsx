import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import ThemeWrapper from "../components/global/ThemeWrapper";

export const metadata = {
  title: "SMK",
  description: "Exams Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider frontendApi="clerk.ema-art-events-amanda.dk">
      <html lang="en">
        <ThemeWrapper>{children}</ThemeWrapper>
      </html>
    </ClerkProvider>
  );
}
