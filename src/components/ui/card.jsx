import * as React from "react"; // Importerer React.
import { cva } from "class-variance-authority"; // Importerer cva til at håndtere betingede CSS-klasser.
import { cn } from "@/lib/utils"; // Importerer en utility-funktion til at kombinere Tailwind CSS klasser (fra Shadcn/UI's setup).

// Definerer varianter for Card-komponenten ved hjælp af cva.
// Dette giver dig mulighed for at have forskellige udseender af kortet baseret på en 'variant' prop.
const cardVariants = cva(
  // Standard (base) klasser, der altid anvendes på kortet.
  "bg-card text-card-foreground flex flex-col rounded-xl shadow-sm content-fit p-(--space-1rem)",
  {
    // Definerer specifikke varianter.
    variants: {
      variant: {
        // Standardvariant: baggrund, tekstfarve, flex-layout, spacing, afrundede hjørner, skygge.
        default:
          "bg-card text-card-foreground flex flex-col gap-4 rounded-xl py-4 shadow-sm ",

        // Opacity-variant: hvid baggrund, sort tekst, opacitet, flex-layout, afrundede hjørner, skygge, h-fit (højde til indhold).
        opacity:
          "bg-white opacity-80 text-black flex rounded-xl shadow-sm h-fit gap-4",
      },
    },
    // Der er ingen 'defaultVariants' defineret her, så du skal specificere 'variant="default"'
    // eller 'variant="opacity"' når du bruger <Card>. Hvis ingen variant er angivet,
    // bruges kun de basiske klasser fra den første streng i cva.
  }
);

// Hoved Card-komponenten.
// Den renderes som en <section> HTML-tag for semantisk korrekthed.
function Card({ className, ...props }) {
  return (
    <section
      data-slot="card" // Custom data-attribut for nem identifikation i devtools/styling.
      // cn kombinerer klasser fra cardVariants, en fast padding på 'p-4', og eventuelle ekstra klasser fra 'className' prop'en.
      className={cn(cardVariants, "p-4", className)}
      {...props} // Spreader alle andre props (f.eks. 'variant', 'onClick' osv.) til <section> elementet.
    />
  );
}

// CardHeader-komponenten.
// Renderes som en <div>. Designet til at holde titlen, beskrivelsen og potentielt en action-knap.
function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header" // Custom data-attribut.
      className={cn(
        // Tailwind CSS-klasser for container-queries, grid-layout, justering, spacing.
        // `@container/card-header` tillader responsive stilarter baseret på forælderens bredde.
        // `grid auto-rows-min grid-rows-[auto_auto]` opsætter et grid med automatisk rækkehøjde.
        // `items-start gap-1.5` justerer elementer og giver mellemrum.
        // `has-data-[slot=card-action]:grid-cols-[1fr_auto]` justerer grid-kolonner, hvis der er en CardAction.
        // `[.border-b]:pb-6` tilføjer padding-bottom, hvis der er en bottom border.
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className // Ekstra klasser fra prop'en.
      )}
      {...props} // Spreader alle andre props.
    />
  );
}

// CardTitle-komponenten.
// Renderes som en <div>. Designet til at holde hovedtitlen.
function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title" // Custom data-attribut.
      className={cn(
        // 'leading-none' fjerner ekstra linjehøjde. 'font-semibold' fed skrift. 'text-xl' stor skrift.
        "leading-none font-semibold text-xl",
        className
      )}
      {...props}
    />
  );
}

// CardDescription-komponenten.
// Renderes som en <div>. Designet til at holde undertitler eller yderligere små tekster.
function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description" // Custom data-attribut.
      className={cn(
        // 'text-muted-foreground' bruger en dæmpet tekstfarve. 'text-sm' lille skrift.
        "text-muted-foreground text-sm",
        className
      )}
      {...props}
    />
  );
}

// CardAction-komponenten.
// Renderes som en <div>. Bruges til at placere handlingsknapper inden i CardHeader, ofte i et grid-layout.
function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action" // Custom data-attribut.
      className={cn(
        // Justering inden for grid-layout: starter i 2. kolonne, spænder over 2 rækker, starter i 1. række, justerer sig selv til toppen og enden.
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

// CardContent-komponenten.
// Renderes som en <div>. Indeholder det primære tekstindhold i kortet.
function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content" // Custom data-attribut.
      className={cn("text-lg", className)} // Standard skriftstørrelse på 'text-lg' (18px).
      {...props}
    />
  );
}

// CardFooter-komponenten.
// Renderes som en <div>. Indeholder elementer nederst på kortet, ofte knapper eller links.
function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer" // Custom data-attribut.
      className={cn(
        // Standard flex-layout for elementer centreret vertikalt.
        // `px-4` giver horisontal padding.
        // `[.border-t]:pt-4` giver top-padding, hvis der er en top border.
        "flex items-center px-4 [.border-t]:pt-4",
        className
      )}
      {...props}
    />
  );
}

export {
  Card, // Hovedkomponent for kortet.
  CardHeader, // Header-sektion af kortet.
  CardFooter, // Footer-sektion af kortet.
  CardTitle, // Titeltekst.
  CardAction, // Komponent til handlinger i headeren (optional).
  CardDescription, // Beskrivende tekst.
  CardContent, // Hovedindholdssektion.
  cardVariants, // CVA-funktion for at anvende varianter på Card.
}; // Eksporterer alle de definerede komponenter og varianter.
