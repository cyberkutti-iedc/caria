import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Input } from '@mui/base/Input';
import { Leaf, Send } from "lucide-react";
import React from "react";
import { Button } from '../components/ui/Button';

const messages = [
  {
    type: "assistant",
    content: "Hello! I'm your Carbon Footprint Assistant. How can I help you understand and reduce your carbon emissions today?",
    timestamp: "12:04 AM",
  },
  {
    type: "user",
    content: "I'd like to know more about my daily commute's carbon impact.",
    timestamp: "12:04 AM",
  },
  {
    type: "assistant",
    content: "Based on average calculations, a 20-mile daily car commute produces approximately 1.85 kg of CO2. Consider carpooling or using public transport to reduce this impact!",
    timestamp: "12:05 AM",
  },
];

export default function Chatbot() {
  return (
    <Card className="w-full mx-auto h-screen flex flex-col">
      <div className="bg-[#4654B0] p-4 flex items-center gap-2 text-white">
        <Leaf className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Carbon Footprint Assistant</h1>
      </div>
      <div className="flex-1 p-4">
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
          <Input placeholder="Type your message about carbon emissions..." className="flex-1" />
          <Button className="bg-[#4654B0]">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}