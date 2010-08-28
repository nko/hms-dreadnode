/**
 * Chat client
 */

var console = console || {
  log: function() { },
  warn: function() { },
  error: function() { }
};


(function(global) {
  var io = global.io;
  console.log(io);

  if (!io) {
    console.warn("I've got nothing.")
    return false;
  }

  // connect io service
  var socket = new io.Socket(null);
  socket.connect();
  socket.on("connect", function() {
    socket.send("Yar!");
    console.log("Connecting.");
  });
  socket.on("disconnect", function() {
    console.log("Reconnecting.");
    socket.connect();
  });
  socket.on("message", function(message) {
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.error(message);
      return;
    }
    console.log(message);
  });

  var chatform = document.getElementById("chatform");
  var chatterbox = document.getElementById("chatterbox");

  if (chatform.addEventListener) {
    chatform.addEventListener("submit", submitty, "false");
  } else if (chatform.attachEvent) {
    chatform.attachEvent("onsubmit", submitty);
  }

  function submitty(event) {
    event.preventDefault();
    socket.send(JSON.stringify({ chat : chatterbox.value }));
    chatterbox.value = "";
    return false;
  }

})(this);
