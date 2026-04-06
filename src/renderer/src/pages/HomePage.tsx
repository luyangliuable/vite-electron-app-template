import {
  FileAddOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import BackgroundLayout from "../components/BackgroundLayout";

import image from "../assets/app_logo.svg";

function HomePage(): JSX.Element {
  const { isDarkMode } = useTheme();
  const buttons: {
    text: string;
    path: string;
    icon: ReactNode;
    description: string;
  }[] = [
    {
      text: "Settings",
      path: "/settings",
      icon: <SettingOutlined />,
      description: "Configure application preferences",
    },
  ];

  const navigate = useNavigate();

  const handlePageBtnClick = (path: string): void => {
    console.log("Navigating to page: " + path);
    navigate(path);
  };

  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center h-full px-8 pb-16">
        {/* Logo section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-8">
            <div
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6"
              style={{}}
            >
              <img
                src={image}
                alt="App Logo"
                className="h-16 w-auto mx-auto app-logo"
              />
            </div>
          </div>
        </div>

        {/* Action cards - Responsive sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mb-16">
          {buttons.map((buttonContent, idx) => (
            <div
              key={idx}
              className="group relative bg-white/3 backdrop-blur-md rounded-2xl p-6 border cursor-pointer"
              onClick={() => handlePageBtnClick(buttonContent.path)}
              style={{
                borderColor: "#8C7DD1",
                boxShadow:
                  "0 4px 16px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.05) inset",
              }}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon container with brand colors */}
                <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-all duration-300">
                  <span
                    className="text-2xl transition-colors duration-300"
                    style={{
                      color: "#ACACE6",
                    }}
                  >
                    {buttonContent.icon}
                  </span>
                </div>

                <h3
                  className={`text-lg font-semibold mb-3 tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}
                >
                  {buttonContent.text}
                </h3>
                <p
                  className={`leading-relaxed font-light text-sm ${isDarkMode ? "text-white/80" : "text-slate-600"}`}
                >
                  {buttonContent.description}
                </p>
              </div>

              {/* Trust indicator */}
              <div className="absolute top-4 right-4">
                <div
                  className="w-2 h-2 rounded-full opacity-70"
                  style={{ backgroundColor: "#8C7DD1" }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer message */}
        <div className="max-w-2xl mx-auto">
          <div
            className="bg-white/2 backdrop-blur-md rounded-xl p-6"
            style={{}}
          >
            <p
              className={`text-center leading-relaxed text-sm font-light ${isDarkMode ? "text-white/90" : "text-slate-600"}`}
            >
              Modern Electron + React + TypeScript template with glassmorphic
              design. Built for production with comprehensive component library,
              state management, and responsive layouts.
            </p>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}

export default HomePage;
