const express = require('express');
const app = express();

// Serve static files (HTML, JSON, etc.) from a directory
app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
