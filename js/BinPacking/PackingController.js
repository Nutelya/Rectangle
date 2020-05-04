
function PackingController(){
    this.dim = "2D";
    this.source = "random";
    this.binWidth = 800;
    this.binHeight = 300;
    this.numObjects =  95;
    this.minSize = 20;
    this.maxSize = 60;
    this.objectsToPack = [];

    this.offline = false;
    this.rotate = true;
    this.shelfs = false;
    this.MR = false;
    this.WM = false;
    this.animate = false;

    this.shelfHeur = 3;
    this.guillHeur = 1;
    this.split = 3;
    this.sort =  5;
    this.oneDimHeur = 3;

    this.binWidthOneDim = 10;
    this.gap = 2;
    this.oneDimPack= null;
}
PackingController.prototype.getDim = function(){
    var storageDim=window.localStorage.getItem("kaj_dim");
    if (storageDim!=null) {
        this.dim = storageDim;
    }
    return this.dim;
}

PackingController.prototype.setDim = function(bw){
    window.localStorage.setItem("kaj_dim", bw);
    this.dim = bw;
}
PackingController.prototype.getSource = function(){
    var storageSource=window.localStorage.getItem("kaj_source");
    if (storageSource!=null) {
        this.source = storageSource;
    }
    return this.source;
}

PackingController.prototype.setSource = function(bw){
    window.localStorage.setItem("kaj_source", bw);
    this.source = bw;
}
PackingController.prototype.getBinWidth = function(){
    return this.binWidth;
}

PackingController.prototype.setBinWidth = function(bw){
    this.binWidth = bw;
}

PackingController.prototype.getBinHeight = function(){
    return this.binHeight;
}

PackingController.prototype.setBinHeight = function(bh){
    this.binHeight = bh;
}

PackingController.prototype.getNumObjects = function(){
    return this.numObjects;
}

PackingController.prototype.setNumObjects = function(n){
    this.numObjects = n;
}

PackingController.prototype.getMinSize = function(){
    return this.minSize;
}

PackingController.prototype.setMinSize = function(n){
    this.minSize = n;
}

PackingController.prototype.getMaxSize = function(){
    return this.maxSize;
}

PackingController.prototype.setMaxSize = function(n){
    this.maxSize = n;
}

PackingController.prototype.getObjectsToPack = function(){
    return this.objectsToPack;
}

PackingController.prototype.setObjectsToPack = function(n){
    this.objectsToPack = n;
}

PackingController.prototype.isOffline = function(){
    return this.offline;
}

PackingController.prototype.setOffline = function(n){
    this.offline = n;
}

PackingController.prototype.isRotationEnabled = function(){
    return this.rotate;
}

PackingController.prototype.setRotationEnabled = function(n) {
    this.rotate = n;
}

PackingController.prototype.isShelfEnabled = function(){
    return this.shelfs;
}

PackingController.prototype.setShelfsEnabled = function(n){
    this.shelfs = n;
}

PackingController.prototype.isMREnabled = function(){
    return this.MR;
}

PackingController.prototype.setMREnabled = function(n){
    this.MR = n;
}

PackingController.prototype.isWMEnabled = function(){
    return this.WM;
}

PackingController.prototype.setWMEnabled = function(n){
    this.WM = n;
}

PackingController.prototype.isAnimationEnabled = function(){
    return this.animate;
}

PackingController.prototype.setAnimationEnabled = function(n){
    this.animate = n;
}

PackingController.prototype.getShelfHeur = function(){
    return this.shelfHeur;
}

PackingController.prototype.setShelfHeur = function(n){
    this.shelfHeur = n;
}

PackingController.prototype.getGuillHeur = function(){
    return this.guillHeur;
}

PackingController.prototype.setGuillHeur = function(n){
    this.guillHeur = n;
}

PackingController.prototype.getSplitHeur = function(){
    return this.split;
}

PackingController.prototype.setSplitHeur = function(n){
    this.split = n;
}

PackingController.prototype.getSortHeur = function(){
    return this.sort;
}

PackingController.prototype.setSortHeur = function(n){
    this.sort = n;
}

PackingController.prototype.getOneDimHeur = function(){
    return this.oneDimHeur;
}

PackingController.prototype.setOneDimHeur = function(n){
    this.oneDimHeur = n;
}

PackingController.prototype.getBinWidthOneDim = function(){
    return this.binWidthOneDim;
}

PackingController.prototype.setBinWidthOneDim = function(n){
    this.binWidthOneDim = n;
}

PackingController.prototype.getGap = function(){
    return this.gap;
}

PackingController.prototype.setGap = function(n){
    this.gap = n;
}

PackingController.prototype.getOneDimPack = function(){
    return this.oneDimPack;
}

PackingController.prototype.setOneDimPack = function(n){
    this.oneDimPack = n;
}

PackingController.prototype.getInputsFromStep4 = function(){
            this.minSize = 60;
            this.maxSize = 100;
            this.binWidth= 400;
            this.binHeight= 400;
            this.numObjects = 50;
    /*    console.log("offline: "+offline);
     console.log("rotate: "+rotate);
     console.log("oneDimHeur: "+oneDimHeur);
     console.log("sort: "+sort);
     console.log("shelfHeur: "+shelfHeur);
     console.log("WM: "+WM);
     console.log("guillHeur: "+guillHeur);
     console.log("split: "+split);
     console.log("MR: "+MR);*/
}


PackingController.prototype.getInputsFromStep5 = function(){
    this.animate = false;
    this.guillHeur = 1;
    this.split = 4;
    this.MR = true;
    this.sort = 1;

    /*   console.log("offline: "+offline);
     console.log("rotate: "+rotate);
     console.log("oneDimHeur: "+oneDimHeur);
     console.log("sort: "+sort);
     console.log("shelfHeur: "+shelfHeur);
     console.log("WM: "+WM);
     console.log("guillHeur: "+guillHeur);
     console.log("split: "+split);
     console.log("MR: "+MR); */
}


/* A function to return random number from min to max */
PackingController.prototype.getRandomInt= function(min, max) {
    //return min + (Math.random() * max)
    //console.log(min + " "+ max);
    //console.log(Math.floor(Math.random() * (max - min)) + min);
    return Math.floor(Math.random() * (max - min)) + min;
}

PackingController.prototype.generateObjects= function(numObjects, minSize, maxSize){
    for (var i = 0; i < numObjects; i++) {
        var obj;
        if(this.dim=="1D")
            obj = new Stripe(this.getRandomInt(minSize, maxSize));
        else
            obj = new Rectangle(this.getRandomInt(minSize, maxSize), this.getRandomInt(minSize, maxSize));
        obj.r = this.getRandomInt(0, 255);
        obj.g = this.getRandomInt(0, 255);
        obj.b = this.getRandomInt(0, 255);
        //element.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        this.objectsToPack.push(obj);
    }
}

PackingController.prototype.packObjects= function(){

        if(this.source == "random"){
            this.objectsToPack = [];
            this.generateObjects(this.numObjects, this.minSize, this.maxSize);
            //myObjects();
        }else{
            for(var i= 0; i< this.objectsToPack.length; i++){
                this.objectsToPack[i].fit = false;
                this.objectsToPack[i].y = -1;
                this.objectsToPack[i].x = -1;
            }
        }
        if(this.offline)
            this.sortObjects();
        var bin;
        if(this.shelfs){
            bin = new ShelfBin(this.binWidth, this.binHeight, this.rotate, this.WM, this.shelfHeur);
        }else{
            bin = new GuillotineBin(this.binWidth, this.binHeight, this.rotate, this.MR, this.guillHeur, this.split);
        }
        for (var i = 0; i < this.objectsToPack.length; i++) {
            bin.insert(this.objectsToPack[i]);
        }
}
