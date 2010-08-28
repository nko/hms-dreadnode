(function(global,$){

	var $board = $("<div></div>"),
		row_names = "ABCDEFGHIJKLMNO".split(""),
		$row, $cell, $target_board, $my_board
	;
	
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
		
		$target_board = $("#target_board");
		$target_board.append($contents.clone());
		
		$my_board = $("#my_board");
		$my_board.append($contents.clone());
		
		$target_board.click(function(e){
			var $et = $(e.target);
			if ($et.is("a") && !$et.hasClass("hit")) {
				$et.addClass("hit");
			}
		});
				
	});
		  
})(window,jQuery);