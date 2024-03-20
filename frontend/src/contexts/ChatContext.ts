import { createContext } from "react";
import { IMessage } from "../models/IMessage";

export interface IChatContext {
  messages: IMessage[];
}

export const ChatContext = createContext<IChatContext>({
  messages: [],
});
