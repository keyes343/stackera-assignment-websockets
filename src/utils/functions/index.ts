import fs from "fs";
import path from "path";

export const catchError = async <T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error]> => {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error] as [Error];
    });
};

// Function to write uniqueResults to a new file
export async function printToFile(val: any) {
  // ! put some env logic here to not execute in prod mode
  const specificDirectory = path.join(process.cwd(), "src");
  const filePath = path.join(specificDirectory, "consoleLog.json"); // Define the file path in the specific directory
  // Ensure the specific directory exists
  if (!fs.existsSync(specificDirectory)) {
    console.error("The specified directory does not exist.");
    return;
  }

  fs.writeFile(filePath, JSON.stringify(val, null, 2), (err: any) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log(`Unique results written to ${filePath}`); // Log the file path
      // if (val.open_file) {
      //   // Open the directory in File Explorer
      //   exec(`start "" "${specificDirectory}"`, (error) => {
      //     if (error) {
      //       console.error("Error opening directory:", error);
      //     }
      //   });
      // }
    }
  });
}
