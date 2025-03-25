import Redis from "ioredis";
import { REDIS_LOCAL_HOST } from "./server-config";

export const Pub = new Redis({
    port: 6379, 
    host: REDIS_LOCAL_HOST, 
});
  
export const Sub = new Redis({
    port: 6379, 
    host: REDIS_LOCAL_HOST, 
});
