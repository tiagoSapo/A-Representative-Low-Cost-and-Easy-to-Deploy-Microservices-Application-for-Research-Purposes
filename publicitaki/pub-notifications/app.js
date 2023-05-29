const express = require('express');
const cors = require('cors');

const app = express();
const { json } = require('body-parser');

// Route files
const adminRoutes = require('./routes/adminRoutes');
const normalRoutes = require('./routes/normalRoutes');


// Server parameters
const PORT = process.env.PORT || 3000;

// Parsers
app.use(json());

// Enable CORS
app.use(cors());

// Routes
app.use('/', adminRoutes);
app.use('/', normalRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
