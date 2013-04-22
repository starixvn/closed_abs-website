(function ($) {
    if (typeof $ == "undefined" || $ == null) return;
    $.fn.isShowingAutoComplete = function () {
        var target = $(this);
        if ($(target).parent().find("div[popupcontianer]").length > 0) return true;
        return false;
    };
    $.fn.removeAutoComplete = function () {
        return this.each(function () {
            var target = $(this);
            $(target).parent().find("div[popupcontianer]").remove();
        });
    };
    $.fn.autoComplete = function (arrayValues, key) {
        return this.each(function () {
            var target = $(this);
            if (arrayValues.length <= 0) return;
            $(target).attr("autocomplete", "off");
            $(target).parent().find("div[popupcontianer]").remove();
            $(target).parent().append("<div popupcontianer='true'></div>");
            var container = $(target).parent().find("div[popupcontianer]");

            var htmlList = "";
            var itemStyle = " style='padding:2px;' ";
         

            var maxLength = 0;
            for (var i = 0; i < arrayValues.length; ++i) {
                htmlList += "<div" + itemStyle + " index='" + (i + 1) + "' value='" + arrayValues[i][key] + "'>" + arrayValues[i][key] + "</div>";
                if (maxLength < arrayValues[i][key].length) {
                    maxLength = arrayValues[i][key].length;
                }
            }

            container.append("<div style='box-shadow: 0 0 2px 2px #3B5998; border:1px solid #BDC7D8; background-color:white;position:absolute;width:" + ($(target).width() + 4) + "px;' listpopup='true'></div>");
            var divListPopup = container.find("div[listpopup]");

            //divListPopup.width(maxLength * 10);
            divListPopup.empty().append(htmlList);
            var height = 0;
            divListPopup.find("div").each(function (index, element) {
                height += $(element).height() + 4;
            });
            divListPopup.height(height);
            divListPopup.get(0).selectedIndex = 0;
            //---------------------------------------------------------------
            var oldHover = null;
            divListPopup.find("div").hover(function (e) {
                if (oldHover != null) {
                    $(oldHover).get(0).style.backgroundColor = "white";
                }
                var _target = e.target;
                $(_target).get(0).style.backgroundColor = "#DFDFDF";
                oldHover = _target;
                divListPopup.get(0).selectedIndex = parseInt($(_target).attr("index"));
            })
        .click(function (e) {
            var _target = e.target;
            $(target).val($(_target).attr('value'));
            container.remove();
        })
        .highlight($(target).val());
            //---------------------------------------------------------------
            target.keyup(function (e) {
                if (divListPopup.parent().parent().length <= 0) {
                    return;
                }
                if (divListPopup.find("div").length <= 0 || !divListPopup.is(":visible")) {
                    return;
                }
                //down key
                if (e.keyCode == 40) {
                    if (divListPopup.get(0).selectedIndex == arrayValues.length) {
                        return;
                    }
                    divListPopup.get(0).selectedIndex += 1;
                    if (oldHover) {
                        $(oldHover).get(0).style.backgroundColor = "white";
                    }
                    if (divListPopup.find("div").length >= divListPopup.get(0).selectedIndex) {
                        divListPopup.find("div:nth-child(" + divListPopup.get(0).selectedIndex + ")").get(0).style.backgroundColor = "#DFDFDF";
                        oldHover = divListPopup.find("div:nth-child(" + divListPopup.get(0).selectedIndex + ")").get(0);
                        $(target).val($(oldHover).attr('value'));
                        target.focus();
                        target.select();
                    }
                }
                else if (e.keyCode == 38) {//up key
                    if (divListPopup.get(0).selectedIndex == 1 || divListPopup.get(0).selectedIndex == 0) {
                        return;
                    }
                    divListPopup.get(0).selectedIndex -= 1;
                    if (oldHover) {
                        $(oldHover).get(0).style.backgroundColor = "white";
                    }
                    if (divListPopup.find("div").length >= divListPopup.get(0).selectedIndex) {
                        divListPopup.find("div:nth-child(" + divListPopup.get(0).selectedIndex + ")").get(0).style.backgroundColor = "#DFDFDF";
                        oldHover = divListPopup.find("div:nth-child(" + divListPopup.get(0).selectedIndex + ")").get(0);
                        $(target).val($(oldHover).attr('value'));
                        target.focus();
                        target.select();
                    }
                }
                else if (e.keyCode == 13) {//Enter press
                    if (oldHover) {
                        $(target).val($(oldHover).attr('value'));
                    }
                    oldHover = null;
                    container.remove();
                }
                else if (e.keyCode == 27) {//ESC press
                    oldHover = null;
                    container.remove();
                }
            });
            $(document).click(function () {
                oldHover = null;
                container.remove();
            });
            divListPopup.show();
        });
    };
})(jQuery); 


    
