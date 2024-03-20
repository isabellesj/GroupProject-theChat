import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Chatlist } from "../components/Chatlist";
import { ShowChat } from "../components/ShowChat";
import { ChatContext } from "../contexts/ChatContext";
import { IMessage } from "../models/IMessage";
import { Navigation } from "../components/Navigation";
import { SocketContext } from "../contexts/SocketContext";
import { useParams } from "react-router-dom";
import { Topic } from "../models/Topic";

export const Chat = () => {
  const { messages } = useContext(ChatContext);
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState<IMessage>({
    text: "",
    username: "",
    messageID: "",
    socketID: "",
    roomID: "",
  });
  const [typingStatus, setTypingStatus] = useState("");
  const [rooms, setRooms] = useState<Topic[]>([]);

  const [isActive, setActive] = useState(true);
  const ToggleClass = () => {
    setActive(!isActive);
  };

  const params = useParams();
  const thisPage: string = params.id as string;

  useEffect(() => {
    socket?.on("typingResponse", (data) => {
      console.log(data);

      setTypingStatus(data);
    });

    socket?.on("notTypingResponse", (data) => setTypingStatus(data));

    if (rooms.length === 0) {
      socket?.emit("get_rooms", (rooms: Topic[]) => {
        setRooms(rooms);
      });
    }

    if (thisPage) {
      socket?.emit(
        "join_room",
        thisPage,
        localStorage.getItem("userName"),
        () => {}
      );
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    socket?.emit("message", {
      text: message.text,
      username: localStorage.getItem("userName"),
      messageID: `${socket.id}${Math.random()}`,
      socketID: socket.id,
      roomID: thisPage,
    });

    setMessage({
      text: "",
      username: "",
      messageID: "",
      socketID: "",
      roomID: "",
    });

    socket?.emit("not_typing", "", thisPage);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, text: e.target.value });
    if (message.text !== "") {
      socket?.emit(
        "typing",
        `${localStorage.getItem("userName")} is typing...`,
        thisPage
      );
    } else {
      socket?.emit("not_typing", "", thisPage);
    }
  };

  const handleTyping = () => {};

  const handleMessage = (m: IMessage) => {
    socket?.emit("edit_message", m);
  };

  return (
    <section className="chatPageContainer">
      <Navigation toggleClass={ToggleClass} isActive={isActive} />
      <div className="chatMainContainer">
        <div className="chatlist">
          {isActive ? <Chatlist rooms={rooms} /> : null}
        </div>
        <ShowChat
          handleSubmit={handleSubmit}
          message={message}
          handleChange={handleChange}
          messages={messages}
          handleTyping={handleTyping}
          typingStatus={typingStatus}
          roomName={thisPage}
          handleMessage={handleMessage}
        />
      </div>
    </section>
  );
};
