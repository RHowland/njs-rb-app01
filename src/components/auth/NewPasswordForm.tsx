// Component Name : NewPasswordForm
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
import { NewPassworSchema } from "@/zodSchemaTypes"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { newPassword } from "@/lib/actions/auth.actions"
import { useLoading } from "@/hooks/useLoading"
import Spinner from "@/components/Sppinner"
import { useEffect } from "react"

export function NewPasswordForm() {
  // secition 1 
  const {state : LoadingState , handleStateChange : handleLoadingState } = useLoading();
  // section  2 
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || "";

  const form = useForm<z.infer<typeof NewPassworSchema>>({
    resolver: zodResolver(NewPassworSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // section 3 
  async function onSubmit(values: z.infer<typeof NewPassworSchema>) {
    handleLoadingState({isLoading : true});
    const res = await newPassword(values , token)
    if (res.success) {
      toast({
        variant: "default",
        description: res.message,
      })
      router.push(`/sign-in`);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input placeholder="****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={LoadingState.isLoading}>{LoadingState.isLoading ? <Spinner /> : "Submit"}</Button>
      </form>
    </Form>
  )
}

/**
 * ---------------------------------------------------------------------
 * File Name      : NewPasswordForm.tsx
 * Component Name : NewPasswordForm
 * Component Type : Form
 * Date Created   : 2024-07-1
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  : This component was necessary to enable users to securely reset their password using a token-based authentication process. This is a common requirement for applications that need to maintain secure user accounts and provide a way for users to regain access if they forget their password.
 * ------------------------------
 * Question: What does this component do?:
 * Answer  : This component provides a form for users to enter a new password and confirm it. It validates the input using Zod schema, handles the submission process by calling an API to update the password, and provides feedback to the user via toast notifications. It also manages loading states to enhance user experience during the submission process.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * This section sets up the loading state management using a custom hook `useLoading` to handle UI feedback during form submission.
 * 
 * Section 2:
 * This section initializes the `useRouter` and `useSearchParams` hooks to handle routing and retrieve the password reset token from the URL. It also sets up the form with default values and validation using `react-hook-form` and Zod.
 * 
 * Section 3:
 * This section defines the `onSubmit` function to handle form submission. It makes an API call to update the password and provides user feedback using toasts. The form's UI is rendered here, including the password and confirm password fields, and a submit button that displays a spinner while loading.
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


