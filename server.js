var sys       = require("sys"),
    crypto    = require("crypto"),
    // npm dependencies
    connect   = require("connect"),
    express   = require("express"),
    io        = require("socket.io"),
    // local
    gm        = require(__dirname+"/lib/gamemanager");

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
dreadnode.get("/game", function(req, res) {
  res.render("game.jade", {
    locals: {
      title: "HMS Dreadnode"
    }
  });
});

// Game Manager
var manager = gm.createGameManager();


// Utility Objects
var response = {
  type: "response",
  msg: "Your message was garbage"
};

var messenger = {
  shot : function(clientId, msg) {
    return msg;
  }
};

var dispatch = {
  chat : function() {
    response.msg = "Received your chat message";
  },

  username : function(client, message) {
    if(message.msg === "no") {
      response.type = "no";
      response.msg = "NOOOOOOOOOOO!";
    } else {
      var username = message.msg;
      var couldAddUser = manager.addUser(client, username);
      if (couldAddUser["success"]) {
        response.type = "auth";
        response.status = "success";
        response.msg = "Welcome "+username;
      } else {
        response.type = "auth";
        response.status = "ufail";
        response.msg = couldAddUser["reason"];
      } 
    }
    client.send(JSON.stringify(response));
  },

  ready : function(client, message) {
    manager.placeShips(client, message.msg);
  },

  shot : function(client, message) {
    manager.fireShot(client, message.msg);
  },

  gravatar : function(client, message) {
    response.type = "gravatar";
    response.status = "success";
    response.msg = crypto.createHash("md5").update(message.msg).digest("hex");
    client.send(JSON.stringify(response));
  }
};

// Socket.IO
var io = io.listen(dreadnode);
io.on("connection", function(client) {
  console.log("Socket.IO Client Connected");
  //client.broadcast("New user connected. Welcome.");

  client.on("message", function(message) {
    console.log("Incoming message: " + sys.inspect(message));
    try {
      message = JSON.parse(message);
      if ("type" in message) {
        dispatch[message.type](client, message)
      }
    } catch (e) {
      console.log("Couldn't parse message: " + sys.inspect(message));
      console.log(sys.inspect(e));
    }
  });

  client.on("disconnect", function() {
    console.log("Socket.IO Client Disconnected");
  });

  manager.on("winner", function (connection) {
    var game = this;
    console.log(sys.inspect(this, connection));
    userlist = { type: "userlist", msg: manager.getUsers() };
    client.send(JSON.stringify(userlist));
  });
});

dreadnode.listen(port);
console.log("Dreadnode server listening on :"+port);
