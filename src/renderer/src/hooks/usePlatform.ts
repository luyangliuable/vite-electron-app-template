import { useState, useEffect } from "react";

export interface PlatformInfo {
  isMacOS: boolean;
  isWindows: boolean;
  isLinux: boolean;
  platform: string;
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isMacOS: false,
    isWindows: false,
    isLinux: false,
    platform: "unknown",
  });

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();

      const isMacOS = userAgent.includes("mac") || platform.includes("mac");
      const isWindows = userAgent.includes("win") || platform.includes("win");
      const isLinux = userAgent.includes("linux") || platform.includes("linux");

      setPlatformInfo({
        isMacOS,
        isWindows,
        isLinux,
        platform: isMacOS
          ? "darwin"
          : isWindows
            ? "win32"
            : isLinux
              ? "linux"
              : "unknown",
      });
    };

    detectPlatform();
  }, []);

  return platformInfo;
};
