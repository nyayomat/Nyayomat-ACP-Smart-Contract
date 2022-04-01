import { writeFileSync } from "fs";

export const saveToFile = async (content: string, file: string) => {
  writeFileSync(file, content);
};
