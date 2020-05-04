/**
 * Created by Veronika on 23.4.2015.
 */

// Describes a horizontal slab of space where rectangles may be placed.
function Shelf(){
    // Space between [0, currentX[ has been filled with rectangles, [currentX, binWidth[ is still available for filling.
    this.currentX = 0; // The x-coordinate that specifies where the used shelf space ends.
    this.startY = 0; // The y-coordinate of where this shelf starts, inclusive.
    this.height = 0; // Specifices the height of this shelf. The topmost shelf is "open" and its height may grow.
    this.usedRectangles = [];     // Lists all the rectangles in this shelf.
}
