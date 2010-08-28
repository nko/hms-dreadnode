/**
 * Game Manager
 */

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
  this.teams = [];

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
}

GameManager.prototype.getUsers = function() {
  return this.users;
}