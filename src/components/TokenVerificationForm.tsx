"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { verifyToken } from "../lib/actions/verifyToken"
import { MailType } from "../types"

export default function TokenVerificationForm() {
  const searchParams = useSearchParams()
  const tokenType = searchParams.get("type");
  const token = searchParams.get("token") || "";
  const [inputToken , setInputToken] = useState(token);
  const router = useRouter();
  const count = useRef(0)
  // Section 1
  async function tokenVerification (token : string , tokenType : string | null) {
    const res =  await verifyToken(token , tokenType)
    if (res.success) {
      if(res.data.type === MailType["signUpVerify"]){
        router.push("/sign-in");
      } else {
        router.push(`/new-password?token=${token}`);
      }
    }
    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    })
  }

  useEffect(()=> {
    if(token.length > 0 && count.current == 0){
      count.current = 1;
      tokenVerification(token , tokenType);
    }
  },[]);

  async function onSubmit(e: any) {
    e.preventDefault()
    tokenVerification(inputToken , tokenType);
  }
  return (
    // Section 2 
    <form onSubmit={onSubmit} className="space-y-2">
      <h1>Past your Token</h1>
      <Input type="text" onChange={(e) => setInputToken(e.target.value)} value={inputToken} placeholder="ba85de9fdf3........" />
      <Button type="submit">Submit</Button>
      {token.length > 0 && (<h1>Loading...</h1>)}
    </form>
  )
}