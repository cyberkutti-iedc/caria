import React from "react";
import { useState } from "react";
import Default from "../components/Settings/Default";
import Notifications from "../components/Settings/Notifications";
import Feedback from "../components/Settings/FeedbackSupport";
import Layout from "../components/Settings/Layout";
import PersonalInfo from "../components/Settings/PersonalInfo";
import { GlobalPreference, PrivacySharing, LoginSecurity } from "../data/SETTINGS_DATA";

export default function Settings() {
    const [page, setPage] = useState("default");
    return ( 

    
        <div className="ml-10">
            {page === "default" ? <Default setPage={setPage} /> : null}
            {page === "Personal info" ? <PersonalInfo /> : null}
            {page === "Login & security" ? <Layout setPage={setPage} title="Login And Security" description="Update your password and secure your account" options={LoginSecurity} /> : null}
            {page === "Privacy & sharing" ? <Layout setPage={setPage} title="Privacy And Sharing" description="Manage your personal data, connected services, and data sharing settings" options={PrivacySharing} /> : null}
            {page === "Global preferences" ? <Layout setPage={setPage} title="Global preferences" description="Set your default language, metrics, and timezone" options={GlobalPreference} /> : null}
            {page === "Notifications" ? <Notifications /> : null}
            {page === "Feedback & Support" ? <Feedback /> : null}
            </div>
    );
};



