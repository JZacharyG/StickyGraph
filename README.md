# StickyGraph
A javascript program to help you quickly visualize and work with small graphs.

##Synopsis
I know that I, personally, have been quite frustrated by how frustrating it is to try to quickly visualize particular, small graphs.  There are some programs that can quickly draw graphs reasonably well (I have been using force-directed layouts in Sage), and some slower methods to precisely control the drawing (I have been using Ti*k*Z in LaTeX).  I am yet to find, however, a tool that combines the simplicity of an automatic layout with the direct control needed to quickly find the "right" way to visualize the structure of a graph if it isn't the way that you automatic drawer *wants* to draw it.

This program seeks to address this by taking graphs in graph6 format, positioning the vertices automatically using a force directed layout (provided by the wonderful d3.js library), but giving you the control to drag vertices around, pinning them in place wherever they are dropped (as other vertices jiggle about trying to keep things pretty).  Double clicking a pinned vertex will unpin it again.  The hope is that this gives you the flexibility to get a reasonable drawing quickly.

StickyGraph also provides a few tools to edit and color the graph, which will be described more fully in the next section.

## Usage

The first thing you should most certainly do is to download or clone this repository and open stickygraph.html in your favorite browser.

#### Drawing and Pinning

You can now type a graph6-encoded graph into the box at the top left and hit enter (If you want a place to start, the Petersen Graph is given by `IheA@GUAo`).  StickyGraph will now try its best to draw your graph, but hey, nobody is perfect.  If you feel the need to move a vertex somewhere else, then it will stay where you put it while the rest of the graph squirms to accommodate.  You can always double click a vertex later if you want to unpin it.

If you hold the `alt`/`option` key while moving a vertex, it won't There are also buttons up at the top to pin and unpin all vertices (they look like a pinned vertex and an unpinned vertex respectively).

#### Selecting and Coloring

If you hold `shift` while clicking vertex or edge, you will select that feature.  You can then do useful things with that selection, like assigning them a color (by clicking on the appropriate color in the top right), or removing whatever colors they may presently be assigned (by clicking that black button).  If you hold `shift` while clicking a color button, it will instead select all vertices and edges that are currently assigned that color.  If you click a color button without anything selected, you will enter an "interactive" mode, in which you can paint colors on vertices or edges just by clicking them. 

Also, there are some buttons to select all edges, all vertices, or de-select everything.

#### Editing

Way down in the bottom left corner, there are buttons to add vertices, add edges, delete things, and contract edges/identify vertices.  These will mostly do what you would expect!  Let's take a look at them, from top to bottom.

- If you select some vertices and/or edges the **add vertex** button will split each to those edges, and if there are any selected vertices, it will add one new vertex adjacent to all of them.  It will add a new isolated vertex if you don't have anything selected.
- The **add edge** button only has an interactive mode.  Give it a click, then drag edges between vertices.
- The **delete button** will delete any selected vertices and edges, of course!  If you press it without selecting anything first, you enter an "interactive delete" mode, where you can click on things to delete them.
- The **contract button** does a couple of slightly different things.  If you have only edges selected, it contracts all of them.  If you have only vertices selected, it will identify all of those vertices.  Don't try it if you have both vertices and edges selected.  I don't know what that should mean, so it doesn't do anything.  If you don't have anything selected, then it will enter an interactive mode, where you can click edges to contract them.

The important thing to notice is that if you do any of these things to edit your graph, StickyGraph will update the graph6 code accordingly, so it is always easy to pull your graph back into the rest of the world.

