// Interfaces preserved for backend functionality
export interface IAPI {
  loadReposFromTxt: () => Promise<any[]>;
  exportRepostoTxt: (repos: any[]) => Promise<void>;
  selectFilesUnderDirectories: () => Promise<any[]>;
  loadCommitFiles: (filePaths: string) => Promise<any[]>;
  encryptStoreGetAll: () => Promise<Record<string, string>>;
  encryptStoreDelete: (key: string) => Promise<void>;
  encryptStoreSet: (key: string, value: string) => Promise<void>;
  loadFile: (filePath: string) => Promise<string>;
}
