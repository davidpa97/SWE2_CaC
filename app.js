// Import and configure dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

//Define routers
const indexRouter = require('./routes/index');
const heartbeatsRouter = require('./routes/heartbeats');
const diagnosticsRouter = require('./routes/diagnostics');
const usersRouter = require('./routes/users');
const turbinesRouter = require('./routes/turbines');
const testsRouter = require('./routes/tests');
const gatewaysRouter = require('./routes/gateways');
const softwareLinksRouter = require('./routes/softwareLinks');

//Define and initialize mongoose connection
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/test', {useNewUrlParser: true});

//Initialize Express app
const app = express();

if (process.env.NODE_ENV !== 'test') {
    //Initialize WebSocket
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: 3030 });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(data) {
            console.log("Data from error notification: " + data);
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    console.log("Sending Data!");
                    client.send(data);
                }
            });
        });
    });
    console.log("App.js setup WS successfully.");
}

//Define express settings, and mixins
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use('/api',express.static(path.join(__dirname, 'public')));

//Register routers with Express
app.use('/api', indexRouter);
app.use('/api/heartbeats', heartbeatsRouter);
app.use('/api/diagnostics', diagnosticsRouter);
app.use('/api/users', usersRouter);
app.use('/api/turbines', turbinesRouter);
app.use('/api/gateways', gatewaysRouter);
app.use('/api/softwareLinks', softwareLinksRouter);
app.use('/api/tests', testsRouter);

//Export the app to parent module (www)
module.exports = app;