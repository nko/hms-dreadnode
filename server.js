// npm dependencies
var connect   = require("connect"),
    express   = require("express"),
    io        = require("socket.io");

var dreadnode = express.createServer(),
    port      = parseInt(process.env.PORT) || 80;

// Express Configuration
dreadnode.configure(function() {
  dreadnode.set("views", __dirname+"/views");
  dreadnode.use(connect.bodyDecoder());
  dreadnode.use(connect.methodOverride());
  dreadnode.use(dreadnode.router);
  dreadnode.use(connect.staticProvider(__dirname+"/public"));
});

// Express Routes
dreadnode.get("/", function(req, res) {
  res.sendfile("public/index.html");
});

// Socket.IO
var io = io.listen(dreadnode);
io.on("connection", function(client) {
	console.log("Socket.IO Client Connected");
  client.broadcast("New user connected. Welcome");
	client.on("message", function(message) {
		client.send('{ "response" : "OK, thanks. Got it." }');
	});
	client.on("disconnect", function() {
		console.log("Socket.IO Client Disconnected");
	});
});

dreadnode.listen(port);
console.log("Dreadnode server listening on :"+port);
