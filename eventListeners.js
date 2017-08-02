

var selecting;
var pinnedAtStart;
var selectedAtStart;
var x0, y0;
var nodeMoved;
var timeoutID;

function drag_pin_drag_start(d)
{
	clearKeyMode();
	var v = d3.select(this);
	selecting = d3.event.sourceEvent.shiftKey;
	pinnedAtStart = v.classed("pinned");
	selectedAtStart = v.classed("selected");
	x0 = d.x;
	y0 = d.y;
	nodeMoved = false;
	
	if (selecting)
		v.classed("selected", !selectedAtStart);
	
	d3.event.sourceEvent.preventDefault();
	
	timeoutID = setTimeout(function ()
		{
			v.classed("selected", !selectedAtStart);
			selecting = true;
		}, 750);
}

function drag_pin_drag(d)
{
	if (!nodeMoved && dist(d.x,d.y,x0,y0)>5)
	{
		float_nbr_edges(d);
		d3.select(this)
			.classed("selected", selectedAtStart)
			.classed("pinned", false);
		nodeMoved = true;
		clearTimeout(timeoutID);
	}
	d3.event.sourceEvent.preventDefault();
}

function drag_pin_end(d)
{
	clearTimeout(timeoutID);
	v = d3.select(this);
	if (!nodeMoved && !selecting)
	{
		switch (mode)
		{
		case COLOR:
			var hadColor = v.classed(colorMode);
			v.classed("selected "+colorstring, false)
				.each(function(d,i) {d.color=""});
			if (!hadColor)
				v.classed(colorMode, true)
					.each(function(d,i) {d.color=colorMode});
			break;
		case DELETE:
			save_state();
			delete_vertex(d);
			update_graph();
			write_graph();
			force.start();
			break;
		}
	}
	
	pinNode = xor(d3.event.sourceEvent.altKey, nodeMoved || xor(pinnedAtStart, (mode == DRAGPIN && !selecting)));
	if (pinNode)
		d3.select(this).each(pin);
	else
		d3.select(this).each(unpin);
	
	d3.event.sourceEvent.preventDefault();
}

var noDrag = d3.behavior.drag();

var addEdgeDrag = d3.behavior.drag()
	.on("dragstart", new_edge_drag_start)
	.on("drag", new_edge_drag)
	.on("dragend", new_edge_drag_end);

var dragLink, newEdgeX, newEdgeY;
var makingNewEdge = false;
function new_edge_drag_start(d)
{
	d.fixed |= 2;
	newEdgeX = d.x, newEdgeY = d.y;
	makingNewEdge = true;
	dragLink = drawingBoard.select("#links")
		.append("path")
		.classed("link", true)
		.attr("d", "M "+d.x+" "+d.y+" L "+d.x+" "+d.y)
		.style("stroke-dasharray", function (d) {return "" + (this.getTotalLength()) + " 11";});
	d3.event.sourceEvent.preventDefault();
}

function new_edge_drag(d)
{
	newEdgeX = d3.event.x, newEdgeY = d3.event.y;
	dragLink
		.attr("d", "M "+d.x+" "+d.y+" L "+newEdgeX+" "+newEdgeY)
		.style("stroke-dasharray", function (d) {return "" + (this.getTotalLength()) + " 11";});
	if (d3.event.sourceEvent.shiftKey)
		dragLink.classed("selected", true);
	else
		dragLink.classed("selected", false);
	d3.event.sourceEvent.preventDefault();
}

function new_edge_drag_end(d1)
{
	d1.fixed &= 1;
	makingNewEdge = false;
	v2 = drawingBoard.selectAll(".node").filter(function (d2) {
		return dist(d2.x,d2.y, newEdgeX, newEdgeY) <= 10; })
	dragLink.remove();
	if (!v2.empty())
	{
		d2 = v2.datum();
		save_state();
		if (d2.id == d1.id)
			multigraph.classed("selected", true);
		else if (!multigraph.classed("selected"))
		{
			for (l of links)
			{
				if (l.source == d1 && l.target == d2 || l.source == d2 && l.target == d1)
				{
					multigraph.classed("selected", true);
					break
				}
			}
		}
		var newe = new_edge(d1, d2);
		update_graph();
		if (d3.event.sourceEvent.shiftKey)
			drawingBoard.selectAll(".link")
				.filter(function (d) { return d == newe; })
				.classed("selected", true);
		write_graph();
		force.start();
	}
	d3.event.sourceEvent.preventDefault();
}

var curveEdgeDrag = d3.behavior.drag()
	.on("dragstart", curve_edge_drag_start)
	.on("drag", curve_edge_drag)
	.on("dragend", curve_edge_drag_end);
var dragLink; // replace this with an edge with a known id, so that we don't need a global variable to keep track of it? debatable.

function get_edge_path(d)
{
	var x1,x2,y1,y2;
	if (d.source.id < d.target.id)
		x1 = d.source.x, x2 = d.target.x, y1 = d.source.y, y2 = d.target.y;
	else
		x1 = d.target.x, x2 = d.source.x, y1 = d.target.y, y2 = d.source.y;
	var coords;
	if ("controlx" in d)
		coords = ["M", d.source.x, d.source.y, "Q", d.controlx, d.controly, d.target.x, d.target.y];
	else if (d.source == d.target)
	{
		scale = 5*d.copy+30;
		coords = ["M", x1, y1, "C", x1+scale*Math.sqrt(d.copy+1), y1-scale*2, ",", x1-scale*Math.sqrt(d.copy+1), y1-scale*2, x2, y2];
	}
	else
	{
		var offset = d.copy - d.copies/2.,
			scale  = 10*offset/dist(x1,y1,x2,y2);
			//scale  = .1*offset;
		var controls = {x: (x1+x2)/2. + scale*(y1-y2), y: (y1+y2)/2.-scale*(x1-x2)};
		coords = ["M", x1, y1, "Q", controls.x, controls.y, x2, y2];
		//coords = ["M", d.source.x, d.source.y, "L", d.target.x, d.target.y];
	}
	return coords.join(" ");
}

function float_nbr_edges(d)
{
	var adj = link.selectAll("path")
		.filter(function (l) { return l.source.id == d.id || l.target.id == d.id; })
		.each(float_edge);
	adj.selectAll("path").attr("d", get_edge_path)
	adj.selectAll(".link").style("stroke-dasharray", function (d) {return "" + (this.getTotalLength()-22) + " 11";});
}

var sourcePinned, targetPinned, edgeMoved;

function curve_edge_drag_start(d)
{
	x0 = y0 = null;
	
	var edge = d3.select(this.parentNode).select(".link");
	selecting = d3.event.sourceEvent.shiftKey;
	selectedAtStart = edge.classed("selected");
	sourcePinned = d.source.fixed;
	targetPinned = d.target.fixed;
	d.source.fixed = 1;
	d.target.fixed = 1;
	edgeMoved = false;
	if (selecting)
		edge.classed("selected", !selectedAtStart);
	timeoutID = setTimeout(function ()
		{
			edge.classed("selected", !selectedAtStart);
			selecting = true;
		}, 750);
	d3.event.sourceEvent.preventDefault();
}

function curve_edge_drag(d)
{
	if (x0 == null || y0 == null)
	{
		x0 = d3.event.x;
		y0 = d3.event.y;
	}
	var edgeParent = d3.select(this.parentNode);
	if (!edgeMoved && dist(d3.event.x,d3.event.y,x0,y0)>5)
	{
		clearTimeout(timeoutID);
		edgeParent.select(".link").classed("selected", selectedAtStart);
		if (d.source != d.target)
		{
			unfloat_edge(d);
			edgeMoved = true;
		}
	}
	if (edgeMoved)
	{
		d.controlx = d3.event.x;
		d.controly = d3.event.y;
		
		edgeParent.selectAll("path")
			.attr("d", get_edge_path);
		edgeParent.select(".link")
			.style("stroke-dasharray", function (d) {return "" + (this.getTotalLength()-22) + " 11";});
	}
	d3.event.sourceEvent.preventDefault();
}

function curve_edge_drag_end(d)
{
	clearTimeout(timeoutID);
	var edgeParent = d3.select(this.parentNode),
		edge = edgeParent.select(".link");
	d.source.fixed = sourcePinned;
	d.target.fixed = targetPinned;
	if (edgeMoved)
	{
		if (dist(d.controlx, d.controly, d.source.x, d.source.y) + dist(d.controlx, d.controly, d.target.x, d.target.y) >= 1.04*dist(d.source.x, d.source.y, d.target.x, d.target.y))
		{
			d3.select("#v"+d.source.id).each(pin);
			d3.select("#v"+d.target.id).each(pin);
		}
		else
		{
			float_edge(d);
		}
		tick();
	}
	else if (!selecting)
	{
		switch (mode)
		{
		case COLOR:
			var hadColor = edge.classed(colorMode);
			edge.classed("selected "+colorstring, false)
				.each(function(d,i) {d.color=""});
			if (!hadColor)
				edge.classed(colorMode, true)
					.each(function(d,i) {d.color=colorMode});
			break;
		case DELETE:
			save_state();
			delete_edge(d);
			update_graph();
			write_graph();
			force.start();
			break;
		case CONTRACT:
			save_state();
			contract_edge(d);
// 			update_graph();
			write_graph();
			force.start();
			break;
		}
	}
	
	d3.event.sourceEvent.preventDefault();
}


var swapLabelsDrag = d3.behavior.drag()
	.on("dragstart", swap_labels_drag_start)
	.on("drag", swap_labels_drag)
	.on("dragend", swap_labels_drag_end);

var swapLabelsX, swapLabelsY;

function swap_labels_drag_start(d)
{
	force.stop();
	swapLabelsX = d.x, swapLabelsY = d.y;
	clearKeyMode();
	d3.event.sourceEvent.preventDefault();
}

function swap_labels_drag(d)
{
	swapLabelsX = d3.event.x, swapLabelsY = d3.event.y;
	d3.select(this)
		.attr({x:swapLabelsX, y:swapLabelsY});
	d3.event.sourceEvent.preventDefault();
}

function swap_labels_drag_end(d1)
{
	v2 = drawingBoard.selectAll(".node").filter(function (d2) {
		return dist(d2.x,d2.y, swapLabelsX, swapLabelsY) <= 10; })
	if (!v2.empty() && v2.datum().id != d1.id)
	{
		d2 = v2.datum();
		save_state();
		swap_labels(d1.index, d2.index);
		tick();
	}
	else
	{
		d3.select(this).attr({x:d1.x, y:d1.y});
	}
	d3.event.sourceEvent.preventDefault();
}





// Button Event Handlers
function pin_button_press()
{
	clearKeyMode();
	selected = drawingBoard.selectAll(".node.selected");
	if (selected.size() == 0)
		node.each(pin);
	else
		selected.each(pin);
}

function unpin_button_press()
{
	clearKeyMode();
	selected = drawingBoard.selectAll(".node.selected");
	if (selected.size() == 0)
		node.each(unpin);
	else
		selected.each(unpin);
}

function select_vertices_button_press()
{
	clearKeyMode();
	selected = drawingBoard.selectAll(".node.selected");
	if (selected.size() == nodes.length)
		selected.classed("selected", false);
	else
		node.classed("selected", true);
}

function select_edges_button_press()
{
	clearKeyMode();
	selected = drawingBoard.selectAll(".link.selected");
	if (selected.size() == links.length)
		selected.classed("selected", false);
	else
		drawingBoard.selectAll(".link").classed("selected", true);
}

function select_none() { clearKeyMode(); drawingBoard.selectAll(".selected").classed("selected", false); }

function add_vertex_button_press()
{
	clearKeyMode();
	save_state();
	var edges_selected = false;
	
	//split edges if they are selected
	var selected = drawingBoard.selectAll(".link.selected");
	if (!selected.empty())
	{
		selected.each(split_edge);
		edges_selected = true;
		update_graph();
	}
	
	selected = drawingBoard.selectAll(".node.selected");
	if (!selected.empty() || !edges_selected)
	{
		var newv = new_vertex();
		selected.each(function (d,i) { new_edge(newv, d); });
		update_graph();
		if (d3.event.shiftKey)
			drawingBoard.select("#v"+newv.id)
				.classed("selected", true);
	}
	
	write_graph();
	force.start();
}


function add_edge_button_press()
{
	clearKeyMode();
	if (mode == ADDEDGE)
		change_mode(DRAGPIN, "");
	else
		change_mode(ADDEDGE, "");
}

function do_mouse_down(d)
{
	clearKeyMode();
	var feature=d3.select(this);
	if (("sourceEvent" in d3.event)?d3.event.sourceEvent.shiftKey:d3.event.shiftKey)
		feature.classed("selected", !feature.classed("selected"));
	else
	{
		switch (mode)
		{
		case COLOR:
			var hadColor = feature.classed(colorMode);
			feature
				.classed("selected "+colorstring, false)
				.each(function(d,i) {d.color=""});
			if (!hadColor)
				feature
					.classed(colorMode, true)
					.each(function(d,i) {d.color=colorMode});
			break;
		}
	}
}

function delete_button_press()
{
	clearKeyMode(); // FIX ME: maybe delete anything typed first?
	var changes=false;
	var selectedLinks = drawingBoard.selectAll(".link.selected");
	var selectedNodes = drawingBoard.selectAll(".node.selected");
	
	if (!selectedLinks.empty() || !selectedNodes.empty())
	{
		save_state();
		changes = true;
	}
	
	selectedLinks.each(delete_edge);
	selectedNodes.each(delete_vertex);
	
	if (changes)
	{
		update_graph();
		write_graph();
		force.start();
	}
	else
	{
		if (mode == DELETE)
			change_mode(DRAGPIN, "");
		else
			change_mode(DELETE, "");
	}
}

function contract_button_press()
{
	clearKeyMode();
	var toContract = [];
	var adj = [];
	toContract.length = nodes.length;
	adj.length = nodes.length;
	for (var i = 0; i < nodes.length; i++)
		toContract[i] = adj[i] = false;
	selectedNodes = drawingBoard.selectAll(".node.selected").each( function (d) {toContract[d.index] = true;} );
	selectedLinks = drawingBoard.selectAll(".link.selected");
	
	if (selectedNodes.empty() && selectedLinks.empty())
	{
		if (mode == CONTRACT)
			change_mode(DRAGPIN, "");
		else
			change_mode(CONTRACT, "");
		return;
	}
	
	if (selectedNodes.empty())
	{
		save_state();
		selectedLinks.each( contract_edge );
		
		write_graph();
		force.start();
		return;
	}
	
	if (selectedLinks.empty())
	{
		save_state();
		var vlist = [];
		selectedNodes.each(function (d) { vlist.push(d.index); } );
		var newv = identify_vertices(vlist);
		// FIX ME: either delete loops or display them.  neither is no good.
		update_graph();
		
		if (d3.event.shiftKey)
			drawingBoard.select("#v"+newv.id)
				.classed("selected", true);
		else
			select_none();
		write_graph();
		force.start();
		return;
	}
}

function color_button_press(c)
{
	clearKeyMode();
	if (d3.event.shiftKey)
	{
		if (c!="")
		{
			var colored = drawingBoard.selectAll("."+c);
			var alreadyAllSelected = true;
			colored.each(function(){if (!d3.select(this).classed("selected")) alreadyAllSelected = false;});
			colored.classed("selected", !alreadyAllSelected);
		}
	}
	else
	{
		var selected = drawingBoard.selectAll(".selected");
		if (selected.empty())
		{
			if (mode == COLOR && colorMode == c)
				change_mode(DRAGPIN, "");
			else
				change_mode(COLOR, c);
		}
		else
		{
			selected
				.classed("selected "+colorstring, false)
				.each(function(d,i) {d.color=c})
				.classed(c, true);
		}
	}
}

function multigraph_button_press()
{
	if (multigraph.classed("selected"))
	{
		simplify();
		multigraph.classed("selected", false);
	}
	else
	{
		multigraph.classed("selected", true);
	}
}


// Keyboard Controls

var keyMode = null;
var vInput = [null,null], vIndex = 0;

function clearKeyMode()
{
	keyMode = null;
	vInput = [null,null], vIndex = 0;
	d3.select("#keyboard-info").text("");
}

function writeKeyboardInfo()
{
	var s = "";
	if (keyMode != null)
		s += keyMode + " ";
	if (vInput[0] != null)
		s += vInput[0]+" ";
	if (vInput[1] != null)
		s += vInput[1];
	d3.select("#keyboard-info").text(s);
}

d3.select("body")
	.on("keydown", keydown_handler);
function keydown_handler()
{
	var e = d3.event;
	var activeID = document.activeElement.id;
	if (activeID == "matrix-area" || activeID == "graph-mode-input" || activeID == "graph-input" || makingNewEdge)
	{
		clearKeyMode();
		return;
	}
	if (48 <= e.keyCode && e.keyCode <= 57) // a number was pressed!
	{
		if (vInput[vIndex] == null)
			vInput[vIndex] = e.keyCode-48;
		else
			vInput[vIndex] = 10*vInput[vIndex] + (e.keyCode-48);
		
		if (vInput[vIndex] < nodes.length)
			writeKeyboardInfo();
		else
			clearKeyMode();
	}
	else if (e.keyCode != 32 && e.keyCode != 13)
		clearKeyMode();
	
	if (!e.metaKey && !e.altKey && !e.ctrlKey)
	{
		switch (e.keyCode)
		{
		case 90:  // z: undo
			if (e.shiftKey)
				redo();
			else
				undo(); // shift-z redoes
			break;
		case 27:  // esc: switch to drag/pin mode
			change_mode(DRAGPIN, ""); break;
		case 187: // =: add vertex
			add_vertex_button_press(); break;
		case 189: // -: add edge
			add_edge_button_press(); break;
		case 8:   // delete: delete stuff
			delete_button_press(); break;
		case 191: // /: contract/identify stuff
			contract_button_press(); break;
		case 73:  // i: pin
			pin_button_press(); break;
		case 85:  // u: unpin
			unpin_button_press(); break;
		case 78:  // n: select all vertices
			select_vertices_button_press(); break;
		case 77:  // m: select all edges
			select_edges_button_press(); break;
		case 188: // ,: select nothing
			select_none(); break;
		case 88:  // x: color removal mode
			color_button_press(""); break;
		case 82:  // r: color mode red
			color_button_press("red"); break;
		case 79:  // o: color mode orange
			color_button_press("orange"); break;
		case 89:  // y: color mode yellow
			color_button_press("yellow"); break;
		case 71:  // g: color mode green
			color_button_press("green"); break;
		case 67:  // c: color mode cyan
			color_button_press("cyan"); break;
		case 66:  // b: color mode blue
			color_button_press("blue"); break;
		case 86:  // v: color mode violet
			color_button_press("violet"); break;
		case 80:  // p: color mode magenta
			color_button_press("magenta"); break;
		case 83:  // s: swap a labels for the specified pair of vertices
			keyMode = "Swap Labels";
			writeKeyboardInfo();
			break;
		case 16:  // shift: select a vertex or edge by keyboard
			keyMode = "Select";
			writeKeyboardInfo();
			break;
		case 32:  // space: separate a pair of vertices
			if (vInput[0] != null)
				vIndex=1;
			break;
		case 13:  // return: process vertex/vertex pair input
			if (keyMode == "Select")
			{
				var feature = null;
				if (vIndex == 0 && vInput[0] != null)
				{
					feature = drawingBoard
						.selectAll(".node")
						.filter(function (d) {return d.index == vInput[0];});
				}
				else if (vIndex == 1 && vInput[0] != null && vInput[1] != null)
				{
					feature = drawingBoard
						.selectAll(".link")
						.filter(function (d) { return (d.source.index == vInput[0] && d.target.index == vInput[1]) || (d.source.index == vInput[1] && d.target.index == vInput[0]); });
				}
				if (feature != null)
					feature.classed("selected", function (d) { return !d3.select(this).classed("selected");});
			}
			else if (keyMode == "Swap Labels")
			{
				if (vIndex == 1 && vInput[0] != null && vInput[1] != null)
					swap_labels(vInput[0],vInput[1]);
			}
			else if (mode == ADDEDGE)
			{
				var v0 = vInput[0], v1 = vInput[1];
				if (vIndex == 1 && v0 != null && v1 != null && v0 >= 0 && v0 < nodes.length && v1 >= 0 && v1 < nodes.length)
				{
					if (v0 == v1)
						multigraph.classed("selected", true);
					else if (!multigraph.classed("selected"))
					{
						for (l of links)
						{
							if (l.source.index == v0 && l.target.index == v1 || l.source.index == v1 && l.target.index == v0)
							{
								multigraph.classed("selected", true);
								break
							}
						}
					}
					save_state();
					new_edge(nodes[v0], nodes[v1]);
					update_graph();
					write_graph();
					force.start();
				}
			}
			clearKeyMode();
			break;
		}
	}
}

function snapshot()
{
	save_state();
	d3.select("#snapshot-button")
		.style({fill:"#0f0"})
		.transition()
		.style({fill:"#fff"})
		.duration(400)
		.each("end", function ()
		{
			d3.select(this)
				.style("fill", null);
		});
}
