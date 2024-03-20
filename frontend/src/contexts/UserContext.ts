import { createContext } from "react";
import { IUser } from "../models/IUser";

export interface IUserContext {
  users: IUser[];
}

export const UserContext = createContext<IUserContext>({
  users: [],
});
