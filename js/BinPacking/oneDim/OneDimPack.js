/**
 * Created by Veronika on 23.4.2015.
 */

/**
 * OneDimPack implements different one-dimensional bin packing algorithms to store a set of
 * one dimensional objects (stripes) to the bin.
 * it is enabled.
 */
function OneDimPack(binHeight, heuristic){
    this.bins = [];
    this.currBin = new Bin(binHeight);
    this.bins.push(this.currBin);
    this.binHeight = binHeight;
    this.heuristic = heuristic;
}

// store a stripe in to the bin
OneDimPack.prototype.insert = function(stripe){
    switch (this.heuristic) {
        case oneDimChoiceHeuristic.NEXT_FIT:
            this.nextFit(stripe);
            break;
        case oneDimChoiceHeuristic.FIRST_FIT:
            this.firstFit(stripe);
            break;
        case oneDimChoiceHeuristic.BEST_FIT:
            this.bestFit(stripe);
            break;
        case oneDimChoiceHeuristic.KNAPSACK:
            break;
        case oneDimChoiceHeuristic.MR:
            break;
    }
};

OneDimPack.prototype.nextFit = function(stripe){
    if (this.fit(stripe.height)) {
        this.addStripe(stripe);
    } else {
        this.currBin = new Bin(this.binHeight);
        this.bins.push(this.currBin);
        if (this.fit(stripe.height)) {
            this.addStripe(stripe);
        }
    }
};

OneDimPack.prototype.firstFit = function(stripe){
    for (var i = 0; i < this.bins.length; i++) {
        this.currBin = this.bins[i];
        if (this.fit(stripe.height)) {
            this.addStripe(stripe);
            return;
        }
    }
    this.currBin = new Bin(this.binHeight);
    this.bins.push(this.currBin);
    if (this.fit(stripe.height)) {
        this.addStripe(stripe);
    }
};

OneDimPack.prototype.bestFit = function(stripe){
    var inxBestBin = -1;
    var bestScore = Number.MAX_VALUE;
    for (var i = 0; i < this.bins.length; i++) {
        this.currBin = this.bins[i];
        if (this.fit(stripe.height)) {
            var score = this.currBin.height - (this.currBin.currY + stripe.height);
            if (score < bestScore) {
                inxBestBin = i;
                bestScore = score;
            }
        }
    }
    if (inxBestBin != -1) {
        this.currBin = this.bins[inxBestBin];
        this.addStripe(stripe);
    } else {
        this.currBin = new Bin(this.binHeight);
        this.bins.push(this.currBin);
        if (this.fit(stripe.height)) {
            this.addStripe(stripe);
        }
    }
};

OneDimPack.prototype.addStripe = function(stripe){
    stripe.fit = true;
    stripe.y = this.currBin.currY;
    this.currBin.stripes.push(stripe);
    this.currBin.currY = this.currBin.currY + stripe.height;
};

OneDimPack.prototype.fit = function(height){
    return this.currBin.currY + height <= this.binHeight;
};