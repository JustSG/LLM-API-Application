import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 3000;
export const mistralApiKey = process.env.MISTRAL_API_KEY;