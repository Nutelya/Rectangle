
/*
*
* Represents page navigation.
* Parameters are:
* Array of pages. Each item is object with parameters link (page url),
* beforeAction (function performed before leaving a page) and action (function performed after entering page)
* mainPage - index of the main page.
*
*/

function PageController(pages, mainPage) {
    this.pages=pages;
    this.actualPageIndex=null;
    this.mainPage=mainPage;

    this.loadPageByHash(window.location.hash);

    window.onhashchange=function () {
        if (this.pages[this.actualPageIndex].link==window.location.hash) {
            return;
        }
        this.loadPageByHash(window.location.hash);
    }.bind(this);

}

/*
*
* Load page by given hash.
* Parameter is: hash in format #something.
*
*/
PageController.prototype.loadPageByHash=function(hash) {

    if (hash==null || hash=="") {
        hash=this.pages[this.mainPage].link;
    }

    var notFound=true;

    for (var i=0; i<this.pages.length; i++) {
        if (this.pages[i]==null) {
            continue;
        }
        if (hash==this.pages[i].link) {

            if (this.actualPageIndex!=null) {
                var doAction=this.pages[this.actualPageIndex].beforeAction();
            }else{
                doAction=true;
            }

            if (doAction==true) {
                this.actualPageIndex=i;
                $("#targets").css("transform", "translateY(-"+i*100+"%)");
                $("#page-container > header nav a[href="+this.pages[i].link+"]").addClass("active");
                this.pages[i].action();
            }else{
                window.location.hash=this.pages[this.actualPageIndex].link;
                $("#page-container > header nav a[href="+this.pages[this.actualPageIndex].link+"]").addClass("active");
            }
            notFound=false;
        }else{
            $("#page-container > header nav a[href="+this.pages[i].link+"]").removeClass("active");
        }
    }
    if (notFound==true) {
        alertify.alert("Sorry, the page you searched for does not exist");
    }
}