import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface ISocketContext {
  socket: Socket | undefined;
}

export const SocketContext = createContext<ISocketContext>({
  socket: undefined,
});
