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
  res.render("index.jade", {
    locals: {
      title: "HMS Dreadnode"
    }
  });
});

dreadnode.listen(port);
console.log("Dreadnode server listening on :"+port);
