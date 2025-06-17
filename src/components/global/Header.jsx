"use client";

import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
  SignOutButton,
  // useUser, // Kan fjernes hvis den ikke bruges andre steder i denne fil
} from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StepIndicator from "@/components/paymentpage/StepIndicator";

const navLinks = [
  { href: "/", label: "Hjem" },
  { href: "/events", label: "Begivenheder" },
  { href: "/dashboard", label: "Kurator" },
  { href: "/create_edit", label: "Lav event" },
];

const Header = ({ backgroundColor, pathname, isPaymentOrConfirmationPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  let currentStep = 0;
  let headerTitle = "SMK";

  if (pathname === "/paymentpage") {
    currentStep = 1;
    headerTitle = "Betaling";
  } else if (pathname === "/paymentconfirmation") {
    currentStep = 2;
    headerTitle = "Betaling";
  }

  return (
    <header
      className={`flex items-center justify-between p-4 shadow-md z-4`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between w-full">
        {isPaymentOrConfirmationPage ? (
          <div className="w-full text-black">
            <h1 className="text-3xl font-bold text-center mb-4">
              {headerTitle}
            </h1>
            <StepIndicator
              currentStep={currentStep}
              totalSteps={2}
              stepNames={["Dine detaljer", "Bekræftelse"]}
            />
          </div>
        ) : (
          <>
            <Link href="/" className="font-bold text-black">
              SMK
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="flex space-x-6 items-center">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      href={link.href}
                      className="px-3 py-2 text-base font-medium transition-colors hover:text-primary focus:outline-none focus:text-primary text-black"
                    >
                      {/* Sikrer at NavigationMenuLink har ét enkelt barn */}
                      <span>{link.label}</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {/* Clerk Auth Buttons for Desktop Navigation. */}
                <NavigationMenuItem>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    {/* **RETTELSE 1:** Giv SignInButton et eksplicit <span> barn */}
                    <SignInButton>
                      <span>Log ind</span>
                    </SignInButton>
                  </SignedOut>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobil Navigation */}
            <div className="lg:hidden flex items-center">
              {/* Clerk mobil auth buttons */}
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                {/* **RETTELSE 2:** Giv SignInButton et eksplicit <span> barn */}
                <SignInButton>
                  <span>Log ind</span>
                </SignInButton>
              </SignedOut>
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={toggleMenu}
                    className="focus:outline-none ml-4"
                  >
                    {isOpen ? (
                      <IoCloseOutline
                        className="h-6 w-6 text-black"
                        aria-hidden="true"
                      />
                    ) : (
                      <RxHamburgerMenu
                        className="h-6 w-6 text-black"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-1/3 min-w-[200px] shadow-lg mt-2 absolute right-0 text-black"
                  style={{ backgroundColor: backgroundColor }}
                >
                  {navLinks.map((link) => (
                    // **RETTELSE 3:** DropdownMenuItem med asChild kræver, at dens barn
                    // (her Link) er et enkelt element OG bærer den nødvendige styling.
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        // Disse klasser er kopieret fra DropdownMenuItem's standard styling
                        // for at sikre, at Link-elementet ser ud som et dropdown-menu-item.
                        className="flex w-full items-center px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  {/* Clerk Auth Buttons inde i dropdown */}
                  {/* Begge knapper skal have eksplicitte <span> børn og være i separate DropdownMenuItem'er, 
                      da SignedOut/SignedIn også kun må returnere et enkelt element. */}
                  <SignedOut>
                    <DropdownMenuItem asChild>
                      <SignInButton>
                        <span className="cursor-pointer">Log ind</span>
                      </SignInButton>
                    </DropdownMenuItem>
                  </SignedOut>
                  <SignedIn>
                    <DropdownMenuItem asChild>
                      <SignOutButton>
                        <span className="cursor-pointer">Log ud</span>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </SignedIn>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
