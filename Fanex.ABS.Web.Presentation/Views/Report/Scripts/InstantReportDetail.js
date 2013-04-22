var ird = {
    panel: {
        MatchDT: ""
    },
    grid: {
        width: 1060 + 36,
        height: 700,
        overInited: false,
        MinTrans: 0
    },
    hideAccountsPopup: {},
    utils: {}
};

ird.panel.init = function () {
    this.setTimeNow();
    this.bindRefreshTimer();
    $("#btnRefresh").click(function () {
        ird.grid.getData();
        ird.panel.setTimeNow();
    });

    $("#selectRefreshTime").change(function () {
        ird.panel.bindRefreshTimer();
        if ($(this).val() != "-1") {
            $("#spanHiddenCounter").html("0");
            ird.grid.getDataInit();
        }
    });

    //spanHide
    $("#spanHide").click(function () {
        ird.panel.hideMatchs();
    });

    this.fillAccountsList();

    this.readHideAccountsFromCookie();

    //spanSetHideAccounts
    $("#spanSetHideAccounts").click(function () {
        ird.panel.setHideAccounts();
    });

    //spanShowAll
    $("#spanShowAll").click(function () {
        ird.panel.showAll();
    });

    //selectAccounts
    $("#selectAccounts").change(function () {
        $("#spanHiddenCounter").html("0");
        ird.grid.getDataInit();
        ird.panel.setTimeNow();
    });

    ird.panel.set_lblRefreshTime();

    if (ird.panel.isHaveCookie()) {
        $("#spanSetHideAccounts").css("border", "1px dashed red");
    }
};

ird.panel.hideMatchs = function () {
    var count = 0;
    $(ird.grid.arrTrMatchIds).each(function () {
        var trm = $("#" + this.trmid);
        var checked = trm.find("input[type='checkbox']").get(0).checked;
        if (checked && trm.is(":visible")) return;
        trm.hide();
        count++;
        $(this.trtids).each(function () {
            $("#" + this.toString()).hide();
        });
    });
    $("#spanHiddenCounter").html(count);

    var haveOneVisible = false;
    $(ird.grid.arrTrMatchIds).each(function () {
        var trm = $("#" + this.trmid);
        if (trm.is(":visible")) haveOneVisible = true;
    });
    $("#cbxShowHideAll").get(0).checked = haveOneVisible;
    //$("#divMainGrid").reRenderScroller(ird.grid.width, ird.grid.height, true);
};

ird.grid.hideEmptyMatchs = function () {
    var arrmids = [];
    $(ird.grid.arrTrMatchIds).each(function () {
        var haveOneVisible = false;
        for (var i = 0; i < this.trtids.length; ++i) {
            var visible = $("#" + this.trtids[i]).is(":visible");
            if (visible) {
                haveOneVisible = true;
                break;
            }
        }
        if (!haveOneVisible) {
            if (this.trtids.length > 0)
                $("#" + this.trmid).hide();
            else {
                $("#" + this.trmid).remove();
                arrmids.push(this.trmid);
            }
        }
    });
    $(arrmids).each(function () {
        ird.grid.removeTreeNode(this.toString());
    });

    var count = 0;
    $(ird.grid.arrTrMatchIds).each(function () {
        var trm = $("#" + this.trmid);
        if (trm.is(":visible")) count++;
    });
    $("#cbxShowHideAll").get(0).checked = count != 0;
};

ird.panel.showAll = function () {
    $(ird.grid.arrTrMatchIds).each(function () {
        var trm = $("#" + this.trmid);
        var checbox = trm.find("input[type='checkbox']");
        if (checbox.get(0).checked && trm.is(":visible")) return;
        checbox.get(0).checked = true;
        trm.show();
        $(this.trtids).each(function () {
            var punterid = $("#" + this.toString()).attr("punterid");
            if (punterid == $("#selectAccounts").val()) $("#" + this.toString()).show();
            else if (ird.panel.isHideAccount(punterid)) $("#" + this.toString()).hide();
            else $("#" + this.toString()).show();
        });
    });
    $("#spanHiddenCounter").html("0");
    var count = 0;
    $(ird.grid.arrTrMatchIds).each(function () {
        var trm = $("#" + this.trmid);
        if (trm.is(":visible")) count++;
    });
    $("#cbxShowHideAll").get(0).checked = count != 0;
    ird.grid.hideEmptyMatchs();
    //$("#divMainGrid").removeClass("hidden").reRenderScroller(ird.grid.width, ird.grid.height, true);
};

ird.panel.set_lblRefreshTime = function () {
    //lblRefreshTime
    if ($("#hiddenKickOffTime").val() == "") {
        $("#lblRefreshTime").html(ird.dateStr);
    }
    else {
        $("#lblRefreshTime").html(ird.dateStr + " " + $("#hiddenKickOffTime").val() + ":00");
    }
};

ird.hideAccountsPopup.init = function () {
    //cbxAllSetHideAccounts
    $("#cbxAllSetHideAccounts").change(function () {
        var checked = this.checked;
        $("#tbodySetHideAccounts").find("input[type='checkbox']").each(function (index, element) {
            element.checked = checked;
        });
    });
};

ird.hideAccountsPopup.checkboxBodyChangeHandler = function (e) {
    var target = typeof e.target != "undefined" ? e.target : e.srcElement;
    if (target.checked) {
        var checkBoxs = $("#tbodySetHideAccounts").find("input[type='checkbox']");
        var checkedCount = 0;
        $(checkBoxs).each(function () {
            if (this.checked) checkedCount += 1;
        });
        if (checkedCount != checkBoxs.length) {
            $("#cbxAllSetHideAccounts").get(0).checked = false;
        }
        else {
            $("#cbxAllSetHideAccounts").get(0).checked = true;
        }
    }
    else {
        $("#cbxAllSetHideAccounts").get(0).checked = false;
    }
};

ird.panel.isHaveCookie = function () {
    var str = $.cookie("arrHideAccounts");
    if (str == null) return false;
    return true;
};

ird.panel.readHideAccountsFromCookie = function () {
    ird.panel.arrHideAccounts = [];
    var str = $.cookie("arrHideAccounts");
    if (str == null) return;
    var arr = str.split(',');
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i] == "") continue;
        if (isNaN(parseFloat(arr[i]))) continue;
        ird.panel.arrHideAccounts[ird.panel.arrHideAccounts.length] = parseInt(arr[i]);
    };
};

ird.panel.isHideAccount = function (punterid) {
    if (this.arrHideAccounts.length <= 0) return false;
    punterid = parseFloat(punterid);
    for (var i = 0; i < this.arrHideAccounts.length; ++i) {
        if (this.arrHideAccounts[i] == punterid) return true;
    }
    return false;
};

ird.panel.setHideAccounts = function () {
    if (typeof ird.panel.arrAccount == "undefined") return;

    var isHideAccount = function (punterid) {
        if (ird.panel.arrHideAccounts.length <= 0) return false;
        punterid = parseFloat(punterid);
        for (var i = 0; i < ird.panel.arrHideAccounts.length; ++i) {
            if (ird.panel.arrHideAccounts[i] == punterid) return true;
        }
    };

    $("#stSetHideAccounts").tmpl(ird.panel.arrAccount).appendTo($("#tbodySetHideAccounts").empty());
    var hasOneUnchecked = false;
    $("#tbodySetHideAccounts").find("input[type='checkbox']").each(function () {
        var punterid = parseInt($(this).attr("punterid"));
        if (isHideAccount(punterid)) {
            this.checked = false;
            hasOneUnchecked = true;
        }
    });
    if (hasOneUnchecked) {
        $("#cbxAllSetHideAccounts").get(0).checked = false;
    }
    else {
        $("#cbxAllSetHideAccounts").get(0).checked = true;
    }
    showPopup
    ({
        content: $("#divSetHideAccounts"),
        title: "Date: " + ird.dateStr,
        width: 200,
        height: 420,
        buttons: [{
            "text": "Update",
            callback: function (popuid, button) {
                $(button).wait();
                ird.panel.arrHideAccounts = [];
                $.cookie("arrHideAccounts", null);
                $("#tbodySetHideAccounts").find("input[type='checkbox']").each(function () {
                    if (this.checked) return;
                    var punterid = parseInt($(this).attr("punterid"));
                    ird.panel.arrHideAccounts.push(punterid);
                });
                if (ird.panel.arrHideAccounts.length > 0) {
                    $.cookie("arrHideAccounts", ird.panel.arrHideAccounts.join(','));
                }
                $("#spanHiddenCounter").html("0");
                ird.grid.getDataInit();
                $(button).unwait();
                closePopup(popuid);
            }
        }],
        multiple: false,
        dialog: true,
        onload: function () {
            $("#divSetHideAccountsGrid").removeClass("hidden").reRenderScroller(136, 300, true);
            ird.hideAccountsPopup.init();
        }
    });
};

ird.panel.fillAccountsList = function () {
    $.ajax({
        type: "POST",
        url: "GetPunterByColor",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"color":""}',
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            rs = jlinq.from(rs).sort("PunterCode").select();
            $(rs).each(function (index, element) {
                this.index = index + 1;
            });
            ird.panel.arrAccount = rs;

            var isHaveSelected = false;
            for (var i = 0; i < rs.length; ++i) {
                var selected = "";
                if (rs[i].Id == $("#hiddenPunterIds").val()) {
                    selected = "selected='selected'";
                    isHaveSelected = true;
                }
                $("#selectAccounts").append("<option " + selected + " value='" + rs[i].Id + "'>" + rs[i].PunterCode + "</option>");
            }
            if (!isHaveSelected) {
                $("#selectAccounts").prepend("<option value=''>ALL</option>");
                $("#selectAccounts").val('');
            }
            else {
                $("#selectAccounts").prepend("<option value=''>ALL</option>");
            }
        }
    });
};

ird.utils.showError = function (msg) {
    showMessage(msg, 1);
};

ird.panel.bindRefreshTimer = function () {
    if (typeof ird.panel.timerIdRefresh != "undefined") {
        clearInterval(ird.panel.timerIdRefresh);
    }
    var second = parseInt($("#selectRefreshTime").val());
    if (second == -1) return;
    ird.panel.timerIdRefresh = setInterval(function () {
        if (!ird.grid.overInited) return;
        ird.grid.getData();
        ird.panel.setTimeNow();
    }, second * 1000);
};

ird.panel.setTimeNow = function () {
    var now = new Date();
    $("#spanTimeNow").html(getCurrentDateWithFormat());
    $("#spanTimeNow").parent().show();
};

ird.grid.init = function () {
    //cbxShowHideAll
    $("#cbxShowHideAll").change(function () {
        var checked = this.checked;
        $(ird.grid.arrTrMatchIds).each(function () {
            var trm = $("#" + this.trmid);
            var checbox = trm.find("input[type='checkbox']");
            checbox.get(0).checked = checked;
        });
    });

    ird.grid.arrTrTranIdsNotify1 = [];
    ird.grid.arrTrTranIdsNotify2 = [];

    //get data
    this.getDataInit();
};

ird.grid.getDataInit = function () {
    ird.grid.overInited = false;
    var MatchId = $("#hiddenMatchID").val();

    var EventStatus = parseInt($("#hiddenEventStatus").val());
    if (isNaN(EventStatus)) EventStatus = 0;
    this.EventStatus = EventStatus;

    var bettype = 0;
    if (!isNaN(parseInt($("#hiddenBettype").val()))) bettype = parseInt($("#hiddenBettype").val());

    var punterIds = $("#hiddenPunterIds").val();
    if (!isNaN(parseInt($("#selectAccounts").val()))) punterIds = $("#selectAccounts").val();

    var reportContent = {
        KickOffDate: $("#hiddenKickOffDate").val(),
        KickOffTime: $("#hiddenKickOffTime").val(),
        LeagueIds: $("#hiddenLeagueIds").val(),
        PunterIds: punterIds,
        EventStatus: EventStatus,
        MatchIds: MatchId,
        Homeid: 0,
        Awayid: 0,
        EventDate: '',
        //MatchCode: $("#hiddenMatchCode").val(),
        BetType: bettype
    };
    if ($("#hiddenMatchCode").val() != '') {
        var arr = $("#hiddenMatchCode").val().split(',');
        reportContent.LeagueIds = arr[0];
        reportContent.Homeid = parseInt(arr[1]);
        reportContent.Awayid = parseInt(arr[2]);
        reportContent.EventDate = arr[3];
    }
    //alert(JSON.stringify(reportContent));
    $("#btnRefresh").wait();
    $.showOverlayer();
    $.ajax({
        type: "POST",
        url: "GetInstantReportDetailData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"reportparams":' + JSON.stringify(reportContent) + '}',
        success: function (rs) {
            ird.grid.arrTrMatchIds = [];
            ird.grid.arrTrTicketNullEHDEOD = [];
            if (typeof rs == "undefined" || rs == null) return;
            ird.grid.vm = rs;
            if (rs.LastTStamp == null) ird.grid.LastTStamp = "0x";
            else ird.grid.LastTStamp = rs.LastTStamp;
            if (ird.grid.MinTrans == 0 && !isNaN(parseInt(rs.MinTrans))) ird.grid.MinTrans = rs.MinTrans;
            ird.grid.renderHtml();
        },
        error: function (ex) {
            $("#btnRefresh").unwait();
        }
    });
};

ird.grid.getData = function () {
    var MatchId = $("#hiddenMatchID").val();

    var EventStatus = parseInt($("#hiddenEventStatus").val());
    if (isNaN(EventStatus)) EventStatus = 0;

    var bettype = 0;
    if (!isNaN(parseInt($("#hiddenBettype").val()))) bettype = parseInt($("#hiddenBettype").val());

    var punterIds = $("#hiddenPunterIds").val();
    if (!isNaN(parseInt($("#selectAccounts").val()))) punterIds = $("#selectAccounts").val();

    var reportContent = {
        KickOffDate: $("#hiddenKickOffDate").val(),
        KickOffTime: $("#hiddenKickOffTime").val(),
        LeagueIds: $("#hiddenLeagueIds").val(),
        PunterIds: punterIds,
        EventStatus: EventStatus,
        MatchIds: MatchId,
        Homeid: 0,
        Awayid: 0,
        EventDate: '',
        //MatchCode: $("#hiddenMatchCode").val(),
        mintstamp: ird.grid.LastTStamp,
        BetType: bettype
    };
    if ($("#hiddenMatchCode").val() != '') {
        var arr = $("#hiddenMatchCode").val().split(',');
        reportContent.LeagueIds = arr[0];
        reportContent.Homeid = parseInt(arr[1]);
        reportContent.Awayid = parseInt(arr[2]);
        reportContent.EventDate = arr[3];
    }
    $("#btnRefresh").wait();
    $.ajax({
        type: "POST",
        url: "GetInstantReportDetailUpdatedTransData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"reportparams":' + JSON.stringify(reportContent) + '}',
        success: function (rs) {
            $("#btnRefresh").unwait();
            if (typeof rs == "undefined" || rs == null) return;
            if (rs.HoursList == null) return;
            if (rs.HoursList.length <= 0) return;
            if (rs.LastTStamp == null || rs.LastTStamp == "") return;
            ird.grid.LastTStamp = rs.LastTStamp;
            ird.grid.notify(rs);
        },
        error: function (ex) {
            $("#btnRefresh").unwait();
        }
    });
};

ird.grid.notify = function (rs) {
    ird.grid.vm = rs;
    $("#tobdyMainGrid").find("tr[noinfo]").remove();
    ird.grid.arrQueue = [];
    var queue = new Queue();
    ird.grid.arrQueue.push(queue);

    for (var i = 0; i < rs.HoursList.length; ++i) {
        if (rs.HoursList[i].Matchs == null) continue;
        for (var j = 0; j < rs.HoursList[i].Matchs.length; ++j) {
            if (rs.HoursList[i].Matchs[j].Trans.length <= 0) continue;
            for (var k = 0; k < rs.HoursList[i].Matchs[j].Trans.length; ++k) {
                ird.grid.checkTicket(rs.HoursList[i].Matchs[j].Trans[k], rs.HoursList[i].Matchs[j]);
            }
            queue.receive(rs.HoursList[i].Matchs[j]);
        }
    }
    var doAppend = function (obj) {
        ird.grid.appendDomTicket(obj);
    };
    queue.process(doAppend, 1);
    var timerId = setInterval(function () {
        if (!ird.grid.isQueueFinishAll()) return;
        clearInterval(timerId);

        ird.grid.startGetEodEhd();

        ird.grid.removeHighLight(ird.grid.arrTrTranIdsNotify2);
        ird.grid.hideEmptyMatchs();
        //$("#divMainGrid").reRenderScroller(ird.grid.width, ird.grid.height, true);
        if (!isNaN(parseInt(ird.grid.vm.MaxTrans)) && parseInt(ird.grid.vm.MaxTrans) > parseInt(ird.grid.MinTrans)) ird.grid.MinTrans = ird.grid.vm.MaxTrans;
    }, 1);
};

ird.grid.checkTicket = function (Tran, match) {
    var remove = function (Tran) {
        //$("#" + ird.grid.gettid(Tran.TransId)).addClass("removerow");
        $("#" + ird.grid.gettid(Tran.TransId)).remove();
        ird.grid.removeLeafNode(ird.grid.getmid(match.MatchCode, match.BetType), ird.grid.gettid(Tran.TransId));
    };
    if (parseInt(this.EventStatus) == 0) {
        if (Tran.StatusId != 1 && Tran.StatusId != 0) {
            //remove all
            Tran.isRemove = true;
            remove(Tran);
        }
        else {
            //insert to dom
            var tr = $("#" + ird.grid.gettid(Tran.TransId));
            if (tr.length > 0) Tran.isExisted = true;
            else Tran.isExisted = false;
            tr.remove();
            Tran.isRemove = false;
        }
    }
    else if (parseInt(this.EventStatus) == 1) {
        if (Tran.StatusId != 111 && Tran.StatusId != 112 && Tran.StatusId != 113) {
            //remove all
            Tran.isRemove = true;
            remove(Tran);
        }
        else {
            //insert to dom
            var tr = $("#" + ird.grid.gettid(Tran.TransId));
            if (tr.length > 0) Tran.isExisted = true;
            else Tran.isExisted = false;
            tr.remove();
            Tran.isRemove = false;
        }
    }
};

ird.grid.getTrMatch = function (match) {
    var id = match.MatchCode + "" + match.BetType;
    for (var i = 0; i < this.arrTrMatchIds.length; ++i) {
        var length = this.arrTrMatchIds[i].trmid.length;
        if (this.arrTrMatchIds[i].trmid.substr(1, length - 1) == id) return $("#" + this.arrTrMatchIds[i].trmid);
    }
    return null;
};

ird.grid.getTreeNode = function (id) {
    if (id.indexOf("m") < 0) id = "m" + id;
    for (var i = 0; i < this.arrTrMatchIds.length; ++i) {
        var length = this.arrTrMatchIds[i].trmid.length;
        if (this.arrTrMatchIds[i].trmid == id) return this.arrTrMatchIds[i];
    }
    return null;
};

ird.grid.removeLeafNode = function (trmid, trtid) {
    var index = -1;
    for (var i = 0; i < this.arrTrMatchIds.length; ++i) {
        if (this.arrTrMatchIds[i].trmid == trmid) {
            for (var j = 0; j < this.arrTrMatchIds[i].trtids.length; ++j) {
                if (this.arrTrMatchIds[i].trtids[j] == trtid) {
                    index = j;
                    break;
                }
            }
            if (index != -1) this.arrTrMatchIds[i].trtids.splice(index, 1);
            break;
        }
    }
};

ird.grid.removeTreeNode = function (trmid) {
    var index = -1;
    for (var i = 0; i < this.arrTrMatchIds.length; ++i) {
        if (this.arrTrMatchIds[i].trmid == trmid) {
            index = i;
            break;
        }
    }
    if (index != -1) this.arrTrMatchIds.splice(index, 1);
};

ird.grid.appendDomTicket = function (match) {
    var tr = this.getTrMatch(match);
    if (tr == null) {
        ird.grid.renderMatch(match);
    }
    else {
        ird.grid.renderTicketsNotify(match, ird.grid.getTreeNode(match.MatchCode + "" + match.BetType), tr);
    }
};

ird.grid.renderTicketsNotify = function (match, treeNodeIds, tr) {
    var arrHtml = [];
    var queue = new Queue();
    ird.grid.arrQueue.push(queue);
    for (var i = 0; i < match.Trans.length; ++i) {
        if (match.Trans[i].isRemove) continue;
        queue.receive(match.Trans[i]);
    }
    var renderRow = function (row) {
        ird.grid.buildTran(row, match);
        var trmid = ird.grid.getmid(match.MatchCode, match.BetType);
        if ($("#" + trmid).is(":hidden")) {
            row.hide = "display:none";
        }
        if (!row.isExisted) {
            row.hightLight = "newrow";
            ird.grid.arrTrTranIdsNotify2.push(row.id);
        }
        else {
            row.hightLight = "";
        }
        treeNodeIds.trtids.push(row.id);
        var html = $("#stTicket").tmpl([row]);
        arrHtml.push(html.get(0));
        if (parseInt(row.BetType) != 5 && parseInt(row.BetType) != 15) {
            if (row.FirstOddHDP == null || row.FirstOddHDP == "") {
                ird.grid.arrTrTicketNullEHDEOD.push({
                    trtid: ird.grid.gettid(row.TransId),
                    trmid: ird.grid.getmid(match.MatchCode, match.BetType),
                    matchid: row.MatchId,
                    whatnull: "ehd",
                    BetType: row.BetType
                });
            }
        }
        if (row.FirstOddOU == null || row.FirstOddOU == "") {
            ird.grid.arrTrTicketNullEHDEOD.push({
                trtid: ird.grid.gettid(row.TransId),
                trmid: ird.grid.getmid(match.MatchCode, match.BetType),
                matchid: row.MatchId,
                whatnull: "eod",
                BetType: row.BetType
            });
        }
    };
    queue.process(renderRow, 1, function () {
        $(arrHtml).insertAfter(tr);
    });
};

ird.grid.renderTicketsNotifyNewMatch = function (match, arrHtml, treeNodeIds) {
    //var queue = new Queue();
    //ird.grid.arrQueue.push(queue);

    var renderRow = function (row) {
        ird.grid.buildTran(row, match);
        treeNodeIds.trtids.push(row.id);
        var html = $("#stTicket").tmpl([row]);
        arrHtml.push(html.get(0));
        if (parseInt(row.BetType) != 5 && parseInt(row.BetType) != 15) {
            if (row.FirstOddHDP == null || row.FirstOddHDP == "") {
                ird.grid.arrTrTicketNullEHDEOD.push({
                    trtid: ird.grid.gettid(row.TransId),
                    trmid: ird.grid.getmid(match.MatchCode, match.BetType),
                    matchid: row.MatchId,
                    whatnull: "ehd",
                    BetType: row.BetType
                });
            }
        }
        if (row.FirstOddOU == null || row.FirstOddOU == "") {
            ird.grid.arrTrTicketNullEHDEOD.push({
                trtid: ird.grid.gettid(row.TransId),
                trmid: ird.grid.getmid(match.MatchCode, match.BetType),
                matchid: row.MatchId,
                whatnull: "eod",
                BetType: row.BetType
            });
        }
    };
    match.Trans = jlinq.from(match.Trans).sort("-TransId").select();
    for (var i = 0; i < match.Trans.length; ++i) {
        if (match.Trans[i].isRemove) continue;
        //queue.receive(match.Trans[i]);
        renderRow(match.Trans[i]);
    }

    /*queue.process(renderRow, 1, function(){
    $("#tobdyMainGrid").append(arrHtml);
    });*/
    $("#tobdyMainGrid").prepend(arrHtml);
};

ird.grid.startGetEodEhd = function () {
    if (typeof ird.grid.arrTrTicketNullEHDEOD == "undefined" || ird.grid.arrTrTicketNullEHDEOD.length <= 0) return;
    var isfinish = true;
    var _doget = function () {
        var matchids = [];
        $(ird.grid.arrTrTicketNullEHDEOD).each(function () {
            matchids.push(this.matchid);
        });
        $.ajax({
            type: "POST",
            url: "GetEHDAndEOD",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"matchIds": "' + matchids.join(',') + '"}',
            success: function (rs) {
                if (rs == null || typeof rs == "undefined") return;
                $(rs).each(function () {
                    var eod = this.eod;
                    var ehd = this.ehd;

                    var indexs = [];
                    for (var i = 0; i < ird.grid.arrTrTicketNullEHDEOD.length; ++i) {
                        if (parseInt(this.matchid) != parseInt(ird.grid.arrTrTicketNullEHDEOD[i].matchid)
                        || parseInt(this.bettype) != parseInt(ird.grid.arrTrTicketNullEHDEOD[i].BetType)) continue;
                        if (ird.grid.arrTrTicketNullEHDEOD[i].whatnull == "ehd")
                            $("#" + ird.grid.arrTrTicketNullEHDEOD[i].trtid).find("div[ehd]").html(ehd);
                        else
                            $("#" + ird.grid.arrTrTicketNullEHDEOD[i].trtid).find("div[eod]").html(eod == 0 ? "" : eod);

                        if (eod != 0 && ehd != 0) {
                            indexs.push(i);
                        }
                    }
                    var length = indexs.length;
                    for (var j = 0; j < length; ++j) {
                        ird.grid.arrTrTicketNullEHDEOD.splice(indexs[j], 1);
                    }
                });
                isfinish = true;
            },
            error: function () {
                isfinish = true;
            }
        });
    };

    if (typeof this.timerId_startGetEodEhd != "undefined") {
        clearInterval(ird.grid.timerId_startGetEodEhd);
    }

    ird.grid.timerId_startGetEodEhd = setInterval(function () {
        if (!isfinish) return;

        if (ird.grid.arrTrTicketNullEHDEOD.length <= 0) {
            clearInterval(ird.grid.timerId_startGetEodEhd);
            return;
        };

        isfinish = false;
        _doget();
    }, 5000);
};

ird.grid.renderHtml = function () {
    ird.grid.arrQueue = [];
    $("#tobdyMainGrid").empty();
    var queue = new Queue();

    ird.grid.arrQueue.push(queue);
    var len = this.vm.HoursList.length;

    for (var i = 0; i < len; ++i) {
        if (this.vm.HoursList[i].Matchs == null) continue;
        var len1 = this.vm.HoursList[i].Matchs.length;
        for (var j = 0; j < len1; ++j) {
            queue.receive(this.vm.HoursList[i].Matchs[j]);
        }
    }

    var render = function (obj) {
        ird.grid.renderMatch(obj);
    };

    var finishCallback = function () {
        if ($("#tobdyMainGrid").find("tr:first").length <= 0) {
            $("#stNoInfo").tmpl([{ noinfo: "true"}]).appendTo($("#tobdyMainGrid"));
        }
        //-------------------
        ird.grid.overInited = true;

        $("#divMainGrid").removeClass("hidden"); //.reRenderScroller(ird.grid.width, ird.grid.height, true);

        if (!isNaN(parseInt(ird.grid.vm.MaxTrans)) && parseInt(ird.grid.vm.MaxTrans) > parseInt(ird.grid.MinTrans)) ird.grid.MinTrans = ird.grid.vm.MaxTrans;

        ird.grid.hideEmptyMatchs();

        //$("#divMainGrid").reRenderScroller(ird.grid.width, ird.grid.height, true);

        ird.grid.startGetEodEhd();

        $("#btnRefresh").unwait();
        $.hideOverlayer();

        ird.grid.removeHighLight(ird.grid.arrTrTranIdsNotify1);
    };

    queue.process(render, 1);

    var timerId = setInterval(function () {
        if (!ird.grid.isQueueFinishAll()) return;
        clearInterval(timerId);
        finishCallback();
    }, 1);
};

ird.grid.removeHighLight = function (arr) {
    var timerId = setTimeout(function () {
        clearTimeout(timerId);
        while (arr.length > 0) {
            var id = arr.pop();
            $("#" + id).removeClass("newrow");
        }
    }, 8 * 1000);
};

ird.grid.isQueueFinishAll = function () {
    if (typeof this.arrQueue == "undefined") return true;
    for (var i = 0; i < this.arrQueue.length; ++i) {
        if (!this.arrQueue[i].finish) return false;
    }
    return true;
};

ird.grid.checkboxShowHideEvent = function (e) {
    var target = typeof e.target != "undefined" ? e.target : e.srcElement;
    if (target.checked) {
        var arrCheckBoxs = [];
        $(ird.grid.arrTrMatchIds).each(function () {
            arrCheckBoxs.push($("#" + this.trmid).find("input[type='checkbox']").get(0));
        });
        var checkedCount = 0;
        $(arrCheckBoxs).each(function () {
            if (this.checked) checkedCount += 1;
        });
        if (checkedCount != arrCheckBoxs.length) {
            $("#cbxShowHideAll").get(0).checked = false;
        }
        else {
            $("#cbxShowHideAll").get(0).checked = true;
        }
    }
    else {
        $("#cbxShowHideAll").get(0).checked = false;
    }
};

ird.grid.renderMatch = function (match) {
    var arrHtml = [];
    match.id = this.getmid(match.MatchCode, match.BetType);
    var treeNodeIds = {
        trmid: match.id,
        trtids: []
    };
    ird.grid.arrTrMatchIds.push(treeNodeIds);
    this.renderMatchRow(match, arrHtml);
    this.renderTicketsNotifyNewMatch(match, arrHtml, treeNodeIds);
};

ird.grid.getmid = function (matchid, BetType) {
    return "m" + matchid + "" + BetType;
};

ird.grid.gettid = function (tranid) {
    return "t" + tranid;
};

ird.grid.renderMatchRow = function (match, arrHtml) {
    if (ird.panel.MatchDT == "") {
        ird.panel.MatchDT = match.MatchDT;
    }
    var EventStatus = parseInt($("#hiddenEventStatus").val());

    //calculate score
    if (EventStatus == 0) { //running
        match.FinalHomeScore = "";
        match.FinalAwayScore = "";
    }
    else { //completed
        if (match.Trans != null && match.Trans.length > 0) {
            var ticket = match.Trans[0];
            match.FinalHomeScore = ticket.FinalHomeScore;
            match.FinalAwayScore = ticket.FinalAwayScore;
        }
        else {
            match.FinalHomeScore = "";
            match.FinalAwayScore = "";
        }
    }

    //render

    var html = $("#stMatch").tmpl(match);

    arrHtml.push(html.get(0));
};

ird.grid.renderTickets = function (match, arrHtml, treeNodeIds) {
    //var queue = new Queue();
    //ird.grid.arrQueue.push(queue);

    var renderRow = function (row) {
        ird.grid.buildTran(row, match);
        treeNodeIds.trtids.push(row.id);
        var html = $("#stTicket").tmpl([row]);
        arrHtml.push(html.get(0));
        if (parseInt(row.BetType) != 5 && parseInt(row.BetType) != 15) {
            if (row.FirstOddHDP == null || row.FirstOddHDP == "") {
                ird.grid.arrTrTicketNullEHDEOD.push({
                    trtid: ird.grid.gettid(row.TransId),
                    trmid: ird.grid.getmid(match.MatchCode, match.BetType),
                    matchid: row.MatchId,
                    whatnull: "ehd",
                    BetType: row.BetType
                });
            }
        }
        if (row.FirstOddOU == null || row.FirstOddOU == "") {
            ird.grid.arrTrTicketNullEHDEOD.push({
                trtid: ird.grid.gettid(row.TransId),
                trmid: ird.grid.getmid(match.MatchCode, match.BetType),
                matchid: row.MatchId,
                whatnull: "eod",
                BetType: row.BetType
            });
        }
    };
    match.Trans = jlinq.from(match.Trans).sort("-TransId").select();
    for (var i = 0; i < match.Trans.length; ++i) {
        if (match.Trans[i].isRemove) continue;
        //queue.receive(match.Trans[i]);
        renderRow(match.Trans[i]);
    }

    /*queue.process(renderRow, 1, function(){
    $("#tobdyMainGrid").append(arrHtml);
    });*/
    $("#tobdyMainGrid").append(arrHtml);
};

ird.grid.buildTran = function (Tran, match) {
    var transId = parseFloat(Tran.TransId);
    Tran.id = this.gettid(Tran.TransId);
    var PreviousTStamp = this.vm.PreviousTStamp == null ? 0 : parseInt(this.vm.PreviousTStamp, 16);
    if (parseInt(Tran.TStamp, 16) > PreviousTStamp && !this.vm.IsOverTime) {
        Tran.hightLight = "newrow";
        if (!ird.grid.overInited) ird.grid.arrTrTranIdsNotify1.push(Tran.id);
        else ird.grid.arrTrTranIdsNotify2.push(Tran.id);
    }
    else {
        Tran.hightLight = "";
    }

    if (isNaN(parseFloat($("#selectAccounts").val()))) {
        if (ird.panel.isHideAccount(Tran.PunterId)) {
            Tran.hide = "display:none";
        }
        else {
            Tran.hide = "";
        }
    }
    else {
        if (parseFloat($("#selectAccounts").val()) != Tran.PunterId) {
            Tran.hide = "display:none";
        }
        else {
            Tran.hide = "";
        }
    }

    Tran.HomeName = match.HomeName;
    Tran.AwayName = match.AwayName;

    Tran._Hdp = parseFloat(Tran.Hdp.replace(/,/g, ''));
    Tran._Winlost = parseFloat(Tran.Winlost.replace(/,/g, ''));

    if (Tran.BetType == "1" || Tran.BetType == "7") {
        Tran.ColorChoice = "style='color:#006600'";
        if (Tran.BetTeam == "h") {
            Tran.TeamPick = Tran.HomeName;
        }
        else {
            Tran.TeamPick = Tran.AwayName;
        }
    }
    else if (Tran.BetType == "3" || Tran.BetType == "8") {
        Tran.ColorChoice = "";
        if (Tran.BetTeam == "h") {
            Tran.TeamPick = "Over";
        }
        else {
            Tran.TeamPick = "Under";
        }
    }
    else {
        Tran.ColorChoice = "";
        Tran.TeamPick = "";
    }

    var _date = Tran.TransDate;
    Tran.TransDateFormated = "<span>{0}</span><span style='margin-left:2px;color:#00009D; font-weight:bold'>{1}</span>";
    Tran.TransDateFormated = Tran.TransDateFormated.replace("{0}", _date.split(' ')[0]);
    Tran.TransDateFormated = Tran.TransDateFormated.replace("{1}", _date.split(' ')[1]);
};

ird.grid.hideOne = function (e) {
    var target = typeof e.target != "undefined" ? e.target : e.srcElement;
    var trm = $(target).parents("tr:first");
    trm.hide();
    trm.find("input[type='checkbox']").get(0).checked = false;
    var treeNode = ird.grid.getTreeNode(trm.attr("id"));
    $(treeNode.trtids).each(function () {
        $("#" + this.toString()).hide();
    });
    //$("#divMainGrid").reRenderScroller(ird.grid.width, ird.grid.height, true);
    var count = parseInt($("#spanHiddenCounter").html()) + 1;
    $("#spanHiddenCounter").html(count);
    if (count == ird.grid.arrTrMatchIds.length) $("#cbxShowHideAll").get(0).checked = false;
    else $("#cbxShowHideAll").get(0).checked = true;
};

ird.grid.editRemark = function (e, TransId) {
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
                if (!ird.utils.remarkIsValid($("#txtRemark").val())) {
                    $("#divMsgRemark").html("Remark is invalid!").addClass("error").show();
                    return;
                }
                ird.grid.saveRemark(popuid, button, target, TransId);
            }
        }],
        multiple: false, dialog: true
    });
};

ird.grid.saveRemark = function (popuid, button, target, TransId) {
    $(button).wait();
    $.ajax({
        type: "POST",
        url: "UpdateRemark",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"transid": ' + TransId + ', "remark":"' + $("#txtRemark").val() + '"}',
        success: function (rs) {
            if (typeof rs != "undefined" && rs == null && rs != "") {
                ird.utils.showError(rs);
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
};

ird.init = function () {
    this.date = new Date($("#hiddenKickOffDate").val());
    this.dateStr = (this.date.getMonth() + 1) + "/" + this.date.getDate() + "/" + this.date.getFullYear();
    this.dateHourStr = (this.date.getMonth() + 1) + "/" + this.date.getDate() + "/" + this.date.getFullYear()
        + this.date.getHours() + ":" + this.date.getMinutes() + ":" + this.date.getSeconds();
    this.panel.init();
    this.grid.init();
};

ird.utils.remarkIsValid = function (str) {
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
};

$(document).ready(function () {
    ird.init();
    var ua = $.browser;
    var paddingtop = "97px";
    if (ua.mozilla && parseInt(ua.version.split('.')[0]) < 10) {
        $("#contentSection").css("padding-top", "105px");
        paddingtop = "105px";
    }

    $('#btnToggle').click(function () {
        $("#filterSection").toggle("fast");
        if ($("#contentSection").css("padding-top") == paddingtop) {
            $("#contentSection").css("padding-top", "31px");
        } else {
            $("#contentSection").css("padding-top", paddingtop);
        }
    });
});