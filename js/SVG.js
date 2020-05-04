
function SVG(){
    this.tmp = 0;
    this.recSVG = [0,0,67,64,  0,67,55,57,  0,122,61,55,  64,0,64,63,  64,64,51,56,  64,115,65,61,   127,0,56,56,   127,56,65,59,   127,121,66,53,  186,56,63,67];
}

SVG.prototype.createRectSVG = function(x,y,w,h){
    var svgns = "http://www.w3.org/2000/svg";
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'height', w);
    rect.setAttributeNS(null, 'width', h);
    rect.setAttributeNS(null, 'fill', '#'+Math.round(0xffffff * Math.random()).toString(16));
    document.getElementById('svgOne').appendChild(rect);
}

SVG.prototype.update = function(){
    if(this.tmp<10){
        this.createRectSVG(this.recSVG[4*this.tmp],this.recSVG[4*this.tmp+1],this.recSVG[4*this.tmp+2],this.recSVG[4*this.tmp+3]);
        this.tmp = this.tmp + 1;
    }else{
        this.tmp = 0;
        var svgNode = document.getElementById("svgOne");
        while (svgNode.firstChild) {
            svgNode.removeChild(svgNode.firstChild);
        }
    }
}

