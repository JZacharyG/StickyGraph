# StickyGraph

A javascript program to help you quickly visualize and work with small (undirected) graphs.

## Purpose

I know that I, personally, have been quite frustrated by how frustrating it is to try to quickly visualize particular, small graphs.  There are some programs that can quickly draw graphs reasonably well (I have been using force-directed layouts in Sage), and some slower methods to precisely control the drawing (I have been using Ti*k*Z in LaTeX).  I am yet to find, however, a tool that combines the simplicity of an automatic layout with the direct control needed to quickly find the "right" way to visualize the structure of a graph if it isn't the way that you automatic drawer *wants* to draw it.

This program seeks to address this by taking graphs and positioning the vertices automatically using a force directed layout (provided by the wonderful [d3.js](d3js.org) library), but giving you the control to drag vertices around, pinning them in place wherever they are dropped (as other vertices jiggle about trying to keep things pretty).  The hope is that this gives you the flexibility to get a reasonable drawing quickly.

StickyGraph also provides a few tools to edit and color the graph, which will be described more fully in the next section.

## Usage

The first thing you should most certainly do is point your favorite browser towards [jzacharyg.github.io/StickyGraph](http://jzacharyg.github.io/StickyGraph) and start playing!  You can also download or clone this repository and open index.html, if you would prefer.

#### Getting a graph into (or out of) StickyGraph

So, you have a graph that you'd like to draw.  Cool!  Direct your attention to the upper left part of the window, please.  That dropdown menu lets you select the graph input/output mode.  You can elect to enter a [graph6](http://users.cecs.anu.edu.au/~bdm/data/formats.txt) encoded graph, for instance, if you have some of those lying around.  You could also go to the interactive adjacency matrix mode to be presented with a grid of checkboxes, letting you easily toggle any entry in the adjacency matrix (if you want to add or remove some vertices, you'll need the add vertex button or the delete button, respectively, which we'll get to in more detail later).  If you already have an adjacency matrix for your graph, you can go to that menu item.  Sticky graph will try to be smart about recognizing whatever format you use for adjacency matrices, as long as it contains a square number of zeros and ones.  More precisely, it will keep track of what characters appear before the first entry, after the last entry, between entries within a row, and between two rows, and will use these when outputting any future matrices.  Speaking of other matrices, you can also select Laplacian matrix mode and normalized Laplacian matrix mode from this menu, but you cannot use these to input a graph.  No matter which mode you are in, StickyGraph will always make sure that your chosen graph representation stays up to date as you edit the graph or switch between modes.

#### Drawing and Pinning

StickyGraph will now try its best to draw your graph, but hey, nobody is perfect.  If you feel the need to move a vertex somewhere else, then it will stay where you put it while the rest of the graph squirms around to accommodate.  You can always click it again later to unpin it.

If you hold the `alt` key while moving a vertex, then it won't pin.  (Well, more accurately, it flips the default pinning behavior.  Normally this is to *pin* the vertex on drag, so holding `alt` will cause the dragged vertex to *unpin*.  When selecting a vertex or applying a color, however, the default behavior is to not change whether the vertex is pinned, so with modifier held, you will toggle whether the vertex is pinned.) There are also two buttons up at the top that look like a pinned and an unpinned vertex respectively.  They will, respectively, pin or unpin all vertices (or just the selected ones, if you have some selected).

Want those edges to be a little less straight?  Hey, no problem!  Just grab one and pull, and you should be in business.  If you curve an edge, it will automatically pin the incident vertices.

#### Selecting and Coloring

If you hold `shift` while clicking vertex or edge (or just press and hold), you will select that feature.  You can then do useful things with that selection, like assigning them a color (by clicking on the appropriate color in the top right), or removing whatever colors they may presently be assigned (by clicking that black button).  If you hold `shift` while clicking a color button, it will instead select all vertices and edges that are currently assigned that color.  If you click a color button without anything selected, you will enter an "interactive" mode, in which you can paint colors on vertices or edges just by clicking them.

Also, there are some buttons to select all edges, all vertices, or de-select everything.

#### Editing

Way down in the bottom left corner, there are buttons to add vertices, add edges, delete things, and contract edges/identify vertices.  These will mostly do what you would expect!  Let's take a look at them, from top to bottom.

- If you select some vertices and/or edges the **add vertex** button will split each to those edges, and if there are any selected vertices, it will add one new vertex adjacent to all of them.  It will add a new isolated vertex if you don't have anything selected.
- The **add edge** button only has an interactive mode.  Give it a click, then drag edges between vertices.
- The **delete button** will delete any selected vertices and edges, of course!  If you press it without selecting anything first, you enter an "interactive delete" mode, where you can click on things to delete them.
- The **contract button** does a couple of slightly different things.  If you have only edges selected, it contracts all of them.  If you have only vertices selected, it will identify all of those vertices.  Don't try it if you have both vertices and edges selected.  I don't know what that should mean, so it doesn't do anything.  If you don't have anything selected, then it will enter an interactive mode, where you can click edges to contract them.

And again, if you choose to edit your graph in any way, StickyGraph will update the graph6 code, adjacency matrix, or whatever else, so it is always easy to pull your graph back out into the rest of the world.

Don't like the changes you've made?  StickyGraph has you covered with some **undo** and **redo** buttons down at the bottom.  They have little arrows on them, which respect the usual convention of undo = left and redo = right, though it's kind of arbitrary when you think about it.

#### Labels and LaTeX Export

Down in the bottom left corner of the screen are two little buttons.  The bottom one toggles the visibility of labels.  If ever you don't like the way your graph is labeled, you can drag a label onto another vertex and they will swap.  Or you can just hide the labels entirely and try to put the issue out of your mind.

The top button will display some LaTeX code to include your beautiful graph in a document.  It will position the vertices exactly how they are positioned within StickyGraph at the time that you clicked it (and of course, vertices and edges will be colored as you have colored them, edges bent as you have bent them, and labels will be included if you are displaying them).  Just press the button again to make it go away!  The generated LaTeX code requires the use of the wonderful graphics package Ti*k*Z, which you should probably be using anyway.

#### Using a Keyboard

Most buttons in StickyGraph have an equivalent key that you can press, however most of the keys on your keyboard do not, at this time, have an equivalent button on screen.  Let this list be a guide for your fingers.

- Select and Pin
  - select a vertex: hit `shift`, type the label, then hit `enter`
  - select an edge: hit `shift`, type the first endpoint, `space`, the second endpoint, then hit `enter`
  - select all vertices: `n`
  - select all edges: `m`
  - select nothing: `,`
  - pin vertices: `p`
  - unpin vertices: `u`
- Graph Editing
  - add vertex mode: `=`
  - add edge mode: `-`
  - add a single edge: type the first endpoint, `space`, the second endpoint, then hit `enter` while in "add edge" mode
  - delete mode: `delete`
  - contract mode: `/`
  - swap two labels: hit `s`, type the first endpoint, `space`, the second endpoint, then hit `enter`
  - undo: `z`
  - redo:  `shift`+`z`
- Colors
  - red: `r`
  - orange: `o`
  - yellow: `y`
  - green: `g`
  - blue: `b`
  - violet: `v`
  - remove color: `x`




