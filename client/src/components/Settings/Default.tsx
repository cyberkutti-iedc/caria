import React, { useEffect, useState } from "react";
import {
  BeakerIcon,
  BellDotIcon,
  EyeIcon,
  Globe2Icon,
  HeadphonesIcon,
  LockIcon,
  UserIcon,
} from "lucide-react";

const settingsCards = [
  {
    icon: <UserIcon className="w-8 h-8 text-blue-600" />,
    title: "Personal info",
    description: "Provide personal details and how we can reach you",
  },
  {
    icon: <LockIcon className="w-8 h-8 text-blue-600" />,
    title: "Login & security",
    description: "Update your password and secure your account",
  },
  {
    icon: <EyeIcon className="w-8 h-8 text-blue-600" />,
    title: "Privacy & sharing",
    description: "Manage your personal data, connected services, and data sharing settings",
  },
  {
    icon: <Globe2Icon className="w-8 h-8 text-blue-600" />,
    title: "Global preferences",
    description: "Set your default language, metrics, and timezone",
  },
  {
    icon: <BellDotIcon className="w-8 h-8 text-blue-600" />,
    title: "Notifications",
    description: "Choose notification preferences and how you want to be contacted",
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8 text-blue-600" />,
    title: "Feedback & Support",
    description: "Contact support or report an issue.",
  },
];

interface SettingsProps {
  setPage: (page: string) => void;
}

export default function Settings({ setPage }: SettingsProps) {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/info");
        const data = await response.json();

        const emailInfo = data.find((item: { label: string; value: string }) => item.label === "Email");
        const nameInfo = data.find((item: { label: string; value: string }) => item.label === "Name");

        if (emailInfo || nameInfo) {
          setEmail(emailInfo?.value || "Not Available");
          setName(nameInfo?.value || "User");
        }
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchInfo();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Settings</h1>
          <div className="text-lg text-gray-700">
            <span className="font-semibold">{name} </span>
            <span>{email}</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex flex-col gap-4 transition cursor-pointer border border-gray-200"
              onClick={() => setPage(card.title)}
            >
              <div className="p-3 rounded-full bg-blue-100 w-fit">{card.icon}</div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
