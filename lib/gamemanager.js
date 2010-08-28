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

  // listeners
  this.on("newuser", function () {
    console.log(sys.inspect(this.getUsers()));
  });
}

GameManager.prototype = new process.EventEmitter();

GameManager.prototype.addUser = function(user) {
  // Bail if the username already exists
  if (this.users.indexOf(user) !== -1) {
    return;
  }
  this.users.push(user);
  this.emit("newuser");
};

GameManager.prototype.getUsers = function() {
  return this.users;
};

GameManager.prototype.addGame = function() {
  this.users.push(user);
  this.emit("newuser");
};

GameManager.prototype.removeGame = function(game) {
  game.emit("winner");
  this.games.splice(this.games.indexOf(game), 1);
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
  this.name = battleName[Math.floor(Math.random()*battleNames.lenth)];
  this.users = [];

  // listeners
  this.on("winner", function () {
    console.log(this.name+" wins!");
  });
}

Game.prototype = new process.EventEmitter();


/*-----------------------------------------------
  Playa Implementation
-----------------------------------------------*/

function Playa() {
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