import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const REDIS_LOCAL_HOST = process.env.REDIS_LOCAL_HOST;