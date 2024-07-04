// lib/auth.actions.ts
/**
 * ---------------------------------------------------------------------
 * File Name      : auth.actions.ts
 * Module Name    : Authentication Actions
 * Module Type    : Server Module
 * Date Created   : 2024-07-01
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Module Purpose:
 * This module handles the authentication actions such as user sign-up, sign-in, sign-out, password reset, and email verification. It interacts with the database, manages user sessions, and sends verification emails.
 * ------------------------------
 * Functions:
 * - signUp: Registers a new user, stores their details in the database, and sends a verification email.
 * - newPassword: Resets the user's password if the provided token is valid.
 * - resendEmailVerification: Resends the email verification link to the user's email.
 * - resetPassword: Sends a password reset link to the user's email if the email is registered and verified.
 * - signIn: Authenticates the user, creates a session, and sets a session cookie.
 * - signOut: Invalidates the user's session and clears the session cookie.
 * ------------------------------
 * Input Comments:     (Enter "none" if you have no comments)
 * - All input validation is handled by Zod schemas.
 * ------------------------------
 * Output Comments:    (Enter "none" if you have no comments)
 * - All functions return a success message or an error message.
 * ------------------------------
 * Additional Comments:
 * - The module uses Argon2 for password hashing and verification.
 * - The module uses UUID for generating unique user IDs.
 * - The module interacts with a database using the Drizzle ORM.
 * - The module sends emails using a mail service.
 * Question: Did you have to write any unusual code?
 * Answer  : NO.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Function: signUp
 * Description: Registers a new user and sends a verification email.
 * Input: User details (name, email, password)
 * Output: Success or error message
 * 
 * Function: newPassword
 * Description: Resets the user's password if the provided token is valid.
 * Input: New password, token
 * Output: Success or error message
 * 
 * Function: resendEmailVerification
 * Description: Resends the email verification link to the user's email.
 * Input: User email
 * Output: Success or error message
 * 
 * Function: resetPassword
 * Description: Sends a password reset link to the user's email if the email is registered and verified.
 * Input: User email
 * Output: Success or error message
 * 
 * Function: signIn
 * Description: Authenticates the user, creates a session, and sets a session cookie.
 * Input: User email, password
 * Output: Success or error message
 * 
 * Function: signOut
 * Description: Invalidates the user's session and clears the session cookie.
 * Input: None
 * Output: Success or error message
 * ------------------------------
 */



"use server"
import { z } from "zod"
import { SignInSchema, SignUpSchema ,RestPasswordSchema, NewPassworSchema } from "@root/src/zodSchemaTypes"
import { lucia, validateRequest } from "@/lib/lucia"
import { cookies } from "next/headers"
import * as argon2 from "argon2"

import {  user as userSchema } from "@/lib/database/schema"
import { v4 as uuidv4 } from 'uuid';
import { db } from "@root/dbConnect"
import { eq } from "drizzle-orm"
import { MailType } from "@root/src/types"
import { storeToken } from "./storeToken"
import { generateMailReact, sendMailTask } from "../mail-service"
import { verifyToken } from "./verifyToken"


export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const hashedPassword = await argon2.hash(values.password)
  const userId = uuidv4();
  
  try {
    const existingUsers : any = await db.select().from(userSchema).where(eq(userSchema.email ,values.email ));
    if(existingUsers[0] || existingUsers.lenght > 0){
      return {
        error: "Email Already Registered",
      }
    }

    const user =  {
      id: userId,
      name: values.name,
      email: values.email,
      hashedPassword,
      updatedAt: Date.now()
    }
  
    const storedUser : any =  await db.insert(userSchema).values(user).returning();
    
    const { token , expiresHours  } = await storeToken({type : MailType["signUpVerify"] , userId});

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-token?token=${token}&type=${MailType["signUpVerify"]}`;
    
    const mailReact = generateMailReact({ userName: user.name , tokenUrl : verificationLink , token , type : MailType["signUpVerify"] , expiresTime : `${expiresHours} Hours` });

    const { id : messageId } = await sendMailTask({type: MailType["signUpVerify"] , react : mailReact ,targetMail : user.email  , subject : "Verify Your Email Address" });

    return {
      success: true,
      message: "SignUp Successful! Please Verify Your Email.",
      data: {
        userId : storedUser.id,
      },
    }
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}

export const newPassword = async (values: z.infer<typeof NewPassworSchema> , token : string) => {
  const tokenResult = await  verifyToken(token , "newPassword")
  if(!tokenResult.success){
    return {
      error: "Reset Password Token isn't valid",
    } 
  }
  
  
  
  try {
    const existingUsers : any = await db.select().from(userSchema).where(eq(userSchema.id , tokenResult.data.userId ));
    if(!existingUsers[0] || existingUsers.lenght === 0){
      return {
        error: "User isn't registered yet. Please SignUp",
      }
    }
    const hashedPassword = await argon2.hash(values.password)
    await db.update(userSchema).set({hashedPassword, updatedAt : Date.now()}).where(eq(userSchema.id , existingUsers[0].id )).returning();

  

    return {
      success: true,
      message: "Password Reset successful. Please Sign-in",
      data: {
        userId : existingUsers[0].id,
      },
    }
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}

export const resendEmailVerification = async (values: z.infer<typeof RestPasswordSchema>) => {
  
  try {
    const existingUsers : any = await db.select().from(userSchema).where(eq(userSchema.email ,values.email ));
    if(!existingUsers[0] || existingUsers.lenght === 0){
      return {
        error: "Email isn't Not Registered , Please signUp",
      }
    }
    if(existingUsers[0].isVerified){
      return {
        error: "Email Already verified. Please Sign-in",
      }
    }
    const userId = existingUsers[0].id
    const userName = existingUsers[0].name
    const userEmail = existingUsers[0].email

    
    const { token , expiresHours  } = await storeToken({type : MailType["signUpVerify"] , userId});

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-token?token=${token}&type=${MailType["signUpVerify"]}`;
    
    const mailReact = generateMailReact({ userName, tokenUrl : verificationLink , token , type : MailType["signUpVerify"] , expiresTime : `${expiresHours} Hours` });

    const { id : messageId } = await sendMailTask({type: MailType["signUpVerify"] , react : mailReact ,targetMail : userEmail  , subject : "Email Verifications" });

    return {
      success: true,
      message: "We have sent a email verification link to your email.",
      data: {
        userId,
        messageId
      },
    }
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}



export const resetPassword = async (values: z.infer<typeof RestPasswordSchema>) => {
  
  try {
    const existingUsers : any = await db.select().from(userSchema).where(eq(userSchema.email ,values.email ));
    if(!existingUsers[0] || existingUsers.lenght === 0){
      return {
        error: "Email isn't Not Registered , Please signUp",
      }
    }
    if(!existingUsers[0].isVerified){
      return {
        error: "Email isn't verified. Please verify your Email address.",
      }
    }
    const userId = existingUsers[0].id
    const userName = existingUsers[0].name
    const userEmail = existingUsers[0].email

    
    const { token , expiresHours  } = await storeToken({type : MailType["resetPass"] , userId});

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-token?token=${token}&type=${MailType["resetPass"]}`;
    
    const mailReact = generateMailReact({ userName, tokenUrl : verificationLink , token , type : MailType["resetPass"] , expiresTime : `${expiresHours} Hours` });

    const { id : messageId } = await sendMailTask({type: MailType["resetPass"] , react : mailReact ,targetMail : userEmail  , subject : "Password Reset" });

    return {
      success: true,
      message: "Reset Password link is sent to your email.",
      data: {
        userId,
        messageId
      },
    }
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}



export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values)
  } catch (error: any) {
    return {
      error: error.message,
    }
  }

 

  const result : any = await db.select().from(userSchema).where(eq(userSchema.email ,values.email ));
  const existingUser = result[0];

  if (!existingUser) {
    return {
      isEmailVerified: true,
      error: "User not found",
    }
  }

  if(!existingUser.isVerified){
    return {
      isEmailVerified: false,
      error: "User's email isn't verified.Please verify your email",
    }
  }

  if (!existingUser.hashedPassword) {
    
    return {
      isEmailVerified: true,
      error: "User email or password doesn't match",
    }
  }

  const isValidPassword = await argon2.verify(
    existingUser.hashedPassword,
    values.password
  )

  if (!isValidPassword) {
    return {
      error: "Incorrect useremail or password",
    }
  }

  const session = await lucia.createSession(existingUser.id, {
      email: existingUser.email,
      name: existingUser.name
  });
  const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    success: true,
    message: "Login Successful!",
    data: {
      userId : existingUser.id 
    },
  }
}




export const signOut = async () => {
  try {
    const { session } = await validateRequest()

    if (!session) {
      return {
        error: "Unauthorized",
      }
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}


