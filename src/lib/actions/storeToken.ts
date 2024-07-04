/**
 * ---------------------------------------------------------------------
 * File Name      : storeToken.ts
 * Module Name    : Token Storage
 * Module Type    : Server Module
 * Date Created   : 2024-07-01
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Module Purpose:
 * This module is responsible for generating and storing verification tokens in the database. These tokens are used for various purposes such as email verification, password reset, and new password setup.
 * ------------------------------
 * Functions:
 * - storeToken: Generates a verification token, stores it in the database with an expiration time, and returns the token details.
 * ------------------------------
 * Input Comments:     (Enter "none" if you have no comments)
 * - The function accepts an object containing the token type (MailType) and userId (string).
 * ------------------------------
 * Output Comments:    (Enter "none" if you have no comments)
 * - The function returns an object containing the token, expiration hours, and expiration time.
 * ------------------------------
 * Additional Comments:
 * - The module uses the Drizzle ORM for database interactions.
 * - The module generates tokens using the generateVerificationToken function from the token module.
 * Question: Did you have to write any unusual code?
 * Answer  : NO.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Function: storeToken
 * Description: Generates a verification token, stores it in the database with an expiration time, and returns the token details.
 * Input: Object containing token type (MailType) and userId (string)
 * Output: Object containing token, expiration hours, and expiration time
 * ------------------------------
 */


import { MailType } from "@root/src/types";
import { generateVerificationToken } from "../token";
import { db } from "@root/dbConnect";
import { verificationToken as verificationTokenSchema } from "@/lib/database/schema"


export const storeToken = async ({type , userId} : {type : MailType , userId : string}) => {
    const token = generateVerificationToken();

    const expiresHours : number = Number(process.env.EXPIER_HOURS)
    const expiresTime =  expiresHours * 60 * 60 * 1000
    const tokenData = {
      token,
      userId,
      type: MailType[type],
      expiresAt : Date.now() + expiresTime
    }
    await db.insert(verificationTokenSchema).values(tokenData);
    return {token , expiresHours , expiresTime };
}