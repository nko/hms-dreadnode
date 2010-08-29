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
  this.users = [];
  this.games = [];
  this.connections = {};

  // listeners
  this.on("newuser", function () {
    console.log(sys.inspect(this.getUsers()));
  });
}

GameManager.prototype = new process.EventEmitter();

GameManager.prototype.getCurrentGame = function() {

  // Grab the current game or create it if
  // it doesn't exist
  var existingGame;
  if (this.games.length === 0) {
    existingGame = new Game();
    this.addGame(existingGame);
  } else {
    existingGame = this.games[0];
  }
  
  return existingGame;
};

GameManager.prototype.addUser = function(ioClient, user) {
  
  if (this.users.indexOf(user) !== -1) {
    return false;
  }

  var existingGame = this.getCurrentGame();

  this.users.push(user);
  var playa = new Playa(existingGame, user);
  existingGame.addPlayer(playa);
  this.connections[ioClient.sessionId] = {client: ioClient, player: playa};
  // this.emit("newuser");

  return true;
};

GameManager.prototype.getUsers = function() {
  return this.users;
};

GameManager.prototype.addGame = function(game) {
  this.games.push(game);
  this.emit("newgame");
};

GameManager.prototype.removeGame = function(game) {
  game.emit("winner");
  this.games.splice(this.games.indexOf(game), 1);
};

GameManager.prototype.fireShot = function(client, username) {
  console.log("IM AH FIRING MY LAZER!!!!!");
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
  this.users = [];

  // listeners
  this.on("winner", function () {
    console.log(this.name+" wins!");
  });
}

Game.prototype = new process.EventEmitter();

Game.prototype.addPlayer = function (player) {
  this.users.push(player);
};

// Returns whether the player name exists in the game
// instance
Game.prototype.containsPlayerWithName = function(name) {
  
  var filteredPlayers = this.users.filter(function(element) {
    return element.name === name;
  });
  
  return filteredPlayers.length !== 0;
};


/*-----------------------------------------------
  Playa Implementation
-----------------------------------------------*/

function Playa(game, username) {
  this.game = game;
  this.username = username;
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