(function(global,$){

	var $board = $("<div></div>"),
		row_names = "ABCDEFGHIJKLMNO".split(""),
		$row, $cell, $piece_position_marker, ppm_pos, my_board_offset
	;
	
	function piece_conflicts() {
		var $pieces = global.$my_board.find(".piece"), conflict_found = false;
		
		$pieces.each(function(){
			var $piece = $(this), p_pos = $piece.position();
			p_pos.right = p_pos.left + $piece.width() - 3;
			p_pos.bottom = p_pos.top + $piece.height() - 1;
			if (!(
				(ppm_pos.right < p_pos.left) || (ppm_pos.left > p_pos.right) || (ppm_pos.bottom < p_pos.top) || (ppm_pos.top > p_pos.bottom)
			)) { conflict_found = true; return false; }
		});
		return conflict_found;
	}
	
	function find_valid_piece_location($piece) {
		var piece_off = $piece.offset(),
			pw = $piece.width()-2, ph = $piece.height(),
			pcw = 1 + Math.floor((pw-30)/32), pch = 1 + Math.floor((ph-30)/32),
			px1 = piece_off.left-my_board_offset.left, py1 = piece_off.top-my_board_offset.top,
			px2 = px1 + pw - 1, py2 = py1 + ph -1,
			position = {
				c1: Math.round(px1 / 32),
				c2: Math.round(px2 / 32),
				r1: Math.round(py1 / 32),
				r2: Math.round(py2 / 32)
			}
		;
		
		// constrain piece_position_marker to board
		if (position.c1 < 1) {
			position.c1 = 1;
			position.c2 = position.c1 + pcw - 1;
		}
		else if (position.c2 > 15) {
			position.c2 = 15;
			position.c1 = position.c2 - pcw + 1;
		}
		else {
			position.c2 = position.c1 + pcw - 1;
		}
		
		if (position.r1 < 1) {
			position.r1 = 1;
			position.r2 = position.r1 + pch - 1;
		}
		else if (position.r2 > 15) {
			position.r2 = 15;
			position.r1 = position.r2 - pch + 1;
		}
		else {
			position.r2 = position.r1 + pch - 1;
		}
		
		position.x1 = position.c1 * 32 + 2;
		position.y1 = position.r1 * 32 + 2;
		position.x2 = (position.c2+1) * 32 + 1;
		position.y2 = (position.r2+1) * 32 + 1;
		
		ppm_pos = {left:position.x1, top:position.y1, right:position.x2, bottom:position.y2};
		
		if (!piece_conflicts() && Math.abs(px1-position.x1) <= 50 && Math.abs(px2-position.x2) <= 50 && Math.abs(py1-position.y1) <= 50 && Math.abs(py2-position.y2) <= 50) {
			$piece_position_marker.css({left:position.x1+"px",top:position.y1+"px",width:(position.x2-position.x1-1)+"px",height:(position.y2-position.y1-1)+"px"}).show();
			return position;
		}
		$piece_position_marker.hide();
		return false;
	}
	
	function hide_piece_location_marker() {
		$piece_position_marker.hide();
	}
	
	row_names.unshift("");
	
	$(document).ready(function(){
		for (var row_idx=0; row_idx<=15; row_idx++) {
			$row = $("<div></div>");
			
			if (row_idx==0) $row.attr("id","headers");
			else $row.addClass("row").attr("rel",row_names[row_idx]);
			
			for (var col_idx=0; col_idx<=15; col_idx++) {
				$cell = $("<div></div>");
				
				if (col_idx==0) $cell.addClass("rowlet").text(row_names[row_idx]);
				else if (row_idx==0 && col_idx>0) $cell.text(col_idx);
				else if (row_idx>0 && col_idx>0) $cell.attr("rel",row_names[row_idx]+":"+col_idx).html("<a></a>");
				
				$row.append($cell);
			}
			$board.append($row);
		}
		
		var $contents = $board.children("#headers, .row");
		
		global.$target_board = $("#target_board");
		global.$target_board.append($contents.clone());
		
		global.$my_board = $("#my_board");
		global.$my_board.append($contents.clone());
		global.$my_board.find_valid_piece_location = find_valid_piece_location;
		global.$my_board.hide_piece_location_marker = hide_piece_location_marker;
		
		$piece_position_marker = $("<div></div>").attr("id","piece_position_marker");
		$piece_position_marker.appendTo(global.$my_board);
		my_board_offset = global.$my_board.offset();
		
		global.$target_board.click(function(e){
			var $et = $(e.target);
			if ($et.is("a") && !$et.hasClass("hit")) {
				$et.addClass("hit");
			}
		});
				
	});
		  
})(window,jQuery);