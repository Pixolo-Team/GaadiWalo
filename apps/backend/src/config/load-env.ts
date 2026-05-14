// LIBRARIES //
import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const getEnvironmentFilePaths = (): string[] => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirectoryPath = path.dirname(currentFilePath);

  return [
    path.resolve(currentDirectoryPath, "../../.env"),
    path.resolve(currentDirectoryPath, "../../../.env"),
  ];
};

const loadEnvironmentFile = (): void => {
  for (const environmentFilePath of getEnvironmentFilePaths()) {
    if (existsSync(environmentFilePath)) {
      loadEnvFile(environmentFilePath);
      return;
    }
  }
};

loadEnvironmentFile();
