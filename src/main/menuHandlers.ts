import { BrowserWindow, dialog, app } from "electron";

export interface MenuAction {
  action: string;
  data?: any;
}

export class MenuHandlers {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  async handleFileOpen(): Promise<void> {
    const result = await dialog.showOpenDialog(this.mainWindow, {
      title: "Open Patient File",
      filters: [
        { name: "Patient Files", extensions: ["json", "csv", "txt"] },
        { name: "All Files", extensions: ["*"] },
      ],
      properties: ["openFile"],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      // Send file path to renderer process
      this.mainWindow.webContents.send("file-opened", result.filePaths[0]);
    }
  }

  async handleExportData(): Promise<void> {
    const result = await dialog.showSaveDialog(this.mainWindow, {
      title: "Export Sonorus Data",
      defaultPath: `sonorus-export-${new Date().toISOString().split("T")[0]}.json`,
      filters: [
        { name: "JSON Files", extensions: ["json"] },
        { name: "CSV Files", extensions: ["csv"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!result.canceled && result.filePath) {
      // Send export request to renderer process
      this.mainWindow.webContents.send("export-data-request", result.filePath);
    }
  }

  handleCheckUpdates(): void {
    // For now, show a simple dialog
    dialog.showMessageBox(this.mainWindow, {
      type: "info",
      title: "Check for Updates",
      message: "Update Check",
      detail: `You are running Sonorus version ${app.getVersion()}.\n\nAutomatic update checking will be available in a future release.`,
      buttons: ["OK"],
      defaultId: 0,
    });
  }

  navigateToPreferences(): void {
    // Send navigation request to renderer
    this.mainWindow.webContents.send("navigate-to", "/settings");
  }

  startNewSession(): void {
    // Send new session request to renderer
    this.mainWindow.webContents.send("navigate-to", "/quick-scan");
  }

  saveCurrentRecording(): void {
    // Send save request to renderer
    this.mainWindow.webContents.send("menu-action", "save-recording");
  }
}
