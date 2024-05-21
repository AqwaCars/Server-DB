const express = require("express");

require("./models");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
// const port = 5000;
const http = require("http");
const server = http.createServer(app);
const { Expo } = require("expo-server-sdk");
const expo = new Expo();
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const logger = require("morgan");
var jwt = require("jsonwebtoken");
app.set("TOKEN_SECRET", `${process.env.JWT_SECRET_KEY}`);
app.use(logger("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const carRouter = require("./router/carRouter");
const adminRouter = require("./router/adminRouter");
const userRouter = require("./router/user.Route");
const reviewRouter = require("./router/Review");
const bookMarksRouter = require("./router/BookMark.router");
const agencyRouter = require("./router/Agency");
const requestRouter = require("./router/request.Route");
const mediaRouter = require("./router/Media.Route");
const reportRouter = require("./router/reports");
const bookingRouter = require("./router/booking.Router");
const paymentRouter = require("./router/payment.Route");
const chatRouter = require("./router/chat.router");
const routerNotification = require("./router/notificationRouter");
//!routers
app.use("/api/car", carRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/review", reviewRouter);
app.use("/api/bookmarks", bookMarksRouter);
app.use("/api/agency", agencyRouter);
app.use("/api/request", requestRouter);
app.use("/api/media", mediaRouter);
app.use("/api/report", reportRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chat", chatRouter);
app.use("/api/notification", routerNotification);
// app.listen(5000, function () {
//   console.log("Server is running on port 5000", port);
// });
const acceptServiceNotification = async (receiver, message) => {
  const messages = [
    {
      to: receiver.expoPushToken,
      sound: "default",
      title: `Service Accepted: ${message}`,
      body: "Service request accepted",
    },
  ];

  try {
    await expo.sendPushNotificationsAsync(messages);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const rejectServiceNotification = async (receiver, message) => {
  const messages = [
    {
      to: receiver.expoPushToken,
      sound: "default",
      title: `Service Rejected: ${message}`,
      body: "Service request rejected",
    },
  ];

  try {
    await expo.sendPushNotificationsAsync(messages);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const requestBookingAgency = async (receiver, message) => {
  const messages = [
    {
      to: receiver.socketId,
      sound: "default",
      title: `Booking Request: ${message}`,
      body: "New booking request",
    },
  ];

  try {
    await expo.sendPushNotificationsAsync(messages);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
app.use(function (err, req, res, next) {
  console.log(err);
  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: "Something looks wrong :( !!!" });
});
const io = socketIo(server, {
  cors: {
    origin: `http://${process.env.EXPO_PUBLIC_SERVER_IP}:8081`,
    methods: ["GET", "POST"],
  },
});

const onlineUsers = [];
console.log(onlineUsers, "onlineUser");
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("login", ({ userId }) => {
    // Add the user to the onlineUsers array
    onlineUsers.push({ userId, socketId: socket.id });
    console.log("we are in", onlineUsers);
  });

  socket.on("acceptService", ({ message, receiverId }) => {
    console.log(receiverId, "receiver");
    const receiver = onlineUsers.find((user) => user.userId === receiverId);
    console.log(onlineUsers, "receiver");
    if (receiver) {
      io.to(receiver.socketId).emit("receive-notification", {
        title: "Booking Accepted",
        message: `Booking request accepted for the car: ${message}`,
      });
      acceptServiceNotification(receiver, message);
      console.log("service accept", receiver);
    } else {
      console.log(`User with UserId ${receiverId} not found or offline.`);
    }
  });
  socket.on("updateLocation", (location) => {
    // Broadcast the location to all connected clients
    console.log("here in back", location);
    io.emit("locationUpdated", location);
  });
  socket.on("rejectService", ({ senderId, receiverId, message }) => {
    const receiver = onlineUsers.find((user) => user.userId === receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("receive-notification", {
        title: "Booking Rejected",
        message: `Your Booking request rejected for the car: ${message}`,
      });
      rejectServiceNotification(receiver, message);
      console.log("service reject", receiver);
    } else {
      console.log(`User with UserId ${receiverId} not found or offline.`);
    }
  });
  socket.on("request", ({ senderId, receiverId, message }) => {
    const receiver = onlineUsers.find((user) => user.userId === receiverId);
    if (receiver && receiver.expoPushToken) {
      io.to(receiver.socketId).emit("receive-notification", {
        title: "Request for booking your car",
        message: ` ${message} `,
      });
      requestBookingAgency(receiver, message);
      console.log("request", receiver);
    } else {
      console.log(`User with UserId ${receiverId} not found or offline.`);
    }
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove the disconnected user from the onlineUsers array
    const disconnectedUserIndex = onlineUsers.findIndex(
      (user) => user.socketId === socket.id
    );
    if (disconnectedUserIndex !== -1) {
      const disconnectedUser = onlineUsers.splice(disconnectedUserIndex, 1)[0];
      console.log(`User with UserId ${disconnectedUser.userId} disconnected.`);
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});