import { validateRequest } from "@/lib/lucia"
import { ResetPasswordForm } from "@root/src/components/auth/ResetPassoword"
import { redirect } from "next/navigation"

export default async function RestPassword() {
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
          Place Your Registered Email Address for Password reset.
        </h2>
        {/* section 3  */}
        <ResetPasswordForm />
      </div>
    </div>
  )
}


/**
 * ---------------------------------------------------------------------
 * File Name      : page.tsx
 * Component Name : ResetPassword
 * Component Type : Page Component
 * Date Created   : 2024-07-01
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Purpose:
 * This component renders the ResetPasswordForm for users to reset their passwords. It checks if the user is already authenticated and redirects to the homepage if they are.
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
 * - If the user is not authenticated, the ResetPasswordForm component is rendered for password reset.
 * Question: Did you have to write any unusual code?
 * Answer  : NO.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1: 
 * - Checks if the user is authenticated. If so, redirects to the homepage.
 * Section 2:
 * - Renders the ResetPasswordForm component if the user is not authenticated.
 * ------------------------------
 */