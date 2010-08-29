(function(global,$){
	var page_stack = ["index.html","login.html","gameselect.html","gamesetup.html","gameboard.html","results.html"],
		page_cache = {},
		current_page = "index.html",
		$index_content,
		watch_interval
	;
	
	function updateHash(page) {
		if (page != current_page) {
			var href = document.location.href.replace(/#.*$/,"");
			if (page != "index.html") {
				href += "#/" + page.replace(/\.html$/i,"");
			}
			document.location.href = href;
		}
	}
	
	function goto(page) {
		$index_content.find("*").andSelf().unbind();
		$index_content.empty();
		$index_content.html(page_cache[page].html);
		updateHash(page);
		current_page = page;
		if (page_cache[page].init) {
			var $script = $("<script></script").attr("type","text/javascript");
			$script.attr("text",page_cache[page].init);
			var head = document.getElementsByTagName("head")[0];
			head.insertBefore($script.get(0),head.firstChild);
		}
	}
	
	global.APPVIEW = {
		next_page:function(){
			for (var i=0; i<page_stack.length-1; i++) {
				if (page_stack[i] == current_page) {
					global.APPVIEW.goto(page_stack[i+1]);
					break;
				}
			}
		},
		goto:function(page){
			if (page_cache[page]) {
				goto(page);
			}
			else {
				$.ajax({
					url:page,
					success:function(resp) {
						var script_init = "", scripts = resp.match(/<script[^>]*?class="init"(.|\s)*?\/script>/gi);
						if (scripts) {
							for (var i=0; i<scripts.length; i++) {
								script_init += scripts[i].replace(/^<script[^>]*?class="init"(.|\s)*?>/i,"").replace(/<\/script>$/i,"");
							}
						}
						resp = resp.replace(/<script(.|\s)*?\/script>/gi,"").replace(/<link(.|\s)*?\/(>|link>)/,"");
						var $content = $("<div />").html(resp);
						var selector = "#"+page.split(".")[0]+"_content";
						$content = $content.find(selector);
						page_cache[page] = {html:$content.html(), init:script_init};
						goto(page);
					}
				});
			}
		}
	};
	
	watch_interval = setInterval(function(){
		var hash = document.location.href.match(/#.*$/), page = "index.html";
		if (hash) {
			page = hash[0].replace(/^#\/?/,"") + ".html";
		}
		if (page != current_page) {
			global.APPVIEW.goto(page);
			updateHash(page);
		}
	},100);
	
	$(document).ready(function(){
		$index_content = $("#index_content");
		page_cache[current_page] = {html:$index_content.html(), init:""};
	});
		  
})(window,jQuery);