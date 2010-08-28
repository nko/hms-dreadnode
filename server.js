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

// <Express Routes>
// For now, / will be a pretty placeholder
dreadnode.get("/", function(req, res) {
  res.render("index.jade", {
    locals: {
      title: "HMS Dreadnode"
    }
  });
});

dreadnode.get("/game", function(req, res) {
  res.render("game.jade", {
    locals: {
      title: "HMS Dreadnode"
    }
  });
});
// </Express Routes>

// Socket.IO
var io = io.listen(dreadnode);
io.on("connection", function(client) {
	console.log("Socket.IO Client Connected");
  client.broadcast("New user connected. Welcome");
	client.on("message", function(message) {
    console.log(message);
		client.send('{ "response" : "OK, thanks. Got it." }');
	});
	client.on("disconnect", function() {
		console.log("Socket.IO Client Disconnected");
	});
});

dreadnode.listen(port);
console.log("Dreadnode server listening on :"+port);
