var drawingBoard = d3.select("#drawing-board-div")
	.append("svg")
	.attr("id", "drawing-board")
	.attr("preserveAspectRatio", "xMinYMin meet");

var addvButton = d3.select("body")
	.append("svg")
	.attr("id", "add-v-button-svg")
	.classed("edit-button",true);
addvButton.append("rect")
	.classed("edit-button-rect mode-button", true)
	.attr("id", "add-v-button")
	.on("click", add_vertex_button_press);
addvButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M 13 0 L -13 0 M 0 13 L 0 -13");
addvButton.append("text")
	.classed("edit-button-text", true)
	.attr("x","9")
	.attr("y","9")
	.text("v");

var addeButton = d3.select("body")
	.append("svg")
	.attr("id", "add-e-button-svg")
	.classed("edit-button",true);
addeButton.append("rect")
	.classed("edit-button-rect mode-button", true)
	.attr("id", "add-e-button")
	.on("click", add_edge_button_press);
addeButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M 13 0 L -13 0 M 0 13 L 0 -13");
addeButton.append("text")
	.classed("edit-button-text", true)
	.attr("x","9")
	.attr("y","9")
	.text("e");

var deleteButton = d3.select("body")
	.append("svg")
	.attr("id", "delete-button-svg")
	.classed("edit-button",true);
deleteButton.append("rect")
	.classed("edit-button-rect mode-button", true)
	.attr("id", "delete-button")
	.on("click", delete_button_press);
deleteButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -9.1924 9.1924 L 9.1924 -9.1924 M -9.1924 -9.1924 L 9.1924 9.1924");

var contractButton = d3.select("body")
	.append("svg")
	.attr("id", "contract-button-svg")
	.classed("edit-button",true);
contractButton.append("rect")
	.classed("edit-button-rect mode-button", true)
	.attr("id", "contract-button")
	.on("click", contract_button_press);
contractButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -13 13 L 13 -13");

var selectAllButton = d3.select("body")
	.append("svg")
	.attr("id", "select-v-button-svg")
	.classed("edit-button",true);
selectAllButton
	.append("defs")
	.append("svg:clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr({id:"clip-rect", x:-17, y:-10, width:34, height:20});
selectAllButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", select_vertices_button_press);
selectAllButton.append("path")
	.classed("link",true)
	.attr("d", "M 11 0 L 17 0 M -11 0 L -17 0")
	.attr("clip-path", "url(#clip)");
selectAllButton.append("circle")
	.classed("node selected", true)
	.attr({cx:"0px", cy:"0px", r:"5px"});


var selectEdgesButton = d3.select("body")
	.append("svg")
	.attr("id", "select-e-button-svg")
	.classed("edit-button",true);
selectEdgesButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", select_edges_button_press);
selectEdgesButton.append("path")
	.classed("link selected",true)
	.attr("d", "M 11 0 L 17 0 M -11 0 L -17 0")
	.attr("clip-path", "url(#clip)");
selectEdgesButton.append("circle")
	.classed("node", true)
	.attr({cx:"0px", cy:"0px", r:"5px"});


var selectNoneButton = d3.select("body")
	.append("svg")
	.attr("id", "select-none-button-svg")
	.classed("edit-button",true);
selectNoneButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", select_none);
selectNoneButton.append("path")
	.classed("link",true)
	.attr("d", "M 11 0 L 17 0 M -11 0 L -17 0")
	.attr("clip-path", "url(#clip)");
selectNoneButton.append("circle")
	.classed("node", true)
	.attr({cx:"0px", cy:"0px", r:"5px"});


var pinButton = d3.select("body")
	.append("svg")
	.attr("id", "pin-button-svg")
	.classed("edit-button",true);
pinButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", pin_button_press);
pinButton.append("path")
	.classed("link",true)
	.attr("d", "M 11 0 L 17 0 M -11 0 L -17 0")
	.attr("clip-path", "url(#clip)");
pinButton.append("circle")
	.classed("node pinned", true)
	.attr({cx:"0px", cy:"0px", r:"5px"});


var unpinButton = d3.select("body")
	.append("svg")
	.attr("id", "unpin-button-svg")
	.classed("edit-button",true);
unpinButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", unpin_button_press);
unpinButton.append("path")
	.classed("link",true)
	.attr("d", "M 11 0 L 17 0 M -11 0 L -17 0")
	.attr("clip-path", "url(#clip)");
unpinButton.append("circle")
	.classed("node", true)
	.attr({cx:"0px", cy:"0px", r:"5px"});

var TikZButton = d3.select("body")
	.append("svg")
	.attr("id", "TikZ-button-svg")
	.classed("edit-button",true);
TikZButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", generate_TikZ);
var TikZText = TikZButton.append("text")
	.attr("id","TikZ-button-text")
	.attr({x:"0px", y:"6px"});
TikZText.append("tspan").text("Ti");
TikZText.append("tspan").text("k").style("font-style","italic");
TikZText.append("tspan").text("Z");

var labelButton = d3.select("body")
	.append("svg")
	.attr("id", "label-button-svg")
	.classed("edit-button",true);
var labelRect = labelButton.append("rect")
	.classed("edit-button-rect selected",true)
	.on("click", function () { 
		d3.select(this).classed("selected", !d3.select(this).classed("selected"));
		check_show_labels(); });
labelButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -13 5.5 L 13 5.5 M -13 -5.5 L 13 -5.5 M 5.5 -13 L 5.5 13 M -5.5 -13 L -5.5 13");

var helpButton = d3.select("body")
	.append("svg")
	.attr("id", "help-button-svg")
	.classed("edit-button",true);
helpButton.append("rect")
	.classed("edit-button-rect",true)
	.on("click", function () { window.open('usage'); });
helpButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -7,-5 C -7,-15 7,-15 7,-5 C 7,0 1,2 0,8 L 0,-6");
helpButton.append("circle")
	.attr({cx:"0px", cy:"12px", r:"2.5px"});

var multigraphButton = d3.select("body")
	.append("svg")
	.attr("id", "multigraph-button-svg")
	.classed("edit-button",true);
var multigraph = multigraphButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", multigraph_button_press);
multigraphButton.append("path")
	.classed("link",true)
	.attr("d", "M -10.07 4 Q 0 7 10.07 4");
multigraphButton.append("path")
	.classed("link",true)
	.attr("d", "M -10.07 -4 Q 0 -7 10.07 -4");
multigraphButton.append("circle")
	.classed("node", true)
	.attr({cx:"17px", cy:"0px", r:"2px"})
	.attr("clip-path", "url(#clip)");;
multigraphButton.append("circle")
	.classed("node", true)
	.attr({cx:"-17px", cy:"0px", r:"2px"})
	.attr("clip-path", "url(#clip)");;

var undoButton = d3.select("body")
	.append("svg")
	.attr("id", "undo-button-svg")
	.classed("edit-button",true);
undoButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", undo);
undoButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M 13 0 L -13 0 M -13 0 l 7 7 M -13 0 l 7 -7");

var redoButton = d3.select("body")
	.append("svg")
	.attr("id", "redo-button-svg")
	.classed("edit-button",true);
redoButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", redo);
redoButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -13 0 L 13 0 M 13 0 l -7 7 M 13 0 l -7 -7");

var snapshotButton = d3.select("body")
	.append("svg")
	.attr("id", "snapshot-button-svg")
	.classed("edit-button",true);
snapshotButton.append("rect")
	.classed("edit-button-rect", true)
	.on("click", save_state);
// snapshotButton.append("rect")
// 	.classed("edit-button-path", true)
// 	.attr({x:-12, y:-8.5, width:24, height:17, rx:1, ry:1});
snapshotButton.append("circle")
	.classed("edit-button-path", true)
	.attr({cx:3.5, cy:0, r:5});
snapshotButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -7.5,-4 L -7.5,4");
snapshotButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -8,-9.5 L -7,-9.5");
snapshotButton.append("path")
	.classed("edit-button-path", true)
	.attr("d","M -12,-8.5 L -12,8.5 L 12,8.5 L 12,-8.5 L 8,-8.5 L 6,-11 L 1,-11 L -1,-8.5 Z");

var colors = ["magenta", "red", "orange", "yellow", "green", "cyan", "blue", "violet"];
var colorstring = colors.join(" ");

d3.select("body")
	.append("svg")
	.attr("id", "no-color-button-svg")
	.classed("color-button-svg",true)
	.append("rect")
	.classed("color-button-rect mode-button", true)
	.attr("id", "no-color-button")
	.on("click", function () {color_button_press("");})
	.style("fill", "black");

for (var color of colors)
{
	var f = function(c) {return function() {color_button_press(c);};};
	d3.select("body")
		.append("svg")
		.attr("id", color+"-button-svg")
		.classed("color-button-svg",true)
		.append("rect")
		.classed(color,true)
		.classed("color-button-rect mode-button", true)
		.attr("id", color+"-button")
		.on("click", f(color));
}

d3.selectAll(".color-button-svg")
	.attr("viewBox", "-20 -20 40 40 ")
	.attr("width", "35")
	.attr("height", "35");

d3.selectAll(".edit-button")
	.attr("viewBox", "-20 -20 40 40 ")
	.attr("width", "35")
	.attr("height", "35");

d3.selectAll(".edit-button-path")
	.attr("stroke-linecap","round");

d3.selectAll(".edit-button-rect")
	.attr({x:"-18.5px", y:"-18.5px", width:"37px", height:"37px", rx:"6px", ry:"6px"});

d3.selectAll(".color-button-rect")
	.attr({x:"-18.5px", y:"-18.5px", width:"37px", height:"37px", rx:"6px", ry:"6px"});

d3.select("body").append("div").attr("id", "TikZ-div").style("display", "none").append("textarea").attr("id", "TikZ-area").attr({id:"TikZ-area", readonly:true, wrap:"off"}).style("width", ""+(window.innerWidth/4)+"px");
