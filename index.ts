import { Lobby } from "./lobby.js"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(cors()) //use cors middleware
const server = createServer(app)

const NUM_LOBBY_ROOMS = 3 //keep number of rooms small for simplicity

const io = new Server(server)

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001

const lobby = new Lobby(NUM_LOBBY_ROOMS, io)

io.on("connection", (socket) => {
    const clientID = socket.handshake.auth.id

    console.log(`User connected: ${clientID}`)

    lobby.addUser(socket)

    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${clientID}`)

        //start disconnect timer for this user
        lobby.startDisconnectTimer(clientID)
    })
})

server.listen(PORT, "0.0.0.0", () => {
    console.log(`SERVER IS RUNNING ON PORT: ${PORT}`)
})
