import TokenVerificationForm from "@root/src/components/auth/TokenVerificationForm"
import { validateRequest } from "@root/src/lib/lucia"
import { redirect } from "next/navigation"

export default async function VerifyToken (){
    const { user } = await validateRequest()
  // section 1 
  if (user) {
    return redirect("/")
  }


  return (
    <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900 md:h-screen">
      <TokenVerificationForm />
    </div>
  )
}


/**
 * ---------------------------------------------------------------------
 * File Name      : page.tsx
 * Component Name : VerifyToken
 * Component Type : Page Component
 * Date Created   : 2024-07-01
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Purpose:
 * This component renders the TokenVerificationForm for verifying user tokens. It checks if the user is already authenticated and redirects to the homepage if they are.
 * ------------------------------
 * Input Comments:     (Enter "none" if you have no comments)
 * None
 * ------------------------------
 * Output Comments:    (Enter "none" if you have no comments)
 * None
 * ------------------------------
 * Additional Comments:
 * - The component uses the validateRequest function to check if the user is authenticated.
 * - If the user is authenticated, they are redirected to the homepage.
 * - If the user is not authenticated, the TokenVerificationForm component is rendered.
 * Question: Did you have to write any unusual code?
 * Answer  : NO.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1: 
 * - Checks if the user is authenticated. If so, redirects to the homepage.
 * ------------------------------
 */