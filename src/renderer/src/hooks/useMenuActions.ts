import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface MenuActionHandler {
  onSaveRecording?: () => void;
  onFileOpened?: (filePath: string) => void;
  onExportDataRequest?: (filePath: string) => void;
}

export function useMenuActions(handlers?: MenuActionHandler) {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle navigation requests from menu
    const handleNavigation = (_event: any, route: string) => {
      navigate(route);
    };

    // Handle menu actions
    const handleMenuAction = (_event: any, action: string) => {
      switch (action) {
        case "save-recording":
          handlers?.onSaveRecording?.();
          break;
        default:
          console.log(`Unhandled menu action: ${action}`);
      }
    };

    // Handle file opened from menu
    const handleFileOpened = (_event: any, filePath: string) => {
      handlers?.onFileOpened?.(filePath);
    };

    // Handle export data request from menu
    const handleExportDataRequest = (_event: any, filePath: string) => {
      handlers?.onExportDataRequest?.(filePath);
    };

    // Register IPC listeners
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on("navigate-to", handleNavigation);
      window.electron.ipcRenderer.on("menu-action", handleMenuAction);
      window.electron.ipcRenderer.on("file-opened", handleFileOpened);
      window.electron.ipcRenderer.on(
        "export-data-request",
        handleExportDataRequest,
      );
    }

    // Cleanup function
    return () => {
      if (window.electron && window.electron.ipcRenderer) {
        window.electron.ipcRenderer.removeAllListeners("navigate-to");
        window.electron.ipcRenderer.removeAllListeners("menu-action");
        window.electron.ipcRenderer.removeAllListeners("file-opened");
        window.electron.ipcRenderer.removeAllListeners("export-data-request");
      }
    };
  }, [navigate, handlers]);
}
