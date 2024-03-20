import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { IMessage } from "./models/IMessage";
import { IUser } from "./models/IUser";
import { Topic } from "./models/Topic";

let messages: IMessage[] = [];
let users: IUser[] = [];

let chatrooms: Topic[] = [
  {
    id: "1",
    name: "Community",
  },
  {
    id: "2",
    name: "Javascript",
  },
  {
    id: "3",
    name: "React",
  },
  {
    id: "4",
    name: "PHP",
  },
  {
    id: "5",
    name: "Typescript",
  },
];

const PORT = 3000;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("User " + socket.id + " has connected");

  socket.emit("room_list", chatrooms);

  socket.emit(
    "show_messages",
    // messages?.map((message: IMessage) => {
    //   return { messages };
    // })
    messages
  );

  socket.emit("newUserResponse", users);

  socket.on("get_rooms", (callback) => {
    callback(chatrooms);
  });

  socket.on("newUser", (data) => {
    users.push(data);
    console.log(users);
    io.emit("newUserResponse", users);
  });

  socket.on("message", (data: IMessage) => {
    console.log("MESSAGE", data);
    messages.push(data);
    io.emit("show_messages", messages);
  });

  socket.on("join_room", (chat, currentUser, callback) => {
    socket.rooms.forEach((room) => {
      socket.leave(room); //Lämnar chatt
      socket.broadcast
        .to(room)
        .emit("room_message", currentUser + "" + "left the chat" + "" + room);

      console.log(users);
    });

    socket.join(chat); //Join chatt
    console.log(chat);
    console.log(currentUser + " " + "has connected to" + " " + chat);
    callback(chatrooms.find((c) => c.name === chat)); //vilket chattrum
  });
  socket.on("typing", (data, room) =>
    socket.to(room).emit("typingResponse", data)
  );
  socket.on("not_typing", (data, room) =>
    socket.to(room).emit("notTypingResponse", data)
  );

  socket.on("edit_message", (text: IMessage) => {
    let index = messages.findIndex((m) => m.messageID == text.messageID);
    if (index >= 0) messages[index].text = text.text;

    console.log(messages[index]);

    socket.emit("show_messages", messages);
  });

  socket.on("disconnect", () => {
    console.log("User " + "" + socket.id + "" + " disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    io.emit("newUserResponse", users);
    socket.disconnect();
  });
});

server.listen(3000, () => {
  console.log("Server is up and running");
});
