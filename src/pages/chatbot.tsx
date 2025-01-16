import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Input } from '@mui/base/Input';
import { Send } from "lucide-react";
import React from "react";

const messages = [
  {
    type: "human",
    content: "Hello! How can I improve my programming skills?",
  },
  {
    type: "ai",
    content:
      "Hello! The first step to improve your programming skills is choosing a programming language. Do you have a specific language in mind?",
  },
  {
    type: "human",
    content: "Yes, I think Python might be interesting. Where should I start?",
  },
  {
    type: "ai",
    content:
      "Great choice! Start by learning basic concepts like variables, conditional statements, and loops. try to start small projects to gain practical experience.AI: You can start with writing a simple program like a calculator or a list manager.",
  },
];

export default function Chatbot (){
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[rgba(119,150,243,0.12)] to-[rgba(255,255,255,0.2)] p-4">
      <div className="max-w-[753px] mx-auto mt-16 space-y-4">
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`border-0 ${
              message.type === "ai" ? "bg-[#cde4ff]" : "bg-white"
            }`}
          >
            <CardContent className="p-1.5">
              <p className="font-['Inter-Regular'] text-sm text-black leading-[22px]">
                {message.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-themes-white-40 backdrop-blur-[146.92px]">
        <div className="max-w-[1116px] mx-auto">
          <Card className="bg-[#ecf5ff] border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <Input
                className="flex-1 bg-transparent border-0 placeholder:text-themes-black-20"
                placeholder="Type message"
              />
              <button className="flex items-center justify-center">
                <Send className="w-[29px] h-[29px]" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

