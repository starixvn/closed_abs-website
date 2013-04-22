/// <reference path="../../../Scripts/Lib/jquery.1.6.js" />
var summary = {
    height: 600,
    main: {},
    league: {},
    leagueDetail: {
        pageSize: 200,
        pageIndex: 0
    },
    fromDate: '',
    toDate: '',
    title: '',
    utils: {}
};

summary.main.init = function () {
    this.searchArea();
    this.initHeaderLeft();
};

summary.GetDateTime = function (vl) {
    if (vl != 8) {
        var data = {
            dateOption: vl
        };
        $.ajax({
            type: "POST",
            url: "GetDatetimeOption",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (rs) {
                $("#tbxFromDate").datepicker("option", "maxDate", new Date(rs.tdate));
                $("#tbxFromDate").datepicker("setDate", new Date(rs.fdate));
                $("#tbxToDate").datepicker("option", "minDate", new Date(rs.fdate));
                $("#tbxToDate").datepicker("setDate", new Date(rs.tdate));
            }
        });
    }
};

summary.main.exportExcel = function (type) {
    $("#frameExportExcel").attr("src", "ExportExcel?type=" + type + "&acc=" + summary.league.acc);
};

summary.main.searchArea = function () {
    var dates = $("#tbxFromDate, #tbxToDate").datepicker({
        changeMonth: true,
        changeYear: true,
        today: new Date($("#hiddenServerDate").val()),
        minDate: "-18m",
        onSelect: function (selectedDate) {
            var option = this.id == "tbxFromDate" ? "minDate" : "maxDate",
				instance = $(this).data("datepicker"),
				date = $.datepicker.parseDate(
					instance.settings.dateFormat ||
					$.datepicker._defaults.dateFormat,
					selectedDate, instance.settings);
            dates.not(this).datepicker("option", option, date);
        }
    });

    $("#tbxFromDate").datepicker("setDate", new Date($("#hiddenServerDate").val()));
    $("#tbxToDate").datepicker("setDate", new Date($("#hiddenServerDate").val()));

    //btnSearch
    $("#btnSearch").click(function () {
        var fromDate = new Date($("#tbxFromDate").val());
        var toDate = new Date($("#tbxToDate").val());

        if (fromDate > toDate) {
            summary.utils.showError("Invalid date range!");
            return;
        }

        summary.main.search();
    });
};

summary.main.initHeaderLeft = function () {
    //cbxAllLeft
    $("#cbxAllLeft").change(function () {
        var checked = this.checked;
        $("#tbodyLeft").find("input[type='checkbox']").each(function () {
            this.checked = checked;
        });

        if (checked) {
            summary.main.search();
        }
    });
};

summary.utils.hideMessage = function () {
    $("#msg").hide();
};

summary.main.search = function (custIds) {
    $("#btnSearch").wait();
    summary.utils.hideMessage();
    var isKeepLeft = false;
    if (typeof custIds == "undefined" || custIds == null) custIds = "";
    else isKeepLeft = true;
    $.ajax({
        type: "POST",
        url: "GetSummary",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"fromDate":"' + $("#tbxFromDate").val() + '", "toDate": "' + $("#tbxToDate").val() + '", "custIds": "' + custIds + '", "bettype":' + $("#selBettype").val() + '}',
        success: function (rs) {
            $("#btnSearch").unwait();
            if (typeof rs == "undefined" || rs == null) return;
            if (rs.Summary.length > 0 && custIds == "") {
                $("#cbxAllLeft").get(0).checked = true;
            }
            summary.main.total = rs.Total;
            var dec = 4;
            $(rs.Summary).each(function (index, element) {
                element.index = index + 1;
                element.WinPercentStr = NumberFormatString(element.WinPercent, dec);
                element.TotalStakeStr = NumberFormatString(element.TotalStake, dec);
                element.TotalPLStr = NumberFormatString(element.TotalPL, dec);
                element.MPPercentStr = NumberFormatString(element.MPPercent, dec);
            });
            if (!isKeepLeft) {
                summary.main.buildLeft(rs.Summary);
            }
            summary.main.buildMain(rs.Summary);

            summary.main.assignChartData(rs.Summary);
        }
        , error: function (e) {
            $("#btnSearch").unwait();
            summary.utils.showError(e.toString());
        }
    });
};

summary.main.assignChartData = function (data) {
    var items = [];
    var chartInfo = { Name: "Acc", cates: [], data: [] };
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        //eval("info." + item.Acc + "=" + item.TotalPL);

        var rows = { y: item.TotalPL,
            color: item.Color
        };
        chartInfo.cates.push(item.Acc);
        chartInfo.data.push(rows);
    }
    //alert($.param(items));
    summary.chart.setData(chartInfo);
}

summary.main.buildMain = function (rs) {
    $("#divRightDetailAcc").hide();
    $("#divLeagueDetail").hide();
    summary.main.buildRight(rs);
    $("#divPath").show().find("label").html("Acc >");
    //$("#divFilter").width(878);
    //$("#msg").width(818);
};

summary.main.cloneVM = function (vm) {
    var _vm = [];
    for (var i = 0; i < vm.length; ++i) {
        _vm[_vm.length] = {
            CustID: vm[i].CustID,
            Acc: vm[i].Acc,
            Color: vm[i].Color,
            Betslip: vm[i].Betslip,
            Draw: vm[i].Draw,
            Lose: vm[i].Lose,
            MPPercent: vm[i].MPPercent,
            TotalPL: vm[i].TotalPL,
            TotalStake: vm[i].TotalStake,
            Win: vm[i].Win,
            WinPercent: vm[i].WinPercent,
            LeagueId: vm[i].LeagueId
        };
    }
    return _vm;
};

summary.main.buildLeft = function (vm) {
    $("#stLeft").tmpl(vm).appendTo($("#tbodyLeft").empty());
    if (vm.length <= 0) {
        $("#stLeftNoInfo").tmpl([{ noinfo: true}]).appendTo($("#tbodyLeft").empty());
    }
    $("#divLeft").show().reRenderScroller(96, summary.height, true);
};

summary.main.leftFilter = function (e) {
    var target = typeof e.srcElement == "undefined" ? e.target : e.srcElement;
    var checked = target.checked;
    if (checked) {
        var haveOneUnChecked = false;
        $("#tbodyLeft").find("input[type='checkbox']").each(function () {
            if (!this.checked) haveOneUnChecked = true;
        });
        if (!haveOneUnChecked) {
            $("#cbxAllLeft").get(0).checked = true;
        }
    }
    else {
        $("#cbxAllLeft").get(0).checked = false;
    }
};

summary.main.doFilter = function () {
    var arrCustId = [];
    $("#tbodyLeft").find("input[type='checkbox']").each(function () {
        if (!this.checked) return;
        arrCustId[arrCustId.length] = $(this).parent().find("input[type='hidden']").val();
    });
    var custids = arrCustId.length <= 0 ? "-1" : arrCustId.join(',');
    summary.main.search(custids);
};

summary.main.buildRight = function (vm) {
    $("#tbodyRight").empty();
    for (var i = 0; i < vm.length; ++i) {
        $("#stRight").tmpl([vm[i]]).appendTo($("#tbodyRight"));
    }
    if (vm.length <= 0) {
        $("#divRightDetailAcc .body-scroll").css("border-right", "solid 1px #bababa");
        $("#divRight .body-scroll").css("border-right", "solid 1px #bababa");
        $("#stRightMainNoInfo").tmpl([{ noinfo: true}]).appendTo($("#tbodyRight").empty());
        $("#divFooterRightMain").hide();
    }
    else {
        $("#divRightDetailAcc .body-scroll").css("border-right", "none 0px");
        $("#divRight .body-scroll").css("border-right", "none 0px");
        $("#divFooterRightMain").show();
    }
    $("#divRight").show(); //.reRenderScroller(770 , summary.height, true);
    this.calcSum();
};

summary.main.calcSum = function () {
    var dec = 4;

    var totalBetslip = NumberFormatString(this.total.Betslip, dec);
    var totalWin = NumberFormatString(this.total.Win, dec);
    var totalDraw = NumberFormatString(this.total.Draw, dec);
    var totalLose = NumberFormatString(this.total.Lose, dec);

    var totalWinPercent = this.total.WinPercent;
    var totalTotalStake = this.total.TotalStake;
    var totalTotalPL = this.total.TotalPL;
    var totalMPPercent = this.total.MPPercent;

    $("#tbodyFooterRight").find("div[betslip]").html(totalBetslip);
    $("#tbodyFooterRight").find("div[win]").html(totalWin);
    $("#tbodyFooterRight").find("div[draw]").html(totalDraw);
    $("#tbodyFooterRight").find("div[lose]").html(totalLose);

    $("#tbodyFooterRight").find("div[winpercent]").html(NumberFormatString(totalWinPercent, dec));
    if (totalWinPercent < 0) $("#tbodyFooterRight").find("div[winpercent]").css("color", "red");
    else $("#tbodyFooterRight").find("div[winpercent]").css("color", "white");

    $("#tbodyFooterRight").find("div[totalstake]").html(NumberFormatString(totalTotalStake, dec));

    $("#tbodyFooterRight").find("div[totalpl]").html(NumberFormatString(totalTotalPL, dec));
    if (totalTotalPL < 0) $("#tbodyFooterRight").find("div[totalpl]").css("color", "red");
    else $("#tbodyFooterRight").find("div[totalpl]").css("color", "white");

    $("#tbodyFooterRight").find("div[mppercent]").html(NumberFormatString(totalMPPercent, dec));
    if (totalMPPercent < 0) $("#tbodyFooterRight").find("div[mppercent]").css("color", "red");
    else $("#tbodyFooterRight").find("div[mppercent]").css("color", "white");
};

summary.main.backAccount = function () {
    var arrCustId = [];
    $("#tbodyLeft").find("input[type='checkbox']").each(function () {
        if (!this.checked) return;
        arrCustId[arrCustId.length] = $(this).parent().find("input[type='hidden']").val();
    });
    summary.main.search(arrCustId.join(','));
};

summary.league.vm = [];
summary.league.viewDetailAcc = function (custId, acc) {
    this.custId = custId;
    this.acc = acc;
    summary.utils.hideMessage();
    $("#btnSearch").wait();
    $.ajax({
        type: "POST",
        url: "GetSumaryDetailAcc",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"fromDate":"' + $("#tbxFromDate").val() + '", "toDate": "' + $("#tbxToDate").val() + '", "custId": ' + custId + ', "acc": "' + acc + '", "bettype": "' + $("#selBettype").val() + '"}',
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            summary.league.buildDetailAcc(rs, acc);
            $("#btnSearch").unwait();
        }
        , error: function (e) {
            $("#btnSearch").unwait();
            summary.utils.showError(e.toString());
        }
    });
};

summary.league.buildDetailAcc = function (rs, acc) {
    summary.league.vm = rs.Summary;
    this.total = rs.Total;

    summary.league.sortData(false);

    $("#divPathLeague").show().find("label").html("<span style='text-decoration:underline' class='blue' onclick='javascript:summary.main.backAccount();'>Acc</span> (" + acc + ") > League");
    //$("#divFilter").width("87%");
    //$('#contentSection').css("width", "1070px");
    //width: 1058px;
    //$("#msg").width(1058);
};

summary.league.buildRight = function () {
    summary.league.leagueIds = [];
    $(summary.league.vm).each(function () {
        summary.league.leagueIds[summary.league.leagueIds.length] = this.LeagueId;
    });
    $("#tbodyRightDetailAcc").empty();
    for (var i = 0; i < summary.league.vm.length; ++i) {
        $("#stRightDetailAcc").tmpl([summary.league.vm[i]]).appendTo($("#tbodyRightDetailAcc"));
    }
    if (summary.league.vm.length <= 0) {
        $("#divFooterRightDetailAcc").hide();
    }
    else {
        $("#divFooterRightDetailAcc").show();
    }
    $("#divRight").hide();
    $("#divLeagueDetail").hide();
    $("#divRightDetailAcc").show(); //.reRenderScroller(950 , summary.height, true);
    this.calcSum();
};

summary.league.calcSum = function () {
    var dec = 4;

    var totalBetslip = NumberFormatString(this.total.Betslip, dec);
    var totalWin = NumberFormatString(this.total.Win, dec);
    var totalDraw = NumberFormatString(this.total.Draw, dec);
    var totalLose = NumberFormatString(this.total.Lose, dec);

    var totalWinPercent = this.total.WinPercent;
    var totalTotalStake = this.total.TotalStake;
    var totalTotalPL = this.total.TotalPL;
    var totalMPPercent = this.total.MPPercent;

    var tbodyFooterRightDetailAcc = $("#tbodyFooterRightDetailAcc");

    tbodyFooterRightDetailAcc.find("div[betslip]").html(totalBetslip);
    tbodyFooterRightDetailAcc.find("div[win]").html(totalWin);
    tbodyFooterRightDetailAcc.find("div[draw]").html(totalDraw);
    tbodyFooterRightDetailAcc.find("div[lose]").html(totalLose);

    tbodyFooterRightDetailAcc.find("div[winpercent]").html(NumberFormatString(totalWinPercent, dec));
    if (totalWinPercent < 0) tbodyFooterRightDetailAcc.find("div[winpercent]").css("color", "red");
    else tbodyFooterRightDetailAcc.find("div[winpercent]").css("color", "White");

    tbodyFooterRightDetailAcc.find("div[totalstake]").html(NumberFormatString(totalTotalStake, dec));

    tbodyFooterRightDetailAcc.find("div[totalpl]").html(NumberFormatString(totalTotalPL, dec));
    if (totalTotalPL < 0) tbodyFooterRightDetailAcc.find("div[totalpl]").css("color", "red");
    else tbodyFooterRightDetailAcc.find("div[totalpl]").css("color", "white");

    tbodyFooterRightDetailAcc.find("div[mppercent]").html(NumberFormatString(totalMPPercent, dec));
    if (totalMPPercent < 0) tbodyFooterRightDetailAcc.find("div[mppercent]").css("color", "red");
    else tbodyFooterRightDetailAcc.find("div[mppercent]").css("color", "white");
};

summary.league.sortData = function (isHeaderClick) {
    if (typeof this.order == "undefined") {
        this.order = -1;
        jlinq.from(summary.league.vm).sort("LeagueName").select();
    }
    else {
        if (isHeaderClick == false) {
            this.order = 1;
        }
        if (this.order == 1) {
            jlinq.from(summary.league.vm).sort("LeagueName").select();
            this.order = -1;
        }
        else {
            jlinq.from(summary.league.vm).sort("-LeagueName").select();
            this.order = 1;
        }
    }
    var dec = 4;
    $(summary.league.vm).each(function (index, element) {
        element.index = index + 1;
        element.WinPercentStr = NumberFormatString(element.WinPercent, dec);
        element.TotalStakeStr = NumberFormatString(element.TotalStake, dec);
        element.TotalPLStr = NumberFormatString(element.TotalPL, dec);
        element.MPPercentStr = NumberFormatString(element.MPPercent, dec);
    });
    summary.league.buildRight();
};

//Scenario #1102
summary.leagueDetail.viewAllTicketsOfAccs = function () {
    var arrCustId = [];
    $("#tbodyLeft").find("input[type='checkbox']").each(function () {
        if (!this.checked) return;
        arrCustId[arrCustId.length] = $(this).parent().find("input[type='hidden']").val();
    });
    var custids = arrCustId.length <= 0 ? "-1" : arrCustId.join(',');
    //summary.main.search(custids);
    summary.league.acc = "All Accs";
    summary.leagueDetail.showDetail(custids, "", summary.league.acc, "");
}

summary.leagueDetail.viewAllTickets = function () {
    summary.leagueDetail.showDetail(summary.league.custId, summary.league.leagueIds.join(','), summary.league.acc, "");
};

summary.leagueDetail.showDetail = function (custId, leagueId, acc, LeagueName) {
    $.showOverlayer();
    summary.utils.hideMessage();
    $("#btnSearch").wait();
    $.ajax({
        type: "POST",
        url: "GetSumaryDetailLeague",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"fromDate":"' + $("#tbxFromDate").val() + '", "toDate": "' + $("#tbxToDate").val() + '", "custIds": "' + custId + '", "leagueIds": "' + leagueId + '", "bettype":"' + $("#selBettype").val() + '"}',
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            summary.leagueDetail.vm = rs;
            summary.leagueDetail.acc = acc;
            summary.leagueDetail.LeagueName = LeagueName;
            summary.leagueDetail.buildGrid(summary.leagueDetail.concatVM4Paging());
            summary.leagueDetail.pageSize = 200;
            summary.leagueDetail.pageIndex = 0;
            summary.leagueDetail.initPager(summary.leagueDetail.vm.LeagueDetails.length, summary.leagueDetail.pageSize, summary.leagueDetail.pageIndex);
            summary.leagueDetail.adjustWidthUI();
            //$("#divFilter").width(1148);
            //$('#contentSection').width(1165);
            //$("#msg").width(1148);

            $.hideOverlayer();
        }
        , error: function (e) {
            summary.utils.showError(e.toString());
            $("#btnSearch").unwait();
            $.hideOverlayer();
        }
    });
};
summary.leagueDetail.adjustWidthUI = function () {
    var widthAdjust = window.screen.width - 1024;
    if (widthAdjust == 0) {
        $(".adjustWidthMD").addClass("colbreak").width(90);
        $(".adjustWidthStakePL").addClass("colbreak").width(60);
        $("#adjustWithFooterTotal").width(594);
    }
    else if (widthAdjust > 0) {
        $(".adjustWidthMD").removeClass("col90").addClass("colbreak").width(90 + Math.round(widthAdjust / 2.5));
        $(".adjustWidthStakePL").removeClass("col65").addClass("colbreak").width(65 + Math.round(widthAdjust / 9));
        $("#adjustWithFooterTotal").width(594 + Math.round(widthAdjust / 2.5));
    }
    //    else {
    //    }
}

summary.leagueDetail.buildTran = function (element) {
    var dec = 4;
    //element.Acc = this.acc;
    element.MatchDetail = element.HomeName + "<span style='color:blue'> vs </span>" + element.AwayName;

    if (element.Bettype == 1 || element.Bettype == 7) {
        if (element.Betteam == "h") {
            element.TeamPick = element.HomeName;
        }
        else {
            element.TeamPick = element.AwayName;
        }
    }
    else if (element.Bettype == 3 || element.Bettype == 8) {
        if (element.Betteam == "h") {
            element.TeamPick = "Over";
        }
        else {
            element.TeamPick = "Under";
        }
    }
    else if (element.Bettype == 5 || element.Bettype == 15) {
        element.TeamPick = (element.Bettype == "5" ? "FT." : "1st.") + element.Betteam;
    }
    else {
        element.TeamPick = "";
    }

    element.OddsStr = NumberFormatString(element.Odds, dec);
    element.StakeStr = NumberFormatString(element.Stake, dec);
    element.TotalPLStr = NumberFormatString(element.TotalPL, dec);
};

summary.leagueDetail.buildGrid = function (vm) {
    $("#btnSearch").wait();
    var acc = summary.leagueDetail.acc;
    var LeagueName = summary.leagueDetail.LeagueName;

    $("#divRight").hide();
    $("#divRightDetailAcc").hide();
    var arrHtml = [];
    var html = [];
    for (var i = 0; i < vm.length; ++i) {
        summary.leagueDetail.buildTran(vm[i]);
        html = $("#stLeagueDetail").tmpl([vm[i]]);
        if (html.length > 0) arrHtml.push(html.get(0));
    }
    var width = 1040;

    $("#tbodyLeagueDetail").empty().append(arrHtml);
    if (vm.length <= 0) {
        $("#divFooterLeagueDetail").hide();
    }
    else {
        $("#divFooterLeagueDetail").show();
    }

    $("#divLeagueDetail").show(); //.reRenderScroller(width , summary.height, true);
    $("#btnSearch").unwait();
    if (summary.league.acc !== "All Accs") {
        $("#divPathLeagueDetail").show().find("label").html("<span style='text-decoration:underline' class='blue' onclick='javascript:summary.main.backAccount();'>Acc</span> > <span style='text-decoration:underline' class='blue' onclick='javascript:summary.league.viewDetailAcc(" + summary.league.custId + ", \"" + summary.league.acc + "\");'>League</span> ("
            + summary.league.acc
            + (LeagueName != "" ? ", " : "")
            + LeagueName + ") > Detail");
    }
    else {
        $("#divPathLeagueDetail").show().find("label").html("<span style='text-decoration:underline' class='blue' onclick='javascript:summary.main.backAccount();'>Acc</span> > Details");
    }
    var dec = 4;

    var TotalTurnOver = NumberFormatString(summary.leagueDetail.vm.TotalTurnOver, dec);
    $("#tbodyFooterLeagueDetail").find("div[stake]").html(TotalTurnOver);

    var TotalPL = NumberFormatString(summary.leagueDetail.vm.TotalPL, dec);
    if (summary.leagueDetail.vm.TotalPL == 0) {
        $("#tbodyFooterLeagueDetail").find("div[totalpl]").html("");
    }
    else {
        $("#tbodyFooterLeagueDetail").find("div[totalpl]").html(TotalPL);
    }
    if (summary.leagueDetail.vm.TotalPL < 0) $("#tbodyFooterLeagueDetail").find("div[totalpl]").css("color", "red");
    else $("#tbodyFooterLeagueDetail").find("div[totalpl]").css("color", "white");
};

summary.leagueDetail.concatVM4Paging = function () {
    var vm = summary.leagueDetail.vm.LeagueDetails;
    if (vm.length <= this.pageSize) {
        return vm;
    }
    var _vm = [];

    var start = this.pageIndex * this.pageSize;
    var end = 0;

    if (vm.length < (start + this.pageSize)) {
        end = vm.length;
    }
    else {
        end = start + this.pageSize;
    }

    for (var i = start; i < end; ++i) {
        _vm.push(vm[i]);
    }
    return _vm;
};

summary.leagueDetail.pageSelectCallback = function (page_index, _items_per_page, jq) {
    var max_page = Math.ceil(this.vm.LeagueDetails.length / _items_per_page);
    page_index = page_index < max_page ? page_index : max_page - 1;

    this.pageSize = parseInt(_items_per_page);
    this.pageIndex = page_index;
    this.buildGrid(this.concatVM4Paging());
    this.initPager(summary.leagueDetail.vm.LeagueDetails.length, summary.leagueDetail.pageSize, summary.leagueDetail.pageIndex);
    summary.leagueDetail.adjustWidthUI();
    return false;
};

summary.leagueDetail.initPager = function (total_item, items_per_page, current_page) {
    var opt = {
        callback: function () {
            summary.leagueDetail.pageSelectCallback(arguments[0], arguments[1], arguments[2]);
        },
        item_per_page_arr: [100, 200, 300, 400, 500],
        items_per_page: items_per_page,
        current_page: current_page
    };
    $("#pagination").pagination(total_item, opt);
};

summary.utils.showError = function (msg) {
    showMessage(msg, 1);
};

$.extend(summary, { chart: {
    data: null,
    categories: [],
    setData: function (_data) {
        //alert(JSON.stringify(_data));
        summary.fromDate = $('#tbxFromDate').val();
        summary.toDate = $('#tbxToDate').val();
        summary.title = 'Total P&L Summary Report From ' + summary.fromDate + ' To ' + summary.toDate;

        this.data = _data.data;
        //this.categories = _data.cates;
        if (_data.cates) {
            var newCates = [];
            jQuery.each(_data.cates, function (ind, cate) {
                var item = { field: cate, label: cate, enable: true };
                newCates.push(item);
            });
            summary.chart.categories = newCates;
        }

        /*var rows =_data.data;
        if (_data) {
        var val = _data[0];
        var objIndex = 0;
        var newCategories = [];
        jQuery.each(val, function (name, value) {
        if (objIndex != 0) {
        var item = { field: name, label: name, enable: true };
        newCategories.push(item);
        }
        objIndex++;
        });
        this.categories = newCategories;
        }*/
        //this.viewByTotal(); hiện thị chart ngay khi bấm vào btnSeach
    },
    viewByTotal: function () {
        if (this.data != null) {
            /*var data_items = this.data;
            var serial_data = []; var categories = [];

            for (var i = 0, len = data_items.length; i < len; i++) {
            var item = data_items[i];
            var toData = [];
            $.each(this.categories, function (ind, cate) {
            if (cate.enable) {
            var val = eval("item." + cate.field + "");
            toData.push(summary.chart.toNumber(val));
            if (i == 0) { categories.push(cate.label); }
            }
            });
            serial_data.push({
            name: item.Name,
            data: toData,
            cursor: 'pointer'
            });
            }*/
            //var categories = this.categories;
            var dataChart = [];
            var categories = [];
            $.each(summary.chart.categories, function (ind, cate) {
                if (cate.enable) {
                    dataChart.push(summary.chart.data[ind]);
                    categories.push(cate.label);
                }
            });
            //var dataChart = this.data;
            var serial_data = [];
            serial_data.push({
                name: "Acc",
                data: dataChart,
                cursor: 'pointer'
            });

            // init chart total
            var opts = {
                container: 'chart_content',
                type: 'column',
                title: summary.title,
                name: "Acc",
                width: "100%",
                height: 550,
                categories: categories,
                series: serial_data
            };

            //alert(JSON.stringify(opts));

            if ($('#chart_content').length == 0) {
                this.initViewChart(opts);
            }
            accChart.renderSVG(opts);
        }
    },
    initViewChart: function (opts) {
        $('<div />').attr('id', 'chart_shadow').addClass('chart_shadow').appendTo('body').show();
        $('<div />').attr('id', 'chart_popup').addClass('chart_popup')
            .css({ width: "90%" })
            .appendTo('body');
        $('<div />').attr('id', 'chart_setting').addClass('chart_setting').appendTo('#chart_popup');
        $('<div />').attr('id', 'chart_title')
             .addClass('chart_title')
             .append('<div class="setting" title="Setting">&nbsp;</div><div class="title">' + opts.title + '</div><div class="close" title="Close">&nbsp;</div>')
             .appendTo('#chart_popup');
        $('<div />').attr('id', 'chart_content').addClass('chart_content')
             .css({ width: opts.width, height: opts.height })
             .appendTo('#chart_popup');
        $('#chart_popup').css("left", 50);
        $('#chart_popup').show();
        $('#chart_popup').draggable({
            handle: '#chart_title'
        });

        //ham khi click vao setting
        $('div.setting').bind('click', function (e) {
            if ($('#chart_setting').is(':hidden')) {
                $('#chart_setting').slideDown();
                $(this).attr('title', 'Hide setting');
            } else {
                $('#chart_setting').slideUp();
                $(this).attr('title', 'Display setting');
            }
        });

        $('div.close').bind('click', function (e) {
            summary.chart.close();
        });
        this.renderSetting();
    },
    renderSetting: function () {
        $('#chart_setting').html('<ul id="ul_setting"></ul>');
        var tpl_cate = '{{each categories}}<li><input class="setcheck" type="checkbox" {{if $value.enable}}checked="${$value.enable}"{{/if}} value="${$index}"/>${$value.enable}&nbsp;${$value.label}</li>{{/each}}';
        //$('<div />').append(tpl_cate).tmpl(this).appendTo("#ul_setting");
        $.each(this.categories, function (ind, cate) {
            var is_checked = (cate.enable == true) ? 'checked' : '';
            var _itemTpl = '<li><input class="setcheck" ' + is_checked + ' type="checkbox" value="' + ind + '"/>&nbsp;' + cate.label + '</li>';
            $("#ul_setting").append(_itemTpl);
        });
        $('#chart_setting').css({ width: 185, 'margin-top': 27 });

        //de scroll duoc khi qua dai
        $('#chart_setting').css('max-height', '300px');
        $('#chart_setting').css('overflow-y', 'auto');

        if ($.browser.msie) {
            if ($.browser.version.indexOf('7') != -1) {
                $('#chart_setting').css({ 'margin-left': -1000 });
                $('#ul_setting').css({ 'margin-left': 10 });
            }
        }
        window.setTimeout(function () {
            $('input.setcheck').bind('click', function (e) {
                var checked = $(this).attr("checked");
                var index = $(this).val();
                summary.chart.categories[index].enable = checked;
                summary.chart.viewByTotal();
            });
        });
    },
    close: function () {
        $('#chart_shadow').fadeOut();
        $('#chart_popup').fadeOut();
        window.setTimeout(function () {
            $('#chart_shadow').remove();
            $('#chart_popup').remove();
        }, 1000);
    },
    toNumber: function (numText) {
        numText = "".concat(numText);
        return parseFloat(numText.replace(/,/gi, ''));
    }
}
});

$(document).ready(function () {
    summary.main.init();
    $('#btnToggle').click(function () {
        $("#divFilter").toggle("fast");
        if ($("#contentSection").css("padding-top") == "80px") {
            $("#contentSection").css("padding-top", "38px");
        } else {
            $("#contentSection").css("padding-top", "80px");
        }
    });
});