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