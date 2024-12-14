const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // Replace 'public' with your directory

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});