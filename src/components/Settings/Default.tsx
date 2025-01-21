import {
    BeakerIcon,
    BellDotIcon,
    EyeIcon,
    Globe2Icon,
    HeadphonesIcon,
    LockIcon,
    UserIcon,
} from "lucide-react";
import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


const settingsCards = [
    {
        icon: <UserIcon className="w-8 h-8" />,
        title: "Personal info",
        description: "Provide personal details and how we can reach you",
    },
    {
        icon: <LockIcon className="w-8 h-8" />,
        title: "Login & security",
        description: "Update your password and secure your account",
    },
    {
        icon: <EyeIcon className="w-8 h-8" />,
        title: "Privacy & sharing",
        description:
            "Manage your personal data, connected services, and data sharing settings",
    },
    {
        icon: <Globe2Icon className="w-8 h-8" />,
        title: "Global preferences",
        description: "Set your default language, metrics, and timezone",
    },
    {
        icon: <BellDotIcon className="w-8 h-8" />,
        title: "Notifications",
        description:
            "Choose notification preferences and how you want to be contacted",
    },
    {
        icon: <HeadphonesIcon className="w-8 h-8" />,
        title: "Feedback & Support",
        description: "Contact support or report an issue.",
    },
];

interface DefaultProps {
    setPage: (page: string) => void;
}

export default function Default({ setPage }: DefaultProps) {
    return (
        <div className="w-full min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-[1080px] mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-semibold text-foreground mb-2">
                            Settings
                        </h1>
                        <div className="text-lg text-foreground">
                            <span className="font-semibold">John Doe, </span>
                            <span>hello@johndoe · </span>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {settingsCards.map((card, index) => (
                            <Card
                                key={index}
                                className="hover:shadow-lg transition-shadow duration-200"
                                onClick={() => setPage(card.title)}
                            >
                                <CardContent className="p-6">
                                    <div className="mb-8">{card.icon}</div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-base text-foreground">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {card.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



