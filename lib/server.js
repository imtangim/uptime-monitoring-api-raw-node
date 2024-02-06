//dependecies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const enviroment = require("../helpers/enviroments");
// app object
const server = {};

server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(enviroment.port, () => {
    console.log(`Listening to port ${enviroment.port}`);
  });
};

//handle req and response
server.handleReqRes = handleReqRes;

// start server
server.init=()=>{
    server.createServer();
}

module.exports = server;
