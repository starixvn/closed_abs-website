$(document).ready(function () {
    var ua = $.browser;
    var paddingtop = "112px";
    if (ua.mozilla && parseInt(ua.version.split('.')[0]) < 10) {
        $("#contentSection").css("padding-top", "120px");
        paddingtop = "120px";
    }

    $('#btnToggle').click(function () {
        $("#filterSection").toggle("fast");
        if ($("#contentSection").css("padding-top") == paddingtop) {
            $("#contentSection").css("padding-top", "38px");
        } else {
            $("#contentSection").css("padding-top", paddingtop);
        }
    });
    var mu = {
        FuncIds: [],
        ABDAllFuncIds: []
    };

    mu.showError = function (msg, targetID) {
        if (typeof targetID === 'undefined')
            showMessage(msg, 1);
        else
            showMessage(msg, 1, false, targetID);
    };

    mu.showSuccess = function (msg, targetID) {
        if (typeof targetID === 'undefined')
            showMessage(msg, 0);
        else
            showMessage(msg, 1, false, targetID);
    };

    mu.init = function () {
        this.getData();
        this.initSearch();
        this.initSort();
    };

    mu.initSort = function () {
        //divUserNameHeader
        $("#divUserNameHeader").css("cursor", "pointer").attr("title", "sort by username");
        $("#divUserNameHeader").click(function () {
            if (typeof this.order == "undefined") {
                this.order = -1;
                jlinq.from(mu.vm).sort("-UserName").select();
            }
            else {
                if (this.order == 1) {
                    jlinq.from(mu.vm).sort("-UserName").select();
                    this.order = -1;
                }
                else {
                    jlinq.from(mu.vm).sort("UserName").select();
                    this.order = 1;
                }
            }
            mu.bindData(mu.vm);
        });
    };

    mu.initSearch = function () {
        //tbxUserName
        $("#tbxUserName").keyup(function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) return true;
            else if (e.keyCode == 13) {
                mu.search($(this).val());
            }
            else {
                var rows = [];
                if ($(this).val() != "") {
                    rows = jlinq.from(mu.vm).starts("UserName", $(this).val()).select();
                    if (rows.length > 0)
                        $(this).autoComplete(rows, "UserName");
                    else {
                        $(this).removeAutoComplete();
                    }
                }
                else {
                    $(this).removeAutoComplete();
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
            if ($("#tbxUserName").val() !== "Search") {
                value = $("#tbxUserName").val();
            }
            mu.search(value);
            $(this).unwait();
        });
    };

    mu.search = function (val) {
        var rows = [];
        if (val == "" || val == "Search") {
            rows = mu.vm;
        }
        else {
            rows = jlinq.from(mu.vm).starts("UserName", val).select();
        }
        mu.bindData(rows);
    };

    mu.getData = function (isSeach) {
        var groupId = parseInt($("#hABDGroupID").val());
        $.ajax({
            type: "POST",
            url: "GetAdminsByGroupId",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"groupId":' + groupId + '}',
            success: function (rs) {
                if (typeof rs != "undefined") {
                    mu.vm = rs;
                    if (typeof isSeach == 'undefined' || isSeach == false) {
                        mu.bindData(rs);
                    }
                    else {
                        mu.search($("#tbxUserName").val());
                    }
                }
            }
        , error: function (e) {
            mu.showError(e.toString());
        }
        });
    };

    mu.bindData = function (vm) {
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
        $("#userGrid").removeClass("hidden"); //.reRenderScroller(900, 500, true);
        //update number of Laber Actice
        mu.updateLabelNumberActive(vm);
        //bind policy event
        $("#tbodyMemList").find("div[policy]").find('input[type="button"]').click(function () {
            var hUserId = $(this).parent().find("input[userid]");
            var userName = $(this).parents("tr:first").find("input[type='hidden'][username]").val();
            $('#txtChangeDisplayName').val($(this).parent().find("input[displayname]").val());
            mu.showUserPolicy(parseInt($(hUserId).val()), userName, true);
        });
        //bind password change event
        $("#tbodyMemList").find("div[editpass]").find('input[type="button"]').click(function () {
            var hUserId = $(this).parent().find("input[userid]");
            var userName = $(this).parents("tr:first").find("input[type='hidden'][username]").val();
            //mu.showUserPolicy(parseInt($(hUserId).val()), userName);
            $("#hiddenUserId").val(hUserId.val());
            $("#passwordLayout").removeClass("hidden");
            $("#txtPassword").val('');
            $("#txtConfirmPassword").val('');
            $("#changePassPopup").hide();
            showPopup
                ({
                    content: $("#passswordSection"),
                    title: "Account: " + userName,
                    width: 360,
                    height: 180,
                    buttons: [{
                        "text": "Reset",
                        callback: function (popid, button) {
                            $("#txtPassword").val('');
                            $("#txtConfirmPassword").val('');
                        }
                    },
                        {
                            "text": "Submit",
                            callback: function (popuid, button) {
                                //$(button).wait();
                                if (mu.checkMatchPassword("#txtPassword", "#txtConfirmPassword", "#changePassPopup", false)) {
                                    mu.changePassword($("#txtPassword").val(), $("#hUserID").val());

                                    $("#passwordLayout").addClass("hidden");
                                    setTimeout(function () {
                                        $('#msg').fadeOut(500);
                                    }, 3000);
                                    closePopup(popuid);
                                }
                            }
                        }
                    ],
                    multiple: false, dialog: true
                });
        });
        //bind Status change event
        $("#tbodyMemList").find("div[useractive]").find('input[type="checkbox"]').click(function () {
            var custId = $(this).parent().find("input[userid]");
            var accid = $("#hUserID").val();
            var userStatus = $(this).parent().find("input[type='checkbox']").attr('checked');
            var userNotActive = true;
            if (userStatus === 'checked') {
                userNotActive = false;
            }
            var rsTemp;
            $.ajax({
                type: "POST",
                url: "UpdateStatus",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"custid": ' + custId.val() + ', "accid":' + accid + ', "closed": ' + userNotActive + '}',
                success: function (rs) {
                    rsTemp = rs;
                    if (rs.ErrorMessage !== "Successful") {
                        mu.showError(rs.ErrorMessage);
                    }
                    else {
                        mu.showSuccess(strUpdateStatus);
                        //mu.updateLabelNumberActive();
                    }
                    setTimeout(function () {
                        $('#msg').fadeOut(500);
                    }, 3000);
                    setTimeout(function () {
                        mu.getData(true);
                    }, 3000);
                }
                , error: function (e) {
                }
            });
            var rstemp2 = rsTemp;
        });
        //bind assign puntercode event
        $("#tbodyMemList").find("div[assignpunter]").find('input[type="button"]').click(function () {
            var custId = $(this).parent().find("input[userid]").val();
            var userName = $(this).parents("tr:first").find("input[type='hidden'][username]").val();
            $("#assignPunterCodeLayout").removeClass("hidden");
            var popWidth = 700;
            var popHeight = 545;
            showPopup
                ({
                    content: $("#assignPunterCodesSection"),
                    title: "Account: " + userName,
                    width: popWidth,
                    height: popHeight + 10,
                    multiple: false, dialog: true,
                    onclose: function () {
                        //alert("close");
                        //remove treeview content data
                        $("#tbodyPunterCodeUpdate").empty();
                        if ($("#puntercodeTreeView").prev().is('div.ui-nextreeview-options')) {
                            $("#puntercodeTreeView").prev().remove();
                        }
                        if ($("#puntercodeTreeView").next().is('div.ui-nextreeview-options')) {
                            $("#puntercodeTreeView").next().remove();
                        }
                        //remove table data
                        $("#tbodyPunterCodeUpdate").empty();
                    }
                });
            mu.initSearchPunterCodes();
            mu.selectPunterCodes(custId, popWidth, popHeight, true);
        });
    };

    mu.selectPunterCodes = function (adminId, popWidth, popHeight, isFirst) {
        $.ajax({
            type: "POST",
            url: "SelectPunterCodes",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"adminId":' + adminId + '}',
            success: function (rs) {
                mu.bindDataForPunterCode(rs, popWidth / 2 - 150, popHeight - 220, adminId, isFirst);
            }
        });
    };

    mu.listPunterCodeChecked = [];
    mu.listPunterCodeUnchecked = [];

    mu.bindDataForPunterCode = function (data, width, height, adminId, isFirst) {
        //divide into 2 parts add and remove
        mu.listPunterCodeChecked = [];
        mu.listPunterCodeUnchecked = [];
        for (var k = 0; k < data.length; k++) {
            if (data[k].IsChecked) {
                mu.listPunterCodeChecked.push(data[k]);
            }
            else {
                mu.listPunterCodeUnchecked.push(data[k]);
            }
        };
        //render treeview on the left
        //mu.renderPunterCodesTreeview(mu.refineDataToGroupPunter(mu.listPunterCodeUnchecked), width, height);
        mu.searchPunterCodes($("#txtAssignPunterCodeSearch").val());
        //render table remove on the right
        mu.renderPunterCodeTable(mu.refineDataToGroupPunter(mu.listPunterCodeChecked));
        //bind event button
        mu.bindClickEventForRemoveAndAddButton(adminId, isFirst);
    };

    mu.bindClickEventForRemoveAndAddButton = function (adminId, isFirst) {
        var arrayPunterCodeRemove = [];
        var arrayPunterCodeAdd = [];
        if (isFirst == true) {
            $("#btnRemovePunterCodes").click(function () {
                var numCheck = 0;
                $('input[punterValue]').each(function () {
                    if ($(this).prop('checked') == true) {
                        numCheck++;
                    }
                });
                $("#lbTotalRemove").text(numCheck++);

                //get array
                var listChecked = $("#tbodyPunterCodeUpdate").find('input[punterValue]').filter('[checked]');
                if ($("#tbodyPunterCodeUpdate").find('input[punterValue]').length == 1 && listChecked.length == 0) {
                    if ($("#tbodyPunterCodeUpdate").find('input[punterValue]').first().prop('checked') === true) {
                        listChecked = $("#tbodyPunterCodeUpdate").find('input[punterValue]');
                    }
                }
                arrayPunterCodeRemove = [];
                for (var i = 0; i < listChecked.length; i++) {
                    arrayPunterCodeRemove.push($(listChecked[i]).next().attr('value'));
                }
                //console.log(arrayPunterCodeRemove.length);
                if (arrayPunterCodeRemove.length > 0) {
                    mu.updateAssignPunterCode(adminId, [], arrayPunterCodeRemove, "#btnRemovePunterCodes");
                }
            });
            $('#btnAddPunterCodes').click(function () {
                arrayPunterCodeAdd = $("#puntercodeTreeView").nexTreeview('getCheckedItems');
                if (arrayPunterCodeAdd.length > 0) {
                    mu.updateAssignPunterCode(adminId, arrayPunterCodeAdd, [], "#btnAddPunterCodes");
                }
                //console.log(arrayPunterCodeAdd.length);
            });
        }
    };

    mu.updateAssignPunterCode = function (adminId, arrayAdd, arrayRemove, btnWait) {
        $(btnWait).wait();
        $.ajax({
            type: "POST",
            url: "UpdatePunterCodes",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"adminId": "' + adminId + '", "punterCodeDelete": "' + arrayRemove.join(',') + '", "punterCodeInsert": "' + arrayAdd.join(',') + '" }',
            success: function (rs) {
                if (rs.ErrorCode == 0) {
                    $("#divmsgAssignPunter").addClass("success").html("Update Successfully!").show();
                    setTimeout(function () {
                        //mu.initSearchPunterCodes();
                        mu.selectPunterCodes(adminId, 700, 600, false);
                        $(btnWait).unwait();
                    }, 3000);
                }
                else {
                    //mu.showError(rs.ErrorMessage, '#divmsgAssignPunter');
                    $("#divmsgAssignPunter").addClass("error").html(rs.ErrorMessage).show();
                    $(btnWait).unwait();
                }
                setTimeout(function () {
                    $('#divmsgAssignPunter').hide();
                }, 3000);
            }
        });
    };

    mu.refineDataToGroupPunter = function (data) {
        var tempData = [];
        for (var i = 0; i < data.length; i++) {
            //console.log("#puntercodeTreeView" + i.toString() + "  " + data[i].PunterCodeId + "  " + data[i].Code + "  " + data[i].IsChecked + "  " + data[i].Color);
            tempData.push({
                Id: "#puntercodeTreeView" + i.toString(),
                Value: data[i].PunterCodeId.toString(),
                Text: data[i].Code,
                Checked: false, //data[i].IsChecked, //!panelHeader.existPunter(data[i].Id, reportContent.hiddenPunters),
                Enable: true,
                Color: data[i].Color,
                Css: "color:" + data[i].Color + ";",
                CssClass: ""
            });
        }

        return mu.groupPunterByColor(tempData);
    };

    mu.renderPunterCodesTreeview = function (data, width, height) {
        var listData = data;
        var isCheckAll = true;
        for (var j = 0; j < listData.length; j++) {
            if (listData[j].Checked == false) {
                isCheckAll = false;
                break;
            }
        }
        if (listData.length == 0) {
            isCheckAll = false;
        }
        $("#puntercodeTreeView").nexTreeview(
            {
                minWidth: width,
                maxHeight: height,
                isCheckAll: isCheckAll,
                listData: listData
            });
    };

    mu.groupPunterByColor = function (data) {
        var arrColor = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
            var item = data[i];
            var color = mu.existPunterByColor(item.Color, arrColor);
            if (color == null) {
                arrColor.push({
                    Id: "",
                    Value: item.Id,
                    Color: item.Color,
                    Css: "color:" + item.Color + ";",
                    Text: mu.getColorName(item.Color),
                    Checked: item.Checked,
                    CssClass: "",
                    Enable: true,
                    Items: [item]
                });
            }
            else {
                color.Checked = !color.Checked ? false : (color.Checked && item.Checked);
                color.Items.push(item);
            }
        }
        return arrColor;
    };

    mu.existPunter = function (id, punters) {
        for (var i = 0; i < punters.length; i++) {
            if (punters[i].Id == id) return true;
        }
        return false;
    };

    mu.getColorName = function (color) {
        var colors = colorFilter.split(',');
        for (var i = 0; i < colors.length; i++) {
            var co = colors[i].split(';');
            if (color == co[0]) {
                return co[1];
            }
        }
        return '';
    };

    mu.existPunterByColor = function (color, punters) {
        for (var i = 0; i < punters.length; i++) {
            if (punters[i].Color == color) return punters[i];
        }
        return null;
    };

    mu.initSearchPunterCodes = function () {
        $("#txtAssignPunterCodeSearch").keyup(function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) return true;
            else if (e.keyCode == 13) {
                //                    mu.search($(this).val());
                $("#btnPunterCodeSearch").trigger("click");
            }
            else {
                var rows = [];
                if ($(this).val() != "") {
                    //                        rows = jlinq.from(mu.vm).starts("UserName", $(this).val()).select();
                    //                        if (rows.length > 0)
                    //                            $(this).autoComplete(rows, "UserName");
                    //                        else {
                    //                            $(this).removeAutoComplete();
                    //                        }
                }
                else {
                    //                        $(this).removeAutoComplete();
                }
            }
        })
        .val("Search Punter Code")
        .focus(function () {
            if ($(this).val().indexOf("Search Punter Code") >= 0) {
                $(this).val("");
            }
        })
        .focusout(function () {
            if ($(this).val() == "") {
                $(this).val("Search Punter Code").css("font-style", "italic");
            }
        });

        //btnSearch
        $("#btnPunterCodeSearch").click(function () {
            //alert($("#puntercodeTreeView").nexTreeview('getCheckedItems').join(','));
            $(this).wait();
            //mu.listPunterCodeUnchecked

            var value = "";
            if ($("#txtAssignPunterCodeSearch").val() !== "Search Punter Code") {
                value = $("#txtAssignPunterCodeSearch").val();
            }
            mu.searchPunterCodes(value);
            $(this).unwait();
        });
    };

    mu.searchPunterCodes = function (val) {
        //mu.listPunterCodeUnchecked
        var rows = [];
        if (val == "" || val == "Search Punter Code") {
            rows = mu.listPunterCodeUnchecked;
        }
        else {
            rows = jlinq.from(mu.listPunterCodeUnchecked).starts("Code", val).select();
        }
        //mu.bindData(rows);
        mu.renderPunterCodesTreeview(mu.refineDataToGroupPunter(rows), 200, 290);
    };

    mu.changePassword = function (password, userId) {
        if (isNaN(parseInt($("#hiddenUserId").val()))) return;
        var loginId = parseInt($("#hiddenUserId").val());
        $.ajax({
            type: "POST",
            url: "UpdatePassword",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"CustId":' + loginId + ', "UserPwd": "' + password + '", "UserId": ' + userId + '}',
            success: function (rs) {
                if (rs == "") {
                    mu.showSuccess("Change password successfully!");
                }
                else {
                    mu.showError(rs);
                }
            }
        });
    };

    mu.updateLabelNumberActive = function (vm) {
        //handle show num of active or in active
        var numActive = 0;
        for (var i = 0; i < vm.length; i++) {
            if (vm[i].Status === 'Active') {
                numActive++;
            }
        }
        $("#lblNumActive").text(numActive);
        $("#lblNumInActive").text(vm.length - numActive);
    };

    mu.convertPunterCode = function (number, data, isChild, groupdId) {
        if (!isChild) {
            number = "";
        }
        var tempData = {
            Number: number,
            Text: data.Text,
            Checked: data.Checked,
            Id: data.Value,
            Color: data.Color,
            IsChild: isChild,
            GroupId: groupdId
        };
        return tempData;
    };

    mu.buildPunterCodesTable = function (punterCodeList) {
        var table = [];
        var tempNum = 0;
        for (var i = 0; i < punterCodeList.length; i++) {
            table[table.length] = mu.convertPunterCode(tempNum, punterCodeList[i], false, punterCodeList[i].Id.toString() + punterCodeList[i].Color);
            if (punterCodeList[i].Items.length > 0) {
                for (var j = 0; j < punterCodeList[i].Items.length; j++) {
                    table[table.length] = mu.convertPunterCode(++tempNum, punterCodeList[i].Items[j], true, punterCodeList[i].Id.toString() + punterCodeList[i].Color);
                }
            }
        };
        return table;
    };

    mu.bindEventForPunterCodeTable = function () {
        //assign event for table
        //id tbody = tbodyPunterCodeUpdate
        $("#cbCheckAllPunter").click(function () {
            var $this = $(this);
            if ($this.prop("checked") === true) {
                $("#tbodyPunterCodeUpdate").find('input[type="checkbox"]').prop("checked", true);
            }
            else {
                $("#tbodyPunterCodeUpdate").find('input[type="checkbox"]').prop("checked", false);
            }
        });
        $('tr.evenrow').find('input[type="checkbox"]').click(function () {
            var $this = $(this);
            if ($this.prop('checked') == true) {
                $('#tbodyPunterCodeUpdate').find('input[groupId=' + $this.attr('groupId') + ']').prop('checked', true);
                var count = true;
                $('#tbodyPunterCodeUpdate tr.evenrow').find('input[type="checkbox"]').each(function () {
                    //console.log($(this).prop('checked'));
                    if ($(this).prop('checked') == false) {
                        count = false;
                    }
                });
                if (count == true) $("#cbCheckAllPunter").prop('checked', true);
            }
            else {
                $("#cbCheckAllPunter").prop('checked', false);
                $('#tbodyPunterCodeUpdate').find('input[groupId=' + $this.attr('groupId') + ']').prop('checked', false);
            }
        });

        $('input[punterValue]').each(function () {
            var $this = $(this);
            $this.click(function () {
                if ($this.prop('checked') == false) {
                    $("#cbCheckAllPunter").prop('checked', false);
                    $('#tbodyPunterCodeUpdate tr.evenrow').find('input[groupId=' + $this.attr('groupId') + ']').prop('checked', false);
                }
                else {
                    var count = true;
                    $('input[punterValue]').each(function () {
                        if ($(this).prop('checked') == false)
                            count = false;
                    });
                    if (count == true) $("#cbCheckAllPunter").prop('checked', true);
                    count = true;
                    $('#tbodyPunterCodeUpdate').find('input[groupId=' + $this.attr('groupId') + '][punterValue="true"]').each(function () {
                        if ($(this).prop('checked') == false)
                            count = false;
                    });
                    if (count == true) $('tr.evenrow').find('input[groupId=' + $this.attr('groupId') + ']').prop('checked', true);
                }
            });
        });
    };

    mu.renderPunterCodeTable = function (punterCodeList) {
        var isCheckAll = true;
        for (var j = 0; j < punterCodeList.length; j++) {
            if (punterCodeList[j].Checked == false) {
                isCheckAll = false;
                break;
            }
        };
        if (punterCodeList.length == 0)
            isCheckAll = false;
        $("#cbCheckAllPunter").prop("checked", isCheckAll);
        $("#scriptTempPunterCodeUpdate").tmpl(mu.buildPunterCodesTable(punterCodeList)).appendTo($("#tbodyPunterCodeUpdate").empty());
        mu.bindEventForPunterCodeTable();
    };

    mu.showUserPolicy = function (userId, username, isUpdateDisplayName) {
        var isShowUpdateDisplayName = typeof isUpdateDisplayName !== 'undefined' && isUpdateDisplayName === true;
        $('#showErrorChangeUserName').addClass("hidden");
        mu.ABDAllFuncIds = [];
        $.ajax({
            type: "POST",
            url: "GetUserPolicyList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"userId": ' + userId + '}',
            success: function (rs) {
                if (typeof rs == "string" && rs != "") {
                    mu.showError(rs);
                }
                else {
                    var popupHeight = 460;
                    if (typeof isUpdateDisplayName !== 'undefined' && isUpdateDisplayName === true) {
                        $('#displayName').show();
                    }
                    else {
                        $('#displayName').hide();
                        popupHeight = 430;
                    };

                    showPopup
                    ({
                        content: $("#policyGridSection"),
                        title: "Account: " + username,
                        width: 839,
                        height: popupHeight,
                        buttons: [{
                            "text": "Update",
                            callback: function (popuid, button) {
                                if (isShowUpdateDisplayName) {
                                    if (!mu.checkValidUser('#txtChangeDisplayName', '#showErrorChangeUserName', "Display Name")) {
                                        $('#showErrorChangeUserName').removeClass("hidden");
                                        return;
                                    }
                                }
                                $(button).wait();
                                mu.updateUserPolicy(userId, popuid, isUpdateDisplayName, isShowUpdateDisplayName);
                            }
                        }],
                        multiple: false, dialog: true
                    });
                    mu.bindDataPolicy(rs);
                    //update table
                    //mu.getData();
                }
            }
        , error: function (e) {
        }
        });
    };

    mu.updateUserInformation = function (custId, popuid) {
        var accid = parseInt($("#hUserID").val());
        var groupid = parseInt($('#hABDGroupID').val());
        var firstName = $('#txtChangeDisplayName').val();
        $.ajax({
            type: "POST",
            url: "UpdateAdminInfo",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"firstname":"' + firstName + '", "accid": ' + accid + ', "custid": ' + custId + ', "groupid": ' + groupid + '}',
            success: function (rs) {
                if (typeof rs == "object" && rs.ErrorCode > 0) {
                    mu.showError(rs.ErrorMessage + ". Function Change Diplay Name.");
                }
                else {
                    mu.showSuccess(strUpdateUserInformation);
                }
                setTimeout(function () {
                    $('#msg').fadeOut(500);
                }, 3000);
                closePopup(popuid);
            }
        , error: function (e) {
            closePopup(popuid);
        }
        });
    };

    mu.getChangedData = function () {
        var arrBeforeEdit = this.policiesDataBeforeEdit.split(";");
        var arrEdited = this.getCurrentPoliciesData().split(";");

        var arrOldPoliciesData = [];
        var arrPoliciesEdited = [];

        for (var i = 0; i < this.ABDAllFuncIds.length; ++i) {
            var valueBeforeEdit = this.getValueOfFuncId(arrBeforeEdit, this.ABDAllFuncIds[i]);
            var valueEdited = this.getValueOfFuncId(arrEdited, this.ABDAllFuncIds[i]);
            if (valueBeforeEdit != valueEdited) {
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

    mu.getValueOfFuncId = function (arrPolicies, funcId) {
        for (var i = 0; i < arrPolicies.length; ++i) {
            var dic = arrPolicies[i].split(",");
            if (dic[0] == funcId.toString()) {
                return dic[1];
            }
        }
        return "";
    };

    mu.appendParentAtOld = function (arr, funcId) {
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

    mu.appendParentAtNew = function (arr, funcId) {
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

    mu.findNodeInFunctionTrees = function (trees, funcId) {
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

    mu.getCurrentPoliciesData = function () {
        this.FuncIds = [];
        $("#tbodyUserPol").find("tr").each(function () {
            var cbxRead = $(this).find("input[cbxRead]");
            var cbxHost = $(this).find("input[cbxHost]");
            var funcId = $(this).find("input[funcid]").val();
            if (!cbxRead.get(0).checked && !cbxHost.get(0).checked) return;
            if (cbxRead.get(0).checked && cbxHost.get(0).checked) {
                mu.FuncIds.push(funcId + "," + 3);
            }
            else if (cbxRead.get(0).checked) {
                mu.FuncIds.push(funcId + "," + 1);
            }
            else if (cbxHost.get(0).checked) {
                mu.FuncIds.push(funcId + "," + 2);
            }
        });
        for (var i = 0; i < this.ABDAllFuncIds.length; ++i) {
            if (!this.isExisted(this.ABDAllFuncIds[i])) {
                this.FuncIds.push(this.ABDAllFuncIds[i] + "," + 0);
            }
        }
        return this.FuncIds.join(";");
    };

    mu.isExisted = function (id) {
        for (var i = 0; i < mu.FuncIds.length; ++i) {
            if (parseInt(mu.FuncIds[i].split(',')[0]) == id) return true;
        }
        return false;
    };

    mu.updateUserPolicy = function (custId, popuid, isUpdateDisplayName, isShowUpdateDisplayName) {
        var data = this.getChangedData();
        var userId = parseInt($("#hUserID").val());

        if (data.policiesDataEdited == "") {

            if (isShowUpdateDisplayName) {
                mu.updateUserInformation(custId, popuid);
                setTimeout(function () {
                    mu.getData(true);
                }, 5000);
            };

            return;
        }

        $.ajax({
            type: "POST",
            url: "UpdateAdminPolicy",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"memberPolicies":"' + data.policiesDataEdited + '", "oldMemberPolicies": "' + data.policiesDataBeforeEdit + '", "userID": ' + userId + ', "custID": ' + custId + '}',
            success: function (rs) {
                if (typeof rs == "string" && rs != "") {
                    mu.showError(rs);
                }
                else {
                    if (isShowUpdateDisplayName) {
                        mu.updateUserInformation(custId, popuid);
                        //setTimeout(mu.getData, 5000);
                        setTimeout(function () {
                            mu.getData(true);
                        }, 5000);
                    };
                    if (typeof isUpdateDisplayName === 'undefined' || isUpdateDisplayName === false) {
                        mu.showSuccess(strUpdateRoleSuccess);
                        mu.policiesDataBeforeEdit = mu.getCurrentPoliciesData();
                    };
                }
                setTimeout(function () {
                    $('#msg').fadeOut(500);
                }, 3000);
                closePopup(popuid);
            }
        , error: function (e) {
            closePopup(popuid);
        }
        });
    };

    mu.bindDataPolicy = function (table) {
        var width = 775;
        var height = 343;
        mu.functionTrees = table;
        $("#scriptTempaltePolicy").tmpl(this.buildTableTree(table)).appendTo($("#tbodyUserPol").empty());
        $("#tbodyUserPol").find("tr").each(function () {
            var hiddenLevel = $(this).find("input[level]");
            var hTotalSub = $(this).find("input[TotalSub]");
            var spanIcon = $(this).find("span[icon]");
            var spanFuncName = $(this).find("span[funcname]");
            if (parseInt($(hTotalSub).val()) != 0) {
                $(spanFuncName).css("font-weight", "bold");
            }
            mu.buildLevelPadding(spanIcon, $(hiddenLevel).val());
        });
        $("#policyGrid").removeClass("hidden").reRenderScroller(width, height, true);
        mu.initGridUserPolEvent();
        this.policiesDataBeforeEdit = this.getCurrentPoliciesData();
    };

    mu.initGridUserPolEvent = function () {
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
                    if (!mu.haveOneCheckedInSameLevelAndParent(cbx, tr)) {
                        if ($(tr).attr("parentID") != "0") {
                            var parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(tr).attr("parentID") + "']");
                            if ($(this).attr("cbxRead") == "true") {
                                $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                            }
                            else {
                                $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                            }
                            if (!mu.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                                parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                                while (parentFunc_tr.length > 0) {
                                    if ($(this).attr("cbxRead") == "true") {
                                        $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                                    }
                                    else {
                                        $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                                    }
                                    parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                                    if (parentFunc_tr.length < 0 || mu.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
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
                    mu.uncheckedHost($(tr).find("input[cbxHost]"));
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

    mu.haveOneCheckedInSameLevelAndParent = function (cbx, tr) {
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

    mu.uncheckedHost = function (cbx) {
        $(cbx).get(0).checked = false;
        var tr = $(cbx).parents("tr:first");
        //all parents will be un-check

        //------------------------------------------------
        //section 1
        //find all tr which have same level and same parent
        if (!mu.haveOneCheckedInSameLevelAndParent(cbx, tr)) {
            if ($(tr).attr("parentID") != "0") {
                var parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(tr).attr("parentID") + "']");
                if ($(cbx).attr("cbxRead") == "true") {
                    $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                }
                else {
                    $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                }
                if (!mu.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
                    parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                    while (parentFunc_tr.length > 0) {
                        if ($(cbx).attr("cbxRead") == "true") {
                            $(parentFunc_tr).find("input[cbxRead]").get(0).checked = false;
                        }
                        else {
                            $(parentFunc_tr).find("input[cbxHost]").get(0).checked = false;
                        }
                        parentFunc_tr = $("#tbodyUserPol").find("tr[_id='" + $(parentFunc_tr).attr("parentID") + "']");
                        if (parentFunc_tr.length < 0 || mu.haveOneCheckedInSameLevelAndParent(cbx, parentFunc_tr)) {
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

    mu.buildLevelPadding = function (span, level) {
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

    mu.buildTableTree = function (table, t, l) {
        var level = 1;
        if (typeof l != "undefined") level = l + 1;
        if (typeof table == "undefined") return [];
        var _table = [];
        if (typeof t != "undefined") _table = t;
        for (var i = 0; i < table.length; ++i) {
            if (typeof t == "undefined") {
                if (table[i].FuncName != $("#hSystemName").val()) continue;
            }

            mu.ABDAllFuncIds[mu.ABDAllFuncIds.length] = table[i].ID;

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
    mu.punterCodeIsValid = function (str) {
        /*var re = /^[a-zA-Z_0-9]$/;
        return re.test(str);*/
        if (str.indexOf("'") >= 0
        || str.indexOf("<") >= 0
        || str.indexOf(">") >= 0
        || str.indexOf("\\") >= 0
        || str.indexOf("/") >= 0
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
    mu.init();
    mu.insertUser = {};
    mu.checkValidUser = function (idUserNameTextbox, msgTargetID, typeOfName) {
        if ($(idUserNameTextbox).val() == '') {
            this.showError(typeOfName + " is invalid!", msgTargetID);
            $(idUserNameTextbox).focus();
            return false;
        }
        if (!this.punterCodeIsValid($(idUserNameTextbox).val())) {
            this.showError(typeOfName + " is invalid!", msgTargetID);
            $(idUserNameTextbox).focus();
            return false;
        }
        if ($(idUserNameTextbox).val().length > 254) {
            this.showError("Max length of " + typeOfName + " is 254 characters!", msgTargetID);
            $(idUserNameTextbox).focus();
            return false;
        }
        return true;
    };
    mu.checkMatchPassword = function (userPassID, confirmPassID, msgTargetID, insertUser) {
        var pass = $(userPassID);
        var confirm = $(confirmPassID);
        if (insertUser) {
            if ($("#txtNewUserName").val().indexOf(" ") != -1) {
                this.showError("User Name cannot contain space.", msgTargetID);
                $("#txtNewUserName").focus();
                return false;
            }
            if (!this.checkValidUser("#txtNewUserName", msgTargetID, "User Name") || !this.checkValidUser("#txtDisplayName", msgTargetID, "Display Name"))
                return false;
        }
        if (pass.val() == '') {
            this.showError(strPasswordEmpty, msgTargetID);
            pass.focus();
            return false;
        }
        if (pass.val().trim().length < 4) {
            this.showError(strPassswordAtLeast4, msgTargetID);
            pass.focus();
            return false;
        }
        if (confirm.val() == '') {
            this.showError(strConfirmPassword, msgTargetID);
            confirm.focus();
            return false;
        }

        if (confirm.val().trim() != pass.val().trim()) {
            this.showError(strPasswordNotCorrectConfirm, msgTargetID);
            confirm.focus();
            return false;
        }
        return true;
    };

    mu.assignDefaultPunterCodes = function () {
    };

    mu.actWhenInsertAdminSucess = function (rs, popuid, button) {
        //acc when inseert success
        $('#insertPopUpMsg').hide();
        $("#userGrantPermission").removeClass("hidden");
        $("#lblPleaseWait").show();
        $("#hdNewUserID").val(rs.slice(2));
        $("#popUpNeedClose").val(popuid);
        $("#createUserlayout").css("margin-top", "0px");
        //add default punter code
        $.ajax({
            type: "POST",
            url: "AssignDefaultPunterCodeToAdmin",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"adminId":"' + $("#hdNewUserID").val() + '"}',
            success: function (rsPunter) {
                if (rsPunter.ErrorCode == 0) {
                    //show message and reload grid data
                    $("#lblPleaseWait").hide();
                    $("#lblGoToGrantPer").show();
                    $(button).unwait();

                    setTimeout(function () {
                        mu.getData(true);
                    }, 2000);

                    //bind event to grant permission
                    $("#lblGoToGrantPer").click(function () {
                        $("#createUserlayout").css("margin-top", "20px");
                        closePopup($("#popUpNeedClose").val());
                        $("#userGrantPermission").addClass("hidden");
                        mu.showUserPolicy(parseInt($("#hdNewUserID").val()), $("#txtNewUserName").val().toString(), false);
                    });
                }
                else {
                    mu.rsPunter(rs, "#insertPopUpMsg");
                    $(button).unwait();
                }
            }
        });
    };

    $("#btnAddNewUser").click(function () {
        $("#txtNewUserName").val('').focus();
        $("#txtNewUserPass").val('');
        $("#txtNewUserConfirmPassword").val('');
        $("#txtDisplayName").val('');
        $("#createUserlayout").removeClass("hidden");
        $("#createUserlayout").css("margin-top", "20px");
        $('#insertPopUpMsg').hide();
        $("#lblPleaseWait").hide();
        $("#lblGoToGrantPer").hide();
        showPopup
                ({
                    content: $("#createUserSection"),
                    title: "Add New User",
                    width: 440,
                    height: 320,
                    buttons: [
                         {
                             "text": "Reset",
                             callback: function (popid, button) {
                                 $("#txtNewUserName").val('').focus();
                                 $("#txtNewUserPass").val('');
                                 $("#txtNewUserConfirmPassword").val('');
                                 $("#txtDisplayName").val('');
                                 $('#insertPopUpMsg').hide();
                             }
                         },
                        {
                            "text": "Submit",
                            callback: function (popuid, button) {
                                if (mu.checkMatchPassword("#txtNewUserPass", "#txtNewUserConfirmPassword", "#insertPopUpMsg", true)) {
                                    $(button).wait();
                                    $.ajax({
                                        type: "POST",
                                        url: "InsertAdmin",
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        data: '{"firstname":"' + $("#txtDisplayName").val() + '", "lastname": "' + "" + '", "userid": "' + $("#hUserID").val().toString() + '", "username": "' + $("#txtNewUserName").val().toString() + '", "password": "' + $("#txtNewUserPass").val().toString() + '"}',
                                        success: function (rs) {
                                            if (rs[0] === 'o' && rs[1] === 'k') {
                                                var timeId = setTimeout(function () {
                                                    mu.actWhenInsertAdminSucess(rs, popuid, button);
                                                    clearTimeout(timeId);
                                                }, 3000);
                                            }
                                            else {
                                                mu.showError(rs, "#insertPopUpMsg");
                                                $(button).unwait();
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ],
                    multiple: false, dialog: true
                });
    });
});