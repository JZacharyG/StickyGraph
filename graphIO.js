const NONE          = 0,
      GRAPH6        = 1,
      PATHLIST      = 2,
      TOGGLEMATRIX  = 3,
      ADJMATRIX     = 4,
      LAPLACIAN     = 5,
      NORMLAPLACIAN = 6,
      EDGELIST      = 7,
      ADJLIST       = 8;

function set_graph_mode()
{
	switch (document.getElementById("graph-mode-input").value)
	{
	case "none":          graphMode = NONE;          break;
	case "graph6":        graphMode = GRAPH6;        break;
	case "pathlist":      graphMode = PATHLIST;      break;
	case "edgelist":      graphMode = EDGELIST;      break;
	case "togglematrix":  graphMode = TOGGLEMATRIX;  break;
	case "adjmatrix":     graphMode = ADJMATRIX;     break;
	case "laplacian":     graphMode = LAPLACIAN;     break;
	case "normlaplacian": graphMode = NORMLAPLACIAN; break;
	case "adjlist":       graphMode = ADJLIST;       break;
	default:
		console.error("unrecognized graph mode: "+document.getElementById("graph-mode-input").value);
		return;
	}
	document.getElementById("graph-mode-input").blur();
	write_graph();
	switch (graphMode)
	{
	case GRAPH6:
	case PATHLIST:
		d3.select("#graph-input").style("display", null);
		document.getElementById("graph-input").focus();
		d3.select("#matrix-area").style("display", "none");
		d3.select("#togglematrix-table").style("display", "none");
		break;
	case ADJMATRIX:
	case LAPLACIAN:
	case NORMLAPLACIAN:
	case EDGELIST:
	case ADJLIST:
		d3.select("#graph-input").style("display", "none");
		d3.select("#matrix-area").style("display", null);
		d3.select("#togglematrix-table").style("display", "none");
		break;
	case TOGGLEMATRIX:
		d3.select("#graph-input").style("display", "none");
		d3.select("#matrix-area").style("display", "none");
		d3.select("#togglematrix-table").style("display", null);
		labelRect.classed("selected", true);
		check_show_labels();
		break;
	case NONE:
		d3.select("#graph-input").style("display", "none");
		d3.select("#matrix-area").style("display", "none");
		d3.select("#togglematrix-table").style("display", "none");
		break;
	}
	if (graphMode == ADJMATRIX || graphMode == EDGELIST)
	{
		d3.select("#matrix-area").attr("readonly", null);
		d3.select("#submit-button").style("display", null);
		document.getElementById("matrix-area").focus();
	}	
	else
	{
		d3.select("#matrix-area").attr("readonly", "");
		d3.select("#submit-button").style("display", "none");
	}
}

function write_graph()
{
	switch (graphMode)
	{
	case GRAPH6:        write_g6();            break;
	case PATHLIST:      write_pathlist();      break;
	case EDGELIST:      write_edgelist();      break;
	case ADJMATRIX:     write_adjmatrix();     break;
	case LAPLACIAN:     write_laplacian();     break;
	case TOGGLEMATRIX:  write_togglematrix();  break;
	case NORMLAPLACIAN: write_normlaplacian(); break;
	case ADJLIST:       write_adjlist();       break;
	}
}

function load_graph()
{
	switch (graphMode)
	{
	case GRAPH6:        load_g6();            break;
	case PATHLIST:      load_pathlist();      break;
	case EDGELIST:      load_edgelist();      break;
	case ADJMATRIX:     load_adjmatrix();     break;
//	case ADJLIST:       load_adjlist();       break;
	}
	document.getElementById("graph-input").blur();
	return false;
}

// return an adjacency matrix for the current graph
function get_adjmatrix()
{
	var am = [];
	var n = nodes.length;
	for (var r=0; r<n; r++)
	{
		var row = [];
		for (var c=0; c<n; c++)
			row.push(0);
		am.push(row);
	}
	for (var l of links)
		am[l.source.index][l.target.index] = am[l.target.index][l.source.index] += 1;
	return am;
}

var pre="[[", interEntry=", ", interRow="],\n [", post="]]";

function write_adjmatrix()
{
	var am = get_adjmatrix();
	var n = nodes.length;
	var rows = [];
	for (var row of am)
		rows.push(row.join(interEntry));
	document.getElementById("matrix-area")
		.value = pre+rows.join(interRow)+post;
}

function load_adjmatrix()
{
	var ams = document.getElementById("matrix-area").value.trim();
	var flatam = ams
		.replace(/\D+/g, " ")
		.trim()
		.split(" ");
	var n = Math.sqrt(flatam.length);
	if (n==0 || flatam[0] == "")
	{
		clear_graph();
		return;
	}
	if (!Number.isInteger(n))
	{
		console.warn("Number of entries is not square");
		return;
	}
	var am = []
	for (var i=0; i<n; i++)
		am.push(flatam.slice(n*i, n*i+n));
	for (var i=0; i<n; i++)
	{
		if (am[i].length != n)
		{
			console.warn("Row "+i+" doesn't have length "+n);
			return;
		}
		for (var j=0; j<i; j++)
		{
			if (am[i][j] != am[j][i])
			{
				console.warn("Asymmetry at "+i+","+j+" not allowed");
				return;
			}
		}
	}
	pre = ams.match(/^\D*/)[0];
	post = ams.match(/\D*$/)[0];
	if (n >= 2)
	{
		interEntry = ams.match(/\d(\D+)\d/)[1];
		rex = new RegExp("\\d(?:\\D+\\d+){"+(n-1)+"}(\\D+)\\d");
		interRow = ams.match(rex)[1];
	}
	save_state();
	force.stop();
	for (var i=nodes.length; i<n; i++)
	{
		nodes.push({id:nextIDv, index:i, x:getRandom(0,width), y:getRandom(0,height), color:"", fixed:0});
		nextIDv++;
	}
	nodes.length = n;
	// FIX ME: check if edges are already present, so that we can preserve edge colorings and curvings
	links.length = 0;
	for (var i=0; i<n; i++) for (var j=0; j<=i; j++)
	{
		for (var count = Number(am[i][j]); count>0; count--)
		{
			if (i == j || count > 1)
				multigraph.classed("selected", true);
			new_edge(nodes[i], nodes[j]);
		}
	}
	update_graph();
	document.getElementById("matrix-area")
		.value = pre+am.map(function (a) {return a.join(interEntry);}).join(interRow)+post;
	force.start();
}

function sum(v) { return v.reduce(function(x,y) {return x+y;}, 0); }

function write_laplacian()
{
	var lap = get_adjmatrix();
	var n = lap.length;
	for (var i=0; i<n; i++)
	{
		lap[i] = lap[i].map(function (x) {return -x;});
		lap[i][i] = -sum(lap[i]);
	}
	var rows = [];
	for (var row of lap)
		rows.push(row.join(interEntry));
	
	document.getElementById("matrix-area")
		.value = pre+rows.join(interRow)+post;
}

function load_laplacian()
{

}

function write_normlaplacian()
{
	var am = get_adjmatrix();
	var deg = am.map(sum);
	var nlap = [];
	var n = am.length;
	for (var i=0; i<n; i++)
	{
		nlap.push(am[i].map(function (x, j) {return (x==0)?0:-1/Math.sqrt(deg[i]*deg[j]);}));
		nlap[i][i] = (deg[i]==0)?0:1;
	}
	var rows = [];
	for (var row of nlap)
		rows.push(row.join(interEntry));
	
	document.getElementById("matrix-area")
		.value = pre+rows.join(interRow)+post;
}

function load_normlaplacian()
{

}

function write_togglematrix()
{
	var n = nodes.length;
	var labels = (n==0)?["(Add a vertex, first!)"]:[""];
	var matrixEntries = [];
	for (var i=0; i<n; i++)
	{
		labels.push(i);
		var row = [""];
		for (var j=0; j<n; j++)
		{
			row.push([i,j]);
		}
		matrixEntries.push(row);
	}
	var rowSelection = d3.select("#togglematrix-table").selectAll("tr")
		.data(labels);
	rowSelection.enter()
		.append("tr")
		.append("td")
		.text(function(d) {return d;});
	rowSelection.exit().remove();
	rowSelection.each(function(di,i) {
		if (i==0)
		{
			var entries = d3.select(this).selectAll("td").data(labels, function(d){return d;});
			entries.enter()
				.append("td")
				.text(function(d) {return d;});
			entries.exit().remove();
		}
		else
		{
			var entries = d3.select(this).selectAll("td").data(matrixEntries[di]);
			entries.enter()
				.append("td")
				.append("input")
				.attr("type", "checkbox")
				.attr("id", function(d) {return "cb"+d[0]+"-"+d[1];})
// 				.attr("disabled",function(d) {return d[0]==d[1]?"disabled":null;})
				.on("change", togglematrix_onchange);
			entries.exit().remove();
		}
	});
	
	for (var i=0; i<n; i++)
		for (var j=0; j<n; j++)
			document.getElementById("cb"+i+"-"+j).checked = false;
	for (var l of links)
	{
		document.getElementById("cb"+l.source.index+"-"+l.target.index).checked = document.getElementById("cb"+l.target.index+"-"+l.source.index).checked = true;
	}
}

function togglematrix_onchange(d)
{
	//force.stop(); // FIX ME: should I be stopping the force every time I change the graph?
	var checked = document.getElementById("cb"+d[1]+"-"+d[0]).checked = this.checked;
	var edge = links.filter(function(l) {return l.source.index==d[0] && l.target.index==d[1] || l.source.index==d[1] && l.target.index==d[0];});
	if (edge.length == 0 && checked)
	{
		save_state();
		if (d[0] == d[1])
			multigraph.classed("selected", true);
		new_edge(nodes[d[0]], nodes[d[1]]);
	}
	else if (edge.length!=0 && !checked)
	{
		save_state();
		edge.forEach(delete_edge);
	}
 	update_graph();
 	//write_graph();
	force.start();
}

function write_pathlist()
{

}

function load_pathlist()
{

}

// FIX ME: store these things in local storage?
var preEdgeList="[(", vertexSeparator=",", edgeSeparator="), (", postEdgeList=")]";

function write_edgelist()
{
	links.sort(function(a,b) { if (a.source!=b.source) return a.source.index-b.source.index; return a.target.index-b.target.index; });
	var list = [];
	for (var l of links)
		list.push("" + l.source.index + vertexSeparator + l.target.index);
	document.getElementById("matrix-area")
		.value = preEdgeList+list.join(edgeSeparator)+postEdgeList;
}

function load_edgelist()
{
	var els = document.getElementById("matrix-area").value.trim();
	var flatel = els
		.replace(/\D+/g, " ")
		.trim()
		.split(" ");
	
	if (flatel[0]=="")
	{
		clear_graph();
		return;
	}
	
	if (flatel.length % 2 == 1)
	{
		console.warn("Odd number of vertices listed");
		return;
	}
	var n = 0; // inferred number of vertices
	for (var i=0; i < flatel.length; i++)
	{
		var v = Number(flatel[i]);
		flatel[i] = v;
		n = Math.max(n,v+1);
	}
	
	preEdgeList = els.match(/^\D*/)[0];
	postEdgeList = els.match(/\D*$/)[0];
	vertexSeparator = els.match(/\d(\D+)\d/)[1];
	if (flatel.length > 2)
	{
		edgeSeparator = els.match(/\d\D+\d+(\D+)\d/)[1];
	}
	save_state();
	force.stop();
	for (var i=nodes.length; i<n; i++)
	{
		nodes.push({id:nextIDv, index:i, x:getRandom(0,width), y:getRandom(0,height), color:"", fixed:0});
		nextIDv++;
	}
	nodes.length = n; // to shorten the list if needed
	links.length = 0;
	for (var i=0; i<flatel.length; i+=2)
	{
		// FIX ME: check for duplicate edges, make a multigraph if needed
		//if (...)
 		//	multigraph.classed("selected", true);
		new_edge(nodes[flatel[i]], nodes[flatel[i+1]]);
	}
	update_graph();
	write_edgelist();
	force.start();
}

function write_adjlist()
{
	var am = get_adjmatrix();
	var n = nodes.length;
	var rows = [], row;
	for (var i=0; i<n; i++)
	{
		row = []
		for (var j=0; j<n; j++)
			for (var c=0; c<am[i][j]; c++)
				row.push(j);
		rows.push("" + i + " : " + row.join(" "));
	}
	document.getElementById("matrix-area")
		.value = rows.join("\n");
}

function load_adjlist()
{

}

function write_g6()
{
	var nv = nodes.length;
	var nvpart = "";
	var adjpart = [];
	if (nv > 0)
	{
		if (nv <= 62)
			nvpart = String.fromCharCode(nv + 63);
		else
		{
			if (nv > 258047)
			{
				console.error("To many vertices for me to write a correct graph6");
				document.getElementById("graph-input").value = "";
				return;
			}
			else
			{
				nvpart = "~" + String.fromCharCode(((nv >> 12) & 63) + 63) + String.fromCharCode(((nv >> 6) & 63) + 63) + String.fromCharCode((nv & 63) + 63);
			}
		}		
		
		var len = Math.ceil(nv*(nv-1)/12);
		for (var i = 0; i < len; i++)
			adjpart.push(0);
		for (var l of links) if (l.source != l.target)
		{
			var V = Math.max(l.source.index, l.target.index);
			var v = Math.min(l.source.index, l.target.index);
			var c = Math.floor((V*(V-1)/2+v)/6);
			var b = 1 << (5-((V*(V-1)/2+v) % 6));
			adjpart[c] |= b;
		}
		adjpart = adjpart.map(function(x) {return String.fromCharCode(x+63);});
	}
	document.getElementById("graph-input").value = nvpart + adjpart.join("");
}

function load_g6()
{
	save_state();
	clear_graph();
	var g6string=document.getElementById("graph-input").value;
	var g6i=0;
	var i, j, k, x;
	
	// if (*g6 == ':')
// 	{
// 		alert("Cannot read sparse6 format\n");
// 		return false;
// 	}
	
	var nv = g6string.charCodeAt(g6i) - 63;
	g6i++;
	if (nv > 62)
	{
		if (nv != 63)
			console.error("First graph6 character is bad...");
		for (nv = 0; g6i < 4; ++g6i)
		{
			nv = (nv << 6) | (g6string.charCodeAt(g6i) - 63);
		}
	}

	for (nextIDv=0; nextIDv<nv; nextIDv++)
	{
		nodes[nextIDv]={id:nextIDv, index:nextIDv, x:getRandom(0,width), y:getRandom(0,height), color:"", fixed:0};
	}
	
	


// 	if (g->nv >= MAXNV)
// 	{
// 		fprintf(stderr, "Graph of size %d is larger than maximum size %d\n", g->nv, MAXNV);
// 		exit(1);
// 	}
	k = 1
	for (i = 1; i < nv; i++)
	{
		for (j = 0; j < i; j++)
		{
			k--;
			if (k==0)
			{
				k = 6;
				x = g6string.charCodeAt(g6i) - 63;
				g6i++;
			}
			if ((x >> 5) & 1)
			{
				new_edge(nodes[i], nodes[j]);
			}
			x <<= 1;
		}
	}
	
	update_graph();
	force.start();
}






function generate_TikZ()
{
	button = d3.select(this);
	
	if (button.classed("selected") || nodes.length == 0)
	{
		button.classed("selected",false)
		d3.select("#TikZ-div")
			.style("display","none");
		return;
	}
	var min = 0, max = 60; // magic numbers... works about right for these force settings
	d3
	tikz = "% (In the preamble)\n\n\\usepackage{tikz}\n\\usetikzlibrary{calc, backgrounds}\n\\tikzset{vertex/.style={draw=none, line width = 2.4pt, fill, inner sep = .09cm, circle}}\n\\tikzset{edge/.style={very thick, gray, line cap=round}}\n"
	if (multigraph.classed("selected"))
		tikz += "\\newcommand{\\multisep}{"+(10/(max-min)).toFixed(4)+"}\n";
	tikz += "\n\n\n% (In the body)\n\n\\begin{tikzpicture}[scale=1]";
	
	var printLabels = labelRect.classed("selected");
	
	for (var i = 0; i < nodes.length; i++)
	{
		tikz += "\n\t\\node[vertex";
		if (nodes[i].color != "")
			tikz += ", " + nodes[i].color;
		if (printLabels)
			tikz += ", label=above:" + nodes[i].index;
		tikz += "] at (" + (nodes[i].x/(max-min)).toFixed(3) + "," + (-nodes[i].y/(max-min)).toFixed(3) + ") (v" + nodes[i].index + ") {};";
	}
	
	links.sort(function(a,b) { if (a.source!=b.source) return a.source.index-b.source.index; return a.target.index-b.target.index; });
	
	tikz += "\n\t\\begin{scope}[on background layer]";
	
	for (var i = 0; i < links.length; i++)
	{
		var l = links[i];
		if (l.copies != 0 && l.source != l.target && !("controlx" in l))
			tikz += "\n\t\t\\coordinate (c) at ($($(v" + l.source.index + ")!0.5!(v" + l.target.index + ")$)!" + (l.copies/2. - l.copy) + "*\\multisep cm!90:(v" + l.target.index + ")$);";
		tikz += "\n\t\t\\draw[edge";
		if (l.color != "")
			tikz += ", " + l.color;
		tikz += "] (v" + l.source.index + ") ";
		if (l.copies == 0 && l.source != l.target && !("controlx" in l))
			tikz += "to";
		else
		{
			var x1 = l.source.x, x2 = l.target.x, y1 = l.source.y, y2 = l.target.y;
			var cx1, cx2, cy1, cy2;
			if ("controlx" in l)
			{
				cx1 = (x1+2*l.controlx)/(3*(max-min));
				cy1 = (-y1-2*l.controly)/(3*(max-min));
				cx2 = (x2+2*l.controlx)/(3*(max-min));
				cy2 = (-y2-2*l.controly)/(3*(max-min));
				tikz += ".. controls (" + cx1.toFixed(3) + ", " + cy1.toFixed(3) + ") and (" + cx2.toFixed(3) + ", " + cy2.toFixed(3) + ") ..";
			}
			else if(l.source == l.target)
			{
				var scale = 5*l.copy+30;
				cx1 = (scale*Math.sqrt(l.copy+1))/(max-min);
				cy1 = (scale*2)/(max-min);
				cx2 = (-scale*Math.sqrt(l.copy+1))/(max-min);
				cy2 = (scale*2)/(max-min);
				tikz += ".. controls +(" + cx1.toFixed(3) + ", " + cy1.toFixed(3) + ") and +(" + cx2.toFixed(3) + ", " + cy2.toFixed(3) + ") ..";
			}
			else // multi-edge
			{
				tikz += ".. controls ($(v" + l.source.index + ")!2/3!(c)$) and ($(v" + l.target.index + ")!2/3!(c)$) ..";
			}
		}
		tikz += " (v" + l.target.index + ");";
	}
	
	tikz += "\n\t\\end{scope}\n\\end{tikzpicture}";
	
	button.classed("selected",true);
	d3.select("#TikZ-div")
		.style("display",null);
	d3.select("#TikZ-area")
		.text(tikz);
}

