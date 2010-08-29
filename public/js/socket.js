(function(global,$){

  // Nerf
  var console = global.console || {
    log: function() { },
    warn: function() { },
    error: function() { }
  };

  var dispatch = {
    auth : function(message) {
      var status = message.status || "failed";
      var msg = message.msg || "?";
      if (status === "success") {
        $("#login_content").toggle();
        $("#gameboard_content").show();
      } else {
        alert(message.msg);
        $("#username").focus();
      }
    },
    // Nooooooooooooooo!!!
    no : function() {
      var mediaplayer = $("#player")[0];
      if ("play" in mediaplayer) {
        mediaplayer.play();
      }
    }
  };

  // Instantiate Transport with Socket.IO
	$.socket = new $.io.Socket(null);
  $.socket.connect();
  $.socket.on("connect", function() {
    console.log("IO Connected.");
  });
  $.socket.on("disconnect", function() {
    console.log("Reconnecting.");
    socket.connect();
  });
  $.socket.on("message", function(message) {
    try {
      message = JSON.parse(message);
      if ("type" in message) {
        dispatch[message.type](message);
      }
    } catch (e) {
      console.warn(message);
    }
  });

})(window,jQuery);