import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { PORT } from "./config/server-config";



async function initServer() {
    const app = express();
    const server = createServer(app);

    const io = new Server(server, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
    })

    io.on('connection', (socket) => {
        console.log(socket.id);

        socket.on('temp', (data) => {
            console.log(data); 
            socket.broadcast.emit('send-message', data);
        })
        socket.emit("temp", "this is a temp message");
        socket.on('disconnect', () => console.log('user disconnected'));
    })

    app.use(express.json());
    app.use(cors());

    server.listen(PORT ? PORT : 5001, () => {
        console.log(`Server is running on PORT:${PORT}`);
    })
}

initServer();

