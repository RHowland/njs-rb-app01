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





