import dotenv from "dotenv";
import { OpenAI } from "openai";
import fs from "fs";
import readline from "readline";

// Create a OpenAI connection
dotenv.config();
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    const fileName = await askQuestion("Enter the filename to upload: ");

    // Check if file exists
    if (!fs.existsSync(fileName)) {
      console.error("File does not exist.");
      return;
    }

    // Upload a file
    const file = await openai.files.create({
      file: fs.createReadStream(fileName),
      purpose: "assistants",
    });

    if (!file || !file.id) {
      console.error("Failed to upload file.");
      return;
    }

    console.log("Assistant created successfully with ID:", file.id);

    // Create an assistant using the file ID
    const assistant = await openai.beta.assistants.create({
      instructions: "...", // Your instructions here
      model: "gpt-3.5-turbo-1106",
      tools: [{ "type": "code_interpreter" }],
      file_ids: [file.id],
    });

    if (!assistant || !assistant.id) {
      console.error("Failed to create assistant.");
      return;
    }

    console.log("Assistant created successfully with ID:", assistant.id);

    // Additional logic for the assistant can be added here
    // ...

    // Save the response to a specific location
    const response = await openai.files.content("file-abc123");
    fs.writeFileSync("output.json", response);

    console.log(`File 'output.json' downloaded successfully.`);
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    readline.close();
  }
}

main();
