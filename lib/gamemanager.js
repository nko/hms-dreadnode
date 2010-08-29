/**
 * Game Manager
 */


/*-----------------------------------------------
  Dependencies
-----------------------------------------------*/
var sys = require("sys");


/*-----------------------------------------------
  Game Manager Exports
-----------------------------------------------*/
exports.GameManager = GameManager;
exports.createGameManager = function(){
  return new GameManager();
};


/*-----------------------------------------------
  Game Manager Implementation
-----------------------------------------------*/
function GameManager() {
  this.usernames = [];
  this.games = [];
  this.connections = {};

  // listeners
  this.on("newuser", function () {
    console.log(sys.inspect(this.getUsers()));
  });
}

GameManager.prototype = new process.EventEmitter();

GameManager.prototype.getCurrentGame = function() {

  var manager = this;

  // Grab the current game or create it if
  // it doesn't exist
  var existingGame;
  if (this.games.length === 0) {
    existingGame = new Game();
    
    // Add an event listener for a new user
    manager.on("newuser", function(connection){

      // If this game doesn't contain the new player, we're done
      if (!existingGame.containsPlayerWithName(connection.playa.username)) {
        return;
      }

      // Create the list of users in this game
      var userlist  = [];
      existingGame.playas.forEach(function(element) {
        userlist.push(element.username);
      });

      // Send all users in the game the updated userlist
      userlist.forEach(function(currentUsername) {
        var client = manager.connections[currentUsername].client;
        userlistmsg = { type: "userlist", msg: userlist };
        client.send(JSON.stringify(userlistmsg));
      });
    });
    
    this.addGame(existingGame);
  } else {
    existingGame = this.games[0];
  }
  
  return existingGame;
};

GameManager.prototype.addUser = function(client, username) {

  // Check if username is already in use
  if (this.usernames.indexOf(username) !== -1) {
    return false;
  }

  var existingGame = this.getCurrentGame();
  this.usernames.push(username);
  var playa = new Playa(username, existingGame);
  existingGame.addPlayer(playa);

  var connection = new Connection(client, playa);
  this.connections[client.sessionId] = connection;
  this.connections[username] = connection;
  this.emit("newuser", connection);

  return true;
};

GameManager.prototype.getUsers = function() {
  return this.usernames;
};

GameManager.prototype.addGame = function(game) {
  this.games.push(game);
  game.emit("newgame");
};

/*
 * NOTE: We emit the winner event first here, since the next
 * statement removes the reference to the game.
 */
GameManager.prototype.gameOver = function(game) {
  game.emit("winner");
  this.games.splice(this.games.indexOf(game), 1);
};

GameManager.prototype.fireShot = function(client, shotLocation) {
  
  // TODO: remove this when this function is implemented
  console.log("Aye, aye, captain. Firing on " + shotLocation + "...");
  
  var connection = this.connections[client.sessionId];
  var game = connection.game;

  // Get the list of all OTHER players
  var otherPlayas = game.playas.filter(function(aPlaya) {
    return connection.username !== aPlaya.username;
  });

  otherPlayas.forEach(function(playa){

    // Was the player hit?
    if (playa.ships.hasOwnProperty(shotLocation)) {

      // TODO: send shot location to client
      console.log("Player " + playa.username + " was hit at " + shotLocation);
      playa.ships[shotLocation] = true;

      // Was the player destroyed?
      if (playa.isDestroyed()) {
        // TODO: let user know they are destroyed
        // maybe remove them from the list of players?
        console.log("Player " + playa.username + " was destroyed");

        // TODO: is the game over??
      }

      // TODO: send shot location to all OTHER clients
      // to notify them of the hit
      game.playas.forEach(function (otherplaya) {
        if (otherplaya.username !== playa.username) {
          // TODO: send hit location to client
          console.log("Alerting " + otherplaya.username + " damage occurred at " + shotLocation);
        }
      });
    }
  });

  // TODO: advance player turn and notify next player
  // their turn has begun... REMEMBER to check if the next
  // user is destroyed before passing them the token
  var nextPlaya = game.getNextPlaya();
  console.log("Shot complete, passing turn to " + nextPlaya.username);
};

GameManager.prototype.placeShips = function(client, locations) {
  //TODO: remove return when this function is implemented
  
  var ships = this.connections[client.sessionId].playa.ships;
  var row_names = "ABCDEFGHIJKLMNO".split("");
  var game = this.connections[client.sessionId].game;

  locations.forEach(function(location) {
    var topLeftRowColumn = location.top_left.split(":");
    var bottomRightRowColumn = location.bottom_right.split(":");
    var topLeftRow = topLeftRowColumn[0];
    var topLeftColumn = topLeftRowColumn[1];
    var bottomRightRow = bottomRightRowColumn[0];
    var bottomRightColumn = bottomRightRowColumn[1];
    
    for (var i=row_names.indexOf(topLeftRow); i<=row_names.indexOf(bottomRightRow); i++) {
      for (var j=parseInt(topLeftColumn); j<=parseInt(bottomRightColumn); j++) {
        var occupiedLocation = row_names[i]+":"+j;
        ships[occupiedLocation] = false;
      }
    }
  });

  // This player is now ready
  this.connections[client.sessionId].playa.ready = true;

  // Is everyone in the game ready?
  var everyoneReady = true;
  game.playas.forEach(function(element) {
    if (element.ready === false) {
      everyoneReady = false;
    }
  });

  // TODO: If everyone is ready, start the game already!
  if (everyoneReady) {
    console.log("Everyone is ready, start the friggin' game!");

    // Send the startgame message to the team
    var startGameMsg = {type: "gamestart", msg: "FRUIT!!!"};
    game.playas.forEach(function(element) {
      var playaClient = this.connections[element.username].client;
      client.send(JSON.stringify(startGameMsg));
    });
  }
};

/*-----------------------------------------------
  Game Implementation
-----------------------------------------------*/

function Game() {
  this.battleNames = [
    "Pillows on the Water",
    "Noooooooooooooooo!",
    "Steve's Got a Chainsaw, but I'm on a Boat"
  ];
  this.name = this.battleNames[Math.floor(Math.random()*this.battleNames.length)];
  this.playas = [];
  this.currentPlaya = 0;

  // listeners
  this.on("winner", function () {
    console.log(this.name+" wins!");
  });
}

Game.prototype = new process.EventEmitter();

Game.prototype.addPlayer = function (player) {
  this.playas.push(player);
};

Game.prototype.getNextPlaya = function() {
  // Loop through players until we find the next one
  // that is not already destroyed
  do {
    this.currentPlaya = (++(this.currentPlaya)) % this.playas.length;
  } while (this.playas[this.currentPlaya].isDestroyed());

  return this.playas[this.currentPlaya];
};

// Returns whether the player name exists in the game
// instance
Game.prototype.containsPlayerWithName = function(name) {
  
  var filteredPlayers = this.playas.filter(function(element) {
    return element.username === name;
  });
  
  return filteredPlayers.length !== 0;
};


/*-----------------------------------------------
  Playa Implementation
-----------------------------------------------*/

function Playa(username, game) {
  this.username = username;
  this.game = game;
  this.board = new Board();
  this.hitboard = new Board();
  this.ships = {};
  this.ready = false;

  var message = "Haters gone hate.";
}

Playa.prototype = new process.EventEmitter();

Playa.prototype.isDestroyed = function() {

  // If ANY ship location is undamaged,
  // then the playa is NOT destroyed
  for (var location in this.ships) {
    if (this.ships[location] === false) {
      return false;
    }
  }
  return true;
};


/*-----------------------------------------------
  Board Implementation
-----------------------------------------------*/

function Board() {
}

Board.prototype = new process.EventEmitter();


/*-----------------------------------------------
  Connection Implementation
-----------------------------------------------*/

function Connection(client, playa) {
  var client = client;
  var playa = playa;

  this.__defineGetter__("client", function() { return client });
  this.__defineGetter__("playa", function() { return playa });
  this.__defineGetter__("id", function() { return client.sessionId });
  this.__defineGetter__("username", function() { return playa.username });
  this.__defineGetter__("game", function() { return playa.game });
}
