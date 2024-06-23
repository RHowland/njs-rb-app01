// Component Name: Dashboard

import { Button } from "@/components/ui/button"
import {  validateRequest } from "@/lib/lucia"
import { redirect } from "next/navigation"
import Link from "next/link"
import { signOut } from "@root/src/lib/actions/auth.actions"


export default async function Dashboard() {
  const { user } = await validateRequest()

  // section 1
  if(!user) {
    return redirect("/sign-in")
  }

  // section 2
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="font-bold">This is DashBoard Page</h1>
      <p>{JSON.stringify(user)}</p>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  )
}


/**
 * ---------------------------------------------------------------------
 * File Name      : page.tsx
 * Component Name : Dashboard
 * Component Type : Next Page
 * Date Created   : 2024-06-24
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  :  This component was necessary to provide a protected dashboard page that is accessible only to authenticated users, ensuring secure access to user-specific content and actions such as signing out. 
 *
 * ------------------------------
 * Question: What does this component do?:
 * Answer  : This component checks if a user is authenticated. If the user is not authenticated, it displays a message informing them that they do not have access and provides a link to the sign-in page. If the user is authenticated, it displays the user's information and provides a sign-out button.
 *
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * Checks if a user is authenticated. If not, it renders a message and a link to the sign-in page.
 *  
 * Section 2:
 * Renders the authenticated user's information and provides a sign-out button.
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

