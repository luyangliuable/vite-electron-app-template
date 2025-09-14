import { ReactNode } from "react";
import background from "../assets/primary_background_3.png";

interface BackgroundLayoutProps {
  children: ReactNode;
}

function BackgroundLayout({ children }: BackgroundLayoutProps): JSX.Element {
  return (
    <>
      {/* Full screen background */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-0"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Glassmorphism overlay with brand colors */}
      <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-gradient-to-br from-white/8 via-purple-300/10 to-indigo-200/8" />

      {/* Content container */}
      <div className="relative z-20 w-screen h-screen overflow-hidden">
        {children}
      </div>
    </>
  );
}

export default BackgroundLayout;
