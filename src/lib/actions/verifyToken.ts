/**
 * ---------------------------------------------------------------------
 * File Name      : verifyToken.ts
 * Module Name    : Token Verification
 * Module Type    : Server Module
 * Date Created   : 2024-07-01
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Module Purpose:
 * This module handles the verification of tokens for actions such as email verification, password reset, and new password setup. It interacts with the database to validate tokens and update user statuses accordingly.
 * ------------------------------
 * Functions:
 * - deleteToken: Deletes a verification token from the database.
 * - verifyToken: Verifies a token and performs the corresponding action (e.g., email verification, password reset).
 * ------------------------------
 * Input Comments:     (Enter "none" if you have no comments)
 * - The functions accept strings representing tokens and types.
 * ------------------------------
 * Output Comments:    (Enter "none" if you have no comments)
 * - All functions return success or error messages along with relevant data.
 * ------------------------------
 * Additional Comments:
 * - The module uses the Drizzle ORM for database interactions.
 * - The module handles different types of tokens using the MailType enum.
 * Question: Did you have to write any unusual code?
 * Answer  : NO.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Function: deleteToken
 * Description: Deletes a verification token from the database.
 * Input: Token string
 * Output: None
 * 
 * Function: verifyToken
 * Description: Verifies a token and performs the corresponding action (e.g., email verification, password reset).
 * Input: Token string, type string
 * Output: Success or error message with relevant data
 * ------------------------------
 */


"use server";

import { db } from "@root/dbConnect"
import { verificationToken as verificationTokenSchema } from "../database/schema"
import { eq } from "drizzle-orm"
import { MailType } from "@root/src/types";
import { user as userSchema } from "@root/src/lib/database/schema";


export const deleteToken = async (token : string) => {
    await db.delete(verificationTokenSchema).where(eq(verificationTokenSchema.token, token));
}

interface IverifyToken {
    success : boolean;
    message : string;
    data : any
}
export const verifyToken  = async (token : string , type : string | null) : Promise<IverifyToken> => {
    const result : any = await db.select().from(verificationTokenSchema).where(eq(verificationTokenSchema.token , token));
    
    if(!result[0] || result[0].type !== type || Number(result[0].expiresAt) < Date.now() ) {
        return {
            success : false,
            message : "Verification token isn't valid",
            data: {}
        }
    }else if (result[0].type === MailType["signUpVerify"] || result[0].type === MailType["newPassword"]){
            await db.update(userSchema).set({isVerified : true , updatedAt : Date.now()}).where(eq(userSchema.id , result[0].userId )).returning()
            await deleteToken(token)
    }else if(result[0].type === MailType["resetPass"]){
        await db.update(verificationTokenSchema).set({type : MailType["newPassword"]}).where(eq(verificationTokenSchema.token , result[0].token )).returning()
    }

    return {
        success : true,
        message : "Verification Successful.",
        data : result[0]
    }
}





