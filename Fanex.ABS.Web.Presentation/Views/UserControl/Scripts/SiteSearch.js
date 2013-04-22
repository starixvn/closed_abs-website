$(function () {
    ss.init();
    ss.initDataFromParent();
});
var ss = {
    pagerSetting: {
        pageDisplay: 10,
        pageStart: 1,
        pageSize: 5
    },
    arrayMenu: [],
    init: function () {
        ss.initSearch();
    },
    getAllMenu: function (keyWord) {
        $.ajax({
            type: "POST",
            url: "Services/UserControlService.svc/GetSearchMenu",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"keyWord": "' + keyWord + '"}',
            success: function (listMenu) {
                if (typeof listMenu != "undefined") {
                    if (listMenu.length > 0) {
                        ss.arrayMenu = listMenu;
                        $("#resultPagination").show();
                        ss.loadResultPager(1);
                        ss.initPager();
                    }
                    else {
                        $("#resultTemplateNoInfo").tmpl([{ noinfo: true}]).appendTo($("#resultView").empty());
                        $("#resultPagination").hide();
                    }
                    $("#numberOfResult").html("There are <b>" + listMenu.length + "</b>" + (listMenu.length > 1 ? " results" : " result") + " match.");
                }
            }
        , error: function (e) {
            ss.showError("Search Error");
        }
        });
    },
    addEventLinkPage: function () {
        $("#resultView a.linkDirectToPage").each(function () {
            var $this = $(this);
            $this.click(function (e) {
                parent.$("iframe").each(function (iel, el) {
                    if (el.contentWindow === window) {
                        var $thisFrame = $(this);
                        $thisFrame.attr("src", $this.attr("href"));
                    }
                });
                e.preventDefault();
            });
        });
    },
    initDataFromParent: function () {
        $("#tbxKeyWord").val(parent.$("#tbxSiteSearchMenu").val());
        ss.search($("#tbxKeyWord").val());
    },
    showError: function (msg, targetID) {
        if (typeof targetID === 'undefined')
            showMessage(msg, 1);
        else
            showMessage(msg, 1, false, targetID);
    },
    showSuccess: function (msg, targetID) {
        if (typeof targetID === 'undefined')
            showMessage(msg, 0);
        else
            showMessage(msg, 1, false, targetID);
    },
    initPager: function () {
        var numOfPage = Math.round((ss.arrayMenu.length / this.pagerSetting.pageDisplay) + 0.49);
        $("#resultPagination").paginate({
            count: numOfPage,
            start: this.pagerSetting.pageStart,
            display: this.pagerSetting.pageSize,
            border: true,
            border_color: '#BEF8B8',
            text_color: '#68BA64',
            background_color: '#E3F2E1',
            border_hover_color: '#68BA64',
            text_hover_color: 'black',
            background_hover_color: '#CAE6C6',
            rotate: false,
            images: false,
            mouse: 'press',
            onChange: function (page) {
                //alert(page);
                ss.loadResultPager(page);
            }
        });
    },
    loadResultPager: function (pageIndex) {
        var tempArrayMenu = jlinq.from(ss.arrayMenu).skip((pageIndex - 1) * this.pagerSetting.pageDisplay).take(this.pagerSetting.pageDisplay);
        $("#resultTemplate").tmpl(tempArrayMenu).appendTo($("#resultView").empty());
        ss.addEventLinkPage();
    },
    initSearch: function () {

        //tbxUserName
        $("#tbxKeyWord").keyup(function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) return true;
            else if (e.keyCode == 13) {
                ss.search($(this).val());
            }
        })
    .val("Site Name").css("font-style", "italic")
    .focus(function () {
        if ($(this).val().indexOf("Site Name") >= 0) {
            $(this).val("");
        }
    })
    .focusout(function () {
        if ($(this).val() == "") {
            $(this).val("Site Name").css("font-style", "italic");
        }
    });

        //btnSearch
        $("#btnSearch").click(function () {
            $(this).wait();
            ss.search($("#tbxKeyWord").val());
            $(this).unwait();
        });
    },
    search: function (val) {
        if (val == "Site Name") {
            val = "";
        }
        ss.getAllMenu(val);
    }

};