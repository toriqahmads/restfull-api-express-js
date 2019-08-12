const http = require('http');
const app = require('./app');

//define port for server listening
const port = process.env.PORT || 3000;

//creating server instance
const server = http.createServer(app);

//listening server
server.listen(port);
console.log(port)