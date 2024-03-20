import { RouterProvider } from "react-router-dom";
import { router } from "./Router.tsx";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ChatContext, IChatContext } from "./contexts/ChatContext.ts";
import { IMessage } from "./models/IMessage.ts";
import { ISocketContext, SocketContext } from "./contexts/SocketContext.ts";
import { IUserContext, UserContext } from "./contexts/UserContext.ts";
import { IUser } from "./models/IUser.ts";

export const App = () => {
  const [state, setState] = useState<IChatContext>({
    messages: [],
  });
  const [socketState, setSocketState] = useState<ISocketContext>({
    socket: undefined,
  });
  const [usersState, setUsersState] = useState<IUserContext>({
    users: [],
  });
  // const [selectedRoom, setSelectedRoom] = useState<Topic>();

  useEffect(() => {
    if (socketState.socket) return;

    const s = io("http://localhost:3000");

    s.on("show_messages", (m: IMessage[]) => {
      setState({ ...state, messages: m });
    });

    s.on("newUserResponse", (u: IUser[]) =>
      setUsersState({ ...usersState, users: u })
    );

    setSocketState({ ...socketState, socket: s });
  }, []);

  return (
    <>
      <SocketContext.Provider value={socketState}>
        <ChatContext.Provider value={state}>
          <UserContext.Provider value={usersState}>
            <RouterProvider router={router}></RouterProvider>
          </UserContext.Provider>
        </ChatContext.Provider>
      </SocketContext.Provider>
    </>
  );
};
