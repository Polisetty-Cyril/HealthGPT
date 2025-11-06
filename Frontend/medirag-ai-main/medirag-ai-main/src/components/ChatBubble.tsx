import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  delay?: number;
}

const ChatBubble = ({ message, isUser, delay = 0 }: ChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`flex items-start gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-gradient-to-br from-primary to-secondary" : "bg-muted"
        }`}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </div>

      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-white rounded-tr-none"
            : "bg-muted text-foreground rounded-tl-none"
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
