import { Menu, MenuItemConstructorOptions, shell, app, dialog, BrowserWindow } from "electron";
import { MenuHandlers } from "./menuHandlers";

export function createApplicationMenu(mainWindow: BrowserWindow): Menu {
  const menuHandlers = new MenuHandlers(mainWindow);
  const isMac = process.platform === "darwin";

  const template: MenuItemConstructorOptions[] = [
    // macOS app menu
    ...(isMac
      ? [
          {
            label: app.getName(),
            submenu: [
              { label: "About Sonorus", click: () => showAboutDialog(mainWindow) },
              { type: "separator" as const },
              { role: "services" as const },
              { type: "separator" as const },
              { role: "hide" as const },
              { role: "hideOthers" as const },
              { role: "unhide" as const },
              { type: "separator" as const },
              { role: "quit" as const },
            ],
          },
        ]
      : []),

    // File menu
    {
      label: "File",
      submenu: [
        {
          label: "New Recording Session",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            menuHandlers.startNewSession();
          },
        },
        { type: "separator" },
        {
          label: "Open Patient File",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            menuHandlers.handleFileOpen();
          },
        },
        {
          label: "Save Recording",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            menuHandlers.saveCurrentRecording();
          },
        },
        {
          label: "Export Data",
          accelerator: "CmdOrCtrl+E",
          click: () => {
            menuHandlers.handleExportData();
          },
        },
        { type: "separator" },
        {
          label: "Preferences",
          accelerator: isMac ? "Cmd+," : "Ctrl+,",
          click: () => {
            menuHandlers.navigateToPreferences();
          },
        },
        // Quit on non-macOS platforms
        ...(!isMac
          ? [
              { type: "separator" as const },
              {
                label: "Quit Sonorus",
                accelerator: "Ctrl+Q",
                click: () => app.quit(),
              },
            ]
          : []),
      ],
    },

    // Edit menu (standard for macOS)
    ...(isMac
      ? [
          {
            label: "Edit",
            submenu: [
              { role: "undo" as const },
              { role: "redo" as const },
              { type: "separator" as const },
              { role: "cut" as const },
              { role: "copy" as const },
              { role: "paste" as const },
              { role: "selectAll" as const },
            ],
          },
        ]
      : []),

    // View menu
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },

    // Window menu (macOS style)
    ...(isMac
      ? [
          {
            label: "Window",
            submenu: [
              { role: "minimize" as const },
              { role: "close" as const },
              { type: "separator" as const },
              { role: "front" as const },
            ],
          },
        ]
      : []),

    // Help menu
    {
      label: "Help",
      submenu: [
        {
          label: "Documentation",
          click: async () => {
            await shell.openExternal("https://sonorus.tech");
          },
        },
        { type: "separator" },
        {
          label: "Check for Updates",
          click: () => {
            menuHandlers.handleCheckUpdates();
          },
        },
        // About on non-macOS platforms
        ...(!isMac
          ? [
              { type: "separator" as const },
              {
                label: "About Sonorus",
                click: () => showAboutDialog(mainWindow),
              },
            ]
          : []),
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}

function showAboutDialog(mainWindow: BrowserWindow): void {
  const version = app.getVersion();
  const name = "Sonorus";

  dialog.showMessageBox(mainWindow, {
    type: "info",
    title: `About ${name}`,
    message: `${name} ${version}`,
    detail: `Advanced cardiac screening platform for healthcare professionals.\n\nStreamlining heart sound analysis with intelligent detection technology and comprehensive patient recording management.\n\n© 2025 Sonorus Technologies`,
    buttons: ["OK"],
    defaultId: 0,
  });
}