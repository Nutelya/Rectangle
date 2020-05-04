/**
 * Created by Veronika on 28.4.2015.
 */

function sortByAreaAS(r1, r2) {
    if (r1.width * r1.height == r2.width * r2.height) {
        return 0;
    }
    if (r1.width * r1.height < r2.width * r2.height) {
        return -1;
    } else {
        return 1;
    }
}

function sortByShorterSideAS(r1, r2) {
    w1 = Math.min(r1.height, r1.width);
    h1 = Math.max(r1.height, r1.width);
    w2 = Math.min(r2.height, r2.width);
    h2 = Math.max(r2.height, r2.width);

    if (w1 == w2 && h1 == h2) {
        return 0;
    }
    if (w1 < w2 || (w1 == w2 && h1 < h2)) {
        return -1;
    } else {
        return 1;
    }
}

function sortByLongerSideAS(r1, r2) {
    w1 = Math.min(r1.height, r1.width);
    h1 = Math.max(r1.height, r1.width);
    w2 = Math.min(r2.height, r2.width);
    h2 = Math.max(r2.height, r2.width);

    if (w1 == w2 && h1 == h2) {
        return 0;
    }
    if (h1 < h2 || (h1 == h2 && w1 < w2)) {
        return -1;
    } else {
        return 1;
    }
}

function sortByPerimeterAS(r1, r2) {
    if (r1.height + r1.width == r2.height + r2.width) {
        return 0;
    }
    if (r1.height + r1.width < r2.height + r2.width) {
        return -1;
    } else {
        return 1;
    }
}

function sortByDifferenceAS(r1, r2) {
    w1 = Math.min(r1.height, r1.width);
    h1 = Math.max(r1.height, r1.width);
    w2 = Math.min(r2.height, r2.width);
    h2 = Math.max(r2.height, r2.width);

    if (Math.abs(h1 - w1) == Math.abs(h2 - w2)) {
        return 0;
    }
    if (Math.abs(h1 - w1) < Math.abs(h2 - w2)) {
        return -1;
    } else {
        return 1;
    }
}

function sortByRatioAS(r1, r2) {
    w1 = Math.min(r1.height, r1.width);
    h1 = Math.max(r1.height, r1.width);
    w2 = Math.min(r2.height, r2.width);
    h2 = Math.max(r2.height, r2.width);

    if (w1 / h1 == w2 / h2) {
        return 0;
    }
    if (w1 / h1 < w2 / h2) {
        return -1;
    } else {
        return 1;
    }
}

function sortStripesAS(s1, s2) {
    if (s1.height == s2.height) {
        return 0;
    }
    if (s1.height < s2.height) {
        return -1;
    } else {
        return 1;
    }
}
