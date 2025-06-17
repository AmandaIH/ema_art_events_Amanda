import Link from "next/link";
import { Button as ShadcnButton } from "@/components/ui/button"; // Renamer Button fra shadcn/ui til ShadcnButton for at undgå navnekollision med CustomButton.

const CustomButton = ({
  link, // En prop der afgør, om knappen skal opføre sig som et link. Hvis sandt, bruges Next.js' Link.
  text, // Teksten der skal vises på knappen.
  onClick, // Event-handler for klik, hvis det er en almindelig knap.
  variant, // Variant for styling (f.eks. "default", "outline", "destructive"), sendes videre til ShadcnButton.
  size, // Størrelse for styling (f.eks. "default", "sm", "lg"), sendes videre til ShadcnButton.
  className, // Ekstra CSS-klasser, der skal anvendes, sendes videre til ShadcnButton.
  type = "button", // HTML-attribut 'type' for knappen, standard "button".
  ...props // Alle andre props, der ikke er nævnt eksplicit (f.eks. 'disabled', 'aria-label'), sendes videre.
}) => {
  // Første scenarie: Hvis 'link'-prop er angivet, renderes knappen som et Next.js Link.
  if (link) {
    return (
      // Her indkapsles ShadcnButton direkte i Next.js Link-komponenten.
      // Dette er den "dobbeltkonfekt" del, vi skal forklare.
      <Link href={link}>
        <ShadcnButton
          variant={variant} // Variant sendes til ShadcnButton
          size={size} // Størrelse sendes til ShadcnButton
          className={className} // Ekstra klasser sendes til ShadcnButton
          {...props} // Resterende props sendes til ShadcnButton
        >
          {text} {/* Teksten i knappen */}
        </ShadcnButton>
      </Link>
    );
  } else {
    // Andet scenarie: Hvis 'link'-prop IKKE er angivet, renderes knappen som en almindelig HTML-knap (via ShadcnButton).
    return (
      <ShadcnButton
        type={type} // Knappens type (f.eks. "button", "submit").
        variant={variant} // Variant for styling.
        size={size} // Størrelse for styling.
        className={className} // Ekstra klasser.
        onClick={onClick} // Klik-handler for knappen.
        {...props} // Resterende props.
      >
        {text} {/* Teksten i knappen */}
      </ShadcnButton>
    );
  }
};

export default CustomButton;
