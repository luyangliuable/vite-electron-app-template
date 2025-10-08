import React, { ReactNode } from "react";
import { useMenuActions } from "../hooks/useMenuActions";

interface MenuActionsProviderProps {
  children: ReactNode;
}

export function MenuActionsProvider({ children }: MenuActionsProviderProps) {
  // Set up menu actions handling
  useMenuActions({
    onSaveRecording: () => {
      // This will be handled by individual pages that have recording functionality
      console.log("Save recording requested from menu");
    },
    onFileOpened: (filePath: string) => {
      console.log("File opened from menu:", filePath);
      // Handle file opening logic here
    },
    onExportDataRequest: (filePath: string) => {
      console.log("Export data requested from menu:", filePath);
      // Handle data export logic here
    },
  });

  return <>{children}</>;
}