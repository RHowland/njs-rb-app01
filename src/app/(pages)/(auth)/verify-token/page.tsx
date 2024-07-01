import TokenVerificationForm from "@root/src/components/TokenVerificationForm"
import { validateRequest } from "@root/src/lib/lucia"
import { redirect } from "next/navigation"

export default async function VerifyToken (){
    const { user } = await validateRequest()
  // section 1 
  if (user) {
    return redirect("/")
  }

  // if(params.token){
    
  // }
  // section 2
  return (
    <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900 md:h-screen">
      <TokenVerificationForm />
    </div>
  )
}