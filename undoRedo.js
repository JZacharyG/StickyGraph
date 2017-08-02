function get_state()
{
	var nodesClone = JSON.parse(JSON.stringify(nodes));
	var linksClone = [];
	for (var l of links)
	{
		if ("controlx" in l)
			linksClone.push({source: nodesClone[l.source.index], target: nodesClone[l.target.index], color: l.color, controlx: l.controlx, controly: l.controly, copy: l.copy, copies: l.copies, id: l.id});
		else
			linksClone.push({source: nodesClone[l.source.index], target: nodesClone[l.target.index], color: l.color, copy: l.copy, copies: l.copies, id: l.id});
		
	}
	return {nodes:nodesClone, links:linksClone, nextIDv:nextIDv, nextIDe:nextIDe, multimode:multigraph.classed("selected")};
}
function save_state()
{
	undoStack.push(get_state());
	redoStack.length = 0;
}

function load_state(state)
{
	multigraph.classed("selected", state.multimode);
	links.length=0;
	nodes.length=0;
	update_graph();
	for (var n of state.nodes)
		nodes.push(n);
	for (var l of state.links)
		links.push(l);
	nextIDv = state.nextIDv;
	nextIDe = state.nextIDe;
	update_graph();
	write_graph();
	force.start();
}

function undo()
{
	clearKeyMode();
	if (undoStack.length == 0)
		return;
	redoStack.push(get_state());
	load_state(undoStack.pop());
}

function redo()
{
	clearKeyMode();
	if (redoStack.length == 0)
		return;
	undoStack.push(get_state());
	load_state(redoStack.pop());
}