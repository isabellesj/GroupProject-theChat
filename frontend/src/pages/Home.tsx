import { useState, FormEvent, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { UserContext } from "../contexts/UserContext";
import { Topic } from "../models/Topic";

export const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { socket } = useContext(SocketContext);

  const { users } = useContext(UserContext);

  console.log(users);

  useEffect(() => {
    socket?.on("room_list", (rooms: Topic[]) => {});
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userName", userName);

    let isUserNameTaken = false;
    console.log(userName);
    console.log(users);

    if (users.length !== 0) {
      console.log("true");

      users.forEach((user) => {
        if (userName !== user.userName) {
          console.log("funkar");
        } else {
          console.log("funkar ej");
          isUserNameTaken = true;
        }
      });

      if (!isUserNameTaken) {
        socket?.emit("newUser", { userName, socketID: socket.id });
        navigate("/chat/Community");
      } else {
        alert("This user name is taken, try another");
        return;
      }
    } else {
      console.log("false");

      socket?.emit("newUser", { userName, socketID: socket.id });
      navigate("/chat/Community");
    }
  };

  return (
    <section className="heroImage">
      <div className="homeTitleContainer">
        <h1 className="homeTitle">TJATT</h1>
      </div>
      <form className="signInContainer" onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <div className="signInInputcontainer">
          <input
            type="text"
            placeholder="Username"
            minLength={6}
            name="username"
            id="username"
            value={userName}
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <button className="signInButton">Log In</button>
      </form>
    </section>
  );
};
