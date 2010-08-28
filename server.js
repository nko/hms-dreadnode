// npm dependencies
var sys       = require("sys"),
    connect   = require("connect"),
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
    console.log("Incoming message: " + sys.inspect(message));

    var response = '{ "response" : "Your message was garbage" }';
    try {
      message = JSON.parse(message);
      switch (message.type) {
        case "chat":
          response = '{ "response" : "Received your chat message" }';
        break;
        case "username":
          response = '{ "response" : "Received your username" }';
        break;
        default:
          response = '{ "response" : "What the hell did you send?" }';
      }

    } catch (e) {
      console.log("Couldn't parse message: " + message);
    }
    client.send(response);
  });

  client.on("disconnect", function() {
    console.log("Socket.IO Client Disconnected");
  });
});

dreadnode.listen(port);
console.log("Dreadnode server listening on :"+port);
