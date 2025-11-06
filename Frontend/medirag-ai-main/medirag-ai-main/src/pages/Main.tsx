import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";

interface Message {
  id: number;
  text?: string;
  src?: string;
  isUser: boolean;
  timestamp: string;
}

const Main = () => {
  const [activeSection, setActiveSection] = useState("chat");
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your medical AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, activeSection]);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: messages.length + 1,
      text: query,
      isUser: true,
      timestamp: timeString,
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    try {
      // Call the medical RAG API
      const response = await fetch('http://localhost:5000/api/medical/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          k: 3,
          use_hyde: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: messages.length + 2,
          text: data.answer,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: messages.length + 2,
          text: `Sorry, I encountered an error: ${data.error || 'Unknown error'}. Please try again.`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error calling medical API:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the medical service. Please try again later.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUploadClick = () => fileInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgMessage: Message = {
        id: messages.length + 1,
        src: reader.result as string,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, imgMessage]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-background via-secondary/5 to-background">
      {messages.map((msg, index) => (
        <ChatBubble
          key={msg.id}
          message={msg.text}
          imageSrc={msg.src}
          isUser={msg.isUser}
          timestamp={msg.timestamp}
          delay={index * 0.05}
        />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return (
          <div className="flex flex-col h-[calc(100vh-64px)]">
            {renderMessages()}
            {/* Input Area */}
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-t-2 border-primary/20 p-6 bg-white shadow-lg"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 bg-muted/30 rounded-full px-4 py-2 border-2 border-primary/20 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20 transition-all">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 rounded-full hover:bg-primary/10"
                    onClick={handleImageUploadClick}
                  >
                    <Paperclip className="h-5 w-5 text-primary" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Input
                    placeholder="Ask a medical question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                    ref={inputRef}
                    className="flex-1 h-12 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base disabled:opacity-50"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 rounded-full hover:bg-primary/10"
                    disabled={isTyping}
                  >
                    <Mic className={`h-5 w-5 text-primary ${!isTyping ? 'animate-glow' : ''}`} />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isTyping || !query.trim()}
                    size="icon"
                    className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  AI-powered medical information • Always consult a healthcare professional
                </p>
              </div>
            </motion.div>
          </div>
        );

      case "history":
        return (
          <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Full Conversation History</h2>
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No messages yet.</p>
            ) : (
              messages.map(msg => (
                <ChatBubble
                  key={msg.id}
                  message={msg.text}
                  imageSrc={msg.src}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        );

      case "voice":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 flex items-center justify-center h-full"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
              >
                <Mic className="h-12 w-12 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Voice Input</h3>
              <p className="text-muted-foreground mb-6">
                Click to start recording your question
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                Start Recording
              </Button>
            </div>
          </motion.div>
        );

      case "upload":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 flex items-center justify-center h-full"
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-3xl text-white">📁</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Medical Image</h3>
              <p className="text-muted-foreground mb-6">
                Feature coming soon - AI-powered image analysis
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                Select File
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-hidden">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Main;
