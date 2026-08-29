import fs from "fs";

export const removeLocalFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Removed local file:", filePath);
    }
  } catch (error) {
    console.error("Failed to remove local file:", error);
  }
};