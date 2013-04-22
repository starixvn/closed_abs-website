(function($){
    if (typeof $ == "undefined" || $ == null) return;
    $.fn.autoComplete = function(arrayValues, key) {  
        return this.each(function() {
            var target = $(this);
            if (arrayValues.length <= 0) return;

            $(target).attr("autocomplete", "off");
            $(target).parent().find("div[popupcontianer]").remove();
            $(target).parent().append("<div popupcontianer='true'></div>");
            var container = $(target).parent().find("div[popupcontianer]");

            var htmlList = "";
            var itemStyle = " style='padding-left:4px; padding-top:2px; padding-botton:2px;' ";

            for (var i = 0; i < arrayValues.length; ++i) {
                var _value = "";
                if (typeof key == "undefined" || key == null) {
                    _value = arrayValues[i];
                }
                else {
                    _value = arrayValues[i][key];
                }
                htmlList += "<div" + itemStyle + " index='" + (i + 1) + "' value='" + _value + "'>" + _value + "</div>";
            }

            container.append("<div style='border:1px solid #1C94CD; background-color:white;position:absolute;' listpopup='true'></div>");
            var divListPopup = container.find("div[listpopup]");

            divListPopup.width(target.width());
            divListPopup.empty().append(htmlList);
            var height = 0;
            divListPopup.find("div").each(function (index, element) {
                height += $(element).height() + 2;
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
                if (divListPopup.find("div").length <= 0 || divListPopup.get(0).style.display == "none") {
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