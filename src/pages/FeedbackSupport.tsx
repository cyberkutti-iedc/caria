import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import {Textarea} from '../components/ui/Textarea';
import { ArrowLeft } from "lucide-react";
import React from "react";

const ratingOptions = [
  { emoji: "😫", label: "Worst", selected: true },
  { emoji: "🙁", label: "Not\nGood", selected: false },
  { emoji: "😐", label: "Fine", selected: false },
  { emoji: "🙂", label: "Look\nGood", selected: false },
  { emoji: "😍", label: "Very\nGood", selected: false },
];

export default function Feedback(){
  return (
    <Card className="w-[410px] bg-white">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-[#4654b0] cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-normal text-sm">Back</span>
        </div>
        <div className="space-y-8">
          <div className="flex justify-between gap-4">
            <div className="space-y-2 flex-1">
              <InputLabel className="text-sm font-bold text-[#4654b0]">Name</InputLabel>
              <Input
                defaultValue="john"
                className="h-11 border-[#4654b0] text-[#4654b0] font-bold text-xs"
              />
            </div>
            <div className="space-y-2 flex-1">
              <InputLabel className="text-sm font-bold text-[#4654b0]">
                Contact Number
              </InputLabel>
              <Input
                placeholder="+91 00000 00000"
                className="h-11 text-grayscaletinted-gray italic text-xs"
              />
            </div>
          </div>
          <div className="space-y-2">
            <InputLabel className="text-sm font-bold text-[#4654b0]">
              Email Address
            </InputLabel>
            <Input
              placeholder="xyz123@gmail.com"
              className="h-11 w-40 text-grayscaletinted-gray italic text-xs"
            />
          </div>
          <div className="space-y-4">
            <InputLabel className="text-sm font-bold text-[#4654b0]">
              Share your experience in scaling
            </InputLabel>
            <div className="flex justify-between px-2">
              {ratingOptions.map((option, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`text-3xl ${
                      option.selected ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    {option.emoji}
                  </div>
                  <div
                    className={`text-xs font-bold text-center whitespace-pre-line ${
                      option.selected ? "text-[#4654b0]" : "text-[#44665544]"
                    }`}
                  >
                    {option.label}
                  </div>
                </div>
              ))}
            </div>
            <Slider defaultValue={[20]} max={100} step={1} className="w-full" />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Add your comments..."
              className="min-h-[85px] resize-none text-grayscalepale-gray text-xs"
            />
          </div>
          <Button className="w-full h-[45px] bg-[#4654b0] hover:bg-[#4654b0]/90 text-white font-bold">
            SUBMIT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
