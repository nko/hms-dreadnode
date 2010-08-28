// npm dependencies
var express   = require("express"),
    io        = require("socket.io");

var dreadnode = express.createServer(),
    port      = parseInt(process.env.PORT) || 80;

dreadnode.listen(port);
console.log("Dreadnode server listening on :"+port);
