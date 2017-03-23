# StickyGraph

A javascript program to help you quickly visualize and work with small (undirected) graphs and multigraphs.

## Purpose

I know that I, personally, have been quite frustrated by how frustrating it is to try to quickly visualize particular, small graphs.  There are some programs that can quickly draw graphs reasonably well (I have been using force-directed layouts in Sage), and some slower methods to precisely control the drawing (I have been using Ti*k*Z in LaTeX).  I am yet to find, however, a tool that combines the simplicity of an automatic layout with the direct control needed to quickly find the "right" way to visualize the structure of a graph if it isn't the way that you automatic drawer *wants* to draw it.

This program seeks to address this by taking graphs and positioning the vertices automatically using a force directed layout (provided by the wonderful [d3.js](d3js.org) library), but giving you the control to drag vertices around, pinning them in place wherever they are dropped (as other vertices jiggle about trying to keep things pretty).  The hope is that this gives you the flexibility to get a reasonable drawing quickly.

StickyGraph also provides a few tools to edit and color the graph, which are described in great detail in [usage.md](http://jzacharyg.github.io/StickyGraph/usage).

## Usage

The first thing that you should most certainly do is point your favorite browser to [jzacharyg.github.io/StickyGraph](http://jzacharyg.github.io/StickyGraph) and start playing!  You can input graphs in various formats, edit them, control how they are drawn, and then output the result.  Most things should be fairly self explanatory, but if you ever find yourself confused, there is a help button (with an interrobang on it) in the lower left corner.  It will take you to [this page](http://jzacharyg.github.io/StickyGraph/usage), where all of your questions will be answered.

