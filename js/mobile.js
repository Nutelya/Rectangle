

$(document).ready(function () {
    media();
});

$( window ).resize(function() {
    media();
});

function media() {
    if (window.matchMedia("only screen and (max-width : 600px), (orientation:portrait)").matches) {
        var menu=$("<img id='nav_menu' src='images/menu.png' alt='menu'>");
        $("#page-container > header").append(menu);

        $(menu).click(function () {

            var nav=$("#page-container > header nav");

            if (nav.is(":visible")) {
                nav.slideUp(200);
            }else{
                nav.slideDown(200);
            }

        });
        $("#page-container > header nav a").click(function () {
            var nav=$("#page-container > header nav");
            nav.slideUp();
        });
    }else{
        $("#page-container > header img#nav_menu").remove();
    }
}