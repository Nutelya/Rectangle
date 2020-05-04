/**
 * Created by Veronika on 19.4.2015.
 */

var packingController = new PackingController();
var pageController=null;
var svg = new SVG();
var svgInterval=null;
var animation=new Animation();

$(document).ready( function() {

    pages=[];

    pages[0]={ link: "#nav-1", beforeAction: function() {

            clearInterval(svgInterval);
            return true;

        }, action: function () {

            svgInterval=setInterval(function () { svg.update() }.bind(svg), 700);

        } };
    pages[1]={ link: "#nav-2", beforeAction: function() { return true; }, action: function () {

            $("input[type=radio][name=dim][value="+packingController.getDim()+"]").prop('checked', true);

        } };
    pages[2]={ link: "#nav-3", beforeAction: function() { return true; }, action: function () {

            $("input[type=radio][name=source][value="+packingController.getSource()+"]").prop('checked', true);

        } };
    pages[3]={ link: "#nav-4", beforeAction: function() {
            console.log("nav-4");
            var inputs = $("input:visible");
            var err = false;
            for (var i=0; i<inputs.length; i++) {
                if(!inputs[i].checkValidity() || inputs[i].value == ""){
                    alertify.alert("Fill all inputs with numbers");
                    err = true;
                }
            }
            return !err;

        }, action: function () {

            if(packingController.getDim()=="1D"){
                $(".random_2D").css("display", "none");
                $(".own_2D").css("display", "none");
                $(".heur_2D").css("display", "none");
                $(".heur_1D").css("display", "block");
                if(packingController.getSource()=="random"){
                    $(".own_1D").css("display", "none");
                }else if(packingController.getSource()=="own"){
                    $(".random_1D").css("display", "none");
                }
            }else if(packingController.getDim()=="2D"){
                $(".random_1D").css("display", "none");
                $(".own_1D").css("display", "none");
                $(".heur_1D").css("display", "none");
                $(".heur_2D").css("display", "block");
                if(packingController.getSource()=="random"){
                    $(".own_2D").css("display", "none");
                }else if(packingController.getSource()=="own"){
                    $(".random_2D").css("display", "none");
                }

            }
            $("."+packingController.getSource()+"_"+packingController.getDim()).css("display", "block");

        } };
    pages[4]={ link: "#nav-5", beforeAction: function() {
            console.log("nav-5");
            var inputs = $("input:visible");
            var err = false;
            for (var i=0; i<inputs.length; i++) {
                if(!inputs[i].checkValidity() || inputs[i].value == ""){
                    alertify.alert("Fill all inputs with numbers");
                    err = true;
                }
            }

            return !err;

        }, action: function () {} };
    pages[5]={ link: "#nav-6", beforeAction: function() { return true; }, action: function () {

            if (animation.isRunning==false) {
                packingController.getInputsFromStep4();
                packingController.getInputsFromStep5();
                packingController.packObjects();
                if(packingController.getDim()=="1D"){
                    $("#canvases_div").css("width", packingController.getBinWidth());
                    $("#canvases_div").css("height", packingController.getBinHeight());
                }else{
                    $("#canvases_div").css("width", packingController.getBinWidth());
                    $("#canvases_div").css("height", packingController.getBinHeight());
                }
                animation.startAnimation();
            }

        } };
    pages[6]={ link: "#nav-7", beforeAction: function() { return true; }, action: function () {} };

    pageController=new PageController(pages, 0);


    $(".switch_container label input[type=radio]").click(function (e) {
        var name = $(this).attr("name");
        if (name=="dim") {
            packingController.setDim($(this).val());
            window.location.hash="#nav-3";
        }
        if (name=="source") {
            packingController.setSource($(this).val());
            window.location.hash="#nav-4";
        }
    });

    $(".btn_target, .a_target").click(function (e){
        e.preventDefault();
        var link = $(this).attr("data-link");
        window.location.hash = link;

        if (link=="nav-6") {
            animation.isRunning=false;
        }

    });
    $( "#online" ).click(function() {
        $("#online_1D_heur").css("display", "block");
        $("#offline_1D_heur").css("display", "none");
        $("#offline_2D_sort").css("display", "none");
    });
    $( "#offline" ).click(function() {
        $("#online_1D_heur").css("display", "none");
        $("#offline_1D_heur").css("display", "block");
        $("#offline_2D_sort").css("display", "block");
    });
    $( "#shelf" ).click(function() {
        $("#shelfPacking").css("display", "block");
        $("#guillotinePacking").css("display", "none");
    });
    $( "#guill" ).click(function() {
        $("#shelfPacking").css("display", "none");
        $("#guillotinePacking").css("display", "block");
    });

    window.addEventListener('online',  function () {
        alertify.log("You are online now");
    });
    window.addEventListener('offline', function () {
        alertify.log("You are offline now");
    });

});

/**
 * Function for manipulation with speed of animation
 */
function updateSliderBar(vol) {
    document.querySelector('#volume').value = vol;
    animation.speed = parseInt(vol);
}



