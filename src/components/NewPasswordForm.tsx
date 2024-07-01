// Component Name : SignUpForm
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
import { NewPassworSchema } from "../zodSchemaTypes"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { newPassword } from "@/lib/actions/auth.actions"

export function NewPasswordForm() {
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

  // section 1 
  async function onSubmit(values: z.infer<typeof NewPassworSchema>) {
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
  }
  return (
    // section 2 
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
        <Button type="submit">Submit</Button>
      </form>
      {/* section 3  */}
    </Form>
  )
}

/**
 * ---------------------------------------------------------------------
 * File Name      : SignUpForm.tsx
 * Component Name : SignUpForm
 * Component Type : Form
 * Date Created   : 2024-06-24
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  : This component was necessary to provide a user interface for account registration, handling form validation, and managing the process of creating a new user account in a user-friendly and efficient manner.
 *
 * ------------------------------
 * Question: What does this component do?:
 * Answer  :  This component renders a sign-up form that allows users to input their name, email, password, and confirm their password. It validates the inputs using a schema, handles form submission, attempts to register the user, and provides feedback via toast notifications. If the sign-up is successful, it reloads the page; if not, it displays an error message.
 *
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * Handles form submission, attempts user registration, and provides feedback based on the result.
 * 
 * Section 2:
 * Renders the form fields for name, email, password, and confirm password input, including validation and error messages.
 * 
 * Section 3:
 * Provides a link for users to navigate to the sign-in page if they already have an account.
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
