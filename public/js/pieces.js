(function(global,$){
		  
	var dragging = false,
		valid_position = false,
		$drag_piece,
		$my_board,
		$pieces,
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
	}
	
	function start_piece_drag(e) {
		dragging = true;
		
        // prevent image drag and text selection
        document.onselectstart = e.target.ondragstart = function(e){e=e||window.event; e.preventDefault&&e.preventDefault(); e.returnValue = false; return false;};
		
		$drag_piece = $(e.target);
		orig_pos = $drag_piece.position();
		
		var pieces_offset = $pieces.offset();
		
		mouseX = e.pageX - pieces_offset.left; 
		mouseY = e.pageY - pieces_offset.top;
		piece_offset_x = mouseX - orig_pos.left;
		piece_offset_y = mouseY - orig_pos.top;
		
		$drag_piece.appendTo("body");
		
		
		$(document).bind("dragstart",function(e){e.preventDefault(); e.returnValue = false; return false;});
		
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
		}
		else stop_drag_piece(e);
	}
	
	function stop_drag_piece(e) {
		$(document).unbind("mousemove mouseup keypress");
		
		if (valid_position) {
			$drag_piece.appendTo($my_board);
		}
		else {
			$drag_piece.appendTo($pieces);
			$drag_piece.removeClass("horz").addClass("vert");
			$drag_piece.css({left:orig_pos.left+"px",top:orig_pos.top+"px"});
		}
		
		dragging = false;
		$drag_piece = null;
		piece_offset_x = 0;
		piece_offset_y = 0;
	}
		  
	$(document).ready(function(){
		$my_board = $("#myboard");
		$pieces = $("#pieces");
		
		$("#warship").css("left","100px");
		$("#submarine").css("left","200px");
		$("#pirateship").css("left","300px");
		$("#tugboat").css("left","400px");
		$("#liferaft").css("left","480px");
		
		$(".piece").bind("mousedown",function(e){
			if ($(this).hasClass("moveable") && !dragging) {
				start_piece_drag(e);
			}
		});

	});
		  
})(window,jQuery);