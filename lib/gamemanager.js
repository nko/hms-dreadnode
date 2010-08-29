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
  console.log("Aye, aye, captain. Firing...");
  return;
  
  var connection = this.connections[client.sessionId].gome();
  var game = connection.playa.game;
  
  // TODO: WRONG, all players but the CURRENT player
  game.playas.forEach(function(playa){
    // Was the player hit?
    if (playa.board.checkForHit(shotLocation)) {
      
      // TODO: send shot location to client
      
      // Was the player destroyed?
      if (playa.board.isDestroyed()) {
        // TODO: let user know they are destroyed
        // maybe remove them from the list of players?
        
        // TODO: is the game over??
      }
      
      // TODO: send shot location to all OTHER clients
      // to notify them of the hit
      game.playas.forEach(function (otherplaya) {
        if (otherplaya.username !== playa.username) {
          // TODO: send hit location to client
        }
      });
    }
  });
  
  // TODO: advance player turn and notify next player
  // their turn has begun... REMEMBER to check if the next
  // user is destroyed before passing them the token
};

GameManager.prototype.placeShips = function(client, locations) {

  //TODO: remove return when this function is implemented
  return;
  
  var connection = this.connections[client.sessionId];
  var playa = connection.playa;
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

  // listeners
  this.on("winner", function () {
    console.log(this.name+" wins!");
  });
}

Game.prototype = new process.EventEmitter();

Game.prototype.addPlayer = function (player) {
  this.playas.push(player);
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

  var message = "Haters gone hate.";
}

Playa.prototype = new process.EventEmitter();


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
