// lib/auth.actions.ts
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




/** Purpose: Registers a new user.
Steps:
  1.Hashes the user's password using Argon2.
  2.Generates a unique user ID.
  3.Constructs the user object with hashed password.
  4.Inserts the user into the database.
  5.Creates a session for the new user.
  6.Sets the session cookie in the browser.
  7.Returns success message and user ID upon successful registration, or error message on failure.
*/ 



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
        messageId
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

    
    const { token , expiresHours  } = await storeToken({type : MailType["resetPass"] , userId});

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-token?token=${token}&type=${MailType["resetPass"]}`;
    
    const mailReact = generateMailReact({ userName, tokenUrl : verificationLink , token , type : MailType["resetPass"] , expiresTime : `${expiresHours} Hours` });

    const { id : messageId } = await sendMailTask({type: MailType["resetPass"] , react : mailReact ,targetMail : userEmail  , subject : "Password Reset" });

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


/** Purpose: Authenticates a user.
Steps:
  1.Validates the sign-in credentials against the schema.
  2.Retrieves the user from the database based on the provided email.
  3.Verifies the hashed password against the stored hashed password.
  4.Creates a session for the authenticated user.
  5.Sets the session cookie in the browser.
  6.Returns success message and user ID upon successful authentication, or error message on failure.
*/

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


/**  Purpose: Terminates an active session.
Steps:
  1.Validates the current session and retrieves session information.
  2.Invalidates the session using Lucia.
  3.Removes the session cookie from the browser.
  4.Returns success message or error message on failure.
 */

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


/**  Summary:
This file provides essential functions for user authentication processes such as signing up, signing in, and signing out using secure practices 
like password hashing and session management. It integrates with a database using Drizzle-ORM and ensures secure session handling using Lucia and 
cookies in a Next.js environment.
*/