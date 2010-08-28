(function(global,$){
		  
	var dragging = false,
		valid_position = false,
		$drag_piece,
		orig_pos,
		mouseX, mouseY,
		piece_offset_x, piece_offset_y
	;
		
	function rotate_piece(e) {
		if ($drag_piece.hasClass("vert")) {
			$drag_piece.removeClass("vert").addClass("horz");
		}
		else {
			$drag_piece.removeClass("horz").addClass("vert");
		}
		var tmp = piece_offset_x;
		piece_offset_x = piece_offset_y;
		piece_offset_y = tmp;
		
		$drag_piece.css({left:mouseX-piece_offset_x+"px",top:mouseY-piece_offset_y+"px"});
		
		valid_position = global.$my_board.find_valid_piece_location($drag_piece);
	}
	
	function start_piece_drag(e) {
		dragging = true;
		
        // prevent image drag and text selection
        document.onselectstart = this.ondragstart = function(e){e=e||window.event; e.preventDefault&&e.preventDefault(); e.returnValue = false; return false;};
		
		$drag_piece = $(this);
		orig_pos = $drag_piece.position();
		
		var parent_offset = $drag_piece.parents("#pieces_bin, #my_board").offset();
		
		mouseX = e.pageX - parent_offset.left; 
		mouseY = e.pageY - parent_offset.top;
		piece_offset_x = mouseX - orig_pos.left;
		piece_offset_y = mouseY - orig_pos.top;
		
		if ($drag_piece.parents("#my_board").length>0) {
			orig_pos = {top:0};
			if ($drag_piece.is("#titanic")) orig_pos.left = 0;
			else if ($drag_piece.is("#warship")) orig_pos.left = 100;
			else if ($drag_piece.is("#submarine")) orig_pos.left = 200;
			else if ($drag_piece.is("#pirateship")) orig_pos.left = 300;
			else if ($drag_piece.is("#tugboat")) orig_pos.left = 400;
			else if ($drag_piece.is("#liferaft")) orig_pos.left = 480;
		}
		$drag_piece.appendTo("body");
		
		$(document).bind("mousemove",drag_piece).bind("mouseup",stop_drag_piece).bind("keypress",function(e){
			if (e.which == 82 || e.which == 114) { // `r` or `R`
				rotate_piece(e);
			}
		});
		
		drag_piece(e);
		
		return false;
	}
	
	function drag_piece(e) {
		if (dragging) {
			mouseX = e.pageX;
			mouseY = e.pageY;
			$drag_piece.css({left:mouseX-piece_offset_x+"px",top:mouseY-piece_offset_y+"px"});
			valid_position = global.$my_board.find_valid_piece_location($drag_piece);
		}
		else stop_drag_piece(e);
	}
	
	function stop_drag_piece(e) {
		$(document).unbind("mousemove mouseup keypress");
		
		global.$my_board.hide_piece_location_marker();
		if (valid_position) {
			$drag_piece.appendTo(global.$my_board);
			$drag_piece.css({left:valid_position.x1+"px",top:valid_position.y1+"px"});
		}
		else {
			$drag_piece.appendTo(global.$pieces_bin);
			$drag_piece.removeClass("horz").addClass("vert");
			$drag_piece.css({left:orig_pos.left+"px",top:orig_pos.top+"px"});
		}
		
		dragging = false;
		$drag_piece = null;
		piece_offset_x = 0;
		piece_offset_y = 0;
	}
		  
	$(document).ready(function(){
		global.$pieces_bin = $("#pieces_bin");
		
		$("#warship").css("left","100px");
		$("#submarine").css("left","200px");
		$("#pirateship").css("left","300px");
		$("#tugboat").css("left","400px");
		$("#liferaft").css("left","480px");
		
		var $pieces = $(".piece");
		
		$pieces.each(function(){
			var $this = $(this), count = +($this.attr("rel")), $hitpeg = $this.find(".hitpeg");
			for (var i=1; i<count; i++) {
				$this.append($hitpeg.clone());
			}
		});
		
		$pieces.bind("mousedown",function(e){
			if ($(this).hasClass("moveable") && !dragging) {
				start_piece_drag.call(this,e);
			}
		});

	});
		  
})(window,jQuery);