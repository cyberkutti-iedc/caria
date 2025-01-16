import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/Accordion";
import { Card, CardContent } from "../components/ui/card";
import React, { JSX } from "react";

const securityOptions = [
  {
    title: "Change metrics",
    id: "change-metrics",
  },
  {
    title: "Time zone",
    id: "time-zone",
  },
  {
    title: "Language",
    id: "language",
  },
];

export default function Desktop(): JSX.Element {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="w-full max-w-[1440px] p-16 bg-gradient-to-b from-[rgba(119,150,243,0.12)] to-[rgba(255,255,255,0.2)]">
        <div className="max-w-[1016px] mx-auto">
          <header className="mb-4">
            <h1 className="font-['Roboto-SemiBold'] text-[32px] leading-9 text-[#222222] mb-2">
              Settings
            </h1>
            <h2 className="font-['Roboto-SemiBold'] text-[24.1px] leading-[27.1px] text-[#222222d1]">
              Global Preferences
            </h2>
          </header>

          <p className="text-sm text-[#717171] mb-8">
            Set your default language, metrics, and timezone
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {securityOptions.map((option) => (
              <AccordionItem
                key={option.id}
                value={option.id}
                className="border border-[#0000004a] rounded-[14px] bg-white"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <span className="font-['Roboto-SemiBold'] text-[24.1px] leading-[27.1px] text-[#222222d1]">
                    {option.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 py-4">
                  <Card>
                    <CardContent className="p-4">
                      <div>{/* Content for each security option would go here */}</div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}