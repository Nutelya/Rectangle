/**
 * Created by Veronika on 23.4.2015.
 */

var oneDimChoiceHeuristic = {
    NEXT_FIT: 1, ///< -NF: We always put the new rectangle to the last open shelf.
    NEXT_FIT_DECREASING: 2,
    FIRST_FIT: 3, ///< -FF: We test each rectangle against each shelf in turn and pack it to the first where it fits.
    FIRST_FIT_DECREASING: 4,
    BEST_FIT: 5, ///< -BAF: Choose the shelf with smallest remaining shelf area.
    MR: 6,
    KNAPSACK: 7
};

// Defines different heuristic rules that can be used in the packing process.
var ShelfChoiceHeuristic = {
    SHELF_NEXT_FIT: 1, ///< -NF: We always put the new rectangle to the last open shelf.
    SHELF_FIRST_FIT: 2, ///< -FF: We test each rectangle against each shelf in turn and pack it to the first where it fits.
    SHELF_BEST_AREA_FIT: 3, ///< -BAF: Choose the shelf with smallest remaining shelf area.
    SHELF_WORST_AREA_FIT: 4, ///< -WAF: Choose the shelf with the largest remaining shelf area.
    SHELF_BEST_HEIGHT_FIT: 5, ///< -BHF: Choose the smallest shelf (height-wise) where the rectangle fits.
    SHELF_BEST_WIDTH_FIT: 6, ///< -BWF: Choose the shelf that has the least remaining horizontal shelf space available after packing.
    SHELF_WORST_WIDTH_FIT: 7 ///< -WWF: Choose the shelf that will have most remainining horizontal shelf space available after packing.
};

/// Specifies the different choice heuristics that can be used when deciding which of the free subrectangles
/// to place the to-be-packed rectangle into.
var FreeRectChoiceHeuristic = {
    RECT_BEST_AREA_FIT:1, ///< -BAF
    RECT_BEST_SHORT_SIDE_FIT:2, ///< -BSSF
    RECT_BEST_LONG_SIDE_FIT:3, ///< -BLSF
    RECT_WORST_AREA_FIT:4, ///< -WAF
    RECT_WORST_SHORT_SIDE_FIT:5, ///< -WSSF
    RECT_WORST_LONG_SIDE_FIT:6 ///< -WLSF
};

/// Specifies the different choice heuristics that can be used when the packer needs to decide whether to
/// subdivide the remaining free space in horizontal or vertical direction.
var GuillotineSplitHeuristic = {
    SPLIT_SHORTER_LEFTOVER_AXIS:1, ///< -SLAS
    SPLIT_LONGER_LEFTOVER_AXIS:2, ///< -LLAS
    SPLIT_MINIMIZE_AREA:3, ///< -MINAS, Try to make a single big rectangle at the expense of making the other small.
    SPLIT_MAXIMIZE_AREA:4, ///< -MAXAS, Try to make both remaining rectangles as even-sized as possible.
    SPLIT_SHORTER_AXIS:5, ///< -SAS
    SPLIT_LONGER_AXIS:6 ///< -LAS
};

var SortChoice = {
    SORT_BY_AREA_AS:1, ///< -ASCA
    SORT_BY_AREA_DES:2, ///< -DESCA
    SORT_BY_SHORTER_SIDE_AS:3, ///< -ASCSS
    SORT_BY_SHORTER_SIDE_DES:4, ///< -DESCSS
    SORT_BY_LONGER_SIDE_AS:5, ///< -
    SORT_BY_LONGER_SIDE_DES:6, ///< -
    SORT_BY_PERIMETER_AS:7, ///< -
    SORT_BY_PERIMETER_DES:8, ///< -
    SORT_BY_DIFFERENCE_AS:9,
    SORT_BY_DIFFERENCE_DES:10,
    SORT_BY_RATIO_AS:11,
    SORT_BY_RATIO_DES:12
};