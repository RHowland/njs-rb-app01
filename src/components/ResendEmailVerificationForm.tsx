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
import { RestPasswordSchema } from "../zodSchemaTypes"
import { toast } from "@/components/ui/use-toast"
import { resendEmailVerification } from "@/lib/actions/auth.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MailType } from "../types"

export function ResendEmailVerificationFrom() {
const router = useRouter()
  const form = useForm<z.infer<typeof RestPasswordSchema>>({
    resolver: zodResolver(RestPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Section 1 
  async function onSubmit(values: z.infer<typeof RestPasswordSchema>) {
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
        <Button type="submit">Submit</Button>
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