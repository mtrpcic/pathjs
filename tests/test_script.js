var hrefs = ["#A",
             "#B",
             "#C",
             "#D",
             "#E/params/1/parse",
             "#E/params/2/parse",
	     "#E/params/3/check",
	     "#F",
	     "#G"
	    ];
var index = 0;
var timer = null;

function update(str){
	var d = document.getElementById("actual");
	text = d.innerHTML;
	d.innerHTML = d.innerHTML + ((text == "") ? "" : "::") + str;
}

function run_route(){
	if(index < hrefs.length){
		location.hash = hrefs[index];
		index++;
	} else {
		clearInterval(timer);
		
		var expected = document.getElementById("expected");
		var actual = document.getElementById("actual");
		var grade = document.getElementById("grade");
		
		if(expected.innerHTML == actual.innerHTML){
			grade.innerHTML = "PASS";
			grade.style.color = "#00FF00";
		} else {
			grade.innerHTML = "FAIL";
			grade.style.color = "#FF0000";
		}
	}
}

function define_routes(){
	Path.map("#A").enter(function(){
		update("A[enter]");
	}).to(function(){
		update("A[action]");
	}).exit(function(){
		update("A[exit]");
	});
	

	Path.map("#B").to(function(){
		update("B[action]");
	});
	
	Path.map("#B").enter(function(){
		update("B[enter]");
	});
	
	Path.map("#C").to(function(){
		update("C[action]");
	}).exit(function(){
		update("C[exit]");
	});
	
	// No map for #D.  This checks that our rescue method works.
	
	Path.map("#E/params/:id/parse").to(function(){
		update("E[action](parse id=" + this.params['id'] + ")");
	});
	
	Path.map("#E/params/:id/parse").enter(function(){
		update("E[enter](parse)");
	});
	
	Path.map("#E/params/:id/check").to(function(){
		update("E[action](check id=" + this.params['id'] + ")");
	});
	
	Path.map("#E/params/:id/check").exit(function(){
		update("E[exit](check)");
	});
	
	Path.map("#F").enter(function(){
		update("F[enter]");
	}).to(function(){
		update("F[action]");
	});
	
	Path.map("#G").enter(function(){
		update("G[enter 1]");
	}).enter(function(){
		update("G[enter 2]");
	}).enter([
		function(){
			update("G[enter 3]");
		},
		function(){
			update("G[enter 4]");
			return false;
		}
	]).to(function(){
		update("G[action - NOT HIT]");
	});
	
	Path.rescue(function(){
		update("RESCUE");
	});
	
	Path.root("#F");
	Path.listen();
	timer = setInterval(run_route, 500);
}
