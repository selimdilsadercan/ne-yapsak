import { Id } from "../convex/_generated/dataModel";
import { USER_ID } from "../lib/constants";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function main() {
  console.log("Seeding movies...");

  try {
    const command = `npx convex run movies:seedMovies "{\\"userId\\":\\"${USER_ID}\\"}"`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error("Error output:", stderr);
    }

    console.log("Command output:", stdout);
    console.log("Successfully seeded movies!");
  } catch (error) {
    console.error("Error seeding movies:", error);
  }
}

main();
