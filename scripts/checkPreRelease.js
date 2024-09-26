const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Function to check if pre.json exists and if it indicates pre-release mode
const checkPreRelease = () => {
  const preJsonPath = path.join(__dirname, "../.changeset", "pre.json");

  // Check if pre.json exists
  if (fs.existsSync(preJsonPath)) {
    const preJson = JSON.parse(fs.readFileSync(preJsonPath, "utf-8"));
    if (preJson.mode === "pre") {
      console.log("You are in pre-release mode.");
      return true; // In pre-release mode
    }
  } else {
    console.log("pre.json not found.");
  }

  // If we reach here, we are NOT in pre-release mode
  return false;
};

// Main logic to process command-line arguments
const main = () => {
  const mode = process.argv[2]; // Get the command-line argument

  if (mode !== "release" && mode !== "prerelease") {
    console.error('Invalid argument. Use "release" or "prerelease".');
    process.exit(1);
  }

  const isPreRelease = checkPreRelease();

  if (mode === "prerelease") {
    if (!isPreRelease) {
      console.log("Not in pre-release mode. Running Changeset to enter beta.");
      try {
        execSync("yarn changeset pre enter beta", { stdio: "inherit" });
      } catch (error) {
        console.error("Failed to run changeset command:", error.message);
        process.exit(1); // Exit with error if the command fails
      }
    } else {
      console.log("Already in pre-release mode. No action taken.");
    }
  } else if (mode === "release") {
    if (isPreRelease) {
      console.log(
        "In pre-release mode. Running Changeset to exit pre-release mode."
      );
      try {
        execSync("yarn changeset pre exit", { stdio: "inherit" }); // Adjust command if needed
      } catch (error) {
        console.error("Failed to run changeset command:", error.message);
        process.exit(1); // Exit with error if the command fails
      }
    } else {
      console.log("Already in release mode. No action taken.");
    }
  }
};

// Execute the main function
main();
