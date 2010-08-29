(function(global,$){

  // Nerf
  var console = global.console || {
    log: function() { },
    warn: function() { },
    error: function() { }
  };

  // Smerf
  global.dread = global.dread || {};
  var dread = global.dread;

  // Gargamello
  if (!("Message" in dread)) {
    dread.Message = function(type, msg) {
      this.type = type;
      this.msg = msg;
    }
  }

  // Watership Down
  var dispatch = {
    auth : function(message) {
      var status = message.status || "failed";
      var msg = message.msg || "?";
      if (status === "success") {
        APPVIEW.next_page();
      } else {
        alert(message.msg);
        $("#uname").focus();
      }
    },
    // not
    gravatar : function(message) {
      var msg = message.msg || "";
      console.log("gravatar md5 "+msg);
    },
    // Nooooooooooooooo!!!
    no : function() {
      var mediaplayer = $("#player")[0];
      if ("play" in mediaplayer) {
        mediaplayer.play();
      }
    },
    yourturn : function(message) {
      var msg = message.msg || "";
      console.log("msg");
      alert("msg");

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

  // Event Handlers
  $("#readyBtn").live("click", function(e) {
    e.preventDefault();
    var Message = dread.Message || function(){};
    var ships;
    if (ships = My_Gameboard.get_ships()) {
      alert(JSON.stringify(ships));
      $.socket.send(JSON.stringify(new Message("ready", ships)));
    }
    else {
      alert("All ships need to be placed on the board!");
    }
    return false;
  });

  dread.fire = function(shot) {
    $.socket.send(JSON.stringify(new Message("shot", shot)));
  };

})(window,jQuery);