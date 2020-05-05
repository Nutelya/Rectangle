function Animation(){
    this.width = 0;
    this.height = 0;
    this.position = 0;
    this.speed = 3;
    this.fps = 60;
    this.pathArray = [];
    this.polypoints = [];
    this.globalID = null;
    this.timeoutHandle = null;
    this.i = 0;
    this.isRunning = false;

    this.canvas_layer1 = null;
    this.canvas_layer2 = null;
    this.ctx1 = null;
    this.ctx2 = null;
}

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

Animation.prototype.makePolyPoints = function(pathArray) {
    var points = [];
    for (var i = 1; i < pathArray.length; i++) {
        var startPt = pathArray[i - 1];
        var endPt = pathArray[i];
        var dx = endPt.x - startPt.x;
        var dy = endPt.y - startPt.y;
        for (var n = 0; n <= 100; n++) {
            var x = startPt.x + dx * n / 100;
            var y = startPt.y + dy * n / 100;
            points.push({
                x: x,
                y: y
            });
        }
    }
    return (points);
}

Animation.prototype.animateObject = function(i){
    if(i < packingController.objectsToPack.length && packingController.objectsToPack[i].fit){
        this.ctx2.fillStyle = 'rgb('+packingController.objectsToPack[i].r +','+packingController.objectsToPack[i].g+','+packingController.objectsToPack[i].b+')';
        this.ctx2.strokeStyle = "black";
        this.ctx2.lineWidth = 2;
        this.width = packingController.objectsToPack[i].width;
        this.height = packingController.objectsToPack[i].height;
        this.pathArray.push({
            x: 0,
            y: 0
        });
        this.pathArray.push({
            x: packingController.objectsToPack[i].x,
            y: packingController.objectsToPack[i].y
        });
        this.polypoints = this.makePolyPoints(this.pathArray);
        this.animatePath();
    }
}

Animation.prototype.animatePath = function() {
    this.timeoutHandle  = setTimeout(function () {
        this.globalID = requestAnimFrame(function(){this.animatePath();}.bind(this));
        //globalID=requestAnimationFrame(function(){
        // calc new position
        this.position += this.speed;
        if (this.position >= this.polypoints.length - 1) {
            cancelAnimationFrame(this.globalID);
            this.ctx1.fillStyle = this.ctx2.fillStyle;
            this.ctx1.strokeStyle = "black";
            this.ctx1.lineWidth = 1;
            if(this.position>this.polypoints.length - 1)
                this.ctx1.fillRect(this.polypoints[this.polypoints.length - 1].x, this.polypoints[this.polypoints.length - 1].y, this.width, this.height);
            else this.ctx1.fillRect(this.polypoints[this.position-1].x, this.polypoints[this.position-1].y, this.width, this.height);
            this.ctx1.stroke();
            this.position = 0;
            this.pathArray = [];
            this.ctx2.clearRect(0, 0, this.canvas_layer2.width, this.canvas_layer2.height);
            this.animateObject(++this.i);
            return;
        }
        this.ctx2.clearRect(0, 0, this.canvas_layer2.width, this.canvas_layer2.height);
        this.ctx2.save();
        this.ctx2.beginPath();
        var pt = this.polypoints[this.position];
        this.ctx2.rect(pt.x, pt.y, this.width, this.height);
        this.ctx2.fill();
        this.ctx2.stroke();
        this.ctx2.restore();
        //}, 1000 / fps);
    }.bind(this));
    //}
}

Animation.prototype.drawRectangles = function(){
    for(var i = 0; i < packingController.objectsToPack.length; i++){
        if(packingController.objectsToPack[i].fit) {
            this.ctx1.fillStyle = 'rgb('+packingController.objectsToPack[i].r +','+packingController.objectsToPack[i].g+','+packingController.objectsToPack[i].b+')';
            this.ctx1.strokeStyle = "black";
            this.ctx1.lineWidth = 1;
            this.ctx1.fillRect(packingController.objectsToPack[i].x, packingController.objectsToPack[i].y, packingController.objectsToPack[i].width, packingController.objectsToPack[i].height);
            this.ctx1.stroke();
        }else{
            // console.log("Rectangle num: " + i + " does not fit");
        }
    }
}

Animation.prototype.drawStripes = function(){
    var odsazeniX = 0;
    for (var i = 0; i < packingController.oneDimPack.bins.length; i++) {
        var bin = packingController.oneDimPack.bins[i];
        for (var j = 0; j < bin.stripes.length; j++) {

            var stripe = bin.stripes[j];
            this.ctx1.fillStyle = 'rgb('+stripe.r +','+stripe.g+','+stripe.b+')';
            this.ctx1.strokeStyle = "black";
            this.ctx1.lineWidth = 1;
            this.ctx1.fillRect(odsazeniX, stripe.y, packingController.binWidthOneDim, stripe.height);
            this.ctx1.stroke();
        }
        odsazeniX = odsazeniX + packingController.binWidthOneDim + packingController.gap;
    }
}

Animation.prototype.startAnimation = function() {
    window.clearTimeout(this.timeoutHandle);
    cancelAnimationFrame(this.globalID);
    this.position = 0;
    this.fps = 60;
    this.pathArray = [];
    this.i = 0;
    this.canvas_layer1 = document.getElementById("canvas_layer1");
    this.ctx1 = this.canvas_layer1.getContext("2d");
    this.ctx1.canvas.width  = packingController.binWidth;
    this.ctx1.canvas.height = packingController.binHeight;
    this.ctx1.clearRect(0, 0, this.canvas_layer1.width, this.canvas_layer1.height);
    this.canvas_layer2 = document.getElementById("canvas_layer2");
    this.ctx2 = this.canvas_layer2.getContext("2d");
    this.ctx2.canvas.width  = packingController.binWidth;
    this.ctx2.canvas.height = packingController.binHeight;
    this.ctx2.clearRect(0, 0, this.canvas_layer2.width, this.canvas_layer2.height);
    this.isRunning = true;
    if(packingController.isAnimationEnabled()) {
        this.animateObject(this.i);
    }else{
this.drawRectangles();
    }
    //this.isRunning = false;
}

Animation.prototype.isRunning = function(){
    return this.isRunning;
}

    /*http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    requestAnimationFrame polyfill by Erik MĂ¶ller
    fixes from Paul Irish and Tino Zijdel*/
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());
