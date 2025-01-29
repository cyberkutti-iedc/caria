import React, { useEffect, useState } from "react";
import { Input } from "@mui/base/Input";
import { Leaf, Send } from "lucide-react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '../components/ui/Button';

// Define the types for chatbot messages
interface Message {
  type: "user" | "assistant"; // Only allow "user" or "assistant"
  content: string;
  timestamp: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]); // State to hold messages
  const [input, setInput] = useState<string>(""); // State for user input
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Fetch the chatbot messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/chatbot-message");
        const data = await response.json();
        setMessages(data); // Set the fetched messages
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
        type: "user", // Explicitly set the type as "user"
        content: input,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      // Add user message to the chat
      setMessages([...messages, userMessage]);
      setIsLoading(true);
      setInput(""); // Clear input field

      try {
        // Send the user message to the server for a response
        const response = await fetch("/api/chatbot-reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
        
        const data = await response.json();
        
        // Receive the chatbot's reply
        const assistantMessage: Message = {
          type: "assistant", // Explicitly set the type as "assistant"
          content: data.reply,
          timestamp: new Date().toLocaleTimeString(),
        };
        
        // Add assistant message to the chat
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  return (
    <Card className="w-full mx-auto h-screen flex flex-col ml-10 bg-white shadow-md rounded-lg">
      <div className="bg-[#4654B0] p-4 flex items-center gap-2 text-white rounded-t-lg">
        <Leaf className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Carbon Footprint Assistant</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${message.type === "user" ? "bg-[#4654B0] text-white" : "bg-gray-100"}`}>
                <p>{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message about carbon emissions..."
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={handleSendMessage}
            className={`p-2 bg-[#4654B0] rounded-lg text-white ${isLoading ? "opacity-50" : "hover:bg-[#4654B0]/90"}`}
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
