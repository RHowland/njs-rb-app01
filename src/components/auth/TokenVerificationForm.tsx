"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { verifyToken } from "@/lib/actions/verifyToken"
import { MailType } from "@/types"
import { useLoading } from "@/hooks/useLoading"
import Spinner from "@/components/Sppinner"

export default function TokenVerificationForm() {
  // section 1
  const searchParams = useSearchParams()
  const tokenType = searchParams.get("type");
  const token = searchParams.get("token") || "";
  const [inputToken , setInputToken] = useState(token);

  // section 2 
  const {state : LoadingState , handleStateChange : handleLoadingState } = useLoading(Boolean(token));

  const router = useRouter();
  const count = useRef(0)
  // Section 3
  async function tokenVerification (token : string , tokenType : string | null) {
    handleLoadingState({isLoading : true})
    const res =  await verifyToken(token , tokenType)
    if (res.success) {
      if(res.data.type === MailType["signUpVerify"]){
        router.push("/sign-in");
      } else {
        router.push(`/new-password?token=${token}`);
      }
    }
    handleLoadingState({isLoading : false})
    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    })
  }

  // section 4
  useEffect(()=> {
    if(token.length > 0 && count.current == 0){
      count.current = 1;
      tokenVerification(token , tokenType);
    }
    return () => {
      handleLoadingState({isLoading : false});
    };
  },[]);

  // section 5 
  async function onSubmit(e: any) {
    e.preventDefault()
    tokenVerification(inputToken , tokenType);
  }
  return (
    // Section 6 
    <form onSubmit={onSubmit} className="space-y-2  w-4/5">
      <h1>Past your Token</h1>
      <Input disabled={LoadingState.isLoading}  type="text" onChange={(e: { target: { value: SetStateAction<string> } }) => setInputToken(e.target.value)} value={inputToken} placeholder="ba85de9fdf3........" />
      <Button type="submit" disabled={LoadingState.isLoading}>{LoadingState.isLoading ? <Spinner /> : "Submit"}</Button>
    </form>
  )
}


/**
 * ---------------------------------------------------------------------
 * File Name      : TokenVerificationForm.tsx
 * Component Name : TokenVerificationForm
 * Component Type : Form
 * Date Created   : 2024-07-01
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  : This component was necessary to provide users with a way to verify their token for actions such as email verification or password reset. It ensures that users can complete these processes securely by verifying the token they received.
 * ------------------------------
 * Question: What does this component do?:
 * Answer  : This component renders a form for users to input a verification token. It handles token verification by calling an API and provides feedback to the user via toast notifications. If the token is valid, it redirects the user to the appropriate page (either sign-in or reset password). It also manages the loading state during the verification process.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * This section retrieves the token and token type from the URL search parameters and sets the initial token state.
 * 
 * Section 2:
 * This section initializes the loading state using a custom hook `useLoading`, which provides UI feedback during the token verification process. It also sets up the router and a ref to track the number of verification attempts.
 * 
 * Section 3:
 * This section defines the `tokenVerification` function to handle the token verification process. It makes an API call to verify the token and provides feedback to the user. If the token is valid, it redirects the user to the appropriate page based on the token type.
 * 
 * Section 4:
 * This section uses the `useEffect` hook to automatically verify the token if it is present in the URL when the component mounts. It also cleans up the loading state when the component unmounts.
 * 
 * Section 5:
 * This section defines the `onSubmit` function to handle the form submission when the user manually enters the token. It calls the `tokenVerification` function with the input token.
 * 
 * Section 6:
 * This section renders the form for the user to input their token and submit it for verification. It includes an input field and a submit button that displays a spinner while loading.
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

