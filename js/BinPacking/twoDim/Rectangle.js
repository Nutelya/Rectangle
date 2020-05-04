/**
 * Created by Veronika on 23.4.2015.
 */

function Rectangle(width, height){
    this.width = width;
    this.height = height;
    this.x = -1;
    this.y = -1;
    this.fit = false;

    // color of rectangle
    this.r = 0;
    this.g = 0;
    this.b = 0;
}

Rectangle.prototype.swap = function(){
    var tmpH = this.height;
    this.height = this.width;
    this.width = tmpH;
};