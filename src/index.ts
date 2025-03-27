import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { PORT } from "./config/server-config";
import { Pub, Sub } from "./config/redis-config";
import prisma from "../prisma/migrations/db";



async function initServer() {
    const app = express();
    const server = createServer(app);

    const io = new Server(server, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
    })

    Sub.subscribe('MESSAGE');

    io.on('connection', (socket) => {
        console.log(socket.id);

        socket.on('temp', async (data) => {

            console.log(data); 

            await Pub.publish('MESSAGE', JSON.stringify(data));

            socket.broadcast.emit('send-message', data);
        })  
        // socket.emit("temp", "this is a temp message");
        socket.on('disconnect', () => console.log('user disconnected'));
    })

    Sub.on('message', async (channel, message) => {
        if(channel === 'MESSAGE'){
            io.emit("message", message);
            await prisma.message.create({
                data: {
                    text: message
                }
            })
            console.log("message from terminal", message);
        }
    })

    app.use(express.json());
    app.use(cors());

    server.listen(PORT ? PORT : 5001, () => {
        console.log(`Server is running on PORT:${PORT}`);
    })
}

initServer();

