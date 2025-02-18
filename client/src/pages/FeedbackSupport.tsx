import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const ratingOptions = [
  { emoji: "😫", label: "Worst" },
  { emoji: "🙁", label: "Not\nGood" },
  { emoji: "😐", label: "Fine" },
  { emoji: "🙂", label: "Look\nGood" },
  { emoji: "😍", label: "Very\nGood" },
];

export default function Feedback() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(20);
  const [formData, setFormData] = useState({
    name: "John",
    contact: "",
    email: "",
    comments: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
      {/* Back Button */}
      <div className="flex items-center gap-2 text-[#4654b0] cursor-pointer hover:text-[#3b47a3] transition">
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium text-sm">Back</span>
      </div>

      {/* Form Content */}
      <div className="space-y-6 mt-4">
        {/* Name & Contact Number */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <label className="text-sm font-bold text-[#4654b0] block mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4654b0] text-sm"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-bold text-[#4654b0] block mb-1">Contact Number</label>
            <input
              name="contact"
              placeholder="+91 00000 00000"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4654b0] text-sm italic"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="text-sm font-bold text-[#4654b0] block mb-1">Email Address</label>
          <input
            name="email"
            placeholder="xyz123@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4654b0] text-sm italic"
          />
        </div>

        {/* Rating Section */}
        <div>
          <label className="text-sm font-bold text-[#4654b0] block mb-2">Share your experience in scaling</label>
          <div className="flex justify-between px-2">
            {ratingOptions.map((option, index) => (
              <div key={index} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setSelectedRating(index)}>
                <div className={`text-3xl transition ${selectedRating === index ? "opacity-100" : "opacity-50"}`}>
                  {option.emoji}
                </div>
                <div className={`text-xs font-bold text-center whitespace-pre-line transition ${selectedRating === index ? "text-[#4654b0]" : "text-gray-500"}`}>
                  {option.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full cursor-pointer accent-[#4654b0]"
          />
          <p className="text-center text-sm font-medium mt-1">{sliderValue}%</p>
        </div>

        {/* Comments Section */}
        <div>
          <label className="text-sm font-bold text-[#4654b0] block mb-1">Add your comments...</label>
          <textarea
            name="comments"
            placeholder="Write your thoughts here..."
            value={formData.comments}
            onChange={handleChange}
            className="w-full min-h-[85px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4654b0] text-sm resize-none"
          />
        </div>

        {/* Submit Button */}
        <button className="w-full py-3 bg-[#4654b0] text-white font-bold rounded-md hover:bg-[#3b47a3] transition">
          SUBMIT
        </button>
      </div>
    </div>
  );
}
