import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from "react";

export default function PersonalInfo() {
    const personalInfo = [
        {
            label: "Name",
            value: "Alex Marshall",
        },
        {
            label: "Username",
            value: "alex_marshall",
        },
        {
            label: "Phone number",
            value: "+1 515 599 9655",
        },
        {
            label: "Email",
            value: "alexmarshall2022@gmail.com",
        },
    ];

    return (
        <main className="w-full h-screen bg-gradient-to-b from-[rgba(119,150,243,0.12)] to-[rgba(255,255,255,0.2)]">
            <div className="max-w-[1016px] mx-auto pt-16 px-4">
                <header className="mb-8">
                    <h1 className="text-[32px] font-semibold text-[#222222] leading-9 mb-2">
                        Settings
                    </h1>
                    <h2 className="text-[24px] font-semibold text-[#222222d1] leading-7">
                        Personal info
                    </h2>
                </header>
                <p className="text-sm text-[#717171] mb-8">
                    Provide personal details and how we can reach you
                </p>
                <div className="space-y-4 max-w-[383px]">
                    {personalInfo.map((field, index) => (
                        <Card
                            key={index}
                            className="bg-[#f4f4f4] rounded-t-[4.67px] rounded-b-none border-t-0 border-x-0 border-b-[1.75px] border-neutral-70"
                        >
                            <CardContent className="p-[18.68px_18.68px_9.34px]">
                                <div className="space-y-1">
                                    <p className="text-xs text-neutral-70 tracking-[0.4px]">
                                        {field.label}
                                    </p>
                                    <p className="text-base text-black tracking-[0.5px]">
                                        {field.value}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button className="w-[328px] h-12 mt-8 bg-[#4654b0] hover:bg-[#4654b0]/90 text-white font-medium">
                    Save
                </Button>
            </div>
        </main>
    );
}
