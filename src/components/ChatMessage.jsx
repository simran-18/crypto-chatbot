import React from "react";
import { FaRobot } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const ChatMessage = ({ message }) => {
  const isBot = message.type === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isBot ? "" : "flex-row-reverse"}`}>
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white">
          {isBot ? <FaRobot /> : <FiUser />}
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-sm whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
