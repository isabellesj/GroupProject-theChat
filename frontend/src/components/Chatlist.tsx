import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { IUser } from "../models/IUser";
import { SocketContext } from "../contexts/SocketContext";
import { Topic } from "../models/Topic";

export interface IChatList {
  rooms: Topic[];
}

export const Chatlist = ({ rooms }: IChatList) => {
  const { users } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
    socket?.emit("disconnect", currentUser);
  };
  const currentUser = localStorage.getItem("userName");
  const goToChat = (chat: string) => {
    socket?.emit("join_room", chat, currentUser, (chat: Topic) => {
      console.log(currentUser + "" + "joined room:" + "" + chat.name);
      console.log(chat);
    });
  };

  return (
    <>
      <div className="chatList-container">
        <h2>Tjattrum</h2>

        <nav className="chatList-links">
          <div className="chatlist-links__background">
            {rooms.map((chatroom) => (
              <NavLink
                to={"/chat/" + chatroom.name}
                key={chatroom.name}
                onClick={() => {
                  goToChat(chatroom.id);
                }}
              >
                {chatroom.name}
              </NavLink>
            ))}
          </div>
        </nav>
        <h2>Users online</h2>
        <div className="active-users">
          {users?.map((user: IUser) => (
            <p key={user.socketID}>{user.userName}</p>
          ))}
        </div>
        <button className="log-out-btn" onClick={handleClick}>
          Log out
        </button>
      </div>
    </>
  );
};
