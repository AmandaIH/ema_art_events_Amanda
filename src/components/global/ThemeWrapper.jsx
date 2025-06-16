"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ThemeWrapper({ children }) {
  const pathname = usePathname();

  const isKuratorPage =
    pathname === "/dashboard" || pathname.startsWith("/create_edit");
  const isPaymentOrConfirmationPage =
    pathname === "/paymentpage" || pathname === "/paymentconfirmation";

  const kuratorBackgroundColor = "#E0D2D4";
  const defaultBackgroundColor = "#E1E2E8";

  const currentBackgroundColor = isKuratorPage
    ? kuratorBackgroundColor
    : defaultBackgroundColor;

  return (
    <body
      suppressHydrationWarning
      style={{
        backgroundColor: currentBackgroundColor,
        transition: "background-color 0.3s ease",
      }}
    >
      <Header
        backgroundColor={currentBackgroundColor}
        pathname={pathname}
        isPaymentOrConfirmationPage={isPaymentOrConfirmationPage} // Send boolsk flag med
      />
      {children}
      <Footer backgroundColor={currentBackgroundColor} />
    </body>
  );
}
