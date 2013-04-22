$(document).ready(function () {

    var up = {
        FuncIds: [],
        ABDAllFuncIds: []
    };

    up.showError = function (msg) {
        showMessage(msg, 1);
    };

    up.showSuccess = function (msg) {
        showMessage(msg, 0);
    };

    up.init = function () {
        this.getData();
        this.initSearch();
        this.initSort();
    };

    up.initSort = function () {
        //divUserNameHeader
        $("#divUserNameHeader").css("cursor", "pointer").attr("title", "sort by username");
        $("#divUserNameHeader").click(function () {
            if (typeof this.order == "undefined") {
                this.order = -1;
                jlinq.from(up.vm).sort("-UserName").select();
            }
            else {
                if (this.order == 1) {
                    jlinq.from(up.vm).sort("-UserName").select();
                    this.order = -1;
                }
                else {
                    jlinq.from(up.vm).sort("UserName").select();
                    this.order = 1;
                }
            }
            up.bindData(up.vm);
        });
    };

    up.initSearch = function () {
        var search = function (val) {
            var rows = [];
            if (val == "") {
                rows = up.vm;
            }
            else {
                rows = jlinq.from(up.vm).contains("UserName", val).select();
            }
            up.bindData(rows);
        };
        //tbxUserName
        $("#tbxUserName").keyup(function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) return true;
            else if (e.keyCode == 13) {
                search($(this).val());
            }
            else {
                var rows = [];
                if ($(this).val() != "") {
                    rows = jlinq.from(up.vm).contains("UserName", $(this).val()).select();
                    $(this).autoComplete(rows, "UserName");
                }
            }
        })
    .val("Search").css("font-style", "italic")
    .focus(function () {
        if ($(this).val().indexOf("Search") >= 0) {
            $(this).val("");
        }
    })
    .focusout(function () {
        if ($(this).val() == "") {
            $(this).val("Search").css("font-style", "italic");
        }
    });

        //btnSearch
        $("#btnSearch").click(function () {
            $(this).wait();
            var value = "";
            if ($("#tbxUserName").val().indexOf("Search") < 0) {
                value = $("#tbxUserName").val();
            }
            search(value);
            $(this).unwait();
        });
    };

    up.getData = function () {
        var groupId = parseInt($("#hABDGroupID").val());
        $.ajax({
            type: "POST",
            url: "Services/UserControlService.svc/GetAdminsByGroupId",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"groupId":' + groupId + '}',
            success: function (rs) {
                if (typeof rs != "undefined") {
                    up.vm = rs;
                    up.bindData(rs);
                }
            }
        , error: function (e) {
            up.showError(e.toString());
        }
        });
    };

    up.bindData = function (vm) {
        $(vm).each(function (index, element) { element.index = index + 1; });
        $("#scriptTemplate").tmpl(vm).appendTo($("#tbodyMemList").empty());
        $("#tbodyMemList").find("tr").each(function () {
            $(this).mouseover(function () {
                $(this).addClass("mouseon");
            })
        .mouseout(function () {
            $(this).removeClass("mouseon");
        });
        });
        if (vm.length <= 0) {
            $("#scriptTemplate2").tmpl([{ "noinfo": true}]).appendTo($("#tbodyMemList").empty());
        }
        $("#userGrid").removeClass("hidden").reRenderScroller(412, 500, true);

        //bind policy event
        $("#tbodyMemList").find("div[policy]").click(function () {
            var hUserId = $(this).parent().find("input[userid]");
            var userName = $(this).parents("tr:first").find("input[type='hidden'][username]").val();
            up.showUserPolicy(parseInt($(hUserId).val()), userName);
        });
    };

    up.showUserPolicy = function (userId, username) {
        $.ajax({
            type: "POST",
            url: "Services/UserControlService.svc/GetUserPolicyList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"userId": ' + userId + '}',
            success: function (rs) {
                if (typeof rs == "string" && rs != "") {
                    up.showError(rs);
                }
                else {
                    showPopup
                ({
                    content: $("#policyGridSection"),
                    title: "Account: " + username,
                    width: 839,
                    height: 430,
                    buttons: [{
                        "text": "Update",
                        callback: function (popuid, button) {
                            $(button).wait();
                            up.updateUserPolicy(userId, popuid);
                        }
                    }],
                    multiple: false, dialog: true
                });
                    up.bindDataPolicy(rs);
                }
            }
        , error: function (e) {
        }
        });
    };

    up.getChangedData = function () {
        up.FuncIds = [];
        $("#tbodyUserPol").find("tr").each(function () {
            var cbxRead = $(this).find("input[cbxRead]");
            var cbxHost = $(this).find("input[cbxHost]");
            var funcID = $(this).find("input[funcid]").val();
            if (!cbxRead.get(0).checked && !cbxHost.get(0).checked) return;
            if (cbxRead.get(0).checked && cbxHost.get(0).checked) {
                up.FuncIds[up.FuncIds.length] = funcID + "," + 3;
            }
            else if (cbxRead.get(0).checked) {
                up.FuncIds[up.FuncIds.length] = funcID + "," + 1;
            }
            else if (cbxHost.get(0).checked) {
                up.FuncIds[up.FuncIds.length] = funcID + "," + 2;
            }
        });
        for (var i = 0; i < up.ABDAllFuncIds.length; ++i) {
            if (!this.isExisted(up.ABDAllFuncIds[i])) {
                up.FuncIds[up.FuncIds.length] = up.ABDAllFuncIds[i] + "," + 0;
            }
        }
        return up.FuncIds.join(";");
    };

    up.isExisted = function (id) {
        for (var i = 0; i < up.FuncIds.length; ++i) {
            if (parseInt(up.FuncIds[i].split(',')[0]) == id) return true;
        }
        return false;
    };

    up.updateUserPolicy = function (custId, popuid) {
        var memberPolicies = this.getChangedData();
        var userId = parseInt($("#hUserID").val());
        $.ajax({
            type: "POST",
            url: "Services/UserControlService.svc/UpdateAdminPolicy",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"memberPolicies":"' + memberPolicies + '", "userID": ' + userId + ', "custID": ' + custId + '}',
            success: function (rs) {
                if (typeof rs == "string" && rs != "") {
                    up.showError(rs);
                }
                else {
                    up.showSuccess("Update role policy successfully!");
                }
                closePopup(popuid);
            }
        , error: function (e) {
            closePopup(popuid);
        }
        });
    };

    up.bindDataPolicy = function (table) {
        up.ABDAllFuncIds = [];
        var width = 775;
        var height = 343;
        $("#scriptTempaltePolicy").tmpl(this.buildTableTree(table)).appendTo($("#tbodyUserPol").empty());
        $("#tbodyUserPol").find("tr").each(function () {
            var hiddenLevel = $(this).find("input[level]");
            var hTotalSub = $(this).find("input[TotalSub]");
            var spanIcon = $(this).find("span[icon]");
            var spanFuncName = $(this).find("span[funcname]");
            if (parseInt($(hTotalSub).val()) != 0) {
                $(spanFuncName).css("font-weight", "bold");
            }
            up.buildLevelPadding(spanIcon, $(hiddenLevel).val())
        });
        $("#policyGrid").removeClass("hidden").reRenderScroller(width, height, true);
        up.initGridUserPolEvent();
    };

    up.initGridUserPolEvent = function () {
        var width = 775;
        var height = 343;
        $("#tbodyUserPol").find("tr").each(function () {
            $(this).mouseover(function () {
                $(this).addClass("mouseon");
            })
        .mouseout(function () {
            $(this).removeClass("mouseon");
        });
        });

        //init expand , collapse tree
        $("#tbodyUserPol").find("tr span[icon]").click(function () {
            var tr = $(this).parents("tr:first");
            var level = parseInt($(tr).attr("level"));
            if ($(this).hasClass("tree-expanded")) {
                $(this).removeClass("tree-expanded").addClass("tree-expand");
                while (
                parseInt($(tr).next("tr").attr("level")) > level
                ) {
                    tr = $(tr).next("tr");
                    //$(tr).hide();
                    $(tr).fadeOut(500, function () {
                        $("#policyGrid").reRenderScroller(width, height, true);
                    });
                }
            }
            else {
                $(this).removeClass("tree-expand").addClass("tree-expanded");
                while (
                parseInt($(tr).next("tr").attr("level")) > level
                ) {
                    tr = $(tr).next("tr");
                    var spanIcon = $(tr).find("span[icon]");
                    if ($(spanIcon).hasClass("tree-expand")) {
                        $(spanIcon).removeClass("tree-expand").addClass("tree-expanded");
                    }
                    $(tr).show();
                }
                $("#policyGrid").reRenderScroller(width, height, true);
            }
        });

        //init handler for checkbox's click event
        $("#tbodyUserPol").find("input[type='checkbox']").each(function () {
            $(this).change(function () {
                var cbx = this;
                if (this.checked) {
                    var tr = $(this).parents("tr:first");
                    if ($(this).attr("cbxHost") == "true") {
                        $(tr).find("input[cbxRead]").get(0).checked = this.checked;
                    }
                    //all parents will be checked
                    if ($(tr).attr("parentID") != "0") {
                        var parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(tr).attr("parentID") + "']");
                        if ($(this).attr("cbxRead") == "true") {
                            $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                        }
                        else {
                            $(parentFunc_tr).find("input[cbxHost]").get(0).checked = true;
                            $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                        }
                        parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                        while (parentFunc_tr.length > 0) {
                            if ($(this).attr("cbxRead") == "true") {
                                $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                            }
                            else {
                                $(parentFunc_tr).find("input[cbxHost]").get(0).checked = true;
                                $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                            }
                            parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                        }
                    }
                    //all childs will be checked
                    if ($(tr).attr("TotalSub") != "0") {
                        var childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(tr).attr("_id") + "']");
                        $(childFunc_tr).each(function () {
                            if ($(cbx).attr("cbxRead") == "true") {
                                $(this).find("input[cbxRead]").get(0).checked = true;
                            }
                            else {
                                $(this).find("input[cbxHost]").get(0).checked = true;
                                $(this).find("input[cbxRead]").get(0).checked = true;
                            }
                        });
                        $(childFunc_tr).each(function () {
                            childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(this).attr("_id") + "']");
                            while (childFunc_tr.length > 0) {
                                $(childFunc_tr).each(function () {
                                    if ($(cbx).attr("cbxRead") == "true") {
                                        $(this).find("input[cbxRead]").get(0).checked = true;
                                    }
                                    else {
                                        $(this).find("input[cbxHost]").get(0).checked = true;
                                        $(this).find("input[cbxRead]").get(0).checked = true;
                                    }
                                });
                                childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(childFunc_tr).attr("_id") + "']");
                            }
                        });
                    }
                }
                else {
                    var tr = $(this).parents("tr:first");
                    //all parents will be un-check

                    //------------------------------------------------
                    //section 1
                    //find all tr which have same level and same parent
                    if (!up.haveOneCheckedInSameLevelAndParent(cbx, tr)) {
                        if ($(tr).attr("parentID") != "0") {
                            var parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(tr).attr("parentID") + "']");
                            if ($(this).attr("cbxRead") == "true") {
                                $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                            }
                            else {
                                $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                            }
                            if (!up.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                                parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                                while (parentFunc_tr.length > 0) {
                                    if ($(this).attr("cbxRead") == "true") {
                                        $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                                    }
                                    else {
                                        $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                                    }
                                    parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                                    if (parentFunc_tr.length < 0 || up.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    //--end
                    //------------------------------------------------

                    //------------------------------------------------
                    //section 2
                    //if not read, then must not host
                    up.uncheckedHost($(tr).find("input[cbxHost]"));
                    //------------------------------------------------

                    //all childs will be checked
                    if ($(tr).attr("TotalSub") != "0") {
                        var childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(tr).attr("_id") + "']");
                        $(childFunc_tr).each(function () {
                            if ($(cbx).attr("cbxRead") == "true") {
                                $(this).find("input[cbxRead]").get(0).checked = false;
                            }
                            else {
                                $(this).find("input[cbxHost]").get(0).checked = false;
                            }
                        });
                        $(childFunc_tr).each(function () {
                            childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(this).attr("_id") + "']");
                            while (childFunc_tr.length > 0) {
                                $(childFunc_tr).each(function () {
                                    if ($(cbx).attr("cbxRead") == "true") {
                                        $(this).find("input[cbxRead]").get(0).checked = false;
                                    }
                                    else {
                                        $(this).find("input[cbxHost]").get(0).checked = false;
                                    }
                                });
                                childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(childFunc_tr).attr("_id") + "']");
                            }
                        });
                    }
                }
            });
        });
    };

    up.haveOneCheckedInSameLevelAndParent = function (cbx, tr) {
        var trs_same = $("#tbodyUserPol").find("tr[parentID='" + $(tr).attr("parentID") + "']");
        var isHaveOneChecked = false;
        $(trs_same).each(function () {
            if ($(cbx).attr("cbxRead") == "true") {
                if ($(this).find("input[cbxRead]").get(0).checked == true) {
                    isHaveOneChecked = true;
                }
            }
            else {
                if ($(this).find("input[cbxHost]").get(0).checked == true) {
                    isHaveOneChecked = true;
                }
            }
        });
        return isHaveOneChecked;
    };

    up.uncheckedHost = function (cbx) {
        $(cbx).get(0).checked = false;
        var tr = $(cbx).parents("tr:first");
        //all parents will be un-check

        //------------------------------------------------
        //section 1
        //find all tr which have same level and same parent
        if (!up.haveOneCheckedInSameLevelAndParent(cbx, tr)) {
            if ($(tr).attr("parentID") != "0") {
                var parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(tr).attr("parentID") + "']");
                if ($(cbx).attr("cbxRead") == "true") {
                    $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                }
                else {
                    $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                }
                if (!up.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                    parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                    while (parentFunc_tr.length > 0) {
                        if ($(cbx).attr("cbxRead") == "true") {
                            $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                        }
                        else {
                            $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                        }
                        parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                        if (parentFunc_tr.length < 0 || up.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                            break;
                        }
                    }
                }
            }
        }
        //--end
        //------------------------------------------------

        //all childs will be checked
        if ($(tr).attr("TotalSub") != "0") {
            var childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(tr).attr("_id") + "']");
            $(childFunc_tr).each(function () {
                if ($(cbx).attr("cbxRead") == "true") {
                    $(this).find("input[cbxRead]").get(0).checked = false;
                }
                else {
                    $(this).find("input[cbxHost]").get(0).checked = false;
                }
            });
            $(childFunc_tr).each(function () {
                childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(this).attr("_id") + "']");
                while (childFunc_tr.length > 0) {
                    $(childFunc_tr).each(function () {
                        if ($(cbx).attr("cbxRead") == "true") {
                            $(this).find("input[cbxRead]").get(0).checked = false;
                        }
                        else {
                            $(this).find("input[cbxHost]").get(0).checked = false;
                        }
                    });
                    childFunc_tr = $("#tbodyUserPol").find("tr[parentID='" + $(childFunc_tr).attr("_id") + "']");
                }
            });
        }
    };

    up.buildLevelPadding = function (span, level) {
        level = parseInt(level);
        var marginLeft = 10;
        switch (level) {
            case 2:
                $(span).css("margin-left", marginLeft + "px");
                break;
            case 3:
                $(span).css("margin-left", marginLeft + 12 + "px");
                break;
            case 4:
                $(span).css("margin-left", marginLeft + 24 + "px");
                break;
        }
    };

    up.buildTableTree = function (table, t, l) {
        var level = 1;
        if (typeof l != "undefined") level = l + 1;
        if (typeof table == "undefined") return [];
        var _table = [];
        if (typeof t != "undefined") _table = t;
        for (var i = 0; i < table.length; ++i) {
            if (typeof t == "undefined") {
                if (table[i].FuncName != $("#hSystemName").val()) continue;
            }

            up.ABDAllFuncIds[up.ABDAllFuncIds.length] = table[i].ID;

            _table[_table.length] = {
                FuncDesc: table[i].FuncDesc,
                FuncName: table[i].FuncName,
                GroupName: table[i].GroupName,
                ID: table[i].ID,
                IsGroupHost: table[i].IsGroupHost,
                IsGroupRead: table[i].IsGroupRead,
                IsRead: table[i].IsRead,
                IsHost: table[i].IsHost,
                ParentId: table[i].ParentId,
                level: level,
                TotalSub: table[i].TotalSub
            };
            if (table[i].TotalSub == 0) continue;
            this.buildTableTree(table[i].SubFuncs, _table, level);
        }
        return _table;
    };

    up.init();
});