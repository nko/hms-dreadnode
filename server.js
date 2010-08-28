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

// Gamestate manager
function GameManager() {
  this.users = new Array();
}

GameManager.prototype = new process.EventEmitter();
GameManager.prototype.addUser = function(user) {
  // Bail if the username already exists
  if (this.users.indexOf(user) !== -1) {
    return;
  }

  this.users.push(user);
  this.emit("newuser");
}

GameManager.prototype.getUsers = function() {
  return this.users;
}

manager = new GameManager();
manager.on("newuser", function () {
  console.log(sys.inspect(this.getUsers()));
});

// Socket.IO
var io = io.listen(dreadnode);
io.on("connection", function(client) {

  manager.on("newuser", function () {
    userlist = {type: "userlist", msg: manager.getUsers()};
    client.send(JSON.stringify(userlist));
  });

  console.log("Socket.IO Client Connected");
  client.broadcast("New user connected. Welcome");

  client.on("message", function(message) {
    console.log("Incoming message: " + sys.inspect(message));

    var response = {type: response, msg: "Your message was garbage"};
    try {
      message = JSON.parse(message);
      switch (message.type) {
        case "chat":
          response.msg = "Received your chat message";
        break;
        case "username":
          response.msg = "Received your username";

          // Hehehehehe.
          if(message.msg === "no") {
            response.type = "no";
            response.msg = "NOOOOOOOOOOO!";
          } else {
            manager.addUser(message.msg);
          }

        break;
        default:
          response.msg = "What the hell did you send?";
      }

    } catch (e) {
      console.log("Couldn't parse message: " + sys.inspect(message));
      console.log(sys.inspect(e));
    }
    client.send(JSON.stringify(response));
  });

  client.on("disconnect", function() {
    console.log("Socket.IO Client Disconnected");
  });
});

dreadnode.listen(port);
console.log("Dreadnode server listening on :"+port);
