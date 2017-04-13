# How to Use StickyGraph

Want to know everything that StickyGraph has to offer?  You've come to the right place!

### Getting a graph into (or out of) StickyGraph

So, you have a graph that you'd like to draw.  Cool!  Direct your attention to the upper left part of the window, please.  That dropdown menu lets you select the graph input/output mode.  You can elect to enter a [graph6](http://users.cecs.anu.edu.au/~bdm/data/formats.txt) encoded graph, for instance, if you have some of those lying around.  You could also go to the interactive adjacency matrix mode to be presented with a grid of checkboxes, letting you easily toggle any entry in the adjacency matrix (if you want to add or remove some vertices, you'll need the add vertex button or the delete button, respectively, which we'll get to in more detail later).  If you already have an adjacency matrix for your graph, you can go to that menu item.  Sticky graph will try to be smart about recognizing whatever format you use for adjacency matrices, as long as it contains a square number of entries with some non-digit character(s) between entries (and is symmetric, of course, as StickyGraph does not support directed graphs).  More precisely, it will keep track of what characters appear before the first entry, after the last entry, between entries within a row, and between two rows, and will use these when outputting any future matrices.  Speaking of other matrices, you can also select Laplacian matrix mode and normalized Laplacian matrix mode from this menu, but you cannot use these to input a graph.  No matter which mode you are in, StickyGraph will always make sure that your chosen graph representation stays up to date as you edit the graph or switch between modes.

### Multigraphs

The button in the lower left with a pair of edges between two vertices toggles *multigraph mode*.  This tells StickyGraph whether to think of your graph as a simple graph or a multigraph (also known as a pseudo graph).  While in multigraph mode, for instance, identifying vertices or contracting edges can create loops and duplicate edges, while those would be discarded if working with a simple graph.  Switching from multigraph mode to simple graph mode will replace your graph with its underlying simple graph, and explicitly creating a multi-edge or loop will automatically put you into multigraph mode.

Be forewarned, some graph input/output formats (like graph6) do not make sense for multigraphs, so they will always encode the underlying simple graph.

### Drawing and Pinning

StickyGraph will try its best to draw your graph, but hey, nobody's perfect.  If you choose to move a vertex somewhere else, it will stay where you put it while the rest of the graph squirms around to accommodate.  You can always click it again later to unpin it.

If you hold the `alt` key while moving a vertex, then it won't pin.  (Well, more accurately, it flips the default pinning behavior.  Normally this is to *pin* the vertex on drag, so holding `alt` will cause the dragged vertex to *unpin*.  When selecting a vertex or applying a color, however, the default behavior is to not change whether the vertex is pinned, so with modifier held, you *will* toggle whether the vertex is pinned.) There are buttons in the bottom right decorated with a pinned and an unpinned vertex.  They will, respectively, pin or unpin all vertices (or just the selected ones, if you have some selected).

Do you want those edges to be a little less straight?  Hey, no problem!  Just grab one and pull!  If you curve an edge, it will automatically pin the incident vertices.

### Selecting and Coloring

If you hold `shift` while clicking vertex or edge (or just press and hold), you will select that feature.  You can then do useful things with that selection, like assigning them a color (by clicking on the appropriate color in the top right), or removing whatever colors they may presently be assigned (by clicking that black button).  If you hold `shift` while clicking a color button, it will instead select all vertices and edges that are currently assigned that color.  If you click a color button without anything selected, you will enter an "interactive" mode, in which you can paint colors on vertices or edges just by clicking them.

There are also buttons to select all edges, all vertices, or de-select everything, located in the bottom right corner.

### Editing

Also down in the bottom right corner, there are buttons to add vertices, add edges, delete things, and contract edges/identify vertices.  These will mostly do what you would expect!  Let's take a look at them, from top to bottom.

- If you select some vertices and/or edges, the **add vertex** button will split each of those edges, and if there are any selected vertices, it will add one new vertex adjacent to all of them.  It will add a new isolated vertex if you don't have anything selected.
- The **add edge** button only has an interactive mode.  Give it a click, then drag edges between vertices.  You can create loops and multiple edges between the same pair of vertices.
- The **delete button** will delete any selected vertices and edges, of course!  If you press it without selecting anything first, you enter an interactive mode in which you can click on things to delete them!
- The **contract button** can do two slightly different things.  If you have only edges selected, it contracts all of them.  If you have only vertices selected, it will identify all of those vertices.  Don't try it if you have both vertices and edges selected.  I don't know what that should mean, so it doesn't mean anything.  If you don't have anything selected, then it will enter an interactive mode, where you can click edges to contract them.

And again, if you choose to edit your graph in any way, StickyGraph will update the graph6 code, adjacency matrix, or whatever else, so it is always easy to pull your graph back out into the rest of the world.

If you regret the changes you've made, StickyGraph has you covered with some **undo** and **redo** buttons.  Located at the bottom of the window, they have little arrows on them which respect the usual convention of undo = left and redo = right, though it's kind of arbitrary when you think about it.

### Labels and LaTeX Export

Down in the bottom left corner of the window are four little buttons.  From bottom to top we have an interrobang, which takes you to this help page, a number sign which toggles the visibility of labels, a pair of edges toggling multigraph-mode, and the word Ti*k*Z, which displays code to draw the graph in LaTeX, exactly as it appears in StickyGraph.  It will position the vertices exactly how they are positioned within StickyGraph at the time that you clicked it (and of course, vertices and edges will be colored as you have colored them, edges bent as you have bent them, and labels will be included if you are displaying them).  Just press the button again to make it go away.  The generated LaTeX code requires the use of the wonderful graphics package Ti*k*Z, which you should probably have been using anyway.

If ever you don't like the way your graph is labeled, you can drag a label onto another vertex and they will swap.  Or you can just hide the labels entirely and try to put the issue out of your mind.

### Using a Keyboard

Most buttons in StickyGraph have an equivalent key that you can press, however most of the keys on your keyboard do not, at this time, have an equivalent button on screen.  Let this list be a guide for your fingers.

- Select and Pin
  - select a vertex: hit `shift`, type the label, then hit `enter`
  - select an edge: hit `shift`, type the first endpoint, `space`, the second endpoint, then hit `enter`
  - select all vertices: `n`
  - select all edges: `m`
  - select nothing: `,`
  - pin vertices: `i`
  - unpin vertices: `u`
- Graph Editing
  - add vertex mode: `=`
  - add edge mode: `-`
  - add a single edge: type the first endpoint, `space`, the second endpoint, then hit `enter` while in "add edge" mode
  - delete mode: `delete`
  - contract mode: `/`
  - return to default mode: `esc`
  - swap two labels: hit `s`, type the first endpoint, `space`, the second endpoint, then hit `enter`
  - undo: `z`
  - redo:  `shift`+`z`
- Colors
  - red: `r`
  - orange: `o`
  - yellow: `y`
  - green: `g`
  - cyan: `c`
  - blue: `b`
  - violet: `v`
  - magenta: `p`
  - remove color: `x`

