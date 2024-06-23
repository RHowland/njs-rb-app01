// lib/auth.actions.ts
"use server"
import { z } from "zod"
import { SignInSchema, SignUpSchema } from "@/types"
import { lucia, validateRequest } from "@/lib/lucia"
import { cookies } from "next/headers"
import * as argon2 from "argon2"

import {  user as userSchema } from "@/lib/database/schema"
import { v4 as uuidv4 } from 'uuid';
import { db } from "@root/dbConnect"
import { eq } from "drizzle-orm"




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
    }
    
    const result : any =  await db.insert(userSchema).values(user).returning();


    const session = await lucia.createSession(userId, {
      email: result.email,
      name: result.name
    });
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      message: "SignUp Successful!",
      data: {
        userId : result.id 
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
      error: "User not found",
    }
  }

  if (!existingUser.hashedPassword) {
    
    return {
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