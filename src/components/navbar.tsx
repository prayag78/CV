"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  //NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function NavbarComponent() {
  const { isSignedIn } = useUser();
  //const { user } = useUser();
  //console.log(user);


  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/sync-user", { method: "POST" });
    }
  }, [isSignedIn]);
  
  const navItems = [
    // {
    //   name: "Dashboard",
    //   link: "/dashboard",
    // },
    {
      name: "Templates",
      link: "/templates",
    },
    // {
    //   name: "Pricing",
    //   link: "/pricing",
    // },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full sticky top-0 z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <div>
            <Link
              href="/"
              className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
            >
              {/* <Image
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={30}
        height={30}
      /> */}

              <span className="font-medium text-black dark:text-white">
                GenCV
              </span>
            </Link>
          </div>
          <NavItems items={navItems} />
          <div className="flex items-center">
            <NavbarButton className="flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="secondary">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </NavbarButton>

            <NavbarButton className="flex items-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button variant="default">Sign Up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* <NavbarLogo /> */}
            <div>
              <Link
                href="/"
                className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
              >
                <span className="font-medium text-black dark:text-white">
                  GenCV
                </span>
              </Link>
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton className="flex items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="secondary">Sign In</Button>
                  </SignInButton>
                </SignedOut>
              </NavbarButton>

              <NavbarButton className="flex items-center">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button variant="default">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
                  
              </NavbarButton>
              <SignedIn>
                  <UserButton />
                </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
