$.showOverlayer = function() {
    var _top = window;

    if ($(_top.document).find("#w_overlayer").length > 0) return;

    $(_top.document).find("body").append("<div id='w_overlayer' style='top:0px; left:0px;position:absolute;z-index:8000;background-color:white;filter:alpha(opacity=20); -moz-opacity: 0.2;opacity: 0.2;'></div>");
    var ug_overlayer = $(_top.document).find("#w_overlayer");
    //Get the screen height and width
    var maskHeight = $(_top.document).height();
    var maskWidth = $(_top).width();
    //Set height and width to mask to fill up the whole screen
    $(ug_overlayer).width(maskWidth).height(maskHeight);
};

$.hideOverlayer = function() {
    var _top = window;

    $(_top.document).find("#w_overlayer").remove();
};