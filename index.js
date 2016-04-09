// Parse response and routing
const express = require('express');
//handles http requests
const http = require('http');
//help parse incoming http requests
const bodyParser = require('body-parser');
// Logging
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
// creates a new database inside mongo called "auth"
mongoose.connect('mongodb://localhost:auth/auth');

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);



// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);