const express = require('express');
var bodyParser = require('body-parser');
const connectionRoutes = require('./Routers/connectionlogRouter')

const userRoutes = require('./Routers/userRouter');
var cors = require('cors')


const app = express();
const port = 3001; // or any other port you prefer

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(express.json());

// Routes
app.use(connectionRoutes);

app.use(userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
