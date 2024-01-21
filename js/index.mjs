import {fs} from 'fs';

document.addEventListener('keypress', async (event) => {
  if (event.key === ' ') {
    try {
      const response = await fetch('sectors.json');
      
      // Check if the response status is OK
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Parse the response as JSON
      const data = await response.json();
      
      const jsonData = {};
      jsonData.sectorInfo = [];
      
      // Here, 'data' contains the parsed JSON data
      // You can now work with the JSON data
      for (let i = 0; i < 576; i++) {
        const randomNum = Math.random() * 20;
        jsonData.sectorInfo.push({
          sectorID: i,
          plantHealth: data.sectorInfo[i].waterAddAmount,
          waterAddAmount: randomNum
        });
      }
      
      jsonData.globalInfo = {
        timeID: data.globalInfo.timeID,
        currentTemperature: data.globalInfo.currentTemperature,
        currentPrecipitation: data.globalInfo.currentPrecipitation,
        totalWaterYouHave: data.globalInfo.totalWaterYouHave
      };
      
      // Add a listener for the Space key
      console.log('Space key released');
      // Your custom logic for Space key release here
      
      // Convert the JSON data to a string
      const jsonString = JSON.stringify(jsonData, null, 2);
      
      // Write the JSON data to a file
      const filePath = 'sectors1.json';
      var output = fs.readFileSync(filePat)
      
      console.log('JSON file has been written successfully.');
    } catch (error) {
      console.error('Error:', error);
    }
  }
});
