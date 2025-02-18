import React, { useEffect, useState } from "react";
import { Send, Leaf } from "lucide-react";

// Define the types for chatbot messages
interface Message {
  type: "user" | "assistant"; // Only allow "user" or "assistant"
  content: string;
  timestamp: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch chatbot messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/chatbot-message");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chatbot messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        type: "user",
        content: input,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages([...messages, userMessage]);
      setIsLoading(true);
      setInput("");

      try {
        const response = await fetch("/api/chatbot-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();

        const assistantMessage: Message = {
          type: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex flex-col bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Chat Header */}
      <div className="bg-[#4654B0] p-4 flex items-center gap-3 text-white rounded-t-lg">
        <Leaf className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Carbon Footprint Assistant</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md ${
                message.type === "user" ? "bg-[#4654B0] text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 block mt-1">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className={`p-2 bg-[#4654B0] text-white rounded-lg flex items-center gap-2 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3b47a3]"
            }`}
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
