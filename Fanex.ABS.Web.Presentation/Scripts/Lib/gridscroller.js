var isnolastborder=true;
(function ($) {
    $.fn.scroller = function (_opts) {
        return this.each(function () {
            return new Scroller(this, _opts);
        });
    };
    
    //width:totalCol*colWidth+totalCol*1+totalCol*2
    //isNoScript:true (no freezing column)
    $.fn.reRenderScroller = function (width, height, isNoScript, noborder) {
        return this.each(function () {
            var bodyscrollheight;
            var gridheight;
            var gridwidth;
            var scrollablewidth;
            var bodyscroll = $(this).find("div.body-scroll");
            scrollablewidth = width + 17;
            if ( $.browser.msie ) {
                scrollablewidth -= 1;
            }

            var isnolastborder=noborder!==undefined ? noborder:true;

            if (!isNoScript) {
                if (isnolastborder) $(this).find(".tbl-header-frozen tr:last-child td, .tbl-header-scroll tr:last-child td").css("border-bottom", "none 0px");
                bodyscroll.css({ 'overflow': "scroll" });
                if ($(this).find("table.tbl-body-scroll").height() > height) {
                    bodyscrollheight = height;
                }
                else {
                    bodyscrollheight = $(this).find("table.tbl-body-scroll").height() + 17;
                }
            }
            else {
                
                bodyscroll.css({ 'overflow': 'hidden', 'overflow-y': 'scroll' });
                if (isnolastborder) $(this).find("table.tbl-body-scroll tr:last-child td").css("border-bottom", "0px");
                if ($(this).find("table.tbl-body-scroll").height() > height) {
                    bodyscrollheight = height;
                }
                else {
                    bodyscrollheight = $(this).find("table.tbl-body-scroll").height() + 17;
                }
                bodyscrollheight -= 17;
            }
            
            gridheight = $(this).find(".header-scroll").height() + bodyscrollheight;

            if ($(this).find(".content-toolbox").length == 0) {
                gridheight -= 1;
            }
            else {
                gridheight += $(this).find(".content-toolbox").height() + 4;
            }
            
            if ($(this).find(".footer-scroll").length > 0) {
                gridheight += $(this).find(".footer-scroll").height() + 2;
            }
            else {
                $(this).find(".content-pagination").css("border-top", "none 0px");
                gridheight += 1;
            }

            if ($(this).find(".pagination-scroll").length > 0) {
               
                $(this).find(".tbl-footer-scroll tr:last-child td").css("border-bottom", "none 0px");
                gridheight += $(this).find(".pagination-scroll").height() + 5;
            }

            gridwidth = $(this).find(".tbl-header-frozen").width() + width + 17;
            $(this).css({ width: gridwidth + 'px', height: gridheight + 'px' });
            bodyscroll.css({ width: scrollablewidth + "px", height: bodyscrollheight + "px" });
            $(this).find("div.body-frozen").css({ height: (bodyscrollheight - 37) + "px" });
            $(this).find("div.header-scroll, div.footer-scroll").css("width", width + "px");
            
        });
    };

    var Scroller = function(el) {
        this.el = $(el);
        this.opts = {
            bodyfrozen: 'body-frozen',
            headerscroll: 'header-scroll',
            footerscroll: 'footer-scroll'
        };
        this.initialize();
    };

    Scroller.prototype = {
        initialize: function () {
            var me = this;
            me.preTop = me.el.scrollTop();
            me.preLeft = me.el.scrollLeft();
            var bodyscroll = me.el.find(".body-scroll");
            bodyscroll.scroll(function () {
                var top = bodyscroll.scrollTop();
                if (me.preTop != top) {
                    me.el.find('.' + me.opts.bodyfrozen).prop("scrollTop", top);
                    me.preTop = top;
                    return;
                }
                var left = bodyscroll.scrollLeft();
                if (me.preLeft != left) {
                    me.el.find('.' + me.opts.headerscroll).prop("scrollLeft", left);
                    me.el.find('.' + me.opts.footerscroll).prop("scrollLeft", left);
                    me.preLeft = left;
                }
            });
        }
    };
})(jQuery);
