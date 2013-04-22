$(document).ready(function () {
    var gp = {
        FuncIds: [],
        ABDAllFuncIds: []
    };

    gp.showError = function (msg) {
        showMessage(msg, 1);
    };

    gp.showSuccess = function (msg) {
        showMessage(msg, 0);
    };

    gp.init = function () {
        this.getData();

        //btnUpdate
        $("#btnUpdate").click(function () {
            //$(this).wait();
            gp.updateData();
        });
    };

    gp.updateData = function () {
        var data = this.getChangedData();
        if (data.policiesDataEdited == "") {
            gp.showError("There is no change!");
            return;
        }
        
        var userId = parseInt($("#hUserID").val());
        var groupId = parseInt($("#hABDGroupID").val());
        $.ajax({
            type: "POST",
            url: "UpdateGroupPolicy",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"groupPolicies":"' + data.policiesDataEdited + '", "oldGroupPolicies": "' + data.policiesDataBeforeEdit + '", "userID": ' + userId + ', "groupID": ' + groupId + '}',
            success: function (rs) {
                if (typeof rs == "string" && rs != "") {
                    gp.showError(rs);
                }
                else {
                    gp.showSuccess("Update role policy successfully!");
                    gp.policiesDataBeforeEdit = gp.getCurrentPoliciesData();
                }
                $("#btnUpdate").unwait();
            }
            , error: function (e) {
                $("#btnUpdate").unwait();
            }
        });
    };

    gp.getChangedData = function () {
        var arrBeforeEdit = this.policiesDataBeforeEdit.split(";");
        var arrEdited = this.getCurrentPoliciesData().split(";");

        var arrOldPoliciesData = [];
        var arrPoliciesEdited = [];

        var _funcIds = [];

        var isExisted = function (funcId) {
            for (var i = 0; i < _funcIds.length; ++i) {
                if (_funcIds[i] == funcId) return true;
            }
            return false;
        };

        for (var i = 0; i < this.ABDAllFuncIds.length; ++i) {
            if (isExisted(this.ABDAllFuncIds[i])) continue;
            var valueBeforeEdit = this.getValueOfFuncId(arrBeforeEdit, this.ABDAllFuncIds[i]);
            var valueEdited = this.getValueOfFuncId(arrEdited, this.ABDAllFuncIds[i]);
            if (valueBeforeEdit != valueEdited) {
                _funcIds.push(this.ABDAllFuncIds[i]);
                arrOldPoliciesData.push(this.ABDAllFuncIds[i] + "," + valueBeforeEdit);
                arrPoliciesEdited.push(this.ABDAllFuncIds[i] + "," + valueEdited);
            }
        }

        var result = {
            policiesDataBeforeEdit: arrOldPoliciesData.join(";"),
            policiesDataEdited: arrPoliciesEdited.join(";")
        };

        var arrOld = result.policiesDataBeforeEdit.split(";");
        var arrNew = result.policiesDataEdited.split(";");

        for (var m = 0; m < arrOldPoliciesData.length; ++m) {
            var keyValues1 = arrOldPoliciesData[m].split(",");
            this.appendParentAtOld(arrOld, keyValues1[0]);
        }

        for (var n = 0; n < arrPoliciesEdited.length; ++n) {
            var keyValues2 = arrPoliciesEdited[n].split(",");
            this.appendParentAtNew(arrNew, keyValues2[0]);
        }

        result = {
            policiesDataBeforeEdit: arrOld.join(";"),
            policiesDataEdited: arrNew.join(";")
        };

        return result;
    };

    gp.getValueOfFuncId = function (arrPolicies, funcId) {
        for (var i = 0; i < arrPolicies.length; ++i) {
            var dic = arrPolicies[i].split(",");
            if (dic[0] == funcId.toString()) {
                return dic[1];
            }
        }
        return "";
    };

    gp.appendParentAtOld = function (arr, funcId) {
        var node = this.findNodeInFunctionTrees(this.functionTrees, funcId);
        if (node == null || node.ParentId == 0) return;
        var parentNode = this.findNodeInFunctionTrees(this.functionTrees, node.ParentId.toString());
        var isExisted = false;
        for (var i = 0; i < arr.length; ++i) {
            var keyValues = arr[i].split(",");
            if (keyValues[0] == parentNode.ID.toString()) isExisted = true;
        }
        if (!isExisted) {
            var arrBeforeEdit = this.policiesDataBeforeEdit.split(";");
            for (var j = 0; j < arrBeforeEdit.length; ++j) {
                var keyValues2 = arrBeforeEdit[j].split(",");
                if (keyValues2[0] == parentNode.ID.toString()) {
                    arr.push(arrBeforeEdit[j]);
                    break;
                }
            }
        }
        this.appendParentAtOld(arr, parentNode.ID.toString());
    };

    gp.appendParentAtNew = function (arr, funcId) {
        var node = this.findNodeInFunctionTrees(this.functionTrees, funcId);
        if (node == null || node.ParentId == 0) return;
        var parentNode = this.findNodeInFunctionTrees(this.functionTrees, node.ParentId.toString());
        var isExisted = false;
        for (var i = 0; i < arr.length; ++i) {
            var keyValues = arr[i].split(",");
            if (keyValues[0] == parentNode.ID.toString()) isExisted = true;
        }
        if (!isExisted) {
            var arrEdited = this.getCurrentPoliciesData().split(";");
            for (var j = 0; j < arrEdited.length; ++j) {
                var keyValues2 = arrEdited[j].split(",");
                if (keyValues2[0] == parentNode.ID.toString()) {
                    arr.push(arrEdited[j]);
                    break;
                }
            }
        }
        this.appendParentAtNew(arr, parentNode.ID.toString());
    };

    gp.getCurrentPoliciesData = function () {
        gp.FuncIds = [];
        $("#tbodyGP").find("tr").each(function () {
            var cbxRead = $(this).find("input[cbxRead]");
            var cbxHost = $(this).find("input[cbxHost]");
            var funcID = $(this).find("input[funcid]").val();
            if (!cbxRead.get(0).checked && !cbxHost.get(0).checked) return;
            if (cbxRead.get(0).checked && cbxHost.get(0).checked) {
                gp.FuncIds[gp.FuncIds.length] = funcID + "," + 3;
            }
            else if (cbxRead.get(0).checked) {
                gp.FuncIds[gp.FuncIds.length] = funcID + "," + 1;
            }
            else if (cbxHost.get(0).checked) {
                gp.FuncIds[gp.FuncIds.length] = funcID + "," + 2;
            }
        });
        for (var i = 0; i < gp.ABDAllFuncIds.length; ++i) {
            if (!this.isExisted(gp.ABDAllFuncIds[i])) {
                gp.FuncIds[gp.FuncIds.length] = gp.ABDAllFuncIds[i] + "," + 0;
            }
        }
        return gp.FuncIds.join(";");
    };

    gp.findNodeInFunctionTrees = function (trees, funcId) {
        for (var j = 0; j < trees.length; ++j) {
            if (funcId == trees[j].ID.toString()) {
                return trees[j];
            }
            else {
                if (trees[j].TotalSub == 0) continue;
                var node = this.findNodeInFunctionTrees(trees[j].SubFuncs, funcId);
                if (node != null) return node;
            }
        }
        return null;
    };

    gp.isExisted = function (id) {
        for (var i = 0; i < gp.FuncIds.length; ++i) {
            if (parseInt(gp.FuncIds[i].split(',')[0]) == id) return true;
        }
        return false;
    };

    gp.getData = function () {
        gp.ABDAllFuncIds = [];
        $.ajax({
            type: "POST",
            url: "GetABSGroupPolicyList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"deptName":"' + $("#hGroupName").val() + '"}',
            success: function (rs) {
                if (typeof rs == "undefined") return;
                gp.dataBinding(rs);
                $("#btnUpdate").removeClass("hidden").show();
            }
            , error: function (e) {
            }
        });
    };

    gp.dataBinding = function (table) {
        gp.functionTrees = table;
        $("#scriptTemplate").tmpl(this.buildTableTree(table)).appendTo($("#tbodyGP").empty());
        $("#tbodyGP").find("tr").each(function () {
            var hiddenLevel = $(this).find("input[level]");
            var hTotalSub = $(this).find("input[TotalSub]");
            var spanIcon = $(this).find("span[icon]");
            var spanFuncName = $(this).find("span[funcname]");
            if (parseInt($(hTotalSub).val()) != 0) {
                $(spanFuncName).css("font-weight", "bold");
            }
            gp.buildLevelPadding(spanIcon, $(hiddenLevel).val())
        });
        $("#policyGrid").removeClass("hidden").reRenderScroller(569, 343, true);

        $("#tbodyGP").find("tr").each(function () {
            $(this).mouseover(function () {
                $(this).addClass("mouseon");
            })
            .mouseout(function () {
                $(this).removeClass("mouseon");
            });
        });

        this.policiesDataBeforeEdit = this.getCurrentPoliciesData();

        //init expand , collapse tree
        $("#tbodyGP").find("tr span[icon]").click(function () {
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
                        $("#policyGrid").reRenderScroller(569, 343, true);
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
                $("#policyGrid").reRenderScroller(569, 343, true);
            }
        });

        //init handler for checkbox's click event
        $("#tbodyGP").find("input[type='checkbox']").each(function () {
            $(this).change(function () {
                var cbx = this;
                if (this.checked) {
                    var tr = $(this).parents("tr:first");
                    if ($(this).attr("cbxHost") == "true") {
                        $(tr).find("input[cbxRead]").get(0).checked = this.checked;
                    }
                    //all parents will be checked
                    if ($(tr).attr("parentID") != "0") {
                        var parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(tr).attr("parentID") + "']");
                        if ($(this).attr("cbxRead") == "true") {
                            $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                        }
                        else {
                            $(parentFunc_tr).find("input[cbxHost]").get(0).checked = true;
                            $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                        }
                        parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                        while (parentFunc_tr.length > 0) {
                            if ($(this).attr("cbxRead") == "true") {
                                $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                            }
                            else {
                                $(parentFunc_tr).find("input[cbxHost]").get(0).checked = true;
                                $(parentFunc_tr).find("input[cbxRead]").get(0).checked = true;
                            }
                            parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                        }
                    }
                    //all childs will be checked
                    if ($(tr).attr("TotalSub") != "0") {
                        var childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(tr).attr("_id") + "']");
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
                            childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(this).attr("_id") + "']");
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
                                childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(childFunc_tr).attr("_id") + "']");
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

                    if (!gp.haveOneCheckedInSameLevelAndParent(cbx, tr)) {
                        if ($(tr).attr("parentID") != "0") {
                            var parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(tr).attr("parentID") + "']");
                            if ($(this).attr("cbxRead") == "true") {
                                $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                            }
                            else {
                                $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                            }
                            if (!gp.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                                parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                                while (parentFunc_tr.length > 0) {
                                    if ($(this).attr("cbxRead") == "true") {
                                        $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                                    }
                                    else {
                                        $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                                    }
                                    parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                                    if (parentFunc_tr.length < 0 || gp.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
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
                    gp.uncheckedHost($(tr).find("input[cbxHost]"));
                    //------------------------------------------------

                    //all childs will be checked
                    if ($(tr).attr("TotalSub") != "0") {
                        var childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(tr).attr("_id") + "']");
                        $(childFunc_tr).each(function () {
                            if ($(cbx).attr("cbxRead") == "true") {
                                $(this).find("input[cbxRead]").get(0).checked = false;
                            }
                            else {
                                $(this).find("input[cbxHost]").get(0).checked = false;
                            }
                        });
                        $(childFunc_tr).each(function () {
                            childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(this).attr("_id") + "']");
                            while (childFunc_tr.length > 0) {
                                $(childFunc_tr).each(function () {
                                    if ($(cbx).attr("cbxRead") == "true") {
                                        $(this).find("input[cbxRead]").get(0).checked = false;
                                    }
                                    else {
                                        $(this).find("input[cbxHost]").get(0).checked = false;
                                    }
                                });
                                childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(childFunc_tr).attr("_id") + "']");
                            }
                        });
                    }
                }
            });
        });
    };

    gp.haveOneCheckedInSameLevelAndParent = function (cbx, tr) {
        var trs_same = $("#tbodyGP").find("tr[parentID='" + $(tr).attr("parentID") + "']");
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

    gp.uncheckedHost = function (cbx) {
        $(cbx).get(0).checked = false;
        var tr = $(cbx).parents("tr:first");
        //all parents will be un-check

        //------------------------------------------------
        //section 1
        //find all tr which have same level and same parent

        if (!gp.haveOneCheckedInSameLevelAndParent(cbx, tr)) {
            if ($(tr).attr("parentID") != "0") {
                var parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(tr).attr("parentID") + "']");
                if ($(cbx).attr("cbxRead") == "true") {
                    $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                }
                else {
                    $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                }
                if (!gp.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                    parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                    while (parentFunc_tr.length > 0) {
                        if ($(cbx).attr("cbxRead") == "true") {
                            $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                        }
                        else {
                            $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                        }
                        parentFunc_tr = $("#tbodyGP").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                        if (parentFunc_tr.length < 0 || gp.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
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
            var childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(tr).attr("_id") + "']");
            $(childFunc_tr).each(function () {
                if ($(cbx).attr("cbxRead") == "true") {
                    $(this).find("input[cbxRead]").get(0).checked = false;
                }
                else {
                    $(this).find("input[cbxHost]").get(0).checked = false;
                }
            });
            $(childFunc_tr).each(function () {
                childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(this).attr("_id") + "']");
                while (childFunc_tr.length > 0) {
                    $(childFunc_tr).each(function () {
                        if ($(cbx).attr("cbxRead") == "true") {
                            $(this).find("input[cbxRead]").get(0).checked = false;
                        }
                        else {
                            $(this).find("input[cbxHost]").get(0).checked = false;
                        }
                    });
                    childFunc_tr = $("#tbodyGP").find("tr[parentID='" + $(childFunc_tr).attr("_id") + "']");
                }
            });
        }
    };

    gp.buildLevelPadding = function (span, level) {
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

    gp.buildTableTree = function (table, t, l) {
        var level = 1;
        if (typeof l != "undefined") level = l + 1;
        if (typeof table == "undefined") return [];
        var _table = [];
        if (typeof t != "undefined") _table = t;
        for (var i = 0; i < table.length; ++i) {
            if (typeof t == "undefined") {
                if (table[i].FuncName != $("#hSystemName").val()) continue;
            }

            gp.ABDAllFuncIds[gp.ABDAllFuncIds.length] = table[i].ID;

            _table[_table.length] = {
                FuncDesc: table[i].FuncDesc,
                FuncName: table[i].FuncName,
                GroupName: table[i].GroupName,
                ID: table[i].ID,
                IsGroupHost: table[i].IsGroupHost,
                IsGroupRead: table[i].IsGroupRead,
                ParentId: table[i].ParentId,
                level: level,
                TotalSub: table[i].TotalSub
            };
            if (table[i].TotalSub == 0) continue;
            this.buildTableTree(table[i].SubFuncs, _table, level);
        }
        return _table;
    };

    gp.init();
});