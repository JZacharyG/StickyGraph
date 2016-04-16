# StickyDraw
A javascript program to help you quickly visualize and work with small graphs.

##Synopsis
I know that I, personally, have been quite frustrated by how frustrating it is to try to quickly visualize particular, small graphs.  There are some programs that can draw graphs reasonably well (I have been using force-directed layouts in Sage), and some ways to precisely control the drawing (I have been using TikZ in LaTeX).  I am yet to find, however, one that combines simiplicity of an automatic layout with the direct control needed to quickly find the "right" way to visualize the structure of a graph if it isn't the way that you automatic drawer *wants* to draw it.

This program seeks to address this by taking graphs in graph6 format, positioning the vertices automatically using a force directed layout, but giving you the control to drag vertices around (the others will jiggle about to try to keep things pretty), pinning them in place wherever they are dropped.  Double clicking a pinned vertex will unpin it again.  The hope is that this gives you the flexibililty to get a reasonable drawing quickly.

You can also select vertices or edges by holding `shift` while clicking.  Clicking on any of those beautiful colorful boxes on the side will apply that color to any selected elements!  Also, if you `shift` click one of those colors, it will select all elements with that color.

##Installation
Installation couldn't be easier!  Just download or clone this repository, open stickydraw.html in your favorite browser, and you are up and running!  Throw some graph6-encoded graphs at it and start playing!
