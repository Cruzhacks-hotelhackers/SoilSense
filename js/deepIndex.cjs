// import the required dependencies
require("dotenv").config();
const OpenAI = require("openai");
const fsPromises = require("fs").promises;
const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  let assistantId;
  const assistantFilePath = "./assistant.json";

  // Check if the assistant.json file exists
  try {
    const assistantData = await fsPromises.readFile(
      assistantFilePath,
      "utf8"
    );
    assistantDetails = JSON.parse(assistantData);
    assistantId = assistantDetails.assistantId;
    console.log("\nExisting assistant detected.\n");
  } catch (error) {
    console.log("not detect");
  }


  // Create a thread using the assistantId
  const thread = await openai.beta.threads.create();
  // Use keepAsking as state for keep asking questions
  let keepAsking = true;
  while (keepAsking) {
    const fileName = await askQuestion("Enter the filename to upload: ");



    // Upload a file with an "assistants" purpose
    const file = await openai.files.create({
      file: fs.createReadStream(fileName),
      purpose: "assistants",
    });

    // Create an assistant using the file ID
    const assistant = await openai.beta.assistants.create({
      instructions: "This AI is going to recieve a JSON file that has three objects: ID, sectorInfo and globalInfo. The sector info is going to have 576 elements, each composing values of plantHealth, waterAddAmount, and mineralHealth. The second object is going to have values for timeID, which the number of weeks,  temperature, precipitation, and waterAmount. The goal is to efficiently water each of the sectors so that they  do not dry out and die while also preserving water. The water added will be defined by the value: waterAddAmount. The waterAmount will refill every four iterations, and you will water the sectors every iteration. Make sure you have enough water to continue to water your plants indefinitely. You will receive another updated JSON file with the new plant and weather info, and you have to determine which sectors to water. Your response should ONLY BE  in the following format: An array of 576 items called sectorInfo which have the following variables:      float sectorID;       float plantHealth;      float waterAddAmount;    ONLY CHANGE the waterAddAmount variable based on your interpretation and predictions on the necessary amount of water for each sector. DO NOT change ANYTHING but the water AddAmont. Respond with your changes in a .json file DO NOT respond with any words ONLY the changes in a .json file. DO NOT respond with words, ONLY a .json file." ,      
      model: "gpt-3.5-turbo-1106",      
      tools: [{ "type": "code_interpreter" }],
      file_ids: [file.id]
    });

    console.log(file.id);


    
    try {
      // Read the file to be uploaded
      const fileContent = fs.readFileSync(fileName, { encoding: 'utf8' });

      // Upload the file to OpenAI
      const uploadedFile = await openai.file.create({
          purpose: "classifications",
          file: fileContent
      });

      // Process the file with specific instructions
      const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: "Process this file and provide a summary: " + uploadedFile.id,
          max_tokens: 150
      });

      console.log("Response from OpenAI:", response.choices[0].text);
  } catch (error) {
      console.error("Error processing the file:", error);
  }



  }

}
main();