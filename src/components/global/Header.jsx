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
  useUser, // Behold useUser, hvis den bruges andre steder, men ikke direkte her i dette snippet
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
import StepIndicator from "@/components/paymentpage/StepIndicator"; // Korrigeret sti til global StepIndicator

// Modtager nu 'pathname' og 'isPaymentOrConfirmationPage' som props
const Header = ({ backgroundColor, pathname, isPaymentOrConfirmationPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const { user } = useUser(); // Fjernet, hvis ikke brugt direkte i dette snippet for at reducere kompleksitet

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Bestem currentStep og titel baseret på pathname for betalingsflowet
  let currentStep = 0;
  let headerTitle = "SMK"; // Standardtitel

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
      style={{ backgroundColor: backgroundColor }} // Beholder den originale baggrundsfarve
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between w-full">
        {isPaymentOrConfirmationPage ? (
          // Indhold for betalingssiden
          <div className="w-full text-black">
            {" "}
            {/* Tekstfarve er sort for at passe med lys baggrund */}
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
          // Standard header indhold
          <>
            <Link href="/" className="font-bold text-black">
              {" "}
              {/* Standard tekstfarve for logo */}
              SMK
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="flex space-x-6 items-center">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className="px-3 py-2 text-base font-medium transition-colors hover:text-primary focus:outline-none focus:text-primary text-black"
                  >
                    Hjem
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/events"
                    className="px-3 py-2 text-base font-medium transition-colors hover:text-primary focus:outline-none focus:text-primary text-black"
                  >
                    Begivenheder
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/dashboard"
                    className="px-3 py-2 text-base font-medium transition-colors hover:text-primary focus:outline-none focus:text-primary text-black"
                  >
                    Kurator
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/create_edit"
                    className="px-3 py-2 text-base font-medium transition-colors hover:text-primary focus:outline-none focus:text-primary text-black"
                  >
                    Lav event
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {/* Clerk Auth Buttons - Gendannet til original tilstand */}
                <NavigationMenuItem>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobil Navigation */}
            <div className="lg:hidden flex items-center">
              {/* Clerk mobil auth buttons - Gendannet til original tilstand */}
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
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
                  <DropdownMenuItem asChild>
                    <Link href="/">Hjem</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/events">Begivenheder</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Kurator</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/create_edit">Lav event</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SignedOut>
                      <SignInButton>
                        <span className="cursor-pointer">Log ind</span>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <SignOutButton>
                        <span className="cursor-pointer">Log ud</span>
                      </SignOutButton>
                    </SignedIn>
                  </DropdownMenuItem>
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
