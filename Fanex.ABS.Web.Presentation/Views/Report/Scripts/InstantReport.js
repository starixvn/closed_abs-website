// Simple function to calculate time difference between 2 Javascript date objects
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

var Handicap = '1', BetHome = 'h', BetAway = 'a', OverUnder = '2', BetOver = 'h', BetUnder = 'a', Bet1x2 = '3', Bet1 = '1', Bet2 = '2', Betx = 'x';

var grid = {
    me: null,
    tb: null,
    initGrid: function () {
        grid.me = $("#reportGrid");
        grid.tb = $("#tblInstantReport tbody");
        $("#chkInstantReport").click(function () {
            var checked = $(this).get(0).checked;
            grid.tb.find(".instantreport").each(function () {
                $(this).attr("checked", checked);
            });
        });
    },
    trs: function () {
        return grid.tb.find("tr");
    }
};

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
        sort: 1,
        refreshTime: '10'
    },
    init: function () {
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
                reportContent.MatchEODList = [];
                $("#timeSelections").html("All Period");
                $("#chkhour").get(0).checked = true;
                $("#ddlRefreshTime")[0].selected = true;
                reportContent.resetHiddenMatchs();
                reportContent.resetInstantParams();
                $("#leagueHidden").html('0');
                panelHeader.getLeagues($("#txtdate").val(), panelHeader.renderLeagues);
                reportContent.initInstantReport();
            }
        });

        $("#txtdate").datepicker("setDate", new Date(toDate));

        $("#runningMatch").click(function () {
            if (reportContent.params.EventStatus == 0)
                return;
            reportContent.resetHiddenMatchs();
            reportContent.params.EventStatus = 0;
            reportContent.params.MinTrans = 0;
            reportContent.initInstantReport();
        });

        $("#completeMatch").click(function () {
            if (reportContent.params.EventStatus == 1)
                return;
            reportContent.resetHiddenMatchs();
            reportContent.params.EventStatus = 1;
            reportContent.params.MinTrans = 0;
            reportContent.initInstantReport();
        });

        $("#btnHideDetail").click(function () {
            reportContent.hiddenMatchs = [];
            var trs = grid.trs();
            var len = trs.length;
            for (var i = 0; i < len; i++) {
                var tr = $(trs[i]);
                var chk = tr.find("td").find("input:checkbox");
                if (chk.length > 0 && !chk.get(0).checked) {
                    tr.addClass("hidden");
                    reportContent.hiddenMatchs.push($(chk.get(0)).attr("id").split('_')[1] + "__" + $(chk.get(0)).attr("bettype"));
                }
            }
            reportContent.reRenderOrder();
            if (reportContent.hiddenMatchs.length > 0) {
                if (trs.length == reportContent.hiddenMatchs.length) {
                    grid.tb.append('<tr nodata="true"><td class="c b" colspan="11">There is no data.</td></tr>');
                }
                $("#currDate").html("Now: " + getCurrentDateWithFormat());
                $("#matchsHidden").html(reportContent.hiddenMatchs.length);
            }
        });

        $("#btnShowAllDetail").click(function () {
            var trs = grid.tb.find(".hidden");
            var len = trs.length;
            if (len > 0) {
                grid.tb.find("tr[nodata]").remove();
                for (var i = 0; i < len; i++) {
                    var tr = $(trs[i]);
                    var chk = tr.find("td").find("input:checkbox");
                    tr.removeClass("hidden");
                    chk.get(0).checked = true;
                }
                reportContent.hiddenMatchs = [];
                $("#currDate").html("Now: " + getCurrentDateWithFormat());
                $("#chkInstantReport").get(0).checked = true;
                $("#matchsHidden").html("0");
                reportContent.reRenderOrder();
            }
        });

        $("#btnRefresh").click(function () {
            reportContent.refreshData(true);
        });

        $("#ddlRefreshTime").change(function () {
            panelHeader.filter.refreshTime = $("#ddlRefreshTime option:selected").val();
            clearInterval(panelHeader.timeout);
            if (panelHeader.filter.refreshTime != '0')
            { reportContent.refreshData(false); }
        });

        $("#ddlSort").change(function () {
            if (reportContent.dataView.length > 0) {
                var dvl = reportContent.dataView.length;
                for (var j = 0; j < dvl; j++) {
                    var vo = reportContent.dataView[j];
                    vo.IsNew = false;
                    vo.Home = vo.Home.replace('&gt;', '').replace('&lt;', '');
                    vo.Away = vo.Away.replace('&gt;', '').replace('&lt;', '');
                    vo.Over = vo.Over.replace('&gt;', '').replace('&lt;', '');
                    vo.Under = vo.Under.replace('&gt;', '').replace('&lt;', '');
                    vo.Bet1 = vo.Bet1.replace('&gt;', '').replace('&lt;', '');
                    vo.Betx = vo.Betx.replace('&gt;', '').replace('&lt;', '');
                    vo.Bet2 = vo.Bet2.replace('&gt;', '').replace('&lt;', '');
                }
                reportContent.renderInstantReportGrid(reportContent.sortData(reportContent.dataView));
            }
        });

        panelHeader.getLeagues($("#txtdate").val(), panelHeader.renderLeagues);
        reportContent.initInstantReport();
    },
    getLeagues: function (strDate, callBack) {
        $.ajax({
            type: "POST",
            url: "GetLeagueByDate",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"date":"' + strDate + '"}',
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
        data = jlinq.from(data).sort("Name").select();

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
                    minWidth: 250,
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
        $("#leagueHidden").html(reportContent.hiddenLeagues.length);
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
    getPunters: function (callBack) {
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
                    minWidth: 150,
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
        $("#accountHidden").html(reportContent.hiddenPunters.length);
        $('#ddlAccount').multiSelect('hideMe');
        reportContent.getInstantReportData(reportContent.firstLoadData);
    },
    isAllowGetData: function () {
        return (($('#ddlAccount').multiSelect('getCheckedItems').length > 0 || $('#ddlAccount').multiSelect('getUncheckItems').length == 0) && ($('#ddlLeague').multiSelect('getCheckedItems').length > 0 || $('#ddlLeague').multiSelect('getUncheckItems').length == 0));
    }
};

var reportContent = {
    isAllowGetData: true,
    isChangedData: false,
    isFirstLoad: true,
    dataModel: [],
    dataView: [],
    hiddenMatchs: [],
    hiddenLeagues: [],
    PunterList: [],
    LeagueList: [],
    hiddenPunters: [],
    timeout: null,
    highlightTime: 8000,
    getOEDIntervalId: 0,
    MatchEODList: [],
    MatchBettypeEODList: [],
    params: {
        KickOffDate: '',
        KickOffTime: 'all',
        LeagueIds: '',
        PunterIds: '',
        EventStatus: 0,
        MinTrans: 0,
        MaxTrans: 0,
        BetType: 0,
        MatchIds: '',
        Homeid: 0,
        Awayid: 0,
        EventDate: '',
        mintstamp: '0x',
        previouststamp: ''
    },
    sortData: function (data) {
        var sortType = $("#ddlSort option:selected").val();
        switch (sortType) {
            case "1":
                return jlinq.from(data).sort("MatchDT", "LeagueName").select();
            case "2":
                return jlinq.from(data).sort("LeagueName").select();
            default:
                return data;
        }
    },
    reRenderOrder: function () {
        var trs = grid.trs();
        trs.removeClass('evenrow');
        var len = trs.length;
        var count = 1;
        for (var i = 0; i < len; i++) {
            var tr = $(trs[i]);
            if (!tr.hasClass("hidden")) {
                if (count % 2 != 0) {
                    tr.addClass('evenrow');
                }
                tr.find("a[order]").html(count);
                count++;
            }
        }
        reportContent.setMarginTopEod();
    },
    drawNoData: function () {
        grid.me.removeClass("hidden");
        grid.tb.empty().html('<tr><td class="c b" colspan="11">There is no data.</td></tr>');
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
                url: "GetInstantReportUpdatedTransData",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"reportparams":' + JSON.stringify(reportContent.params) + '}',
                beforeSend: function (xhr) {
                    loader.main = true;
                    loader.beforeSend();
                    clearTimeout(panelHeader.timeout);
                    reportContent.resetNewPunter();
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
                url: "GetInstantReportData",
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
            reportContent.drawNoData();
        }
    },
    resetHiddenMatchs: function () {
        reportContent.hiddenMatchs = [];
        $("#chkInstantReport").get(0).checked = true;
        $("#matchsHidden").html("0");
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
    resizeFilterSectionHeight: function () {
        // Check if Width of filtersection is exceeded height
        var filterSectionDiv = $("#filterSection");
        if (filterSectionDiv.height() > 151) {
            $("#reportGrid").css("margin-top", "23px");
        }
        else {
            $("#reportGrid").css("margin-top", "6px");
        }
    },
    firstLoadData: function (data) {
        if (data.PunterList != null && reportContent.isFirstLoad) {
            $("#accountHidden").html('0');
            reportContent.PunterList = data.PunterList;
            panelHeader.renderPunters(reportContent.PunterList);
            reportContent.isFirstLoad = false;
        }

        reportContent.dataModel = data.HoursList;

        if (data.PreviousTStamp != null) {
            reportContent.params.previouststamp = data.PreviousTStamp;
        }

        if (data.LastTStamp != null) {
            reportContent.params.mintstamp = data.LastTStamp;
        }

        if (panelHeader.isFirstLoadLeague) {
            panelHeader.isFirstLoadLeague = false;
        }

        reportContent.resetHiddenMatchs();

        reportContent.renderBetSummary(reportContent.dataModel);
        reportContent.dataView = reportContent.mappingData(reportContent.dataModel);
        reportContent.renderInstantReportGrid(reportContent.sortData(reportContent.dataView));
        $("#reportInfo").removeClass("hidden");
        reportContent.resizeFilterSectionHeight();
    },
    refreshData: function (isManualAuto) {
        reportContent.getInstantReportUpdatedTransData(reportContent.autoRefresh, isManualAuto);
    },
    initInstantReport: function () {
        reportContent.params.KickOffDate = $("#txtdate").val();
        reportContent.getInstantReportData(reportContent.firstLoadData);
        reportContent.initInfo();
        //reportContent.gete
        clearInterval(reportContent.getOEDIntervalId);
        reportContent.getOEDIntervalId = setInterval(reportContent.getEODFromMatchIds, 7000);
    },
    cloneTran: function (tran, isHighlight) {
        var newtran = {
            MatchId: tran.MatchId,
            BetTeam: tran.BetTeam,
            BetType: tran.BetType,
            Color: tran.Color,
            PunterCode: tran.PunterId,
            PunterId: tran.PunterId,
            PunterName: tran.PunterName,
            TransDate: tran.TransDate,
            Stake: tran.Stake,
            TransId: tran.TransId,
            IsNew: isHighlight,
            MatchCode2: tran.MatchCode2,
            Eod: tran.Eod,
            Ehd: tran.Ehd
        };
        return newtran;
    },
    cloneMatch: function (match, isHighlight) {
        var newmatch = {
            MatchCode: match.MatchCode,
            BetType: match.BetType,
            IsNew: isHighlight,
            MatchDT: match.MatchDT,
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
    addNewMatch: function (tran, match, hour, isHighlight) {
        var newmatch = reportContent.cloneMatch(match, isHighlight);
        newmatch.Trans.push(reportContent.cloneTran(tran, true));
        hour.Matchs.push(newmatch);
        hour.TotalMatchs += 1;
        hour.TotalBets += 1;
    },
    appendTranToHour: function (tran, match, _hour, ishighlight) {
        var len = _hour.Matchs.length;
        if (len == 0) {
            reportContent.addNewMatch(tran, match, _hour, ishighlight);
            _hour.IsNew = ishighlight;
        }
        else {
            var isNewMatch = true;
            for (var i = 0; i < len; i++) {
                _match = _hour.Matchs[i];

                if (match.MatchCode == _match.MatchCode && match.BetType == _match.BetType) {
                    if (!reportContent.checkTransInList(tran.TransId, _match.Trans)) {
                        _match.Trans.push(reportContent.cloneTran(tran, true));
                        _match.IsNew = ishighlight;
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
                        if (_match.Trans.length == 0) {
                            _hour.TotalMatchs -= 1;
                            var mid = _match.MatchCode + "__" + _match.BetType;
                            var index = reportContent.hiddenMatchs.indexOf(mid);
                            if (index >= 0) {
                                reportContent.hiddenMatchs.splice(index, 1);
                            }
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
        if (data.LastTStamp == null) return;
        reportContent.isChangedData = false;

        reportContent.params.mintstamp = data.LastTStamp;
        reportContent.isChangedData = true;

        if (data.PreviousTStamp != null) {
            reportContent.params.previouststamp = data.PreviousTStamp;
        }

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
                        if (tran.StatusId == "0" || tran.StatusId == "1")//Append end Highlight
                        {
                            reportContent.appendTranToHour(tran, match, _hour, true);
                            //_hour.IsNew = true;
                        }
                        else {
                            reportContent.removeTranFromHour(tran, _hour);
                        }
                    }
                    else {
                        if (tran.StatusId == "111" || tran.StatusId == "112" || tran.StatusId == "113")//Append end Highlight
                        {
                            reportContent.appendTranToHour(tran, match, _hour, true);
                            _hour.IsNew = true;
                        }
                        else {
                            reportContent.removeTranFromHour(tran, _hour);
                        }
                    }
                }
            }
        }
        if (reportContent.isChangedData) {
            reportContent.renderBetSummary(reportContent.dataModel);
            reportContent.dataView = reportContent.mappingData(reportContent.dataModel);
            reportContent.renderInstantReportGrid(reportContent.sortData(reportContent.dataView));
            $("#matchsHidden").html(reportContent.hiddenMatchs.length);
            reportContent.isChangedData = false;

            //Remove Highlight rows
            reportContent.timeout = setTimeout(function () {
                $("#contentSection .newrow").removeClass("newrow");
                $("#tblHours .newrow").removeClass("newrow");
                grid.tb.find("span[newpunter]").each(function () {
                    $(this).html($(this).html().replace('&gt;', '').replace('&lt;', ''));
                });
            }, reportContent.highlightTime);
        }
        reportContent.resizeFilterSectionHeight();
    },
    resetNewPunter: function () {
        for (var i = 0; i < 24; i++) {
            var h = reportContent.dataModel[i];
            h.IsNew = false;
            if (h.Matchs != null) {
                var l = h.Matchs.length;
                for (var m = 0; m < l; m++) {
                    var match = h.Matchs[m];
                    match.IsNew = false;
                    var _l = match.Trans.length;
                    for (var t = 0; t < _l; t++) {
                        match.Trans[t].IsNew = false;
                    }
                }
            }
        }

        var dvl = reportContent.dataView.length;
        for (var j = 0; j < dvl; j++) {
            var vo = reportContent.dataView[j];
            vo.IsNew = false;
            vo.Home = vo.Home.replace('&gt;', '').replace('&lt;', '');
            vo.Away = vo.Away.replace('&gt;', '').replace('&lt;', '');
            vo.Over = vo.Over.replace('&gt;', '').replace('&lt;', '');
            vo.Under = vo.Under.replace('&gt;', '').replace('&lt;', '');
            vo.Bet1 = vo.Bet1.replace('&gt;', '').replace('&lt;', '');
            vo.Betx = vo.Betx.replace('&gt;', '').replace('&lt;', '');
            vo.Bet2 = vo.Bet2.replace('&gt;', '').replace('&lt;', '');
        }
    },
    renderBetSummary: function (rs) {
        var len = rs.length;
        var totalBets = 0;
        var totalMatch = 0;
        var Alltext = "[ALL]";
        if (reportContent.params.KickOffTime != 'all') {
            Alltext = "[Sel]";
        }
        var rowChk = '<tr><td class="c title col60"><input type="checkbox" ' + (reportContent.params.KickOffTime == 'all' ? 'checked="checked"' : '') + ' id="chkhour" onclick="reportContent.chkAllHourClick(this)" /></td>';
        var rowOk = '<tr><td class="c title"><a href="javascript:void(0);" onclick="reportContent.lnkSummaryOK();">[OK]</a></td>';
        var rowAll = '<tr><td class="c title"><a href="javascript:void(0);" id="lnkSummaryAll"  onclick="reportContent.lnkSummaryAll();">' + Alltext + '</a></td>';
        var rowDetail = '<tr><td class="c title"><a href="javascript:void(0);" id="lnkDetailAll" onclick="reportContent.lnkDetailAll(\'\',\'\',\'0\');">Det</a></td>';

        for (var i = 0; i < len; i++) {
            var row = rs[i];
            rowChk += '<td class="c ' + (row.IsNew ? ' newrow' : '') + '"><input id="chkhour_' + row.HourNo + '"  type="checkbox" class="betperhour" ' + ((reportContent.params.KickOffTime == 'all' || reportContent.params.KickOffTime.indexOf(row.HourNo) >= 0) ? 'checked="checked"' : '') + ' onclick="reportContent.betperhourChkClick(this)" /></td>';
            rowOk += '<td class="c ' + (row.IsNew ? ' newrow' : '') + '">' + row.HourNo + '</td>';
            rowAll += '<td class="c ' + (row.IsNew ? ' newrow' : '') + '"><span class="c ' + (row.TotalBets > 0 ? 'b' : '') + '"><a href="javascript:void(0);" onclick="reportContent.linkHourDetail(\'' + row.HourNo + '\')">(' + row.TotalBets + '/' + row.TotalMatchs + ')</a></span></td>';
            rowDetail += '<td class="c ' + (row.IsNew ? ' newrow' : '') + '"><a href="javascript:void(0);" onclick="reportContent.lnkDetailAll(\'' + row.HourNo + '\',\'\',\'0\');">Det</a></td>';
            totalBets += rs[i].TotalBets;
            totalMatch += rs[i].TotalMatchs;
        }

        rowChk += '<td class="c title col60">Total</td></tr>';
        rowOk += '<td class="c title">&nbsp;</td></tr>';
        rowAll += '<td class="c title"><a onclick="reportContent.lnkSummaryAll();" href="javascript:void(0);">' + totalBets + '/' + totalMatch + '</a></td><tr>';
        rowDetail += '<td class="c title"><a onclick="reportContent.lnkDetailAll(\'\',\'\',\'0\');" href="javascript:void(0);">Det</a></td></tr>';

        var betPerHourGrid = $("#tblHours");
        betPerHourGrid.empty().append(rowChk).append(rowOk).append(rowAll).append(rowDetail);
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
    renderInstantReportGrid: function (rs) {
        var arr = [];
        for (var i = 0; i < rs.length; i++) {
            var row = rs[i];
            var css = ((reportContent.hiddenMatchs.length > 0 && reportContent.hiddenMatchs.indexOf(row.Id + '__' + row.BetType) >= 0) ? ' hidden' : (row.IsNew ? ' newrow' : ''));
            if (i % 2 == 0) {
                css += ' evenrow';
            }
            arr.push(reportContent.renderRowReport(i + 1, row, css));
        }
        if (arr.length > 0) {
            grid.me.removeClass("hidden");
            grid.tb.empty().html(arr.join(''));
        }
        else {
            reportContent.drawNoData();
        }
        reportContent.reRenderOrder();
    },
    setMarginTopEod: function () {
        $("#reportGrid").find("div[eod]").each(function () {
            var parent = $($(this).parent());
            var lastSpanChild = $(this).parent().find("span:last");
            var lastSpanChildTop = $(lastSpanChild).position() == null ? 0 : $(lastSpanChild).position().top;
            var firstSpanChild = $(this).parent().find("span:first");
            var firstSpanChildTop = $(firstSpanChild).position() == null ? 0 : $(firstSpanChild).position().top;

            var parentHeight = $(this).parent().height();
            if ((parentHeight / 2) < (lastSpanChildTop - firstSpanChildTop + 5)) {
                parent.css('height', parentHeight + 30);
            }
            else if ((parentHeight / 2)) {

            }
        });
        $("#reportGrid").find("div[eod]").each(function () {
            var grandParent = $(this).parent().parent();
            var marginTop = $(this).parent().height() / 2;
            marginTop *= -1;
            if ($.browser.msie && $.browser.version.indexOf("7") >= 0) {
                marginTop += 5;
            }
            else {
                marginTop += 3;
            }

            var lastSpanChild = $(this).parent().find("span:last");
            var lastSpanChildTop = $(lastSpanChild).position() == null ? 0 : $(lastSpanChild).position().top;
            var firstSpanChild = $(this).parent().find("span:first");
            var firstSpanChildTop = $(firstSpanChild).position() == null ? 0 : $(firstSpanChild).position().top;
            marginTop += (lastSpanChildTop - firstSpanChildTop) / 2;

            $(this).css("margin-top", marginTop);
        });
    },
    chkclick: function (obj) {
        if (!$(obj).get(0).checked) {
            $("#chkInstantReport").get(0).checked = false;
        }
        else {
            var isAllCheck = true;
            grid.tb.find("input:checkbox").each(function () {
                if (!$(this).get(0).checked) {
                    isAllCheck = false;
                    return;
                }
            });
            $("#chkInstantReport").get(0).checked = isAllCheck;
        }
    },
    renderRowReport: function (num, row, css) {

        var html = '<tr class="' + css + '">'
                   + ' <td class="c"><input type="checkbox" class="instantreport" bettype="' + row.BetType + '" id="chkInstantReport_' + row.Id + '" checked="checked" onclick="reportContent.chkclick(this)" /></td>'
                   + ' <td class="c"><a order="true" href="javascript:void(0);" onclick="reportContent.lnkDetailAll(\'' + row.MatchDT.split(":")[0] + '\',\'' + row.Id + '\',\'' + (row.BetType == "7_8_15" ? '2' : '1') + '\');">' + num + '</a>'
                   + ' </td>'
                   + ' <td class="c">' + row.MatchDT + ' </td>'
                   + ' <td class="l"><span class="league">' + row.LeagueName + '</span><br><span class="b">' + row.HomeName + ' <span style="color:blue">vs</span> ' + row.AwayName + (row.BetType == "7_8_15" ? ' <span class="b">(1st)</span>' : ' <span class="b">(FT)</span>') + '</span>'
                   + ' </td>'
                   + ' <td class="l b" style="position:relative;z-index:-1;">' + (row.EODHome != null ? ("<div eod='true' class='divcontainseod" + (row.EODHome.EOD != "" ? "'" : (" " + row.EODHome.EODId + "' transid='" + row.EODHome.TransId + "'")) + " >" + (row.EODHome.EHD + " " + row.EODHome.EOD) + "</div>") : "") + row.Home + '</td>'
                   + ' <td class="l b" style="position:relative;z-index:-1;">' + (row.EODAway != null ? ("<div eod='true' class='divcontainseod" + (row.EODAway.EOD != "" ? "'" : (" " + row.EODAway.EODId + "' transid='" + row.EODAway.TransId + "'")) + " >" + (row.EODAway.EHD + " " + row.EODAway.EOD) + "</div>") : "") + row.Away + '</td>'
                   + ' <td class="l b" style="position:relative;z-index:-1;">' + (row.EODOver != null ? ("<div eod='true' class='divcontainseod" + (row.EODOver.EOD != "" ? "'" : (" " + row.EODOver.EODId + "' transid='" + row.EODOver.TransId + "'")) + " >" + (row.EODOver.EHD + " " + row.EODOver.EOD) + "</div>") : "") + row.Over + '</td>'
                   + ' <td class="l b" style="position:relative;z-index:-1;">' + (row.EODUnder != null ? ("<div eod='true' class='divcontainseod" + (row.EODUnder.EOD != "" ? "'" : (" " + row.EODUnder.EODId + "' transid='" + row.EODUnder.TransId + "'")) + " >" + (row.EODUnder.EHD + " " + row.EODUnder.EOD) + "</div>") : "") + row.Under + '</td>'
                   + ' <td class="l b" style="position:relative;z-index:-1;">' + (row.EODBet1 != null ? ("<div eod='true' class='divcontainseod" + (row.EODBet1.EOD != "" ? "'" : (" " + row.EODBet1.EODId + "' transid='" + row.EODBet1.TransId + "'")) + " >" + (row.EODBet1.EOD) + "</div>") : "") + row.Bet1 + '</td>'
                   + ' <td class="l b" style="position:relative;z-index:-1;">' + (row.EODBetx != null ? ("<div eod='true' class='divcontainseod" + (row.EODBetx.EOD != "" ? "'" : (" " + row.EODBetx.EODId + "' transid='" + row.EODBetx.TransId + "'")) + " >" + (row.EODBetx.EOD) + "</div>") : "") + row.Betx + '</td>'
                   + ' <td class="l b" style="position:relative;z-index:-1;">' + (row.EODBet2 != null ? ("<div eod='true' class='divcontainseod" + (row.EODBet2.EOD != "" ? "'" : (" " + row.EODBet2.EODId + "' transid='" + row.EODBet2.TransId + "'")) + " >" + (row.EODBet2.EOD) + "</div>") : "") + row.Bet2 + '</td>'
                + '</tr>';
        return html;
    },
    linkHourDetail: function (hour) {
        $("#timeSelections").html(hour + ":00");
        $("#chkhour").get(0).checked = false;
        $("#tblHours .betperhour").each(function () {
            $(this).get(0).checked = false;
        });
        $("#tblHours #chkhour_" + hour).get(0).checked = true;
        reportContent.resetHiddenMatchs();
        reportContent.params.KickOffTime = hour;
        reportContent.dataView = reportContent.mappingData(reportContent.dataModel);
        reportContent.renderInstantReportGrid(reportContent.sortData(reportContent.dataView));
    },
    lnkSummaryOK: function () {
        if (!$("#chkhour").get(0).checked) {
            $("#timeSelections").html("Selected Period");
        }
        else {
            $("#timeSelections").html("All Period");
        }
        reportContent.resetHiddenMatchs();
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

        reportContent.resetHiddenMatchs();
        reportContent.initInstantReport();
    },
    chkAllHourClick: function (obj) {
        $("#tblHours .betperhour").each(function () {
            $(this).get(0).checked = $(obj).get(0).checked;
        });
    },
    lnkDetailAll: function (hour, matchcode, bettype) {
        var isCheckNothing = false;
        if (hour == '') {
            if (!$("#chkhour").get(0).checked) {
                var listHours = "";
                $("#tblHours .betperhour").each(function () {
                    if ($(this).get(0).checked) {
                        listHours += ',' + $(this).attr("id").split("_")[1];
                    }
                });
                if (listHours == '') {
                    listHours = '';
                    isCheckNothing = true;
                }
                else {
                    listHours = listHours.substring(1, listHours.length);
                }
            }
            else {
                listHours = '';
            }
        }
        else {
            listHours = hour;
        }
        //Get matchids from match code
        var bt = bettype == 1 ? "1_3_5" : "7_8_15";
        var matchids = [];
        for (var i = 0; i < 24; i++) {
            var h = reportContent.dataModel[i];
            if (h.HourNo == hour) {
                if (h.Matchs != null) {
                    var _l = h.Matchs.length;
                    for (var _m = 0; _m < _l; _m++) {
                        var m = h.Matchs[_m];
                        if (m.MatchCode == matchcode && m.BetType == bt) {
                            for (var _t = 0; _t < m.Trans.length; _t++) {
                                if (matchids.indexOf(m.Trans[_t].MatchId) == -1) {
                                    matchids.push(m.Trans[_t].MatchId);
                                }
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
        if (matchids.length > 1) {
            matchcode = '';
        }
        // Check if Detail button is clicked but no hour was chosen
        if (!isCheckNothing) {
            var url = "InstantReportDetailPage?KickOffDate="
            + reportContent.params.KickOffDate
            + "&KickOffTime=" + listHours
            + "&LeagueIds=" + reportContent.params.LeagueIds
            + "&PunterIds=" + reportContent.params.PunterIds
            + "&EventStatus=" + reportContent.params.EventStatus
            + "&matchID=" + matchids.join(',')
            + "&matchCode=" + matchcode
            + "&bettype=" + bettype;

//             <input type="hidden" id="KickOffDateInput" name="KickOffDateInput" />
//            <input type="hidden" id="KickOffTimeInput" name="KickOffTimeInput" />
//            <input type="hidden" id="LeagueIdsInput" name="LeagueIdsInput" />
//            <input type="hidden" id="PunterIdsInput" name="PunterIdsInput" />
//            <input type="hidden" id="EventStatusInput" name="EventStatusInput" />
//            <input type="hidden" id="matchIDInput" name="matchIDInput" />
//            <input type="hidden" id="matchCodeInput" name="matchCodeInput" />
//            <input type="hidden" id="bettypeInput" name="bettypeInput" />
            $("#KickOffDateInput").val(reportContent.params.KickOffDate);
            $("#KickOffTimeInput").val(listHours);
            $("#LeagueIdsInput").val(reportContent.params.LeagueIds);
            $("#PunterIdsInput").val(reportContent.params.PunterIds);
            $("#EventStatusInput").val(reportContent.params.EventStatus);
            $("#matchIDInput").val(matchids.join(','));
            $("#matchCodeInput").val(matchcode);
            $("#bettypeInput").val(bettype);
            //Do #1105
            //window.open(url, "_blank", "toolbar=no, directories=no, location=no, status=no, menubar=no, fullscreen=no, resizable=yes, width=1230, height=1024, top=0, left=0");
            //window.open(url, "_blank");
            $("#sendQueryStringForm").submit();
        }
    },
    mappingData: function (hours) {
        var rs = [];
        var len = hours.length;
        for (var i = 0; i < len; i++) {
            var hour = hours[i];
            if (reportContent.params.KickOffTime == 'all' || reportContent.params.KickOffTime.indexOf(hour.HourNo) >= 0) {
                if (hour.Matchs != null) {
                    var len1 = hour.Matchs.length;
                    for (j = 0; j < len1; j++) {
                        var match = {};
                        var _match = hour.Matchs[j];
                        match.Id = _match.MatchCode;
                        match.BetType = _match.BetType;
                        match.MatchDT = _match.MatchDT;
                        match.LeagueName = _match.LeagueName;
                        match.HomeName = _match.HomeName;
                        match.AwayName = _match.AwayName;
                        match.IsNew = _match.IsNew;

                        if (match.BetType == "1_3_5") {
                            Handicap = "1";
                            OverUnder = "3";
                            Bet1x2 = "5";
                        }
                        else {
                            Handicap = "7";
                            OverUnder = "8";
                            Bet1x2 = "15";
                        }

                        match.EODHome = reportContent.getEOD(Handicap, BetHome, _match.Trans);
                        match.EODAway = reportContent.getEOD(Handicap, BetAway, _match.Trans);
                        match.EODOver = reportContent.getEOD(OverUnder, BetOver, _match.Trans);
                        match.EODUnder = reportContent.getEOD(OverUnder, BetUnder, _match.Trans);
                        match.EODBet1 = reportContent.getEOD(Bet1x2, Bet1, _match.Trans);
                        match.EODBetx = reportContent.getEOD(Bet1x2, Betx, _match.Trans);
                        match.EODBet2 = reportContent.getEOD(Bet1x2, Bet2, _match.Trans);

                        match.Home = reportContent.getPunterCode(Handicap, BetHome, _match);
                        match.Away = reportContent.getPunterCode(Handicap, BetAway, _match);
                        match.Over = reportContent.getPunterCode(OverUnder, BetOver, _match);
                        match.Under = reportContent.getPunterCode(OverUnder, BetUnder, _match);
                        match.Bet1 = reportContent.getPunterCode(Bet1x2, Bet1, _match);
                        match.Betx = reportContent.getPunterCode(Bet1x2, Betx, _match);
                        match.Bet2 = reportContent.getPunterCode(Bet1x2, Bet2, _match);

                        rs.push(match);
                    }
                }
            }
        }

        return rs;
    },
    getEOD: function (bettype, betteam, trans) {
        var len = trans.length;
        var tempBetType = 0;
        var _trans = [];
        for (var i = 0; i < len; i++) {
            var _tran = trans[i];
            if (_tran.BetType == bettype && _tran.BetTeam == betteam && _tran.MatchCode2.toLowerCase().indexOf("hedge") < 0) {
                //if (_tran.BetType == bettype && _tran.MatchCode2.toLowerCase().indexOf("hedge") < 0) {
                _trans.push(_tran);
                break;
            };
        }
        if (_trans.length > 0) {
            if (_trans[0].Eod == null) {
                return null;
            }
            var ehd = (bettype == "1" || bettype == "7") ? (parseFloat(_trans[0].Ehd) > 0 ? ("+" + _trans[0].Ehd) : _trans[0].Ehd) : _trans[0].Ehd;
            var eoDInfo = {
                MatchId: _trans[0].MatchId,
                TransId: _trans[0].TransId,
                EOD: _trans[0].Eod,
                EODId: _trans[0].MatchId + "_" + bettype,
                EHD: ehd
            };

            if (eoDInfo.EOD == "") {
                var exist = false;
                eoDInfo.EHD = "";
                for (var i = 0; i < reportContent.MatchEODList.length; i++) {
                    if (reportContent.MatchEODList[i].MatchId == eoDInfo.MatchId && reportContent.MatchEODList[i].Bettype == bettype) {
                        exist = true;
                    }
                }
                if (exist == false) {
                    reportContent.MatchEODList.push({
                        MatchId: eoDInfo.MatchId,
                        Bettype: bettype
                    });
                }
            }
            return eoDInfo;
        }
        return null;
    },
    getMatchIdOfOED: function (trans) {
        if (trans.length > 0 && trans[0] != null) {
            return trans[0].MatchId;
        }
        return "";
    },
    getTransId: function (trans) {
        if (trans.length > 0 && trans[0] != null) {
            return trans[0].TransId;
        }
        return "";
    },
    selectPunterByName: function (name, punters) {
        var len = punters.length;
        for (var i = 0; i < len; i++) {
            var _punter = punters[i];
            if (_punter.punterCode == name) {
                return _punter;
            };
        }
        return null;
    },
    selectPunterByBetTypeBetTeam: function (bettype, betteam, punters) {
        var len = punters.length;
        var _punters = [];
        for (var i = 0; i < len; i++) {
            var _punter = punters[i];
            if (_punter.BetType == bettype && _punter.BetTeam == betteam) {
                _punters.push(_punter);
            };
        }
        return _punters;
    },
    getPunterCode: function (bettype, betteam, match) {
        var result = '';
        var puntercode = reportContent.selectPunterByBetTypeBetTeam(bettype, betteam, match.Trans);
        var arrPunters = [];
        var l = puntercode.length;
        for (var i = 0; i < l; i++) {
            var punter = {
                IsNew: false,
                IsLimit: false,
                totalStake: 0,
                punterCode: '',
                PunterId: '',
                color: ''
            };

            //Check exist PunterCode
            var p = puntercode[i];
            var _punter = reportContent.selectPunterByName(p.PunterName, arrPunters);
            var totalStake = 0;

            if (_punter != null) {
                if (!_punter.IsLimit) {
                    _punter.totalStake += parseFloat(p.Stake.replace(/\,/g, ''));
                    //Get Default Max Stake for Handicap or OverUnder
                    var ___punter = reportContent.getFBValue(_punter.PunterId);
                    if (___punter != null) {
                        if (p.BetType == "1" || p.BetType == "7") {
                            totalStake = ___punter.AH;
                        }
                        else if (p.BetType == "5" || p.BetType == "15") {
                            totalStake = ___punter.FB1x2;
                        }
                        else {
                            totalStake = ___punter.OU;
                        }
                    }
                    _punter.IsLimit = totalStake == 0 ? false : (_punter.totalStake > totalStake ? true : false);
                }
                _punter.IsNew = false;
            }
            else {
                punter.PunterId = p.PunterId;
                punter.punterCode = p.PunterName;
                punter.color = p.Color;
                punter.IsNew = p.IsNew;
                punter.totalStake = parseFloat(p.Stake.replace(/\,/g, ''));
                var ___punter = reportContent.getFBValue(punter.PunterId);
                if (___punter != null) {
                    if (p.BetType == "1" || p.BetType == "7") {
                        totalStake = ___punter.AH;
                    }
                    else if (p.BetType == "5" || p.BetType == "15") {
                        totalStake = ___punter.FB1x2;
                    }
                    else {
                        totalStake = ___punter.OU;
                    }
                }

                punter.IsLimit = totalStake == 0 ? false : (punter.totalStake > totalStake ? true : false);
                arrPunters.push(punter);
            }
        }
        var l1 = arrPunters.length;
        for (var x = 0; x < l1; x++) {
            var p1 = arrPunters[x];
            var name = p1.punterCode;
            if (p1.IsLimit) name = "**" + name;
            if (p1.IsNew) name = "&lt;" + name + "&gt;";
            result += ', <span style="Color:' + p1.color + '" ' + (p1.IsNew ? ' newpunter="true"' : '') + '>' + name + '</span>';
        }
        return result.length > 0 ? result.substring(1, result.length) : '';
    },
    getFBValue: function (punterCode) {
        var punter = {};
        var len = reportContent.PunterList.length;
        for (var i = 0; i < len; i++) {
            var _punter = reportContent.PunterList[i];
            if (_punter.Id == punterCode) {
                punter.AH = parseFloat(_punter.fb_ah.replace(/\,/g, ''));
                punter.OU = parseFloat(_punter.fb_ou.replace(/\,/g, ''));
                punter.FB1x2 = parseFloat(_punter.fb_1x2.replace(/\,/g, ''));
                return punter;
            }
        }
        return punter;
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
    getEODFromMatchIds: function () {
        if (reportContent.MatchEODList.length > 0) {
            var tempMatchArray = [];
            for (var i = 0; i < reportContent.MatchEODList.length; i++) {
                tempMatchArray.push(reportContent.MatchEODList[i].MatchId);
            }
            var matchIds = tempMatchArray.join(',');

            $.ajax({
                type: "POST",
                url: "GetEHDAndEOD",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"matchIds":' + JSON.stringify(matchIds) + '}',
                success: function (rs) {
                    for (var i = 0; i < rs.length; i++) {
                        var matchEOD = rs[i];
                        var firstOdd = $('.' + matchEOD.matchid + '_' + matchEOD.bettype);
                        if (firstOdd.length > 0) {
                            $(firstOdd).each(function () {
                                var $this = $(this);
                                var transId = $this.attr('transid');
                                var ehd = (matchEOD.bettype == "5" || matchEOD.bettype == "15") ? "" : ((matchEOD.bettype == "1" || matchEOD.bettype == "7") ? (parseFloat(matchEOD.ehd) > 0 ? ("+" + matchEOD.ehd) : matchEOD.ehd) : matchEOD.ehd);
                                $this.text(ehd + ' ' + matchEOD.eod);
                                reportContent.removeMatchIdFromMatchEODList(matchEOD.matchid);
                                reportContent.updateOEDForTrans(transId, matchEOD.matchid, matchEOD.bettype, matchEOD.eod, matchEOD.ehd);
                            });
                        }
                    }
                }
            });
        }
    },
    removeMatchIdFromMatchEODList: function (matchId) {
        for (var i = 0; i < reportContent.MatchEODList.length; i++) {
            if (reportContent.MatchEODList[i].MatchId == matchId) {
                reportContent.MatchEODList.splice(i, 1);
            }
        }
    },
    updateOEDForTrans: function (transId, matchId, bettype, eod, ehd) {
        var isBreak = false;
        for (var i = 0; i < reportContent.dataModel.length; i++) {
            var hour = reportContent.dataModel[i];
            for (var j = 0; j < hour.Matchs.length; j++) {
                var match = hour.Matchs[j];
                for (var k = 0; k < match.Trans.length; k++) {
                    var tran = match.Trans[k];
                    if (tran.TransId == transId) {
                        tran.Eod = eod;
                        tran.Ehd = ehd;
                        isBreak = true;
                        break;
                    }
                }
                if (isBreak) break;
            }
            if (isBreak) break;
        }
    },
    resetInstantParams: function () {
        reportContent.isAllowGetData = true;
        reportContent.params.KickOffTime = 'all';
        reportContent.params.LeagueIds = '';
        reportContent.params.PunterIds = '';
        reportContent.params.MinTrans = 0;
        reportContent.dataModel = [];
        reportContent.dataView = [];
        reportContent.PunterList = [];
        reportContent.hiddenPunters = [];
        reportContent.LeagueList = [];
        reportContent.hiddenLeagues = [];
        panelHeader.isFirstLoadLeague = true;
        panelHeader.isFirstLoadMember = true;
        reportContent.isFirstLoad = true;
        $("#chkmember").get(0).checked = true;
        $("#tblMember input:checkbox").each(function () {
            $(this).get(0).checked = true;
        });
    }
};

$(function () {
    $('#btnToggle').click(function () {
        $("#filterSection").toggle("fast");
        if ($("#contentSection").css("padding-top") == "205px") {
            $("#contentSection").css("padding-top", "30px");
        } else {
            $("#contentSection").css("padding-top", "205px");
        }
    });
    panelHeader.init();
    grid.initGrid();
});