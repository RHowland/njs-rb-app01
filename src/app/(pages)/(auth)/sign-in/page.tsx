// Component Name : SignInPage

import { SignInForm } from "@/components/auth/SignInForm"
import { validateRequest } from "@/lib/lucia"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const { user } = await validateRequest()
  // section 1 
  if (user) {
    return redirect("/")
  }
  // section 2
  return (
    <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900 md:h-screen">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        {/* section 3  */}
        <SignInForm />
      </div>
    </div>
  )
}

/**
 * ---------------------------------------------------------------------
 * File Name      : page.tsx
 * Component Name : SignInPage
 * Component Type : Next Page
 * Date Created   : 2024-06-24
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  : This component was necessary to provide a dedicated page for user authentication. It ensures that authenticated users are redirected to the home page and displays the sign-in form for existing users to log in. 
 *
 * ------------------------------
 * Question: What does this component do?:
 * Answer  : This component checks if a user is already authenticated. If the user is authenticated, it redirects them to the home page. If the user is not authenticated, it renders a page with a sign-in form, allowing existing users to log in to their accounts.
 *
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * Checks if a user is authenticated and redirects them to the home page if they are.
 *
 * Section 2:
 * Sets up the layout for the sign-in page, positioning elements centrally.
 *
 * Section 3:
 * Renders the sign-in form for users to log in to their accounts.
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
