// Component Name : ResendEmailVerificationFrom
/* eslint-disable react/no-unescaped-entities */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RestPasswordSchema } from "@/zodSchemaTypes"
import { toast } from "@/components/ui/use-toast"
import { resendEmailVerification } from "@/lib/actions/auth.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MailType } from "@/types"
import { useLoading } from "@/hooks/useLoading"
import Spinner from "@/components/Sppinner"
import { useEffect } from "react"

export function ResendEmailVerificationFrom() {
  // section 1 
  const {state : LoadingState , handleStateChange : handleLoadingState } = useLoading();
const router = useRouter()
// section 2 
  const form = useForm<z.infer<typeof RestPasswordSchema>>({
    resolver: zodResolver(RestPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Section 3 
  async function onSubmit(values: z.infer<typeof RestPasswordSchema>) {
    handleLoadingState({isLoading : true});
    const res = await resendEmailVerification(values)
    if (res.success) {
        toast({
          variant: "default",
          description: res.message,
        })
        router.push(`/verify-token?type=${MailType["signUpVerify"]}`);
        return;
      }
      toast({
        variant: "destructive",
        description: res.error,
      })
      handleLoadingState({isLoading : false});
  }
  useEffect(() => {
    return () => {
      handleLoadingState({isLoading : false});
    };
  },[])

  return (
    // Section 4
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <Button type="submit" disabled={LoadingState.isLoading}>{LoadingState.isLoading ? <Spinner /> : "Submit"}</Button>
      </form>
      {/* Section 3 */}
      <div className="flex gap-2">
        <p> Don't have account?</p>
        <Link className="text-blue-700  hover:bg-slate-200 rounded-md" href="/sign-up">Sign-Up Now</Link>
      </div>

      <div className="flex gap-2">
        <p>Already have an account?</p>
        <Link className="text-blue-700  hover:bg-slate-200 rounded-md" href="/sign-in">Sign-In Now</Link>
      </div>
      
    </Form>
  )
}




/**
 * ---------------------------------------------------------------------
 * File Name      : ResendEmailVerificationFrom.tsx
 * Component Name : ResendEmailVerificationFrom
 * Component Type : Form
 * Date Created   : 2024-07-1
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  : This component was necessary to provide users with an option to resend the email verification link. This is important for users who may not have received the initial verification email or who might have accidentally deleted it.
 * ------------------------------
 * Question: What does this component do?:
 * Answer  : This component renders a form that allows users to enter their email address and request a new verification email. It validates the input, handles the submission process by calling an API to resend the verification email, and provides feedback to the user through toast notifications. It also manages loading states to enhance user experience during the form submission.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * This section sets up the loading state management using a custom hook `useLoading` to handle UI feedback during form submission.
 * 
 * Section 2:
 * This section initializes the form using `react-hook-form` and Zod schema for validation. It sets default values and attaches the resolver for validation.
 * 
 * Section 3:
 * This section defines the `onSubmit` function to handle form submission. It makes an API call to resend the email verification and provides user feedback using toasts. It also handles routing to the verify token page and manages the loading state.
 * 
 * Section 4: 
 * This section renders the form fields and the submit button. It also includes links for users to navigate to the sign-up and sign-in pages.
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