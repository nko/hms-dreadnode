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

  // Handle disconnects
  if (Modernizr.sessionStorage) {
    if (sessionStorage['username']) {
      dread.username = sessionStorage['username'];
      dread.game = sessionStorage['username'];
    }
    if (sessionStorage['game']) {
      dread.game = sessionStorage['game'];
    }
  }

  // Watership Down
  var dispatch = {
    _alertMessage : function(message) {
      var msg = message.msg;
      console.log(msg);
      alert(msg)
    },
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
    destroyed : function(message) {
      var msg = message.msg;
      console.log(msg);
	  global.APPVIEW.win_state = false;
      global.APPVIEW.next_page();
    },
    gamestart : this._alertMessage,
    // not implemented
    gravatar : function(message) {
      var msg = message.msg || "";
      console.log("gravatar md5 "+msg);
    },
    // peg event
    hit : function(message) {
      var hitLocation = message.msg;
      console.log("HIT "+hitLocation);
	    global.Target_Gameboard.set_peg(hitLocation,true);
    },
    // peg event
    miss : function(message) {
      var missLocation = message.msg;
      console.log("MISS "+missLocation);
	    global.Target_Gameboard.set_peg(missLocation,false);
    },
    // Nooooooooooooooo!!!
    no : function() {
      var mediaplayer = $("#player")[0];
      if ("play" in mediaplayer) {
        mediaplayer.play();
      }
    },
    // peg event: ouch is - you've been hit
    ouch : function(message) {
      var ouchLocation = message.msg;
      console.log("OUCH "+ouchLocation);
	    global.My_Gameboard.set_peg(ouchLocation);
    },
    quitter : this._alertMessage,
    setup : function(message) {
      var playersState = message.msg;
      console.log(playersState);
      // TODO: Push player ready status to Scoreboard
      // { jane: boolean, bob : boolean // ready }
    },
    win : function(message) {
      var msg = message.msg;
      console.log(msg);
	  global.APPVIEW.win_state = true;
      global.APPVIEW.next_page();
    },
    userlist : function(message) {
      var userlist = message.msg || [];
      console.log(JSON.stringify(userlist));
	  
	  var $player_list = $("#players_list"), $tr, $td;
	  if ($player_list.length) {
		  $player_list.find("tbody").empty();
		  for (var count=0; count<userlist.length; count++) {
			  $tr = $("<tr></tr>");
			  $td = $("<td></td>").text((count+1));
			  $tr.append($td);
			  $td = $("<td></td>").text(userlist[count]);
			  $tr.append($td);
			  $player_list.find("tbody").append($tr);
		  }
	  }
    },
    yourturn : function(message) {
      var msg = message.msg || "";
      console.log(msg);
      $("#yourturn").show();
      global.Target_Gameboard.set_your_turn(true);
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
      //alert(JSON.stringify(ships));
      $.socket.send(JSON.stringify(new Message("ready", ships)));
    }
    else {
      alert("All ships need to be placed on the board!");
    }
    return false;
  });
  $("#yourturn").live("click", function(e) {
    $(this).hide();
  });


  // Gargamello
  if (!("Message" in dread)) {
    dread.Message = function(type, msg) {
      this.type = type;
      this.msg = msg;
    }
  }

  dread.fire = function(shot) {
    $.socket.send(JSON.stringify(new dread.Message("shot", shot)));
  };
  
})(window,jQuery);