// Component Name : SignInForm
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
import { SignInSchema } from "../types"

import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/actions/auth.actions"
import Link from "next/link"

export function SignInForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Section 1 
  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    
    const res = await signIn(values)
    if (res.success) {
      toast({
        variant: "default",
        description: "Signed in successfully",
      });
      if(typeof window){
        setTimeout(() => {
          window.location.reload()
        },1000);
        
      }
      return;
    }
    toast({
      variant: "destructive",
      description: res.error,
    })
  }
  return (
    // Section 2 
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
        <Button type="submit">Submit</Button>
      </form>
      {/* Section 3 */}
      <div className="flex gap-2">
        <p> Don't have account?</p>
        <Link className="text-blue-700  hover:bg-slate-200 rounded-md" href="/sign-up">Sign-Up Now</Link>
      </div>
    </Form>
  )
}


/**
 * ---------------------------------------------------------------------
 * File Name      : SignInForm.tsx
 * Component Name : SignInForm
 * Component Type : Form
 * Date Created   : 2024-06-24
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Question: Why was it necessary to create this component?
 * Answer  : This component was necessary to provide a user interface for signing in, handling form validation, and managing authentication state in a user-friendly and efficient manner.
 *
 * ------------------------------
 * Question: What does this component do?:
 * Answer  :  This component renders a sign-in form that allows users to input their email and password. It validates the inputs using a schema, handles form submission, attempts to sign the user in, and provides feedback via toast notifications. If the sign-in is successful, it reloads the page; if not, it displays an error message.
 *
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Section 1:
 * Handles form submission, attempts user sign-in, and provides feedback based on the result.
 * 
 * Section 2:
 * Renders the form fields for email and password input, including validation and error messages.
 * 
 * Section 3:
 * Provides a link for users to navigate to the sign-up page if they don't have an account.
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