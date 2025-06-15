// components/footer.tsx
import Link from "next/link";
import React from "react";

const Footer = ({ backgroundColor }) => {
  return (
    <footer
      className="border-t py-6 md:py-8 sticky bottom-0"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p>
            &copy; {new Date().getFullYear()} SMK. Alle rettigheder forbeholdes.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
          <Link
            href="/privacy-policy"
            className="hover:underline underline-offset-4"
          >
            Privatlivspolitik
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:underline underline-offset-4"
          >
            Vilkår for brug
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4">
            Kontakt os
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
