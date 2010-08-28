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
    console.warn("I've got nothing.");
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
  var handlemaker = document.getElementById("username");
  var chatterbox = document.getElementById("chatterbox");

  if (chatform.addEventListener) {
    chatform.addEventListener("submit", submitty, "false");
  } else if (chatform.attachEvent) {
    chatform.attachEvent("onsubmit", submitty);
  }

  function submitty(event) {
    event.preventDefault();

    if (handlemaker.value.length) {
      handlemaker.username = handlemaker.value;
      if ("placeholder" in handlemaker) {
        handlemaker.placeholder = handlemaker.username;
      }
      socket.send(JSON.stringify({
        type : "username",
        msg : handlemaker.value
      }));
      handlemaker.value = "";
      handlemaker.blur();
    }
    if (chatterbox.value.length) {
      socket.send(JSON.stringify({
        type : "chat",
        msg : chatterbox.value
      }));
      chatterbox.value = "";
      chatterbox.blur();
    }

    this.blur();
    return false;
  }

})(this);
