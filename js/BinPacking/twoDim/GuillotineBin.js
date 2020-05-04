/**
 * Created by Veronika on 24.4.2015.
 */

/**
 * GuillotineBin implements different variants of bin packer algorithms that
 * use the GUILLOTINE data structure to keep track of the free space of the bin
 * where rectangles may be placed.
 */

/// Initializes a new bin of the given size.
function GuillotineBin(width, height, rotate, merge, rectChoice, splitMethod) {
    this.binWidth = width;
    this.binHeight = height;
    this.rotate = rotate;
    this.merge = merge;
    this.rectChoice = rectChoice;
    this.splitMethod = splitMethod;
    // Stores a list of all the rectangles that we have packed so far. This is used only to compute the Occupancy ratio,
    // so if you want to have the packer consume less memory, this can be removed.
    this.usedRectangles = [];
    var r = new Rectangle();
    r.x = 0;
    r.y = 0;
    r.width = width;
    r.height = height;
    /// Stores a list of rectangles that represents the free area of the bin. This rectangles in this list are disjoint.
    this.freeRectangles = [];
    this.freeRectangles.push(r);
}

/// Inserts a single rectangle into the bin. The packer might rotate the rectangle, in which case the returned
/// struct will have the width and height values swapped.
/// If merge is true, performs free Rectangle Merge procedure after packing the new rectangle. This procedure
///		tries to defragment the list of disjoint free rectangles to improve packing performance, but also takes up
///		some extra time.
GuillotineBin.prototype.insert = function (rectangle) {
    var freeNodeIndex = this.findPositionForNewNode(rectangle, this.rectChoice);
    if (!rectangle.fit) {
        return rectangle;
    }
    // Remove the space that was just consumed by the new rectangle.
    this.splitFreeRectByHeuristic(this.freeRectangles[freeNodeIndex], rectangle, this.splitMethod);
    this.freeRectangles.splice(freeNodeIndex, 1);
    if (this.merge) {
        this.mergeFreeList();
        this.mergeFreeList();
    }
    this.usedRectangles.push(rectangle);
    return rectangle;
};

/// Goes through the list of free rectangles and finds the best one to place a rectangle of given size into.
/// Running time is Theta(|freeRectangles|).
GuillotineBin.prototype.findPositionForNewNode = function (rectangle, rectChoice) {
    var nodeIndex = 0;
    var bestScore = Number.MAX_VALUE;
    /// Try each free rectangle to find the best one for placement.
    for (var i = 0; i < this.freeRectangles.length; ++i) {
        // If this is a perfect fit upright, choose it immediately.
        if (rectangle.width == this.freeRectangles[i].width && rectangle.height == this.freeRectangles[i].height) {
            rectangle.x = this.freeRectangles[i].x;
            rectangle.y = this.freeRectangles[i].y;
            rectangle.fit = true;
            bestScore = Number.MIN_VALUE;
            nodeIndex = i;
            break;
        } // If this is a perfect fit sideways, choose it.
        else if (rectangle.height == this.freeRectangles[i].width && rectangle.width == this.freeRectangles[i].height) {
            rectangle.x = this.freeRectangles[i].x;
            rectangle.y = this.freeRectangles[i].y;
            rectangle.fit = true;
            rectangle.swap();
            bestScore = Number.MIN_VALUE;
            nodeIndex = i;
            break;
        } // Does the rectangle fit upright?
        else if (rectangle.width <= this.freeRectangles[i].width && rectangle.height <= this.freeRectangles[i].height) {
            var score = this.scoreByHeuristic(rectangle.width, rectangle.height, this.freeRectangles[i], rectChoice);
            if (score < bestScore) {
                rectangle.x = this.freeRectangles[i].x;
                rectangle.y = this.freeRectangles[i].y;
                rectangle.fit = true;
                bestScore = score;
                nodeIndex = i;
            }
        } // Does the rectangle fit sideways?
        else if (rectangle.height <= this.freeRectangles[i].width && rectangle.width <= this.freeRectangles[i].height) {
            score = this.scoreByHeuristic(rectangle.height, rectangle.width, this.freeRectangles[i], rectChoice);
            if (score < bestScore) {
                rectangle.x = this.freeRectangles[i].x;
                rectangle.y = this.freeRectangles[i].y;
                rectangle.fit = true;
                rectangle.swap();
                bestScore = score;
                nodeIndex = i;
            }
        }
    }
    return nodeIndex;
};

GuillotineBin.prototype.scoreByHeuristic = function (width, height, freeRect, rectChoice) {
    switch (rectChoice) {
        case FreeRectChoiceHeuristic.RECT_BEST_AREA_FIT:
            return this.scoreBestAreaFit(width, height, freeRect);
        case FreeRectChoiceHeuristic.RECT_BEST_SHORT_SIDE_FIT:
            return this.scoreBestShortSideFit(width, height, freeRect);
        case FreeRectChoiceHeuristic.RECT_BEST_LONG_SIDE_FIT:
            return this.scoreBestLongSideFit(width, height, freeRect);
        case FreeRectChoiceHeuristic.RECT_WORST_AREA_FIT:
            return this.scoreWorstAreaFit(width, height, freeRect);
        case FreeRectChoiceHeuristic.RECT_WORST_SHORT_SIDE_FIT:
            return this.scoreWorstShortSideFit(width, height, freeRect);
        case FreeRectChoiceHeuristic.RECT_WORST_LONG_SIDE_FIT:
            return this.scoreWorstLongSideFit(width, height, freeRect);
        default:
            return Number.MAX_VALUE;
    }
};

// The following functions compute (penalty) score values if a rect of the given size was placed into the
// given free rectangle. In these score values, smaller is better.
GuillotineBin.prototype.scoreBestAreaFit = function (width, height, freeRect) {
    return freeRect.width * freeRect.height - width * height;
};

GuillotineBin.prototype.scoreBestShortSideFit = function (width, height, freeRect) {
    var leftoverHoriz = Math.abs(freeRect.width - width);
    var leftoverVert = Math.abs(freeRect.height - height);
    return Math.min(leftoverHoriz, leftoverVert);
};

GuillotineBin.prototype.scoreBestLongSideFit = function (width, height, freeRect) {
    var leftoverHoriz = Math.abs(freeRect.width - width);
    var leftoverVert = Math.abs(freeRect.height - height);
    return Math.max(leftoverHoriz, leftoverVert);
};

GuillotineBin.prototype.scoreWorstAreaFit = function (width, height, freeRect) {
    return -this.scoreBestAreaFit(width, height, freeRect);
};

GuillotineBin.prototype.scoreWorstShortSideFit = function (width, height, freeRect) {
    return -this.scoreBestShortSideFit(width, height, freeRect);
};

GuillotineBin.prototype.scoreWorstLongSideFit = function (width, height, freeRect) {
    return -this.scoreBestLongSideFit(width, height, freeRect);
};

/// Splits the given L-shaped free rectangle into two new free rectangles after placedRect has been placed into it.
/// Determines the split axis by using the given heuristic.
GuillotineBin.prototype.splitFreeRectByHeuristic = function (freeRect, placedRect, method) {
    // Compute the lengths of the leftover area.
    var w = freeRect.width - placedRect.width;
    var h = freeRect.height - placedRect.height;

    // Placing placedRect into freeRect results in an L-shaped free area, which must be split into
    // two disjoint rectangles. This can be achieved with by splitting the L-shape using a single line.
    // We have two choices: horizontal or vertical.	Use the given heuristic to decide which choice to make.
    var splitHorizontal;
    switch (method) {
        case GuillotineSplitHeuristic.SPLIT_SHORTER_LEFTOVER_AXIS:
            // Split along the shorter leftover axis.
            splitHorizontal = (w <= h);
            break;
        case GuillotineSplitHeuristic.SPLIT_LONGER_LEFTOVER_AXIS:
            // Split along the longer leftover axis.
            splitHorizontal = (w > h);
            break;
        case GuillotineSplitHeuristic.SPLIT_MINIMIZE_AREA:
            // Maximize the larger area == minimize the smaller area.
            // Tries to make the single bigger rectangle.
            splitHorizontal = (placedRect.width * h > w * placedRect.height);
            break;
        case GuillotineSplitHeuristic.SPLIT_MAXIMIZE_AREA:
            // Maximize the smaller area == minimize the larger area.
            // Tries to make the rectangles more even-sized.
            splitHorizontal = (placedRect.width * h <= w * placedRect.height);
            break;
        case GuillotineSplitHeuristic.SPLIT_SHORTER_AXIS:
            // Split along the shorter total axis.
            splitHorizontal = (freeRect.width <= freeRect.height);
            break;
        case GuillotineSplitHeuristic.SPLIT_LONGER_AXIS:
            // Split along the longer total axis.
            splitHorizontal = (freeRect.width > freeRect.height);
            break;
        default:
            splitHorizontal = true;
    }
    // Perform the actual split.
    this.splitFreeRectAlongAxis(freeRect, placedRect, splitHorizontal);
};

/// Splits the given L-shaped free rectangle into two new free rectangles along the given fixed split axis.
/// This function will add the two generated rectangles into the freeRectangles array. The caller is expected to
/// remove the original rectangle from the freeRectangles array after that.
GuillotineBin.prototype.splitFreeRectAlongAxis = function (freeRect, placedRect, splitHorizontal) {
    // Form the two new rectangles.
    var bottom = new Rectangle();
    bottom.x = freeRect.x;
    bottom.y = freeRect.y + placedRect.height;
    bottom.height = freeRect.height - placedRect.height;

    var right = new Rectangle();
    right.x = freeRect.x + placedRect.width;
    right.y = freeRect.y;
    right.width = freeRect.width - placedRect.width;

    if (splitHorizontal) {
        bottom.width = freeRect.width;
        right.height = placedRect.height;
    } else {// Split vertically
        bottom.width = placedRect.width;
        right.height = freeRect.height;
    }

    // Add the new rectangles into the free rectangle pool if they weren't degenerate.
    if (bottom.width > 0 && bottom.height > 0) {
        this.freeRectangles.push(bottom);
    }
    if (right.width > 0 && right.height > 0) {
        this.freeRectangles.push(right);
    }
};

GuillotineBin.prototype.mergeFreeList = function () {
    // Do a Theta(n^2) loop to see if any pair of free rectangles could me merged into one.
    // Note that we miss any opportunities to merge three rectangles into one. (should call this function again to detect that)
    for (var i = 0; i < this.freeRectangles.length; ++i) {
        for (var j = i + 1; j < this.freeRectangles.length; ++j) {
            if (this.freeRectangles[i].width == this.freeRectangles[j].width && this.freeRectangles[i].x == this.freeRectangles[j].x) {
                if (this.freeRectangles[i].y == this.freeRectangles[j].y + this.freeRectangles[j].height) {
                    this.freeRectangles[i].y -= this.freeRectangles[j].height;
                    this.freeRectangles[i].height += this.freeRectangles[j].height;
                    this.freeRectangles.splice(j, 1);
                    --j;
                } else if (this.freeRectangles[i].y + this.freeRectangles[i].height == this.freeRectangles[j].y) {
                    this.freeRectangles[i].height += this.freeRectangles[j].height;
                    this.freeRectangles.splice(j, 1);
                    --j;
                }
            } else if (this.freeRectangles[i].height == this.freeRectangles[j].height && this.freeRectangles[i].y == this.freeRectangles[j].y) {
                if (this.freeRectangles[i].x == this.freeRectangles[j].x + this.freeRectangles[j].width) {
                    this.freeRectangles[i].x -= this.freeRectangles[j].width;
                    this.freeRectangles[i].width += this.freeRectangles[j].width;
                    this.freeRectangles.splice(j, 1);
                    --j;
                } else if (this.freeRectangles[i].x + this.freeRectangles[i].width == this.freeRectangles[j].x) {
                    this.freeRectangles[i].width += this.freeRectangles[j].width;
                    this.freeRectangles.splice(j, 1);
                    --j;
                }
            }
        }
    }
};

