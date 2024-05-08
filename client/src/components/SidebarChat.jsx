import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";

const SidebarChat = ({ title, last }) => {
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return (
    <div className="sidebarChat">
      <Avatar
        src={`https://avatars.dicebear.com/api/human/
b${seed}.svg`}
      />
      <div className="sidebarChat__info">
        <h2>{title}</h2>
        <p>{last}</p>
      </div>
    </div>
  );
};

export default SidebarChat;
