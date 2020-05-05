function PackingController(){
    //taille de la plaque
    this.binWidth = 600;
    this.binHeight = 400;
    //nombre d'objets
    this.numObjects = 15;

    //taille des rectangle générés aléatoirement
    this.minSize = 80;
    this.maxSize = 150;


    this.objectsToPack = [];

    this.offline = false;
    this.rotate = true;
    this.MR = true;
    this.animate = false;

    //type de coupe, voir Enums.js
    this.guillHeur = 1;
    this.split = 4;
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

/* A function to return random number from min to max */
PackingController.prototype.getRandomInt= function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

PackingController.prototype.generateObjects= function(numObjects, minSize, maxSize){
    for (var i = 0; i < numObjects; i++) {
        var obj;
        obj = new Rectangle(this.getRandomInt(minSize, maxSize), this.getRandomInt(minSize, maxSize));
        obj.r = this.getRandomInt(0, 255);
        obj.g = this.getRandomInt(0, 255);
        obj.b = this.getRandomInt(0, 255);
        //element.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        this.objectsToPack.push(obj);
    }
}

PackingController.prototype.packObjects= function(){

            this.objectsToPack = [];
            this.generateObjects(this.numObjects, this.minSize, this.maxSize);
            //myObjects();
        var bin;
            bin = new GuillotineBin(this.binWidth, this.binHeight, this.rotate, this.MR, this.guillHeur, this.split);
        for (var i = 0; i < this.objectsToPack.length; i++) {
            bin.insert(this.objectsToPack[i]);
        }
}
