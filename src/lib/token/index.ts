import { randomBytes } from "crypto";

export const generateVerificationToken = () => {                     // Function to generate a verification token
    return randomBytes(32).toString('hex');                            // Generate a random token and convert it to a hex string
};

