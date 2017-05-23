function swap_labels(l1, l2)
{
	if (l1<0 || l2 < 0 || l1 >=nodes.length || l2 >= nodes.length)
		return;
	var temp = nodes[l2];
	nodes[l2] = nodes[l1];
	nodes[l2].index = l2;
	nodes[l1] = temp;
	nodes[l1].index = l1;
	update_graph();
	write_graph();
}

function new_vertex()
{
	var newv = {id:nextIDv++, index:nodes.length, x:getRandom(0,width), y:getRandom(0,height), color:"", fixed:0};
	nodes.push(newv);
	return newv;
}

function new_edge(v1, v2)
{
	if (v1.index > v2.index)
	{
		var t = v1;
		v1 = v2;
		v2 = t;
	}
	var newe = {source:v1, target:v2, color:"", copy:0, copies:0, controlx:null, id:nextIDe++};
	links.push(newe);
	float_edge(newe);
	return newe;
}

function delete_vertex(d)
{
	for (var i=0; i < links.length;)
	{
		if (links[i].source.id == d.id || links[i].target.id == d.id)
		{
			links[i] = links[links.length-1];
			links.length--;
		}
		else
			i++;
	}
	
	for (var i=d.index+1; i<nodes.length; i++)
	{
		nodes[i].index--;
		nodes[i-1]=nodes[i];
	}
	nodes.length--;
}

function delete_edge(d)
{
	var i = links.indexOf(d);
	if (i != -1)
	{
		unfloat_edge(d);
		links[i] = links[links.length-1];
		links.length--;
	}
}

function contract_edge(d)
{
	if (links.indexOf(d) == -1) // the edge has already been deleted, for whatever reason
		return;
	delete_edge(d);
	var newv;
	if (d.source == d.target)
		newv = d.source;
	else
		newv = identify_vertices([d.source.index, d.target.index]);
	update_graph();
	if (d3.event.shiftKey)
		drawingBoard.select("#v"+newv.id)
			.classed("selected", true);
}

function split_edge(d)
{
	var newv = new_vertex();
	if ("controlx" in d)
	{
		newv.x = d.controlx;
		newv.y = d.controly;
		delete d.controlx;
		delete d.controly;
	}
	else
	{
		newv.x = (d.source.x+d.target.x)/2;
		newv.y = (d.source.y+d.target.y)/2;
	}
	if (d.source.fixed && d.target.fixed)
		newv.fixed = 1;
	new_edge(newv, d.source).color = d.color; // leave it to update_graph to assign the color's class, pinned-ness
	d.source = newv;
}

// remove loops and multi-edges
function simplify()
{
	var changed = false;
	links.sort(function(a,b) { if (a.source!=b.source) return a.source.index-b.source.index; return a.target.index-b.target.index; });
	for (var i = links.length-1; i>0; i--)
	{
		l = links[i];
		lp = links[i-1];
		if (l.source == l.target || l.source == lp.source && l.target == lp.target)
		{
			if (!changed)
			{
				save_state();
				changed = true;
			}
			links[i] = links[links.length-1];
			links.length--;
		}
		else
			l.copies = l.copy = 0; 
	}
	if (links.length>0)
	{
		if (links[0].source == links[0].target)
		{
			if (!changed)
			{
				save_state();
				changed = true;
			}
			links[0] = links[links.length-1];
			links.length--;
		}
		else
			links[0].copies = links[0].copy = 0;
	}
	if (changed)
	{
		update_graph();
		write_graph();
		force.start();
	}
}

