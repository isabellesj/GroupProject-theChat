import { ChangeEvent, FormEvent, useState } from "react";
import { IMessage } from "../models/IMessage";
import { useParams } from "react-router-dom";

export interface IShowChat {
  handleSubmit: (e: FormEvent) => void;
  message: IMessage;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  messages: IMessage[];
  handleTyping: () => void;
  typingStatus: string;
  handleMessage: (m: IMessage) => void;
  roomName: string;
}

export const ShowChat = ({
  handleSubmit,
  handleChange,
  messages,
  message,
  handleTyping,
  typingStatus,
  handleMessage,
  roomName,
}: IShowChat) => {
  const [editing, setEditing] = useState<IMessage | null>();

  console.log("Editing:", editing);

  const filteredList = messages.filter((m: IMessage) => m.roomID === roomName);

  return (
    <div className="chat">
      <section className="chat__header">
        <p className="chat__header-userName">{roomName}</p>
        <article className="chat__header-callIcons">
          <i id="callIcon" className="fa-solid fa-video"></i>
          <i id="callIcon" className="fa-solid fa-phone"></i>
        </article>
      </section>
      <section className="chat__main">
        {filteredList?.map((m: IMessage) =>
          m.username === localStorage.getItem("userName") ? (
            <div className="chat__main-chats" key={m.messageID}>
              <p className="chat__main-name">You</p>
              <div className="chat__main-sender">
                {editing?.messageID === m.messageID ? (
                  <>
                    <input
                      className="edit_input"
                      type="text"
                      value={editing.text}
                      onChange={(e) => {
                        setEditing({ ...editing, text: e.target.value });
                      }}
                    />
                    <button
                      className="edit_btn"
                      onClick={() => {
                        setEditing(null);
                        handleMessage(editing);
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <p className="message-p">
                    {m.text}{" "}
                    <button
                      onClick={() => {
                        {
                          setEditing(m);
                        }
                      }}
                    >
                      Ändra
                    </button>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="chat__main-chats" key={m.messageID}>
              <p>{m.username}</p>
              <div className="chat__main-recipient">
                <p>{m.text}</p>
              </div>
            </div>
          )
        )}
        <div className="chat__main-status">
          <p>{typingStatus}</p>
        </div>
      </section>
      <section className="chat__input">
        <form onSubmit={handleSubmit}>
          <input
            className="chat__input-box"
            type="text"
            placeholder="Type something..."
            value={message.text}
            onChange={handleChange}
            onKeyDown={handleTyping}
          ></input>
          <button className="chat__input-button">
            <i id="chat__input-icon" className="fa-solid fa-arrow-up"></i>
          </button>
        </form>
      </section>
    </div>
  );
};
