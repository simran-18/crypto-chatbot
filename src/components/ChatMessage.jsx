import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.type === "user";

  return (
    <div
      className={`flex gap-4 max-w-[85%] animate-fade-in ${
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
      <Avatar
        className={`h-10 w-10 shrink-0 ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600"
            : "bg-gradient-to-r from-green-500 to-blue-500"
        }`}
      >
        <AvatarFallback className="text-white">
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={`rounded-2xl px-4 py-3 shadow-lg max-w-full ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse">Thinking</div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
              </div>
            </div>
          ) : (
            message.content
          )}
        </div>

        <div
          className={`text-xs mt-2 opacity-70 font-medium ${
            isUser ? "text-right text-blue-100" : "text-left text-gray-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
