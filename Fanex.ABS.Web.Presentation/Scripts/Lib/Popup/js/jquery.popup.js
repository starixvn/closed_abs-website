function showPopup(options) {
    (new popup()).showPopup(options);
}

function showOverlay() {
    var p = new popup();
    p.dialog = true;
    p.overlayer();
}

function hideOverlay() {
    (new popup()).removeOverlayer();
}

function closePopup(id) {
    if (typeof id == "undefined") {
        $(document).find("div[ugpopup]").each(function(){
            closePopup($(this).attr("id"));
        });
    }
    else {
        if ($("#" + id).length <= 0) return;
        $("#" + id).get(0).popup.closePopup();
    }
}

function hidePopup(id) {
    if (typeof id == "undefined") {
        $(document).find("div[ugpopup]").each(function () {
            hidePopup($(this).attr("id"));
        });
    }
    else {
        if ($("#" + id).length <= 0) return;
        $("#" + id).get(0).popup.hidePopup();
    }
}

function popup () {
    this.imgPath = "";
    this.content = "";
    this.width = 0;
    this.height = 0;
    this.title = "";
    this.titleColor = "black";
    this.backgroundColor = "#E8F4FE";
};

popup.id = 0;

popup.prototype.showPopup = function (options) {
    this.closePopup();

    if (typeof options == "undefined") options = {};
    if (typeof options.content == "undefined" || options.content == null) options.content = "";
    if (typeof options.title == "undefined" || options.title == null) options.title = "";
    if (typeof options.width == "undefined" || options.width == null) options.width = 600;
    if (typeof options.height == "undefined" || options.height == null) options.height = 800;
    if (typeof options.buttons == "undefined" || options.buttons == null) options.buttons = [];
    if (typeof options.multiple == "undefined" || options.multiple == null) options.multiple = false;
    if (typeof options.dialog == "undefined" || options.dialog == null) options.dialog = false;
    if (typeof options.onload == "undefined" || options.onload == null) options.onload = function(){};
    if (typeof options.onclose == "undefined" || options.onclose == null) options.onclose = function(){};

    this.content = options.content;
    this.title = options.title;
    this.width = options.width;
    this.height = options.height;
    this.buttons = options.buttons;
    this.multiple = options.multiple;
    this.dialog = options.dialog;
    this.onload = options.onload;
    this.onclose = options.onclose;
    //use it for asp.net webform
    this.imgPath = this.getAppPath() + "Scripts/Lib/Popup/Images/";
    //this.imgPath = this.getAppPath().substring( + "Scripts/Lib/Popup/Images/";
    //user it for asp.net mvc
    //this.imgPath = location.protocol + '//' + location.host + "/Scripts/Lib/Popup/Images/";
    //this.imgPath = "../Images/";
    popup.id += 1;

    if (!this.multiple) {
        $(document).find("body").find("div[ugpopup]").remove();
    }

    $(document).find("body").append("<div id='ugpopup" + popup.id + "' ugpopup='true' style='z-index:9000'></div>");

    this.divPopup = $("#ugpopup" + popup.id);

    $(this.divPopup).get(0).popup = this;

    $(this.divPopup).width(this.width).height(this.height);

    this.overlayer($(this.divPopup));
    this.head($(this.divPopup));
    this.body($(this.divPopup));
    this.bottom($(this.divPopup));
    this.addButtons($(this.divPopup));

    $(this.divPopup).show();
    $(this.divPopup).CenterIt();
    //$(this.divPopup).css("position", "absolute");
    $(this.divPopup).css("position", "fixed");
    $(this.content).show();

    this.onload();

    return $(this.divPopup).attr("id");
};

popup.prototype.closePopup = function(){
    if (typeof this.divPopup == "undefined") return;

    if (typeof this.content != "string") {
        $(this.backupParent).append($(this.content).hide().remove());
    }
    $(this.divPopup).remove();
    if (typeof this.onclose != "undefined") {
        this.onclose();
    }
    var ug_head_center = $(this.divPopup).find("div[ug_head_center]");
    $(document).unbind("mousemove", ug_head_center.get(0)._onmousemove);
    this.removeOverlayer();
};

popup.prototype.hidePopup = function () {
    if (typeof this.divPopup == "undefined") return;

    $(this.divPopup).hide();
};

popup.prototype.isExisted = function() {
    var popup = $(document).find("body").find("div[ugpopup]");
    if (popup.length <= 0) return false;
    return true;
};

popup.prototype.removeOverlayer = function() {
    $(window.document).find("body").find("div[ug_overlayer]").remove();
};

popup.prototype.overlayer = function (p) {
    if (!this.dialog) return;

    var _top = window;

    $(_top.document).find("body").append("<div ug_overlayer='true' style='top:0px; left:0px;position:absolute;z-index:8000;background-color:white;filter:alpha(opacity=20); -moz-opacity: 0.2;opacity: 0.2;'></div>");
    var ug_overlayer = $(_top.document).find("body").find("div[ug_overlayer]");
    //Get the screen height and width

    var maskHeight = $('html')[0].scrollHeight;
    //var maskScrollHeight = $(_top).scrollHeight;
    var maskWidth = $(_top).width();
    //Set height and width to mask to fill up the whole screen
    $(ug_overlayer).width(maskWidth).height(maskHeight);
};

popup.prototype.head = function(p) {
    this.headPartial1(p);

    this.createCloseButton(p);
};

popup.prototype.headPartial1 = function (p) {
    var height_head = 40;
    var width_head_left = 22;
    var width_head_right = 23;
    var width_head_center = this.width - (width_head_left + width_head_right);
    $(p).append
    ("\
        <div ug_head_left='true' style='float:left; background-image:url(\"" + this.imgPath + "L_top.png" + "\"); width:" + width_head_left + "px; height:" + height_head + "px;'>\
        </div>\
        <div ug_head_center='true' style='cursor:move;position:relative;float:left; background-image:url(\"" + this.imgPath + "C_top.png" + "\"); width:" + width_head_center + "px; height:" + height_head + "px'>\
        </div>\
        <div ug_head_right='true' style='float:left; background-image:url(\"" + this.imgPath + "R_top.png" + "\"); width:" + width_head_right + "px; height:" + height_head + "px;'>\
        </div>\
    ");
    var ug_head_center = $(p).find("div[ug_head_center]");
    //title
    $(ug_head_center).html("<span style='position:absolute; left:0px; top: 20px'>" + this.title + "</span>").css("color", this.titleColor).css("font-weight", "bold");
    $(ug_head_center).disableTextSelect();

    var _moveTarget = $(ug_head_center).get(0);
    _moveTarget._onmousedown = $.proxy(function(e) {
        $(document).find("div[ugpopup]").css("z-index", "");
        $(this.divPopup).css("z-index", 90000);
        _moveTarget.mouseLeft = e.pageX;
        _moveTarget.mouseTop = e.pageY;
        _moveTarget.isMove = true;
    }, this);

    _moveTarget._onmousemove = $.proxy(function(e) {
        if (!_moveTarget.isMove) return;
        if (e.pageX >= _moveTarget.mouseLeft) {
            if (e.pageY >= _moveTarget.mouseTop) {
                $(p).offset(
                {
                    left: $(p).offset().left + (e.pageX - _moveTarget.mouseLeft),
                    top: $(p).offset().top + (e.pageY - _moveTarget.mouseTop)
                });
            }
            else {
                $(p).offset(
                {
                    left: $(p).offset().left + (e.pageX - _moveTarget.mouseLeft),
                    top: $(p).offset().top - (_moveTarget.mouseTop - e.pageY)
                });
            }
        }
        else {
            if (e.pageY >= _moveTarget.mouseTop) {
                $(p).offset(
                {
                    left: $(p).offset().left - (_moveTarget.mouseLeft - e.pageX),
                    top: $(p).offset().top + (e.pageY - _moveTarget.mouseTop)
                });
            }
            else {
                $(p).offset(
                {
                    left: $(p).offset().left - (_moveTarget.mouseLeft - e.pageX),
                    top: $(p).offset().top - (_moveTarget.mouseTop - e.pageY)
                });
            }
        }
        _moveTarget.mouseLeft = e.pageX;
        _moveTarget.mouseTop = e.pageY;
    }, this);

    _moveTarget._onmouseup = $.proxy(function(e) {
        _moveTarget.isMove = false;
    }, this);

    $(ug_head_center).mousedown(_moveTarget._onmousedown)
    .mouseup(_moveTarget._onmouseup)
    .mousemove(_moveTarget._onmousemove);

    $(document).mousemove(_moveTarget._onmousemove).mouseup(_moveTarget._onmouseup);
};

popup.prototype.createCloseButton = function(p) {
    var ug_head_center = $(p).find("div[ug_head_center]");
    //close image
    $(ug_head_center).append("<div ug_close_img='true' style='background-image:url(" + this.imgPath + "icon_close1.png" + "); background-position:0px 0px;cursor:pointer;position:absolute; right:0px; top:" + 18 + "px; width:19px; height:18px'></div>");
    var ug_close_img = $(ug_head_center).find("div[ug_close_img]");
    $(ug_close_img).mouseover($.proxy(function(){
        $(this.divPopup).find("div[ug_close_img]").css("background-position", "0px 18px");
    }, this))
    .mouseout($.proxy(function(){
        $(this.divPopup).find("div[ug_close_img]").css("background-position", "0px 0px");
    }, this))
    .click($.proxy(function(){
        this.closePopup();
    }, this));
};

popup.prototype.body = function(p) {
    var height_head = 40;
    var height_bottom = 47;
    var height_mid = this.height - (height_head + height_bottom);
    var width_mid_left = 22;
    var width_mid_right = 23;
    var width_mid_center = this.width - (width_mid_left + width_mid_right);
    $(p).append
    ("\
        <div ug_mid_left='true' style='float:left; background-image:url(\"" + this.imgPath + "mid_L.png" + "\"); width:" + width_mid_left + "px; height:" + height_mid + "px;'>\
        </div>\
        <div ug_mid_center='true' style='float:left; background-color:" + this.backgroundColor + "; width:" + width_mid_center + "px; height:" + height_mid + "px'>\
        </div>\
        <div ug_mid_right='true' style='float:left; background-image:url(\"" + this.imgPath + "mid_R.png" + "\"); width:" + width_mid_right + "px; height:" + height_mid + "px;'>\
        </div>\
    ");
    var ug_mid_center = $(p).find("div[ug_mid_center]");
    if (typeof this.content == "string") {//iframe
        var ug_frame = $(ug_mid_center).append("<iframe frameborder='0' noresize='noresize' scrolling='auto' ALLOWTRANSPARENCY='true'></iframe>").find("iframe");
        $(ug_frame).height(height_mid).width(width_mid_center);
        $(ug_frame).attr("src", this.content);
    }
    else {//show div(object)
        this.backupParent = $(this.content).parent();
        $(ug_mid_center).append($(this.content).remove());
    }
};

popup.prototype.bottom = function(p) {
    var height_bottom = 47;
    var width_bottom_left = 22;
    var width_bottom_right = 22;
    var width_bottom_center = this.width - (width_bottom_left + width_bottom_right);
    $(p).append
    ("\
        <div ug_bottom_left='true' style='float:left; background-image:url(\"" + this.imgPath + "L_bottom.png" + "\"); width:" + width_bottom_left + "px; height:" + height_bottom + "px;'>\
        </div>\
        <div ug_bottom_center='true' style='float:left; background-image:url(\"" + this.imgPath + "C_bottom.png" + "\"); width:" + width_bottom_center + "px; height:" + height_bottom + "px'>\
        </div>\
        <div ug_bottom_right='true' style='float:left; background-image:url(\"" + this.imgPath + "R_bottom.png" + "\"); width:" + width_bottom_right + "px; height:" + height_bottom + "px;'>\
        </div>\
    ");
};

popup.prototype.addButtons = function (p) {
    if (this.buttons.length <= 0) return;
    var ug_bottom_center = $(this.divPopup).find("div[ug_bottom_center]");
    var len = this.buttons.length;
    for(var i = 0; i < len; ++i) {
        $(ug_bottom_center).append("<input type='button' tabindex=" + (i==len-1? 0:1) + " class='btn' value='" + this.buttons[i].text + "' style='float:right; margin-right:2px; margin-top:5px' />");
        var btns = $(ug_bottom_center).find("input[type='button']");
        $($(btns).get($(btns).length - 1)).get(0).callback = this.buttons[i].callback;
        $($(btns).get($(btns).length - 1)).click($.proxy(function(e){
            e.target.callback($(this.divPopup).attr("id"), e.target);
        }, this));
    }
};

popup.prototype.getAppPath = function() {
    var getDomainName = function fnGetDomain(url) {
        return (url.match( /:\/\/(.[^/]+)/ )[1]).replace('www.', '');
    };
    var isHttps = false;
    var baseURL = location.href;
    var rootURL = baseURL.substring(0, baseURL.indexOf('/', 7));

    // if the root url is localhost, don't add the directory as cassani doesn't use it
    if (baseURL.indexOf('.com/') > 0 || baseURL.indexOf('.net/') > 0 || baseURL.indexOf('.org/') > 0) {
        if (baseURL.indexOf('https://') >= 0) isHttps = true;
        return (isHttps ? "https://" : "http://") + getDomainName(baseURL) + "/";
    } else {
        return rootURL + baseURL.substring(baseURL.indexOf('/', 8), baseURL.indexOf('/', baseURL.indexOf('/', 8) + 1)) + "/";
    }
};

//------------------------------------------------------------------------------------------------------------------------------------

popup.prototype.initPopup = function (options, div) {
    this.closePopup();

    if (typeof options == "undefined") options = {};
    if (typeof options.title == "undefined" || options.title == null) options.title = "";
    if (typeof options.width == "undefined" || options.width == null) options.width = 600;
    if (typeof options.height == "undefined" || options.height == null) options.height = 800;
    if (typeof options.buttons == "undefined" || options.buttons == null) options.buttons = [];
    if (typeof options.multiple == "undefined" || options.multiple == null) options.multiple = false;
    if (typeof options.dialog == "undefined" || options.dialog == null) options.dialog = false;
    if (typeof options.onload == "undefined" || options.onload == null) options.onload = function(){};
    if (typeof options.onclose == "undefined" || options.onclose == null) options.onclose = function(){};

    this.content = div;
    this.title = options.title;
    this.width = options.width;
    this.height = options.height;
    this.buttons = options.buttons;
    this.multiple = options.multiple;
    this.dialog = options.dialog;
    this.onload = options.onload;
    this.onclose = options.onclose;

    this.imgPath = this.getAppPath() + "Scripts/Lib/Popup/Images/";

    popup.id += 1;

    if (!this.multiple) {
        $(document).find("body").find("div[ugpopup]").remove();
    }

    $(document).find("body").append("<div id='ugpopup" + popup.id + "' ugpopup='true' style='z-index:9000'></div>");

    this.divPopup = $("#ugpopup" + popup.id);

    $(this.divPopup).get(0).popup = this;

    $(this.divPopup).width(this.width).height(this.height);

    this.overlayer($(this.divPopup));
    this.head2($(this.divPopup));
    this.body($(this.divPopup));
    this.bottom($(this.divPopup));
    this.addButtons($(this.divPopup));

    $(this.divPopup).hide();

    return $(this.divPopup).attr("id");
};

popup.prototype.head2 = function(p) {
    this.headPartial1(p);

    this.createCloseButton2(p);
};

popup.prototype.createCloseButton2 = function(p) {
    var ug_head_center = $(p).find("div[ug_head_center]");
    //close image
    $(ug_head_center).append("<div ug_close_img='true' style='background-image:url(" + this.imgPath + "icon_close1.png" + "); background-position:0px 0px;cursor:pointer;position:absolute; right:0px; top:" + 18 + "px; width:19px; height:18px'></div>");
    var ug_close_img = $(ug_head_center).find("div[ug_close_img]");
    $(ug_close_img).mouseover($.proxy(function(){
        $(this.divPopup).find("div[ug_close_img]").css("background-position", "0px 18px");
    }, this))
    .mouseout($.proxy(function(){
        $(this.divPopup).find("div[ug_close_img]").css("background-position", "0px 0px");
    }, this))
    .click($.proxy(function(){
        $(this.divPopup).hide();
        this.onclose();
    }, this));
};

jQuery.fn.initPopup = function (options) {
    preloadImage();
    return this.each(function () {
        if (typeof $(this).get(0).p == "undefined" || $(this).get(0).p == null) {
            var p = new popup();
            $(this).get(0).p = p;
            $(this).get(0).popupOptions = options;
        }
        $(this).get(0).p.initPopup(options, $(this));
    });
};

jQuery.fn.showPopup = function () {
    return this.each(function () {
        if ($(this).get(0).p == "undefined" || $(this).get(0).p == null) return;

        $($(this).get(0).p.divPopup).show();
        $($(this).get(0).p.divPopup).CenterIt();
        $($(this).get(0).p.divPopup).css("position", "absolute");
        $($(this).get(0).p.content).show();
        $(this).get(0).p.onload();
    });
};

jQuery.fn.closePopup = function () {
    return this.each(function () {
        if ($(this).get(0).p == "undefined" || $(this).get(0).p == null) return;
        ($(this).get(0).p.divPopup).hide();
        $(this).get(0).p.onclose();
    });
};

jQuery.fn.disableTextSelect = function () {
    return this.each(function () {
        $(this).css({
            'MozUserSelect': 'none'
        }).bind('selectstart', function () {
            return false;
        }).mousedown(function () {
            return false;
        });
    });
};

///dependency :Scripts/Lib/jquery.imgpreload.js
//preload images
var the_images = [
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/C_bottom.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/C_top.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/icon_close1.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/L_bottom.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/L_top.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/mid_L.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/mid_R.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/R_bottom.png",
    (new popup()).getAppPath() + "Scripts/Lib/Popup/Images/R_top.png"
];
function preloadImage() {
    jQuery.imgpreload(the_images);
}