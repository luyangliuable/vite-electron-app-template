import BackButton from "./BackButton";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./FeaturePageLayout.css";
import BackgroundLayout from "./BackgroundLayout";
import image from "../assets/sn_primary_logo.png";

function FeaturePageLayout(): JSX.Element {
  return (
    <BackgroundLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className="w-[90%] mx-auto mt-4 mb-4 rounded-xl flex items-center gap-8 py-2 px-4 bg-white/15 backdrop-blur-xl border z-30"
          style={{
            borderColor: "#ACACE6",
            boxShadow:
              "0 4px 16px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.05) inset",
          }}
        >
          <BackButton />
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div
                className="bg-white/5 backdrop-blur-md rounded-2xl"
                style={{}}
              >
                <img
                  src={image}
                  alt="Sonorus Logo"
                  className="h-8 w-auto mx-auto"
                />
              </div>
            </div>
          </div>
          <div className=" ml-auto">
            <Navbar />
          </div>

        </div>

        {/* Main content */}
        <main className="flex-1 flex justify-center px-8 pb-16 overflow-auto">
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </BackgroundLayout>
  );
}

export default FeaturePageLayout;
