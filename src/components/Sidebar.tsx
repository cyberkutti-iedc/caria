import {
  Bot,
  MonitorSmartphoneIcon,
  BarChart3,
  LayoutDashboard,
  Settings,
  ChevronLast,
  ChevronFirst,
  LogOut,
  HelpCircle,
} from "lucide-react";
import React, { useContext, createContext, useState } from "react";
import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

const SidebarContext = createContext({ expanded: true });

export function SidebarContainer({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen flex flex-row">
      <nav className="h-full inline-flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "scale-0 w-0"
              } duration-500
          `}
          >
            <div className="leading-4">
              <h4 className="font-bold text-gray-800">Caria</h4>
              <span className="text-xs text-gray-600">Software</span>
            </div>
          </div>
          {/*<button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>*/ }
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex">
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              <SidebarItem
                icon={<LogOut size={20} />}
                text="Logout"
                active={false}
                alert={false}
                onClick={() => {}}
              />
              <SidebarItem
                icon={<HelpCircle size={20} />}
                text="Help"
                active={false}
                alert={false}
                onClick={() => {}}
              />
            </ul>
          </SidebarContext.Provider>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
  onClick: () => void;
}

export function SidebarItem({ icon, text, active, alert, onClick }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        } duration-500`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

export default function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarItem
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
        alert
        active={window.location.pathname == "/" ? true : false}
        onClick={() => (window.location.pathname = "/")}
      />
      <SidebarItem
        icon={<MonitorSmartphoneIcon size={20} />}
        text="Devices"
        active={false}
        alert={false}
        onClick={() => (window.location.pathname = "/devices")}
      />
      <SidebarItem
        icon={<BarChart3 size={20} />}
        text="Analytics"
        active={window.location.pathname == "/analytics" ? true : false}
        alert={false}
        onClick={() => (window.location.pathname = "/analytics")}
      />
      <SidebarItem
        icon={<Settings size={20} />}
        text="Settings"
        active={window.location.pathname == "/settings" ? true : false}
        alert={false}
        onClick={() => (window.location.pathname = "/settings")}
      />
      <SidebarItem
        icon={<Bot size={20} />}
        text="ChatBot"
        alert
        active={window.location.pathname == "/chatbot" ? true : false}
        onClick={() => (window.location.pathname = "/chatbot")}
      />
    </SidebarContainer>
  );
}
