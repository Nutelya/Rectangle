var packingController = new PackingController();
var animation=new Animation();

$(document).ready( function() {
    packingController.packObjects();
    $("#canvases_div").css("width", packingController.getBinWidth());
    $("#canvases_div").css("height", packingController.getBinHeight());
    animation.startAnimation();
});


