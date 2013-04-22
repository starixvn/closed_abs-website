// Simple function to calculate time difference between 2 Javascript date objects

var timeDiff = {
    setStartTime: function () {
        var d = new Date();
        var time = d.getTime();
    },

    getDiff: function () {
        d = new Date();
        return (d.getTime() - time);
    }
};

function get_time_difference(earlierDate, laterDate) {
    var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
    var oDiff = new Object();

    oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

    oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

    oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.minutes * 1000 * 60;

    oDiff.seconds = Math.floor(nTotalDiff / 1000);

    return oDiff;
}

var Handicap = '1', BetHome = 'h', BetAway = 'a', OverUnder = '2', BetOver = 'h', BetUnder = 'a';

$(function () {
    var mindate = -1;
    var maxdate = 6;

    var oDiff = get_time_difference(new Date(), new Date(toDate));
    mindate += oDiff.days + 1;
    maxdate += oDiff.days + 1;
    $("#txtdate").datepicker({
        minDate: mindate,
        maxDate: maxdate,
        today: new Date(toDate),
        onSelect: function (dateText, inst) {
            $("#timeSelections").html("All Period");
            $("#ddlRefreshTime").get(0).selectedIndex = 0;
            panelHeader.filter.refreshTime = "10";
            $("#chkhour").get(0).checked = true;
            reportContent.defaultView = true;
            reportContent.onDefaultView();
            reportContent.resetInstantParams();
            panelHeader.getLeagues($("#txtdate").val(), panelHeader.renderLeagues);
            reportContent.initInstantReport();
        }
    });

    $("#txtdate").datepicker("setDate", new Date(toDate));

    $('#btnToggle').click(function () {
        $("#filterSection").toggle("fast");
        if ($("#contentSection").css("padding-top") == "160px") {
            $("#contentSection").css("padding-top", "30px");
        } else {
            $("#contentSection").css("padding-top", "160px");
        }
    });

    panelHeader.init();
    grid.initGrid();
});
var loader = {
    league: false,
    punter: false,
    main: false,
    isLoading: function () {
        return loader.league || loader.punter || loader.main;
    },
    beforeSend: function () {
        $("#btnRefresh").wait();
        try { parent.IBlockUI(); } catch (e) { }
    },
    completeSend: function () {
        if (!loader.isLoading()) {
            $("#btnRefresh").unwait();
            try { parent.IUnBlockUI(); } catch (e) { }
        }
    }
};

var panelHeader = {
    timeout: null,
    isFirstLoadLeague: true,
    isFirstLoadMember: true,
    filter: {
        refreshTime: '10'
    },
    currRefresh: 10,
    init: function () {
        panelHeader.getLeagues($("#txtdate").val(), panelHeader.renderLeagues);

        reportContent.initInstantReport();
        $("#btnRefresh").click(function () {
            reportContent.refreshData(true);
        });

        $("#ddlRefreshTime").change(function () {
            panelHeader.filter.refreshTime = $("#ddlRefreshTime option:selected").val();
            panelHeader.currRefresh = panelHeader.filter.refreshTime;
            reportContent.refreshData(false);
        });
    },
    renderSelectLeague: function (data, isReset) {
        var ddLeague = $("#ddlLeague");
        var currVal = isReset ? "all" : ddLeague.val();
        ddLeague.empty().append('<option value="all">All League</option>');
        var len = data.length;
        for (var i = 0; i < len; i++) {
            ddLeague.append('<option value="' + data[i].Id + '">' + data[i].Name + '</option>');
        }
        ddLeague.val(currVal);
    },
    getLeagues: function (strDate, callBack) {
        var date = strDate;
        $.ajax({
            type: "POST",
            url: "GetLeagueByDate",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"date":"' + date + '"}',
            beforeSend: function (xhr) {
                loader.league = true;
                loader.beforeSend();
            },
            complete: function (jqXHR, textStatus) {
                loader.league = false;
                loader.completeSend();
            },
            success: function (rs) {
                reportContent.LeagueList = rs;
                if (callBack) {
                    callBack(rs);
                }
            }
        });
    },
    existLeague: function (id, leagues) {
        for (var i = 0; i < leagues.length; i++) {
            if (leagues[i].Id == id) return true;
        }
        return false;
    },
    renderLeagues: function (data) {
        var tempData = [];
        for (var i = 0; i < data.length; i++) {
            tempData.push({
                Id: "#ddlLeague" + i.toString(),
                Value: data[i].Id,
                Text: data[i].Name,
                Checked: !panelHeader.existLeague(data[i].Id, reportContent.hiddenLeagues),
                Enable: true,
                CssClass: ""
            });
        }
        $("#ddlLeague").multiSelect(
                {
                    minWidth: 300,
                    maxHeight: 400,
                    shadow: true,
                    showHeader: true,
                    isCheckAll: true,
                    updateResult: '[Show/Hide]',
                    onUpdateResult: function () {
                        panelHeader.showHideLeague();
                    },
                    listData: tempData
                });
    },
    showHideLeague: function () {
        reportContent.params.MinTrans = 0;
        reportContent.params.LeagueIds = $("#ddlLeague").multiSelect('getCheckedItems').join(',');
        reportContent.hiddenLeagues = $("#ddlLeague").multiSelect('getUncheckItems');
        reportContent.isAllowGetData = panelHeader.isAllowGetData();
        $('#ddlLeague').multiSelect('hideMe');
        if (reportContent.hiddenLeagues.length > 0) {
            reportContent.initInstantReport();
        }
        else {
            panelHeader.getLeagues($("#txtdate").val(), function (list) {
                panelHeader.renderLeagues(list);
                reportContent.initInstantReport();
            });
        }
    },
    existPunter: function (id, punters) {
        for (var i = 0; i < punters.length; i++) {
            if (punters[i].Id == id) return true;
        }
        return false;
    },
    existPunterByColor: function (color, punters) {
        for (var i = 0; i < punters.length; i++) {
            if (punters[i].Color == color) return punters[i];
        }
        return null;
    },
    getColorName: function (color) {
        var colors = colorFilter.split(',');
        for (var i = 0; i < colors.length; i++) {
            var co = colors[i].split(';');
            if (color == co[0]) {
                return co[1];
            }
        }
        return '';
    },
    groupPunterByColor: function (data) {
        var arrColor = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
            var item = data[i];
            var color = panelHeader.existPunterByColor(item.Color, arrColor);
            if (color == null) {
                arrColor.push({
                    Id: "",
                    Value: item.Id,
                    Color: item.Color,
                    Css: "color:" + item.Color + ";",
                    Text: panelHeader.getColorName(item.Color),
                    Check: item.Check,
                    CssClass: "",
                    Enable: true,
                    Items: [item]
                });
            }
            else {
                color.Check = !color.Check ? false : (color.Check && item.Check);
                color.Items.push(item);
            }
        }
        return arrColor;
    },
    getPunter: function (callBack) {
        var ddlAccount = $("#ddlAccount");
        ddlAccount.empty().append('<option value="all" selected="selected">All</option>');
        $.ajax({
            type: "POST",
            url: "GetPunterByColor",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"color":""}',
            beforeSend: function (xhr) {
                loader.punter = true;
                loader.beforeSend();
            },
            complete: function (jqXHR, textStatus) {
                loader.punter = false;
                loader.completeSend();
            },
            success: function (rs) {
                if (callBack) {
                    callBack(rs);
                }
            }
        });
    },
    renderPunters: function (data) {
        var tempData = [];
        for (var i = 0; i < data.length; i++) {
            tempData.push({
                Id: "#ddlAccount" + i.toString(),
                Value: data[i].Id,
                Text: data[i].PunterCode,
                Checked: !panelHeader.existPunter(data[i].Id, reportContent.hiddenPunters),
                Enable: true,
                Color: data[i].Color,
                Css: "color:" + data[i].Color + ";",
                CssClass: ""
            });
        }
        var listData = panelHeader.groupPunterByColor(tempData);
        $("#ddlAccount").multiSelect(
                {
                    minWidth: 180,
                    maxHeight: 400,
                    shadow: true,
                    showHeader: true,
                    isCheckAll: true,
                    hasOptGroup: true,
                    updateResult: '[Show/Hide]',
                    onUpdateResult: function () {
                        panelHeader.showHidePunter();
                    },
                    listData: listData
                });
    },
    showHidePunter: function () {
        reportContent.params.MinTrans = 0;

        reportContent.params.PunterIds = $('#ddlAccount').multiSelect('getCheckedItems').join(',');
        reportContent.hiddenPunters = $('#ddlAccount').multiSelect('getUncheckItems');
        reportContent.isAllowGetData = panelHeader.isAllowGetData();
        $('#ddlAccount').multiSelect('hideMe');
        reportContent.initInstantReport();
    },
    isAllowGetData: function () {
        return (($('#ddlAccount').multiSelect('getCheckedItems').length > 0 || $('#ddlAccount').multiSelect('getUncheckItems').length == 0) && ($('#ddlLeague').multiSelect('getCheckedItems').length > 0 || $('#ddlLeague').multiSelect('getUncheckItems').length == 0));
    }
};
var grid = {
    me: null,
    tb: null,
    initGrid: function () {
        grid.me = $("#reportGrid");
        grid.tb = $("#tblInstantRecord tbody");
    },
    trs: function () {
        return grid.tb.find("tr");
    }
};
var reportContent = {
    isAllowGetData: true,
    isFirstLoad: true,
    dataModel: [],
    LeagueList: [],
    hiddenLeagues: [],
    hiddenPunters: [],
    newTrans: [],
    defaultView: true,
    maxRows: 1000,
    isChangedData: false,
    timeout: null,
    highlightTime: 8000,
    params: {
        KickOffDate: '',
        KickOffTime: 'all',
        LeagueIds: '',
        PunterIds: '',
        EventStatus: 0,
        MinTrans: 0,
        BetType: 0,
        MatchIds: '',
        Homeid: 0,
        Awayid: 0,
        EventDate: '',
        mintstamp: '0x'
    },
    renderNoData: function () {
        grid.me.removeClass("hidden");
        grid.tb.empty().html('<tr nodata="true"><td class="c b" colspan="12">There is no data.</td></tr>');
    },
    preRenderOrderNumber: function () {
        var totalRow = grid.trs().length;
        if (totalRow == 0) {
            reportContent.renderNoData();
        }
        else {
            grid.tb.find("tr[nodata]").remove();
        }

        if (totalRow <= reportContent.maxRows) {
            $("#lnkmorebets").css("visibility", "hidden");
        }
        else {
            $("#lnkmorebets").css("visibility", "visible");
        }

        grid.trs().each(function (index) {
            var count = index + 1;
            $(this).find("td[order]").html(count);
        });
    },
    getInstantReportUpdatedTransData: function (fcallback, isManualAuto) {
        if (reportContent.params.KickOffTime != '' && reportContent.isAllowGetData && (panelHeader.filter.refreshTime != '0' || isManualAuto)) {
            if (reportContent.hiddenLeagues.length == 0) {
                reportContent.params.LeagueIds = '';
            }
            if (reportContent.hiddenPunters.length == 0) {
                reportContent.params.PunterIds = '';
            }
            $.ajax({
                type: "POST",
                url: "GetInstantReCordUpdatedTransData",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"reportparams":' + JSON.stringify(reportContent.params) + '}',
                beforeSend: function (xhr) {
                    loader.main = true;
                    loader.beforeSend();
                    clearTimeout(panelHeader.timeout);
                },
                complete: function (jqXHR, textStatus) {
                    loader.main = false;
                    loader.completeSend();
                    if (panelHeader.filter.refreshTime != "0") {
                        panelHeader.timeout = setTimeout(function () {
                            reportContent.refreshData(false);
                        }, parseInt(panelHeader.filter.refreshTime) * 1000);
                    }
                },
                success: function (rs) {
                    if (fcallback) fcallback(rs);
                }
            });
        }
    },
    getInstantReportData: function (fcallback) {
        if ((reportContent.isFirstLoad || reportContent.isAllowGetData) && reportContent.params.KickOffTime != '') {
            if (reportContent.hiddenLeagues.length == 0) {
                reportContent.params.LeagueIds = '';
            }
            if (reportContent.hiddenPunters.length == 0) {
                reportContent.params.PunterIds = '';
            }
            $.ajax({
                type: "POST",
                url: "GetInstantReCordData",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"reportparams":' + JSON.stringify(reportContent.params) + '}',
                beforeSend: function (xhr) {
                    loader.main = true;
                    loader.beforeSend();
                    clearTimeout(panelHeader.timeout);
                },
                complete: function (jqXHR, textStatus) {
                    loader.main = false;
                    loader.completeSend();
                    if (panelHeader.filter.refreshTime != "0") {
                        panelHeader.timeout = setTimeout(function () {
                            reportContent.refreshData(false);
                        }, parseInt(panelHeader.filter.refreshTime) * 1000);
                    }
                },
                success: function (rs) {
                    if (fcallback) fcallback(rs);
                }
            });
        }
        else {
            if (reportContent.dataModel.length >= 24) {
                for (var i = 0; i < 24; i++) {
                    var hour = reportContent.dataModel[i];
                    hour.TotalBets = 0;
                    hour.TotalMatchs = 0;
                    hour.Matchs = [];
                    hour.IsNew = false;
                }
                reportContent.renderBetSummary(reportContent.dataModel);
            }
            reportContent.renderNoData();
        }
    },
    resetKickOffTime: function () {
        reportContent.params.KickOffTime = 'all';
        $("#chkhour").get(0).checked = true;
        $("#timeSelections").html("All Period");
    },
    initInfo: function () {
        $("#currDate").html("Now: " + getCurrentDateWithFormat());
        if (reportContent.params.EventStatus == 0) {
            $("#infoInstantReport .spmatch").html("SP Match(s)");
            $("#runningMatch").addClass("disabled");
            $("#completeMatch").removeClass("disabled");
        }
        else {
            $("#infoInstantReport .spmatch").html("FT Match(s)");
            $("#completeMatch").addClass("disabled");
            $("#runningMatch").removeClass("disabled");
        }
    },
    firstLoadData: function (data) {
        if (data.PunterList != null && reportContent.isFirstLoad) {
            reportContent.PunterList = data.PunterList;
            panelHeader.renderPunters(reportContent.PunterList);
            reportContent.isFirstLoad = false;
        }
        reportContent.dataModel = data.HoursList;

        if (data.LastTStamp != null) {
            reportContent.params.mintstamp = data.LastTStamp;
        }
        reportContent.defaultView = true;
        reportContent.onDefaultView();

        reportContent.renderBetSummary(reportContent.dataModel);
        if (panelHeader.isFirstLoadLeague) {
            panelHeader.isFirstLoadLeague = false;
        }
        reportContent.renderInstantReportGrid(reportContent.dataModel);
        $("#reportInfo").removeClass("hidden");
    },
    refreshData: function (isManualAuto) {
        reportContent.getInstantReportUpdatedTransData(reportContent.autoRefresh, isManualAuto);
    },
    initInstantReport: function () {
        reportContent.params.KickOffDate = $("#txtdate").val();
        reportContent.getInstantReportData(reportContent.firstLoadData);
        reportContent.initInfo();

        $("#runningMatch").click(function () {
            if (reportContent.params.EventStatus == 0)
                return;
            //reportContent.resetHiddenMatchs();
            reportContent.params.EventStatus = 0;
            reportContent.params.MinTrans = 0;
            reportContent.initInstantReport();
        });
        $("#completeMatch").click(function () {
            if (reportContent.params.EventStatus == 1)
                return;
            reportContent.params.EventStatus = 1;
            reportContent.params.MinTrans = 0;
            reportContent.initInstantReport();
        });
    },
    checkTransInList: function (transId, trans) {
        var len = trans.length;
        for (var i = 0; i < len; i++) {
            var tran = trans[i];
            if (tran.TransId == transId) {
                return true;
            };
        }
        return false;
    },
    cloneTran: function (tran, isHighlight) {
        var newtran = {
            LiveIndicator: tran.LiveIndicator,
            MatchCode: tran.MatchCode,
            BetTeam: tran.BetTeam,
            BetType: tran.BetType,
            Color: tran.Color,
            PunterId: tran.PunterId,
            PunterName: tran.PunterName,
            TransDate: tran.TransDate,
            Stake: tran.Stake,
            Winlost: tran.Winlost,
            Hdp: tran.Hdp,
            Odds: tran.Odds,
            BetTeamName: tran.BetTeamName,
            BetTypeName: tran.BetTypeName,
            MatchDate: tran.MatchDate,
            LiveAwayScore: tran.LiveAwayScore,
            LiveHomeScore: tran.LiveHomeScore,
            Remark: tran.Remark,
            TransId: tran.TransId,
            IsNew: isHighlight
        };
        return newtran;
    },
    cloneMatch: function (match, isHighlight) {
        var newmatch = {
            MatchCode: match.MatchCode,
            BetType: match.BetType,
            IsNew: isHighlight,
            MatchDT: match.MatchDT,
            MatchDate: match.MatchDate,
            LeagueId: match.LeagueId,
            LeagueName: match.LeagueName,
            HomeId: match.HomeId,
            HomeName: match.HomeName,
            AwayId: match.AwayId,
            AwayName: match.AwayName,
            Trans: []
        };
        return newmatch;
    },
    addNewMatch: function (tran, match, hour, isHighlight) {
        var newmatch = reportContent.cloneMatch(match, isHighlight);
        newmatch.Trans.push(reportContent.cloneTran(tran, isHighlight));
        hour.Matchs.push(newmatch);
        hour.TotalMatchs += 1;
        hour.TotalBets += 1;
    },
    appendTranToHour: function (tran, match, _hour, ishighlight) {
        var len = _hour.Matchs.length;
        if (len == 0) {
            reportContent.addNewMatch(tran, match, _hour, ishighlight);
            //grid.tb.prepend(reportContent.renderRowReport(0, tran, match, ishighlight ? 'newrow' : ''));
            reportContent.newTrans.push(tran);
            grid.tb.find("tr[nodata]").remove();

            _hour.IsNew = ishighlight;
        }
        else {
            var isNewMatch = true;
            for (var i = 0; i < len; i++) {
                _match = _hour.Matchs[i];

                if (match.MatchCode == _match.MatchCode && match.BetType == _match.BetType) {
                    if (!reportContent.checkTransInList(tran.TransId, _match.Trans)) {
                        _match.Trans.push(reportContent.cloneTran(tran, ishighlight));
                        _match.IsNew = ishighlight;
                        //grid.tb.prepend(reportContent.renderRowReport(0, tran, match, ishighlight ? 'newrow' : ''));
                        reportContent.newTrans.push(tran);
                        grid.tb.find("tr[nodata]").remove();
                        _hour.TotalBets += 1;
                        _hour.IsNew = ishighlight;
                    }
                    isNewMatch = false;
                    break;
                }
            }
            if (isNewMatch) {
                reportContent.addNewMatch(tran, match, _hour, ishighlight);
                _hour.IsNew = ishighlight;
                //grid.tb.prepend(reportContent.renderRowReport(0, tran, match, ishighlight ? 'newrow' : ''));
                reportContent.newTrans.push(tran);
                grid.tb.find("tr[nodata]").remove();
            }
        }
    },
    removeTranFromHour: function (tran, _hour) {
        var len = _hour.Matchs.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                _match = _hour.Matchs[i];
                var tl = _match.Trans.length;
                for (var j = 0; j < tl; j++) {
                    var _tran = _match.Trans[j];
                    if (_tran.TransId == tran.TransId) {
                        _match.Trans.splice(j, 1);
                        _hour.TotalBets -= 1;
                        grid.tb.find("#" + tran.TransId).remove();
                        if (_match.Trans.length == 0) {
                            _hour.TotalMatchs -= 1;
                            _hour.Matchs.splice(i, 1);
                        }
                        return;
                    }
                }
            }
        }
    },
    autoRefresh: function (data) {
        $("#currDate").html("Now: " + getCurrentDateWithFormat());
        reportContent.isChangedData = false;
        if (data.LastTStamp != null) {
            reportContent.params.mintstamp = data.LastTStamp;
            reportContent.isChangedData = true;

            if (data.LeagueList != null) {
                var len = data.LeagueList.length;
                var _len = reportContent.LeagueList.length;
                var isChange = false;
                for (var l = 0; l < len; l++) {
                    var isExist = false;
                    for (var _l = 0; _l < _len; _l++) {
                        if (data.LeagueList[l].Id == reportContent.LeagueList[_l].Id) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        isChange = true;
                        reportContent.LeagueList.push(data.LeagueList[l]);
                    }
                }
                if (isChange) {
                    panelHeader.renderLeagues(reportContent.LeagueList);
                    reportContent.params.LeagueIds = $("#ddlLeague").multiSelect('getCheckedItems').join(',');
                    reportContent.isAllowGetData = panelHeader.isAllowGetData();
                }
            }
        }
        else {
            return;
        }
        reportContent.newTrans = [];
        for (var i = 0; i < 24; i++) {
            var hour = data.HoursList[i];
            var _hour = reportContent.dataModel[i];
            var matchs = hour.Matchs;
            var ml = matchs.length;
            for (var j = 0; j < ml; j++) {
                var match = matchs[j];
                var trans = match.Trans;
                var tl = trans.length;
                for (var k = 0; k < tl; k++) {
                    var tran = trans[k];
                    if (reportContent.params.EventStatus == 0) {
                        if (tran.StatusId == "0" || tran.StatusId == "1")//Append and Highlight
                        {
                            reportContent.appendTranToHour(tran, match, _hour, true);
                            //_hour.IsNew = true;
                        }
                        else {
                            reportContent.removeTranFromHour(tran, _hour);
                        }
                    }
                    else {
                        if (tran.StatusId == "111" || tran.StatusId == "112" || tran.StatusId == "113")//Append and Highlight
                        {
                            reportContent.appendTranToHour(tran, match, _hour, true);
                            //_hour.IsNew = true;
                        }
                        else {
                            reportContent.removeTranFromHour(tran, _hour);
                        }
                    }
                }
            }
        }
        reportContent.newTrans = jlinq.from(reportContent.newTrans).sort("TransId").select();
        for (var t = 0; t < reportContent.newTrans.length; t++) {
            var row = reportContent.newTrans[t];
            grid.tb.prepend(reportContent.renderRowReport(t + 1, row, reportContent.getMatchFromHours(data.HoursList, row.MatchCode), 'newrow'));
        }

        if (reportContent.isChangedData) {
            reportContent.renderBetSummary(reportContent.dataModel);
            reportContent.preRenderOrderNumber();
            reportContent.isChangedData = false;

            reportContent.timeout = setTimeout(function () {
                $("#tblHours .newrow").removeClass("newrow");
                $("#contentSection .newrow").removeClass("newrow");
                for (var i = 0; i < 24; i++) {
                    var h = reportContent.dataModel[i];
                    h.IsNew = false;
                    if (h.Matchs != null) {
                        var _l = h.Matchs.length;
                        for (var _m = 0; _m < _l; _m++) {
                            var m = h.Matchs[_m];
                            m.IsNew = false;
                            for (var _t = 0; _t < m.Trans.length; _t++) {
                                m.Trans[_t].IsNew = false;
                            }
                        }
                    }
                }
            }, reportContent.highlightTime);
        }
        //alert(JSON.stringify(reportContent.dataModel));
    },
    renderBetSummary: function (rs) {
        var len = rs.length;
        var totalBets = 0;
        var totalMatch = 0;
        var totalDiplayedBet = 0;
        var isSingleDisplay = false;
        var hourNo = "";
        if ($("#timeSelections").html() != "All Period") {
            isSingleDisplay = true;
            hourNo = $("#timeSelections").html().split(":")[0];
        }

        var Alltext = "[ALL]";
        if (reportContent.params.KickOffTime != 'all') {
            Alltext = "[Sel]";
        }

        var rowChk = '<tr><td class="c title col60"><input type="checkbox" ' + (reportContent.params.KickOffTime == 'all' ? 'checked="checked"' : '') + ' id="chkhour" onclick="reportContent.chkAllHourClick(this)" /></td>';
        var rowOk = '<tr><td class="c title"><a href="javascript:void(0);" onclick="reportContent.lnkSummaryOK();">[OK]</a></td>';
        var rowAll = '<tr><td class="c title"><a href="javascript:void(0);" id="lnkSummaryAll"  onclick="reportContent.lnkSummaryAll();">' + Alltext + '</a></td>';

        for (var i = 0; i < len; i++) {
            var row = rs[i];
            rowChk += '<td class="c ' + (row.IsNew ? ' newrow' : '') + '"><input id="chkhour_' + row.HourNo + '"  type="checkbox" class="betperhour" ' + ((reportContent.params.KickOffTime == 'all' || reportContent.params.KickOffTime.indexOf(row.HourNo) >= 0) ? 'checked="checked"' : '') + ' onclick="reportContent.betperhourChkClick(this)" /></td>';
            rowOk += '<td class="c ' + (row.IsNew ? ' newrow' : '') + '">' + row.HourNo + '</td>';
            rowAll += '<td class="c ' + (row.IsNew ? ' newrow' : '') + '"><span class="c ' + (row.TotalBets > 0 ? 'b' : '') + '"><a href="javascript:void(0);" onclick="reportContent.linkHourDetail(\'' + row.HourNo + '\',' + row.TotalBets + ')">(' + row.TotalBets + '/' + row.TotalMatchs + ')</a></span></td>';
            if (isSingleDisplay) {
                if (hourNo == row.HourNo) {
                    totalDiplayedBet = row.TotalBets;
                }
            }
            totalBets += row.TotalBets;
            totalMatch += row.TotalMatchs;
        }

        if (totalDiplayedBet == 0) {
            totalDiplayedBet = totalBets;
        }

        if (totalDiplayedBet <= reportContent.maxRows) {
            $("#lnkmorebets").css("visibility", "hidden");
        }
        else {
            $("#lnkmorebets").css("visibility", "visible");
        }

        rowChk += '<td class="c title col60">Total</td></tr>';
        rowOk += '<td class="c title">&nbsp;</td></tr>';
        rowAll += '<td class="c title"><a onclick="reportContent.lnkSummaryAll();" href="javascript:void(0);">' + totalBets + '/' + totalMatch + '</a></td><tr>';

        var betPerHourGrid = $("#tblHours");
        betPerHourGrid.empty().append(rowChk).append(rowOk).append(rowAll);
    },
    renderInstantReportGrid: function (hours) {
        var list = [];
        var arr = [];
        var count = 1;
        if (reportContent.defaultView) {
            var len = hours.length;
            for (var i = 0; i < len; i++) {
                if (count > reportContent.maxRows) { break; }
                var hour = hours[i];
                if (hour.Matchs != null) {
                    var len1 = hour.Matchs.length;
                    for (var h = 0; h < len1; h++) {
                        if (count > reportContent.maxRows) { break; }
                        var match = hour.Matchs[h];
                        var len2 = match.Trans.length;
                        for (var m = 0; m < len2; m++) {
                            if (count > reportContent.maxRows) { break; }
                            list.push(match.Trans[m]);
                            count++;
                        }
                    }
                }
            }
        }
        else {
            var len = hours.length;
            for (var i = 0; i < len; i++) {
                var hour = hours[i];
                if (hour.Matchs != null) {
                    var len1 = hour.Matchs.length;
                    for (var h = 0; h < len1; h++) {
                        var match = hour.Matchs[h];
                        var len2 = match.Trans.length;
                        for (var m = 0; m < len2; m++) {
                            if (count > reportContent.maxRows) {
                                list.push(match.Trans[m]);
                            }
                            count++;
                        }
                    }
                }
            }
        }

        var total = list.length;
        list = jlinq.from(list).sort("-TransId").select();
        for (var num = 0; num < total; num++) {
            var row = list[num];
            arr.push(reportContent.renderRowReport(num + 1, row, reportContent.getMatchFromHours(hours, row.MatchCode), ''));
        }

        if (arr.length > 0) {
            grid.me.removeClass("hidden");
            grid.tb.empty().html(arr.join(''));
        }
        else {
            reportContent.renderNoData();
        }
    },
    showFullBets: function () {
        if (reportContent.defaultView) {
            reportContent.defaultView = false;
            clearTimeout(panelHeader.timeout);
        }
        else {
            reportContent.defaultView = true;
            panelHeader.filter.refreshTime = panelHeader.currRefresh;
            clearTimeout(panelHeader.timeout);
            if (panelHeader.filter.refreshTime != "0") {
                panelHeader.timeout = setTimeout(function () {
                    reportContent.refreshData(false);
                }, parseInt(panelHeader.filter.refreshTime) * 1000);
            }
        }
        reportContent.onDefaultView();

        var listHours = reportContent.mappingData(reportContent.dataModel);
        reportContent.renderInstantReportGrid(listHours);
    },
    onDefaultView: function () {
        if (!reportContent.defaultView) {
            $("#lnkmorebets").html("Top " + reportContent.maxRows + " ...");
            $("#btnRefresh").css("visibility", "hidden");
            $("#lblrefresh").css("visibility", "hidden");
            panelHeader.currRefresh = $("#ddlRefreshTime").val();
            panelHeader.filter.refreshTime = "0";
            $("#ddlRefreshTime").css("visibility", "hidden");
            $("#ddlRefreshTime option[value='0']").attr("selected", "selected");
        }
        else {
            panelHeader.filter.refreshTime = panelHeader.currRefresh;
            $("#ddlRefreshTime").val(panelHeader.currRefresh);
            $("#ddlRefreshTime").css("visibility", "visible");
            $("#lblrefresh").css("visibility", "visible");
            $("#btnRefresh").css("visibility", "visible");
            $("#lnkmorebets").html("More ...");
        }
    },
    renderRowReport: function (no, row, match, cssclass) {
        var html = '<tr class="' + cssclass + '" id="' + row.TransId + '">'
                    + '</td>'
                    + '<td order="true" class="c">' + no + '</td>'
                    + '<td class="c">' + row.TransId + '</td>'
                    + '<td class="c">' + row.TransDate + '</td>'
                    + '<td class="c">' + match.MatchDate + '</td>'
                    + '<td class="c"><span style="color:' + row.Color + ';">' + row.PunterName + '<span></td>'
                    + '<td class="c">' + (row.LiveIndicator ? '<span style="color:blue;">Live</span> ' : '') + row.BetTypeName + '</td>'
                    + '<td class="r">' + match.HomeName + ' <span class="versus">vs</span> ' + match.AwayName + (row.LiveIndicator ? (' <span class="b livescore">' + row.LiveHomeScore + '-' + row.LiveAwayScore + '</span>') : '') + '<br><span class="league">' + match.LeagueName + '</span></td>'
                    + '<td class="c">' + row.BetTeamName + '</td>'
                    + '<td class="c red">' + row.Hdp + '</td>'
                    + '<td class="c red">' + row.Odds + '</td>'
                    + '<td class="c">' + row.Stake + '</td>'
                    + '<td class="l">\<div style="float:right;color:blue; text-decoration: underline; cursor:pointer" onclick="reportContent.editRemark(event, ' + row.TransId + ');">[Edit]</div>\<div remark="true" style="float:left;">' + row.Remark + '&nbsp</div>\</div>'
                    + '</td>'
                + '</tr>';
        return html;
    },
    betperhourChkClick: function (obj) {
        if (!$(obj).get(0).checked) {
            $("#chkhour").get(0).checked = false;
        }
        else {
            var isAllCheck = true;
            $("#tblHours .betperhour").each(function () {
                if (!$(this).get(0).checked) {
                    isAllCheck = false;
                    return;
                }
            });
            $("#chkhour").get(0).checked = isAllCheck;
        }
    },
    chkAllHourClick: function (obj) {
        $("#tblHours .betperhour").each(function () {
            $(this).get(0).checked = $(obj).get(0).checked;
        });
    },
    linkHourDetail: function (hour, totalbet) {
        $("#timeSelections").html(hour + ":00");
        $("#chkhour").get(0).checked = false;
        $("#tblHours input:checkbox").each(function () {
            $(this).get(0).checked = false;
        });
        $("#tblHours #chkhour_" + hour).get(0).checked = true;

        reportContent.params.KickOffTime = hour;

        var listHours = reportContent.mappingData(reportContent.dataModel);
        if (totalbet <= reportContent.maxRows) {
            $("#lnkmorebets").css("visibility", "hidden");
        }
        else {
            $("#lnkmorebets").css("visibility", "visible");
        }
        reportContent.defaultView = true;
        clearTimeout(panelHeader.timeout);
        if (panelHeader.filter.refreshTime != "0") {
            panelHeader.timeout = setTimeout(function () {
                reportContent.refreshData(false);
            }, parseInt(panelHeader.filter.refreshTime) * 1000);
        }
        reportContent.onDefaultView();
        reportContent.renderInstantReportGrid(listHours);
    },
    lnkSummaryOK: function () {
        if (!$("#chkhour").get(0).checked) {
            $("#lnkSummaryAll").html("[Sel]");
            $("#timeSelections").html("Selected Period");
        }
        else {
            $("#lnkSummaryAll").html("[ALL]");
            $("#timeSelections").html("All Period");
        }

        reportContent.setHoursFilter();
        reportContent.params.MinTrans = 0;
        reportContent.initInstantReport();
    },
    lnkSummaryAll: function () {
        if ($("#lnkSummaryAll").html() == "[ALL]") {
            reportContent.params.KickOffTime = 'all';
            $("#tblHours .betperhour").each(function () {
                $(this).get(0).checked = true;
            });
            $("#chkhour").get(0).checked = true;
            $("#timeSelections").html("All Period");
            reportContent.params.MinTrans = 0;
        }
        else {
            if (!$("#chkhour").get(0).checked) {
                $("#timeSelections").html("Selected Period");
            }
            else {
                $("#timeSelections").html("All Period");
            }
            reportContent.setHoursFilter();
        }

        reportContent.initInstantReport();
    },
    mappingData: function (hours) {
        var rs = [];
        for (var i = 0; i < hours.length; i++) {
            var hour = hours[i];
            if (reportContent.params.KickOffTime == 'all' || reportContent.params.KickOffTime.indexOf(hour.HourNo) >= 0) {
                rs.push(hour);
            }
        }
        return rs;
    },
    getMatchFromHours: function (hours, matchcode) {
        for (var i = 0; i < hours.length; i++) {
            var matchs = hours[i].Matchs;
            for (var j = 0; j < matchs.length; j++) {
                if (matchcode == matchs[j].MatchCode) {
                    return matchs[j];
                }
            }
        }
        return {};
    },
    setHoursFilter: function () {
        if (!$("#chkhour").get(0).checked) {
            var listHours = "";
            $("#tblHours .betperhour").each(function () {
                if ($(this).get(0).checked) {
                    listHours += ',' + $(this).attr("id").split("_")[1];
                }
            });
            if (listHours == '') {
                reportContent.params.KickOffTime = '';
            }
            else {
                reportContent.params.KickOffTime = listHours.substring(1, listHours.length);
            }
        }
        else {
            reportContent.params.KickOffTime = 'all';
        }
    },
    resetInstantParams: function () {
        reportContent.isAllowGetData = true;
        reportContent.params.KickOffTime = 'all';
        reportContent.params.LeagueIds = '';
        reportContent.params.PunterIds = '';
        reportContent.params.MinTrans = 0;
        panelHeader.isFirstLoadLeague = true;
        panelHeader.isFirstLoadMember = true;
        reportContent.isFirstLoad = true;
        reportContent.dataModel = [];
        reportContent.PunterList = [];
        reportContent.hiddenLeagues = [];
        reportContent.hiddenPunters = [];
    },
    editRemark: function (e, transId) {
        $("#divMsgRemark").hide();
        var target = typeof e.target != "undefined" ? e.target : e.srcElement;
        $("#txtRemark").val($(target).parent().find("div[remark]").html().replace("&nbsp;", ""));
        showPopup
        ({
            content: $("#divEditRemark"),
            title: "Edit Remarks",
            width: 420,
            height: 200,
            buttons: [{
                "text": "Update",
                callback: function (popuid, button) {
                    if (!reportContent.remarkIsValid($("#txtRemark").val())) {
                        $("#divMsgRemark").html("Remark is invalid!").addClass("error").show();
                        return;
                    }
                    reportContent.saveRemark(popuid, button, target, transId);
                }
            }],
            multiple: false, dialog: true
        });
    },
    saveRemark: function (popuid, button, target, transId) {
        $(button).wait();
        $.ajax({
            type: "POST",
            url: "UpdateRemark",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"transid": ' + transId + ', "remark":"' + $("#txtRemark").val() + '"}',
            success: function (rs) {
                if (typeof rs != "undefined" && rs == null && rs != "") {
                    showMessage(rs, 1);
                }
                else {
                    if ($("#txtRemark").val().replace(/ /g, "") != "") {
                        $(target).parent().find("div[remark]").html($("#txtRemark").val());
                    }
                    else {
                        $(target).parent().find("div[remark]").html("&nbsp;");
                    }
                }
                $(button).unwait();
                closePopup(popuid);
            },
            error: function (ex) {
                $(button).unwait();
                closePopup(popuid);
            }
        });
    },
    remarkIsValid: function (str) {
        /*var re = /^[a-zA-Z_0-9]$/;
        return re.test(str);*/
        if (str.indexOf("'") >= 0
        || str.indexOf("<") >= 0
        || str.indexOf(">") >= 0
        || str.indexOf("\\") >= 0
        //|| str.indexOf("/") >= 0
        || str.indexOf("?") >= 0
        || str.indexOf(".") >= 0
        || str.indexOf(",") >= 0
        || str.indexOf("*") >= 0
        || str.indexOf("&") >= 0
        || str.indexOf("^") >= 0
        || str.indexOf("%") >= 0
        || str.indexOf("#") >= 0
        || str.indexOf("@") >= 0
        || str.indexOf("!") >= 0
        || str.indexOf("`") >= 0
        || str.indexOf("~") >= 0
        || str.indexOf("|") >= 0
        || str.indexOf("+") >= 0
        || str.indexOf("-") >= 0
        || str.indexOf("(") >= 0
        || str.indexOf(")") >= 0
        || str.indexOf(":") >= 0
        || str.indexOf("[") >= 0
        || str.indexOf("]") >= 0
        || str.indexOf("{") >= 0
        || str.indexOf("}") >= 0
        || str.indexOf(";") >= 0
        || str.indexOf('"') >= 0
        || str.indexOf('=') >= 0
    ) return false;
        return true;
    }
};