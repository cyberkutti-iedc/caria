import React from "react";


interface DesktopProps {
    title: string;
    description: string;
    options: {
        title: string;
        id: string;
    }[];
}

export default function Layout({ title, description, options, setPage }: DesktopProps & {setPage: (page: string) => void}) {
    return (
    <>
           
        <div className="flex justify-center w-full h-screen">
            <div className="w-full p-16 bg-gradient-to-b from-[rgba(119,150,243,0.12)] to-[rgba(255,255,255,0.2)]">
                <div className=" mx-auto">
                    <header className="mb-4">
                        <h1 className="font-['Roboto-SemiBold'] text-[32px] leading-9 text-[#222222] mb-2">
                            Settings
                        </h1>
                        <h2 className="font-['Roboto-SemiBold'] text-[24.1px] leading-[27.1px] text-[#222222d1]">
                            {title}
                        </h2>
                    </header>

                    <p className="text-sm text-[#717171] mb-8">
                        {description}
                    </p>

                    {options.map((option) => (
                        <div className={`border border-[#0000004a] rounded-[14px] p-4 m-2 ${option.title === "Delete account" ? "bg-red-100" : "bg-white"}`}>
                            <span className="font-['Roboto-SemiBold'] text-[24.1px] leading-[27.1px] text-[#222222d1]">
                                {option.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
    );
}