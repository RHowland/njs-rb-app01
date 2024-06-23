// Component Name : NavigationBar
"use client";

import React from "react";
import Link from "next/link";
// import { validateRequest } from "@/lib/lucia";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

interface INavigationBar {
  user: any;
  signOut: () => void;
}

const NavigationBar = ({ user, signOut }: INavigationBar) => {
  // section 1
  if (!user) {
    return (
      <div className="mx-auto w-11/12 mt-2 flex items-center justify-between">
        <Link className="p-4 hover:bg-slate-200 rounded-md font-bold" href="/">
          HOME
        </Link>
        <div className="flex justify-end items-end">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  className="p-4 hover:bg-slate-200 rounded-md"
                  href="/sign-in"
                >
                  sign-in
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  className="p-4 hover:bg-slate-200 rounded-md"
                  href="/sign-up"
                >
                  sign-up
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    );
  }
  // section 2
  return (
    <div className="mx-auto w-11/12 mt-2 flex items-center justify-between">
      <Link className="p-4 hover:bg-slate-200 rounded-md font-bold" href="/">
        HOME
      </Link>
      <div className="flex justify-end items-end">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                className="p-4 hover:bg-slate-200 rounded-md"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <form action={signOut}>
                <Button type="submit">Sign out</Button>
              </form>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default NavigationBar;

/**
 * ---------------------------------------------------------------------
 * File Name      : NavigationBar.tsx
 * Component Name : NavigationBar
 * Component Type : Navbar
 * Date Created   : 2024-06-24
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  : This component was necessary to provide a navigation bar that dynamically adjusts its content based on the user's authentication state, offering navigation options and actions that are appropriate for both authenticated and unauthenticated users.
 *
 * ------------------------------
 * Question: What does this component do?:
 * Answer  : This component renders a navigation bar with links to different pages. If the user is not authenticated, it displays links to the home, sign-in, and sign-up pages. If the user is authenticated, it shows links to the home and dashboard pages, as well as a button to sign out.
 *
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * Renders the navigation bar for unauthenticated users, providing links to the home, sign-in, and sign-up pages.
 *
 * Section 2:
 * Renders the navigation bar for authenticated users, providing links to the home and dashboard pages, along with a sign-out button.
 *
 *
 * ------------------------------
 * Input Comments:     (Enter "none" if you have no comments)
 * None
 * ------------------------------
 * Output Comments:    (Enter "none" if you have no comments)
 * None
 * ------------------------------
 * Additional Comments:
 * Question: Did you have to write any unusual code?
 * Answer  : NO.
 *
 */

