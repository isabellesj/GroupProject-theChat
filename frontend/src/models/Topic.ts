import { IMessage } from "./IMessage";

export class Topic {
  constructor(
    public id: string,
    public name: string,
    public messages: IMessage[]
  ) {}
}
