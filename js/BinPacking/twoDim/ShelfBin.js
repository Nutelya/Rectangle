/**
 * Created by Veronika on 23.4.2015.
 */

/**
 * ShelfBin implements different bin packing algorithms that use the SHELF
 * data structure. ShelfBin also uses GuillotineBin for the waste map if
 * it is enabled.
 */

// Clears all previously packed rectangles and starts packing from scratch into a bin of the given size.
function ShelfBin(width, height, rotate, useWasteMap, method) {
    this.binWidth = width;
    this.binHeight = height;
    this.rotate = rotate;
    this.useWasteMap = useWasteMap; // If true, the following GuillotineBinPack structure is used to recover the SHELF data structure from losing space.
    this.method = method;
    this.currentY = 0; // Stores the starting y-coordinate of the latest (topmost) shelf.
    this.usedSurfaceArea = 0; // Tracks the total consumed surface area.
    this.shelves = [];
    this.startNewShelf(0);
    if (useWasteMap) {
        this.wasteMap = new GuillotineBin(width, height);
        this.wasteMap.freeRectangles = [];
    }
}

/* Inserts a single rectangle into the bin. The packer might rotate the rectangle, in which case the returned
 struct will have the width and height values swapped.*/
ShelfBin.prototype.insert = function (rectangle) {
    // First try to pack this rectangle into the waste map, if it fits.
    if (this.useWasteMap) {
        rectangle = this.wasteMap.insert(rectangle);
        if (rectangle.fit) {
            // Track the space we just used.
            this.usedSurfaceArea += rectangle.width * rectangle.height;
            return rectangle;
        }
    }
    switch (this.method) {
        case 1:
        {
            var r = this.shelfNextFit(rectangle);
            if (r.fit) {
                return r;
            }
            break;
        }
        case ShelfChoiceHeuristic.SHELF_FIRST_FIT:
        {
            r = this.shelfFirstFit(rectangle);
            if (r.fit) {
                return r;
            }
            break;
        }
        case ShelfChoiceHeuristic.SHELF_BEST_AREA_FIT:
        {
            r = this.shelfBestAreaFit(rectangle);
            if (r.fit) {
                return r;
            }
            break;
        }
        case ShelfChoiceHeuristic.SHELF_WORST_AREA_FIT:
        {
            r = this.shelfWorstAreaFit(rectangle);
            if (r.fit) {
                return r;
            }
            break;
        }
        case ShelfChoiceHeuristic.SHELF_BEST_HEIGHT_FIT:
        {
            r = this.shelfBestHeightFit(rectangle);
            if (r.fit) {
                return r;
            }
            break;
        }
        case ShelfChoiceHeuristic.SHELF_BEST_WIDTH_FIT:
        {
            r = this.shelfBestWidthFit(rectangle);
            if (r.fit) {
                return r;
            }
            break;
        }
        case ShelfChoiceHeuristic.SHELF_WORST_WIDTH_FIT:
        {
            r = this.shelfWorstWidthFit(rectangle);
            if (r.fit) {
                return r;
            }
            break;
        }
    }

    // The rectangle did not fit on any of the shelves. Open a new shelf.
    // Flip the rectangle so that the long side is horizontal.
    if (this.rotate && rectangle.width < rectangle.height && rectangle.height <= this.binWidth) {
        rectangle.swap();
    }
    if (this.canStartNewShelf(rectangle.height)) {
        if (this.useWasteMap) {
            this.moveShelfToWasteMap(this.shelves[this.shelves.length - 1]);
        }
        this.startNewShelf(rectangle.height);
        this.addToShelf(this.shelves[this.shelves.length - 1], rectangle);
        rectangle.fit = true;
        return rectangle;
    }
    rectangle.fit = false;
    return rectangle;
};

ShelfBin.prototype.shelfNextFit = function (rectangle) {
    if (this.fitsOnShelf(this.shelves[this.shelves.length - 1], rectangle, true)) {
        this.addToShelf(this.shelves[this.shelves.length - 1], rectangle);
        rectangle.fit = true;
    }
    return rectangle;
};

ShelfBin.prototype.shelfFirstFit = function (rectangle) {
    for (var i = 0; i < this.shelves.length; ++i) {
        if (this.fitsOnShelf(this.shelves[i], rectangle, i == this.shelves.length - 1)) {
            this.addToShelf(this.shelves[i], rectangle);
            rectangle.fit = true;
        }
    }
    return rectangle;
};

ShelfBin.prototype.shelfBestAreaFit = function (rectangle){
    var bestShelf = null;
    var bestShelfSurfaceArea = Number.MAX_VALUE;
    for (var i = 0; i < this.shelves.length; ++i) {
        // Pre-rotate the rect onto the shelf here already so that the area fit computation
        // is done correctly.
        this.rotateToShelf(this.shelves[i], rectangle);
        if (this.fitsOnShelf(this.shelves[i], rectangle, i == this.shelves.length - 1)) {
            var surfaceArea = (this.binWidth - this.shelves[i].currentX) * this.shelves[i].height;
            if (surfaceArea < bestShelfSurfaceArea) {
                bestShelf = this.shelves[i];
                bestShelfSurfaceArea = surfaceArea;
            }
        }
    }
    if (bestShelf != null) {
        this.addToShelf(bestShelf, rectangle);
        rectangle.fit = true;
    }
    return rectangle;
};

ShelfBin.prototype.shelfWorstAreaFit = function (rectangle) {
    var bestShelf = null;
    var bestShelfSurfaceArea = -1;
    for (var i = 0; i < this.shelves.length; ++i) {
        this.rotateToShelf(this.shelves[i], rectangle);
        if (this.fitsOnShelf(this.shelves[i], rectangle, i == this.shelves.length - 1)) {
            var surfaceArea = (this.binWidth - this.shelves[i].currentX) * this.shelves[i].height;
            if (surfaceArea > bestShelfSurfaceArea) {
                bestShelf = this.shelves[i];
                bestShelfSurfaceArea = surfaceArea;
            }
        }
    }
    if (bestShelf != null) {
        this.addToShelf(bestShelf, rectangle);
        rectangle.fit = true;
    }
    return rectangle;

};

ShelfBin.prototype.shelfBestHeightFit = function (rectangle){
    var bestShelf = null;
    var bestShelfHeightDifference = Number.MAX_VALUE;
    for (var i = 0; i < this.shelves.length; ++i) {
        this.rotateToShelf(this.shelves[i], rectangle);
        if (this.fitsOnShelf(this.shelves[i], rectangle, i == this.shelves.length - 1)) {
            var heightDifference = Math.max(this.shelves[i].height - rectangle.height, 0);
            if (heightDifference < bestShelfHeightDifference) {
                bestShelf = this.shelves[i];
                bestShelfHeightDifference = heightDifference;
            }
        }
    }
    if (bestShelf != null) {
        this.addToShelf(bestShelf, rectangle);
        rectangle.fit = true;
    }
    return rectangle;
};

ShelfBin.prototype.shelfBestWidthFit = function (rectangle) {
    var bestShelf = null;
    var bestShelfWidthDifference = Number.MAX_VALUE;
    for (var i = 0; i < this.shelves.length; ++i) {
        this.rotateToShelf(this.shelves[i], rectangle);
        if (this.fitsOnShelf(this.shelves[i], rectangle, i == this.shelves.length - 1)) {
            var widthDifference = this.binWidth - this.shelves[i].currentX - rectangle.width;
            if (widthDifference < bestShelfWidthDifference) {
                bestShelf = this.shelves[i];
                bestShelfWidthDifference = widthDifference;
            }
        }
    }
    if (bestShelf != null) {
        this.addToShelf(bestShelf, rectangle);
        rectangle.fit = true;
    }
    return rectangle;
};

ShelfBin.prototype.shelfWorstWidthFit = function (rectangle) {
    var bestShelf = null;
    var bestShelfWidthDifference = -1;
    for (var i = 0; i < this.shelves.length; ++i) {
        this.rotateToShelf(this.shelves[i], rectangle);
        if (this.fitsOnShelf(this.shelves[i], rectangle, i == this.shelves.length - 1)) {
            var widthDifference = this.binWidth - this.shelves[i].currentX - rectangle.width;
            if (widthDifference > bestShelfWidthDifference) {
                bestShelf = this.shelves[i];
                bestShelfWidthDifference = widthDifference;
            }
        }
    }
    if (bestShelf != null) {
        this.addToShelf(bestShelf, rectangle);
        rectangle.fit = true;
    }
    return rectangle;
};

/// Returns true if the rectangle of size width*height fits on the given shelf, possibly rotated.
/// @param canResize If true, denotes that the shelf height may be increased to fit the object.
ShelfBin.prototype.fitsOnShelf = function (shelf, rectangle, canResize) {
    var shelfHeight = canResize ? (this.binHeight - shelf.startY) : shelf.height;
    return ((shelf.currentX + rectangle.width <= this.binWidth && rectangle.height <= shelfHeight)
        || (shelf.currentX + rectangle.height <= this.binWidth && rectangle.width <= shelfHeight));

};

/// Creates a new shelf of the given starting height, which will become the topmost 'open' shelf.
ShelfBin.prototype.startNewShelf = function (startingHeight) {
    if (this.shelves.length > 0) {
        this.currentY += this.shelves[this.shelves.length - 1].height;
    }
    var shelf = new Shelf();
    shelf.currentX = 0;
    shelf.height = startingHeight;
    shelf.startY = this.currentY;
    this.shelves.push(shelf);
};

/// Adds the rectangle of size width*height into the given shelf, possibly rotated.
ShelfBin.prototype.addToShelf = function (shelf, rectangle) {
    // Swap width and height if the rect fits better that way.
    this.rotateToShelf(shelf, rectangle);
    // Add the rectangle to the shelf.
    rectangle.x = shelf.currentX;
    rectangle.y = shelf.startY;
    shelf.usedRectangles.push(rectangle);
    // Advance the shelf end position horizontally.
    shelf.currentX += rectangle.width;
    // Grow the shelf height.
    shelf.height = Math.max(shelf.height, rectangle.height);
    this.usedSurfaceArea += rectangle.width * rectangle.height;
};

/// Measures and if desirable, flips width and height so that the rectangle fits the given shelf the best.
ShelfBin.prototype.rotateToShelf = function (shelf, rectangle) {
    // If the width > height and the long edge of the new rectangle fits vertically onto the current shelf,
    // flip it. If the short edge is larger than the current shelf height, store
    // the short edge vertically.
    if(this.rotate){
        if ((rectangle.width > rectangle.height && rectangle.width > this.binWidth - shelf.currentX)
            || (rectangle.width > rectangle.height && rectangle.width < shelf.height)
            || (rectangle.width < rectangle.height && rectangle.height > shelf.height && rectangle.height <= this.binWidth - shelf.currentX)) {
            rectangle.swap();
        }
    }
};

/// Returns true if there is still room in the bin to start a new shelf of the given height.
ShelfBin.prototype.canStartNewShelf = function (height) {
    return this.shelves[this.shelves.length - 1].startY + this.shelves[this.shelves.length - 1].height + height <= this.binHeight;
};

/// Parses through all rectangles added to the given shelf and adds the gaps between the rectangle tops and the shelf
/// ceiling into the waste map. This is called only once when the shelf is being closed and a new one is opened.
ShelfBin.prototype.moveShelfToWasteMap = function (shelf) {
    var freeRects = this.wasteMap.freeRectangles;
    // Add the gaps between each rect top and shelf ceiling to the waste map.
    for (var i = 0; i < shelf.usedRectangles.length; ++i) {
        var r = shelf.usedRectangles[i];
        var rectangle = new Rectangle();
        rectangle.x = r.x;
        rectangle.y = r.y + r.height;
        rectangle.width = r.width;
        rectangle.height = shelf.height - r.height;
        if (rectangle.height > 0) {
            freeRects.push(rectangle);
        }
    }
    shelf.usedRectangles = [];
    // Add the space after the shelf end (right side of the last rect) and the shelf right side.
    rectangle = new Rectangle();
    rectangle.x = shelf.currentX;
    rectangle.y = shelf.startY;
    rectangle.width = this.binWidth - shelf.currentX;
    rectangle.height = shelf.height;
    if (rectangle.width > 0) {
        freeRects.push(rectangle);
    }
    // This shelf is DONE.
    shelf.currentX = this.binWidth;
    // Perform a rectangle merge step.
    this.wasteMap.mergeFreeList();
};

/// Computes the ratio of used surface area to the bin area.
ShelfBin.prototype.occupancy = function () {
    return this.usedSurfaceArea / (this.binWidth * this.binHeight);
};
