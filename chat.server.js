// const express = require('express');
// const app= express();
// const cors= require('cors');
// app.use(cors())
// require("dotenv").config()
// const http = require('http');
// const { Server} = require("socket.io")
// const server = http.createServer(app)
// const fs = require('fs-extra')
// const io = new Server({
//     maxHttpBufferSize: 1e8 // 100 MB
//   }, {
//     cors: {
//         origin: `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000`,
//         methods: ["GET", "POST", "PUT"],
//     }
// })

// // http.listen(PORT, () => console.log(`listening on ${PORT}`))
// let a=app.listen(3002, () => console.log(`listening on port 3002`));
// io.listen(a)
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);
//     let room;

//     socket.on("join-room", (id) => {
//         room = id;
//         socket.join(id);
//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected");
//     });

//     socket.on("send-message", (data) => {
//         socket.to(room).emit("receive-message", data);
//     });

//     socket.on("send-document", (document) => {
//         // Broadcast the document to all clients in the room except the sender
//         socket.to(room).emit("receive-document", document);
//     });
// });
