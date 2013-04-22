var pc = {
    panel: {},
    gridpl: {},
    member: {},
    user: {},
    utils: {},
    moneyMax: 912337203685477.5807
};

pc.panel.init = function () {
    //btnToggle
    $('#btnToggle').click(function () {
        $("#divAddPunterCode").toggle("fast");
        if ($("#contentSection").css("padding-top") == "155px") {
            $("#contentSection").css("padding-top", "75px");
        } else {
            $("#contentSection").css("padding-top", "155px");
        }
    });

    //get currency list
    this.getCurrencyList();

    //abt danger
    this.initABTDangerFilter();

    //fill punter color dropdownlist
    this.fillPunterColor();

    //tbxPunterCode
    $("#tbxPunterCode").resMaxLength(10);

    //tbxFBAH
    $("#tbxFBAH").ForceDecimalOnly().ForceCurrencyOnly();

    //tbxFBOU
    $("#tbxFBOU").ForceDecimalOnly().ForceCurrencyOnly();

    $("#tbxFB1x2").ForceDecimalOnly().ForceCurrencyOnly();

    //selPunterColor
    var foption = $("#selPunterColor").find("option:first");
    $("#selPunterColor").change(function () {
        if (!$.browser.msie) {
            var option = $("#selPunterColor").find("option[value='" + $(this).val() + "']");
            $("#selPunterColor").css("color", option.attr("c")).css("background-color", $(this).val());
        }
    }).css("color", foption.attr("c"));

    //divLabelHeaderPunterCode
    $("#divLabelHeaderPunterCode").click(function (e) {
        var target = e.target;
        $(this).hide();
        $(this).parent().append("<div class='w100' editor='true'><input type='text' class='inputtext' style='width:94px' /></div>");
        var textbox = $(this).parent().find("input");
        textbox.focus();
        textbox.focusout(function (e) {
            $(this).parent().remove();
            $(target).show();
        });
        textbox.keyup(function (e) {
            if (e.keyCode == 27) {
                $(this).parent().remove();
                $(target).show();
            }
            if (e.keyCode == 13) {
                if ($(this).val().replace(/ /g, '') == "") {
                    pc.gridpl.bindDataGrid(pc.gridpl.concatVM4Paging());
                    pc.gridpl.initPager(pc.gridpl.vm.length, pc.gridpl.pageSize, pc.gridpl.pageIndex);
                }
                else {
                    pc.gridpl.pageSize = 50;
                    pc.gridpl.pageIndex = 0;
                    var vm = jlinq.from(pc.gridpl.vm).contains("PunterCode", $(this).val()).select();
                    pc.gridpl.bindDataGrid(pc.gridpl.concatVM4PagingOnSearch(vm));
                    pc.gridpl.initPager(vm.length, pc.gridpl.pageSize, pc.gridpl.pageIndex);
                }
            }
        });
    });
};

pc.panel.fillPunterColor = function () {
    $("#selPunterColor").empty();
    var arr = colorFilter.split(',');
    colorFilter = [];
    for (var i = 0; i < arr.length; ++i) {
        var p = arr[i].split(';');
        colorFilter[i] = {
            "Value": p[0],
            "Name": p[1],
            "Color": p[2]
        };
    }
    for (var j = 0; j < arr.length; ++j) {
        $("#selPunterColor").append("<option value='" + colorFilter[j].Value + "' c='" + colorFilter[j].Color + "'>" + colorFilter[j].Name + "</option>");
    }
    $("#selPunterColor").find("option").each(function (index, element) {
        $(this).css("background-color", $(this).attr("value"));
        $(this).css("color", $(this).attr("c"));
    });
    $("#selPunterColor").find("option:first").attr("selected", "selected");
    if (!$.browser.msie) {
        $("#selPunterColor").css("background-color", $("#selPunterColor").find("option:first").val());
    }
    $("#selPunterColor").css("color", $("#selPunterColor").find("option:first").attr("c"));
};

pc.utils.checkLargeMoney = function (str) {
    str = str.replace(/,/g, '');
    if (str.indexOf('.') > 0 && str.indexOf('e') < 0) {
        str = str.substr(0, str.indexOf('.'));
    }
    if (str.length > 15) return true;
    return false;
};

pc.panel.getCurrencyList = function () {
    jlinq.from(listCurrency).sort("Currency").select();
    $("#selCurrency").empty();
    for (var i = 0; i < listCurrency.length; ++i) {
        $("#selCurrency").append("<option value='" + listCurrency[i].ExchangeId + "'>" + listCurrency[i].Currency + "</option>");
    }
    $("#selCurrency").find("option:first").attr("selected", "selected");
};

pc.panel.initABTDangerFilter = function () {
    $("#ddlFilterDanger").empty();
    $("#ddlFilterDanger").append('<option value="0" selected="selected">All</option>');
    var arr = abtDangerConfig.split(',');
    for (var i = 0; i < arr.length; ++i) {
        $("#ddlFilterDanger").append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
    }
};

pc.gridpl.init = function () {
    pc.gridpl.pageSize = 50;
    pc.gridpl.pageIndex = 0;

    pc.gridpl.gridWidth = 1090;
    pc.gridpl.gridHeight = 500;

    this.getData();
};

pc.gridpl.refresh = function () {
    this.getData();
};

pc.gridpl.getData = function () {
    $("#btnRefresh").wait();
    $.ajax({
        type: "POST",
        url: "GetPunterList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: null,
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            pc.gridpl.vm = rs;
            pc.gridpl.bindDataGrid(pc.gridpl.concatVM4Paging());
            pc.gridpl.initPager(pc.gridpl.vm.length, pc.gridpl.pageSize, pc.gridpl.pageIndex);
            $("#btnRefresh").unwait();
        },
        error: function () {
            $("#btnRefresh").unwait();
        }
    });
};

pc.gridpl.concatVM4Paging = function () {
    var vm = pc.gridpl.cloneVM(pc.gridpl.vm);
    if (vm.length <= this.pageSize) {
        //sort
        if (typeof pc.gridpl.sortOrder == "undefined") {
            //vm = jlinq.from(vm).sort("-PunterCode").select();
        }
        else if (pc.gridpl.sortOrder == 1) {
            //vm = jlinq.from(vm).sort("PunterCode").select();
        }
        else {
            //vm = jlinq.from(vm).sort("-PunterCode").select();
        }
        return vm;
    }
    var _vm = [];

    var start = pc.gridpl.pageIndex * pc.gridpl.pageSize;
    var end = 0;

    if (vm.length < (start + pc.gridpl.pageSize)) {
        end = vm.length;
    }
    else {
        end = start + pc.gridpl.pageSize;
    }

    for (var i = start; i < end; ++i) {
        _vm[_vm.length] = vm[i];
    }
    //sort
    if (typeof pc.gridpl.sortOrder == "undefined") {
        //_vm = jlinq.from(_vm).sort("-PunterCode").select();
    }
    else if (pc.gridpl.sortOrder == 1) {
        //_vm = jlinq.from(_vm).sort("PunterCode").select();
    }
    else {
        //_vm = jlinq.from(_vm).sort("-PunterCode").select();
    }
    return _vm;
};

pc.gridpl.concatVM4PagingOnSearch = function (_vm) {
    var vm = pc.gridpl.cloneVM(_vm);
    if (vm.length <= this.pageSize) {
        //sort
        if (typeof pc.gridpl.sortOrder == "undefined") {
            //vm = jlinq.from(vm).sort("-PunterCode").select();
        }
        else if (pc.gridpl.sortOrder == 1) {
            //vm = jlinq.from(vm).sort("PunterCode").select();
        }
        else {
            //vm = jlinq.from(vm).sort("-PunterCode").select();
        }
        return vm;
    }
    var _vm = [];

    var start = pc.gridpl.pageIndex * pc.gridpl.pageSize;
    var end = 0;

    if (vm.length < (start + pc.gridpl.pageSize)) {
        end = vm.length;
    }
    else {
        end = start + pc.gridpl.pageSize;
    }

    for (var i = start; i < end; ++i) {
        _vm[_vm.length] = vm[i];
    }
    //sort
    if (typeof pc.gridpl.sortOrder == "undefined") {
        //_vm = jlinq.from(_vm).sort("-PunterCode").select();
    }
    else if (pc.gridpl.sortOrder == 1) {
        //_vm = jlinq.from(_vm).sort("PunterCode").select();
    }
    else {
        //_vm = jlinq.from(_vm).sort("-PunterCode").select();
    }
    return _vm;
};

pc.gridpl.bindDataGrid = function (vm, isInit) {
    this.isEditting = false;
    if (typeof isInit == "undefined") {
        //vm = jlinq.from(vm).sort("PunterCode").select();
    }
    var dec = 4;
    $(vm).each(function (index, element) {
        element.index = index + 1;
        element.ColorName = pc.gridpl.getColorName(element.Color);
        element.FBAH = NumberFormatString(element.FBAH, dec);
        element.FBOU = NumberFormatString(element.FBOU, dec);
        element.FB1x2 = NumberFormatString(element.FB1x2, dec);
        element.Currency = pc.utils.getCurrency(element.ExchangeId);
    });
    if (vm.length > 0) {
        $("#scriptPunterList").tmpl(vm).appendTo($("#tbodyPunterList").empty());
    }
    else {
        $("#stPunterListEmpty").tmpl({ "noinfo": true }).appendTo($("#tbodyPunterList").empty());
    }
    this.buildMemberColumn();
    $("#punterList").removeClass("hidden"); //.reRenderScroller(pc.gridpl.gridWidth, pc.gridpl.gridHeight, true);
};

pc.gridpl.buildMemberColumn = function () {
    $("#tbodyPunterList").find("div[f_member]").each(function (index, element) {
        var totalMember = parseInt($(this).attr("totalmember"));
        var userName = $(this).attr("username");
        var punterCodeId = $(this).attr("puntercodeid");
        var _color = $(this).attr("_color");
        var puntercode = $(this).attr("puntercode");
        var enabled = $(this).attr("enabled");
        $(this).find("img[iconadd]").show();
        if (totalMember == 0) {
            //$(this).html("&nbsp;");
            $(this).find("img[iconadd]").show();
        }
        else if (totalMember == 1) {
            if (userName == "") { //ABT danger = 2
                $(this).append("<span style='text-decoration:underline' class='blue' onclick='javascript:pc.gridpl.getMembers(\"" + punterCodeId + "\", \"" + _color + "\", \"" + puntercode + "\", \"" + enabled + "\");'>" + totalMember + "</span>");
                if (enabled == "false") {
                    $(this).find("span").removeAttr("onclick").css("text-decoration", "none").css("cursor", "default");
                }
                $(this).find("img[iconadd]").show();
            }
            else {
                $(this).append("<span style='text-decoration:underline' class='blue' onclick='javascript:pc.gridpl.getMembers(\"" + punterCodeId + "\", \"" + _color + "\", \"" + puntercode + "\", \"" + enabled + "\");'>" + userName + "</span>");
                if (enabled == "false") {
                    $(this).find("span").removeAttr("onclick").css("text-decoration", "none").css("cursor", "default");
                }
                $(this).find("img[iconadd]").show();
            }
        }
        else { //totalmember > 1, and all members has ABT danger = 2
            $(this).append("<span style='text-decoration:underline' class='blue' onclick='javascript:pc.gridpl.getMembers(\"" + punterCodeId + "\", \"" + _color + "\", \"" + puntercode + "\", \"" + enabled + "\");'>" + totalMember + "</span>");
            if (enabled == "false") {
                $(this).find("span").removeAttr("onclick").css("text-decoration", "none").css("cursor", "default");
            }
            $(this).find("img[iconadd]").show();
        }
        //do with assign user
    });
    $("#tbodyPunterList").find("div[f_user]").each(function (index, element) {
        $(this).find("img[iconadd]").show();
        var totaluser = parseInt($(this).attr("totaluser"));
        var userName = $(this).attr("username");
        var puntercode = $(this).attr("puntercode");
        var punterCodeId = $(this).attr("puntercodeid");
        var enabled = $(this).attr("enabled");
        $(this).append("<span style='text-decoration:underline' class='blue' onclick='javascript:pc.gridpl.getUsers(\"" + punterCodeId + "\", \"" + puntercode + "\", \"" + enabled + "\");'>" + totaluser + "</span>");
        if (enabled == "false") {
            $(this).find("span").removeAttr("onclick").css("text-decoration", "none").css("cursor", "default");
        }
    });
};
pc.panel.punterCodeIsValid = function (str) {
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

pc.panel.addPunterCode = function (e) {
    pc.utils.hideMessage();
    var _val = $("#tbxPunterCode").val().replace(/ /g, '');
    if (_val == "") {
        pc.utils.showError("Please input punter code!");
        return;
    }

    if (_val.length > 10) {
        pc.utils.showError("Max length of punter code is 10 characters!");
        $("#tbxPunterCode").val(_val.substr(0, 9));
        return;
    }

    if (!pc.panel.punterCodeIsValid(_val)
    ) {
        pc.utils.showError("Punter Code is invalid!");
        return;
    }

    if (
        isNaN(
            parseFloat($("#tbxFBAH").val().replace(/,/g, ""))
            )
        ) {
        pc.utils.showError("FBAH's value is invalid! ");
        return;
    }

    if (
            isNaN(
                parseFloat($("#tbxFBOU").val().replace(/,/g, ""))
                )
        ) {
        pc.utils.showError("FBOU's value is invalid! ");
        return;
    }

    if (
            isNaN(
                parseFloat($("#tbxFB1x2").val().replace(/,/g, ""))
                )
        ) {
        pc.utils.showError("FB 1x2's value is invalid! ");
        return;
    }

    if (parseFloat($("#tbxFBAH").val().replace(/,/g, "")) < 0) {
        pc.utils.showError("FBAH's value is invalid! ");
        return;
    }

    if (parseFloat($("#tbxFBOU").val().replace(/,/g, "")) < 0) {
        pc.utils.showError("FBOU's value is invalid! ");
        return;
    }

    if (parseFloat($("#tbxFB1x2").val().replace(/,/g, "")) < 0) {
        pc.utils.showError("FB 1x2's value is invalid! ");
        return;
    }

    if (pc.utils.checkLargeMoney($("#tbxFBAH").val())) {
        pc.utils.showError("FBAH's value is so large! ");
        return;
    }

    if (pc.utils.checkLargeMoney($("#tbxFBOU").val())) {
        pc.utils.showError("FBOU's value is so large! ");
        return;
    }

    if (pc.utils.checkLargeMoney($("#tbxFB1x2").val())) {
        pc.utils.showError("FB 1x2's value is so large! ");
        return;
    }

    var target = typeof e.srcElement == "undefined" ? e.target : e.srcElement;

    var fbah = $("#tbxFBAH").val().replace(/,/g, '');
    if (fbah == "") fbah = "0";
    var fbou = $("#tbxFBOU").val().replace(/,/g, '');
    if (fbou == "") fbou = "0";
    var fb1x2 = $("#tbxFB1x2").val().replace(/,/g, '');
    if (fb1x2 == "") fb1x2 = "0";

    fbah = parseFloat(fbah);
    fbou = parseFloat(fbou);
    fb1x2 = parseFloat(fb1x2);

    if (fbah > pc.moneyMax) {
        pc.utils.showError("FBAH's value is so large! ");
        return;
    }

    if (fbou > pc.moneyMax) {
        pc.utils.showError("FBOU's value is so large! ");
        return;
    }

    if (fb1x2 > pc.moneyMax) {
        pc.utils.showError("FB 1x2's value is so large! ");
        return;
    }

    $(target).wait();

    $.ajax({
        type: "POST",
        url: "InsertPunterCode",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"userId\": " + $("#hUserID").val() + ", \"punterCode\": \"" + $("#tbxPunterCode").val().replace(/ /g, '')
             + "\", \"color\": \"" + $("#selPunterColor").val()
             + "\", \"fbAh\": " + fbah
             + ", \"fbOu\": " + fbou
             + ", \"fb1x2\": " + fb1x2 + "}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) {
                $(target).unwait();
                return;
            }
            if (rs != "") {
                pc.utils.showError(rs);
                $(target).unwait();
                return;
            }
            $("#tbxPunterCode").val("");
            $("#tbxFBAH").val(0);
            $("#tbxFBOU").val(0);
            $("#tbxFB1x2").val(0);
            pc.gridpl.getData();
            $(target).unwait();
            pc.utils.showSuccess("Insert successfully!");
        },
        error: function (e) {
            if (typeof e == "undefined" || e == null) return;
            pc.utils.showError(e.toString());
            $(target).unwait();
        }
    });
};

//user management

pc.gridpl.getUsers = function (punterCodeId, puntercode, enabled) {
    if (pc.gridpl.isRunning) return;

    if (enabled == "false") {
        return;
    }
    pc.utils.hideMessage();

    //avoid double-click. inportant!
    pc.gridpl.isRunning = true;

    $.ajax({
        type: "POST",
        url: "GetAdminByPunterCodeId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"punterCodeId\": " + punterCodeId + "}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            //sort data
            jlinq.from(rs).sort("UserName").select();
            $(rs).each(function (index, element) {
                element.index = index + 1;
            });
            pc.gridpl.showUsers(rs, punterCodeId, puntercode, enabled);
        }
    });
};
pc.gridpl.vmOld = [];
pc.gridpl.showUsers = function (vm, punterCodeId, puntercode, enabled) {
    pc.gridpl.vmOld = vm.slice();

    $("#divMsgEditUser").hide();
    $("#stUserList").tmpl(vm).appendTo($("#tbodyUserList").empty());
    var height = 20 * vm.length + 160;
    if (vm.length > 20) height = 500;
    showPopup
    ({
        content: $("#divPopupUserList"),
        title: puntercode + " - Assign Punter Code",
        width: 420,
        height: height,
        buttons: [{
            "text": "Submit",
            callback: function (popuid, button) {
                pc.gridpl.removeUser(punterCodeId, popuid, button);
            }
        }],
        multiple: false, dialog: true
    });
    
    $("#divUserList").removeClass("hidden").reRenderScroller(349, height - 102, true);
    var timerId = setTimeout(function () {
        pc.gridpl.isRunning = false;
        clearTimeout(timerId);
    }, 500);
};

pc.gridpl.removeUser = function (punterCodeId, popuid, button) {
    var arrCheckBoxs = $("#divPopupUserList").find("input[userid]");
    var custidsAdd = [];
    var custidsRemove = [];
    $(arrCheckBoxs).each(function (index, element) {
        if ($(this).prop('checked') != pc.gridpl.vmOld[index].IsAssign) {
            if (element.checked && pc.gridpl.vmOld[index].IsAssign == false) {
                custidsAdd[custidsAdd.length] = $(element).attr("userid");
            }
            else {
                if (pc.gridpl.vmOld[index].IsAssign == true)
                    custidsRemove[custidsRemove.length] = $(element).attr("userid");
            }
        }
    });
    if (custidsAdd.length <= 0 && custidsRemove.length <= 0) return;

    $(button).wait();
    //alert(custids.join(','));
    $.ajax({
        type: "POST",
        url: "AssignAndRemoveAdminOfPunterCode",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"puntercodeId\": " + punterCodeId + ", \"adminIdsAssign\": \"" + custidsAdd.join(',') + "\", \"adminIdsRemove\": \"" + custidsRemove.join(',') + "\"}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            if (rs.ErrorCode > 0) {
                $("#divMsgEditUser").addClass("error").html(rs.ErrorMessage).show();
                setTimeout(function () {
                    pc.user.fillGridUserAfterRemove(punterCodeId, popuid, button);
                    $("#divMsgEditUser").hide().removeAttr("class");
                }, 3000);
                $(button).unwait();
                return;
            }
            if (custidsAdd.length > 0 || custidsRemove.length > 0) {
                $("#divMsgEditUser").addClass("success").html("Update successfully!").show();
            }
            var timerId = setTimeout(function () {
                pc.gridpl.getData();
                pc.user.fillGridUserAfterRemove(punterCodeId, popuid, button);
                $("#divMsgEditUser").hide().removeAttr("class");
                clearTimeout(timerId);
            }, 3000);
        },
        error: function (e) {
            $("#divMsgEditUser").addClass("error").html(e.toString()).show();
            $(button).unwait();
        }
    });
};

pc.user.fillGridUserAfterRemove = function (punterCodeId, popuid, button) {
    $.ajax({
        type: "POST",
        url: "GetAdminByPunterCodeId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"punterCodeId\": " + punterCodeId + "}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            jlinq.from(rs).sort("UserName").select();
            $(rs).each(function (index, element) {
                element.index = index + 1;
            });
            $("#stUserList").tmpl(rs).appendTo($("#tbodyUserList").empty());
            var height = 20 * rs.length + 110;
            if (rs.length > 20) height = 400;
            $("#divUserList").removeClass("hidden").reRenderScroller(349, height, true);
            pc.gridpl.vmOld = rs.slice();
            $(button).unwait();
        },
        error: function () {
            $(button).unwait();
        }
    });
};

//member management
pc.gridpl.getMembers = function (punterCodeId, color, puntercode, enabled) {
    if (pc.gridpl.isRunning) return;

    if (enabled == "false") {
        return;
    }
    pc.utils.hideMessage();

    //avoid double-click. inportant!
    pc.gridpl.isRunning = true;

    $.ajax({
        type: "POST",
        url: "GetMemberByPunterCodeId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"punterCodeId\": " + punterCodeId + "}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            $(rs).each(function (index, element) {
                element.index = index + 1;
                element.Color = color;
            });
            pc.gridpl.showMembers(rs, punterCodeId, color, puntercode, enabled);
        }
    });
};

pc.gridpl.showMembers = function (vm, punterCodeId, color, puntercode, enabled) {
    $("#divMsgEditMember").hide();
    $("#stMemberList").tmpl(vm).appendTo($("#tbodyMemberList").empty());
    var height = 20 * vm.length + 160;
    if (vm.length > 20) height = 500;
    showPopup
    ({
        content: $("#divPopuMemberList"),
        title: puntercode + " - Member Management",
        width: 420,
        height: height,
        buttons: [{
            "text": "Submit",
            callback: function (popuid, button) {
                pc.gridpl.removeMember(punterCodeId, popuid, button, color);
            }
        }],
        multiple: false, dialog: true
    });
    $("#divMemberList").removeClass("hidden").reRenderScroller(349, height - 100, true);
    var timerId = setTimeout(function () {
        pc.gridpl.isRunning = false;
        clearTimeout(timerId);
    }, 500);
};

pc.gridpl.removeMember = function (punterCodeId, popuid, button, color) {
    var arrCheckBoxs = $("#divPopuMemberList").find("input[memberid]");
    var custids = [];
    $(arrCheckBoxs).each(function (index, element) {
        if (element.checked) {
            custids[custids.length] = $(element).attr("memberid");
        }
    });
    if (custids.length <= 0) return;
    $(button).wait();
    $.ajax({
        type: "POST",
        url: "RemoveMeberFromPunterCode",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"puterId\": " + punterCodeId + ", \"userId\": " + $("#hUserID").val() + ", \"custids\": \"" + custids.join(',') + "\"}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            if (rs != "") {
                $("#divMsgEditMember").addClass("error").html(rs).show();
                $(button).unwait();
                return;
            }
            if (custids.length > 0) {
                $("#divMsgEditMember").addClass("success").html("Remove successfully!").show();
            }
            var timerId = setTimeout(function () {
                clearTimeout(timerId);
                $("#divMsgEditMember").hide().removeAttr("class");
            }, 4000);
            pc.gridpl.getData();
            pc.member.fillGridMemberAfterRemove(punterCodeId, popuid, button, color);
        },
        error: function (e) {
            if (typeof rs != "undefined" && rs != null) {
                $("#divMsgEditMember").addClass("error").html(e.toString()).show();
            }
            $(button).unwait();
        }
    });
};

pc.member.fillGridMemberAfterRemove = function (punterCodeId, popuid, button, color) {
    $.ajax({
        type: "POST",
        url: "GetMemberByPunterCodeId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"punterCodeId\": " + punterCodeId + "}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            $(rs).each(function (index, element) {
                element.index = index + 1;
                element.Color = color;
            });
            $("#stMemberList").tmpl(rs).appendTo($("#tbodyMemberList").empty());
            var height = 20 * rs.length + 140;
            if (rs.length > 20) height = 500;
            $("#divMemberList").removeClass("hidden"); //.reRenderScroller(349, height, true);
            $(button).unwait();
        },
        error: function () {
            $(button).unwait();
        }
    });
};

pc.gridpl.initPager = function (total_item, items_per_page, current_page) {
    var opt = {
        callback: function () {
            pc.gridpl.pageSelectCallback(arguments[0], arguments[1], arguments[2]);
        },
        items_per_page: items_per_page,
        current_page: current_page
    };
    $("#pagination").pagination(total_item, opt);
};

pc.gridpl.pageSelectCallback = function (page_index, _items_per_page, jq) {
    var max_page = Math.ceil(pc.gridpl.vm.length / _items_per_page);
    page_index = page_index < max_page ? page_index : max_page - 1;

    pc.gridpl.pageSize = parseInt(_items_per_page);
    pc.gridpl.pageIndex = page_index;
    $("#btnRefresh").wait();

    pc.gridpl.bindDataGrid(pc.gridpl.concatVM4Paging());
    pc.gridpl.initPager(pc.gridpl.vm.length, pc.gridpl.pageSize, pc.gridpl.pageIndex);

    $("#btnRefresh").unwait();
    return false;
};

pc.gridpl.showPopupAddMember = function (punterCodeId, exchangeId, totalMember, PunterCode) {
    $("#divMsgAddMember").hide();
    pc.utils.hideMessage();
    pc.member.exchangeId = exchangeId;
    pc.member.totalMember = totalMember;
    $("#divPopupAddMember").find("input").val("");
    showPopup
    ({
        content: $("#divPopupAddMember"),
        title: "Add Member to " + PunterCode,
        width: 420,
        height: 200,
        buttons: [{
            "text": "Add Member",
            callback: function (popuid, button) {
                $(button).wait();
                pc.gridpl.addMember(punterCodeId, popuid, button);
            }
        }],
        multiple: false, dialog: true
    });
};

//pc.gridpl.showPopupAddUser = function (punterCodeId, totalUser, PunterCode) {
//    $("#divMsgAddUser").hide();
//    pc.user.initSearchUsers(punterCodeId);
//    pc.utils.hideMessage();
//    pc.member.totalUser = totalUser;
//    $("#divPopupAddUser").find("input").val("");
//    showPopup
//    ({
//        content: $("#divPopupAddUser"),
//        title: "Assign " + PunterCode + " to",
//        width: 420,
//        height: 200,
//        buttons: [{
//            "text": "Submit",
//            callback: function (popuid, button) {
//                $(button).wait();
//                pc.gridpl.addUser(punterCodeId, popuid, button, $("#tbxUserInsert").val());
//            }
//        }],
//        multiple: false, dialog: true
//    });
//    $("#tbxUserInsert").keyup(function (e) {
//        if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) return true;
//        else if (e.keyCode == 13) {
//            //mu.search($(this).val());
//        }
//        else {
//            var rows = [];
//            if ($(this).val() != "") {
//                rows = jlinq.from(pc.user.ListUser).starts("UserName", $(this).val()).select();
//                rows = jlinq.from(rows).skip(0).take(10);
//                if (rows.length > 0)
//                    $(this).autoComplete(rows, "UserName");
//                else {
//                    $(this).removeAutoComplete();
//                }
//            }
//            else {
//                $(this).removeAutoComplete();
//            }
//        }
//    });
//};

pc.gridpl.addUser = function (punterCodeId, popuid, button, username) {
    var adminId = -1;
    for (var i = 0; i < pc.user.ListUser.length; i++) {
        if (username === pc.user.ListUser[i].UserName) {
            adminId = pc.user.ListUser[i].UserId;
            break;
        }
    };
    if (adminId === -1) {
        $("#divMsgAddUser").html("Username is not available.").addClass("error").show(); //.hide(3000);
        var idTimeOut = setTimeout(function () {
            $("#divMsgAddUser").hide();
            clearTimeout(idTimeOut);
        }, 3000);
        $(button).unwait();
        return;
    }
    $.ajax({
        type: "POST",
        url: "AssignPunterToAdmin",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"adminId\": " + adminId + ", \"punterCodeId\": " + punterCodeId + "}",
        success: function (rs) {
            if (typeof rs == "object" && rs.ErrorCode > 0) {
                $("#msg").html(rs.ErrorMessage).addClass("error").show(); //.hide(3000);
                var idTimeOut = setTimeout(function () {
                    $("#msg").hide();
                    clearTimeout(idTimeOut);
                }, 3000);
            }
            else {
                pc.utils.showSuccess("Assign successfully. Data copy is in progress, please wait for a while");

                var timerId = setTimeout(function () {
                    pc.gridpl.getData();
                    clearTimeout(timerId);
                }, 3000);
                closePopup(popuid);
            }
            $(button).unwait();
        },
        error: function (e) {
            $("#divMsgAddMember").html(e.toString()).addClass("error").show().hide(3000);
            $(button).unwait();
        }
    });
    closePopup(popuid);
};
pc.gridpl.addMember = function (punterCodeId, popuid, button) {
    $("#divMsgAddMember").hide();
    if ($("#tbxUserNameInsert").val() == "") {
        $("#divMsgAddMember").html("Please input username!").addClass("error").show();
        $(button).unwait();
        return;
    }
    $.ajax({
        type: "POST",
        url: "InsertMemberToPunterCode",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"userId\": " + $("#hUserID").val() + ", \"userName\": \"" + $("#tbxUserNameInsert").val() + "\", \"punterId\": " + punterCodeId + "}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) return;
            rs = rs.split('|');
            if (rs[0] != "") {
                $(button).unwait();
                $("#divMsgAddMember").html(rs[0]).addClass("error").show();
                return;
            }
            pc.utils.showSuccessNoHide("New member added successfully. Data copy is in progress, please wait for a while");
            pc.gridpl.getData();
            closePopup(popuid);
            var timerId = setTimeout(function () {
                pc.gridpl.callSynData(punterCodeId, parseInt(rs[1]));
                clearTimeout(timerId);
            }, 3000);
        },
        error: function (e) {
            if (typeof rs != "undefined" && rs != null) {
                $("#divMsgAddMember").html(e.toString()).addClass("error").show();
            }
            $(button).unwait();
        }
    });
};

pc.gridpl.callSynData = function (punterCodeId, custid) {
    showOverlay();
    $("#btnRefresh").wait();
    $.ajax({
        type: "POST",
        url: "ABTransactionSync",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"puterId\": " + punterCodeId + ", \"custid\": " + custid + "}",
        success: function (rs) {
            hideOverlay();
            if (typeof rs != "undefined" && rs != null && rs != "") {
                var str = '"Copy Again"';
                pc.utils.showError("Data copied unsuccessfully. Please click <span class='blue' onclick='javascript:pc.gridpl.callSynData(" + punterCodeId + ", " + custid + ")'>" + str + "</span> to complete the process");
            }
            else {
                pc.utils.showSuccess("Data copied successfully");
            }
            $("#btnRefresh").unwait();
        },
        error: function (e) {
            hideOverlay();
            pc.utils.hideMessage();
            $("#btnRefresh").unwait();
        }
    });
};

pc.gridpl.beginEdit = function (e) {
    pc.utils.hideMessage();
    if (this.isEditting) return;

    this.isEditting = true;

    var target = typeof e.srcElement == "undefined" ? e.target : e.srcElement;
    var tr = $(target).parents("tr:first");
    var f_puntercode = $(tr).find("div[f_puntercode]");
    var f_puntercolor = $(tr).find("div[f_puntercolor]");
    var f_fbah = $(tr).find("div[f_fbah]");
    var f_fbou = $(tr).find("div[f_fbou]");
    var f_fb1x2 = $(tr).find("div[f_fb1x2]");
    var f_enable = $(tr).find("input[f_enable]");

    //punter code
    $(f_puntercode).hide();
    $(f_puntercode).parent().append("<input editor='true' class='inputtext' type='text' style='width:94px' value='" + $(f_puntercode).attr("value") + "' />");
    $(f_puntercode).parent().find("input[editor]").resMaxLength(10);

    //punter color
    $(f_puntercolor).hide();
    $(f_puntercolor).parent().append($("#selPunterColor").clone());
    $(f_puntercolor).parent().find("select").attr("editor", "true").addClass("col80 inputtext").val($(f_puntercolor).attr("value"));
    if (!$.browser.msie) {
        $(f_puntercolor).parent().find("select").css("background-color", $(f_puntercolor).attr("value")).css("color", "black");
    }
    var foption = $("#selPunterColor").find("option:first");
    $(f_puntercolor).parent().find("select").change(function () {
        if (!$.browser.msie) {
            $(f_puntercolor).parent().find("select").css("background-color", $(this).val());
        }
        var option = $("#selPunterColor").find("option[value='" + $(this).val() + "']");
        $(f_puntercolor).parent().find("select").css("color", option.attr("c"));
    }).css("color", foption.attr("c"));

    //fb ah
    $(f_fbah).hide();
    $(f_fbah).parent().append("<input editor='true' type='text' style='width:114px' class='inputtext r' value='" + $(f_fbah).attr("value") + "' />");
    $(f_fbah).parent().find("input[editor]").ForceDecimalOnly().ForceCurrencyOnly();

    //fb ou
    $(f_fbou).hide();
    $(f_fbou).parent().append("<input editor='true' type='text' style='width:114px' class='inputtext r' value='" + $(f_fbou).attr("value") + "' />");
    $(f_fbou).parent().find("input[editor]").ForceDecimalOnly().ForceCurrencyOnly();

    //fb 1x2
    $(f_fb1x2).hide();
    $(f_fb1x2).parent().append("<input editor='true' type='text' style='width:114px' class='inputtext r' value='" + $(f_fb1x2).attr("value") + "' />");
    $(f_fb1x2).parent().find("input[editor]").ForceDecimalOnly().ForceCurrencyOnly();

    var hideEditorInfo = function () {
        $(f_puntercode).parent().find("input[editor]").hide();
        $(f_puntercode).show();

        $(f_puntercolor).parent().find("select").hide();
        $(f_puntercolor).show();

        $(f_fbah).parent().find("input[editor]").hide();
        $(f_fbah).show();

        $(f_fbou).parent().find("input[editor]").hide();
        $(f_fbou).show();

        $(f_fb1x2).parent().find("input[editor]").hide();
        $(f_fb1x2).show();
    };

    if ($(f_enable).get(0).checked == false) {
        hideEditorInfo();
    }

    //checkbox enable
    $(f_enable).hide();
    $(f_enable).parent().append("<input editor='true' type='checkbox' />");
    if ($(f_enable).get(0).checked) {
        $(f_enable).parent().find("input[editor]").attr("checked", "checked");
    }

    $(target).addClass("hidden");
    $(target).parent().find("input[class='btnSave hidden']").removeClass("hidden");
    $(target).parent().find("input[class='btnCancel hidden']").removeClass("hidden");

    $("#punterList").removeClass("hidden"); //.reRenderScroller(pc.gridpl.gridWidth, pc.gridpl.gridHeight, true);
};

pc.gridpl.updatePunterCode = function (e) {
    if (!this.isEditting) return;
    var target = typeof e.srcElement == "undefined" ? e.target : e.srcElement;
    var tr = $(target).parents("tr:first");
    var f_puntercode = $(tr).find("div[f_puntercode]");
    var f_puntercolor = $(tr).find("div[f_puntercolor]");
    var f_fbah = $(tr).find("div[f_fbah]");
    var f_fbou = $(tr).find("div[f_fbou]");
    var f_fb1x2 = $(tr).find("div[f_fb1x2]");
    var f_enable = $(tr).find("input[f_enable]");
    var punterCodeId = $(target).parent().find("input[type='hidden'][_puntercodeid]").val();

    var editorPunterCode = $(f_puntercode).parent().find("input");

    var valuePunterCode = editorPunterCode.val().replace(/ /g, '');

    if (valuePunterCode == "") {
        pc.utils.showError("Please input Punter Code");
        return;
    }

    if (valuePunterCode.length > 10) {
        pc.utils.showError("Max length of punter code is 10 characters!");
        editorPunterCode.val(editorPunterCode.val().substr(0, 9));
        return;
    }

    if (!pc.panel.punterCodeIsValid(valuePunterCode)
    ) {
        pc.utils.showError("Punter Code is invalid");
        return;
    }

    var fbah = $(f_fbah).parent().find("input[editor]").val().replace(/,/g, '');
    var fbou = $(f_fbou).parent().find("input[editor]").val().replace(/,/g, '');
    var fb1x2 = $(f_fb1x2).parent().find("input[editor]").val().replace(/,/g, '');
    if (fbah == "") fbah = "0";
    if (fbou == "") fbou = "0";
    if (fb1x2 == "") fb1x2 = "0";

    if (isNaN(parseFloat(fbah)) || parseFloat(fbah) < 0) {
        pc.utils.showError("FBAH's value is invalid! ");
        return;
    }

    if (isNaN(parseFloat(fbou)) || parseFloat(fbou) < 0) {
        pc.utils.showError("FBOU's value is invalid! ");
        return;
    }

    if (isNaN(parseFloat(fb1x2)) || parseFloat(fb1x2) < 0) {
        pc.utils.showError("FB 1x2's value is invalid! ");
        return;
    }

    if (pc.utils.checkLargeMoney($(f_fbah).parent().find("input[editor]").val())) {
        pc.utils.showError("FBAH's value is so large! ");
        return;
    }

    if (pc.utils.checkLargeMoney($(f_fbou).parent().find("input[editor]").val())) {
        pc.utils.showError("FBOU's value is so large! ");
        return;
    }

    if (pc.utils.checkLargeMoney($(f_fb1x2).parent().find("input[editor]").val())) {
        pc.utils.showError("FB 1x2's value is so large! ");
        return;
    }

    fbah = parseFloat(fbah);
    fbou = parseFloat(fbou);
    fb1x2 = parseFloat(fb1x2);

    if (fbah > pc.moneyMax) {
        pc.utils.showError("FBAH's value is so large! ");
        return;
    }

    if (fbou > pc.moneyMax) {
        pc.utils.showError("FBOU's value is so large! ");
        return;
    }

    if (fb1x2 > pc.moneyMax) {
        pc.utils.showError("FB 1x2's value is so large! ");
        return;
    }

    var isEnablePunter = false;
    if ($(f_enable).get(0).checked == false && $(f_enable).parent().find("input[editor]").get(0).checked == true) {
        isEnablePunter = true;
    }

    $.ajax({
        type: "POST",
        url: "UpdatePunterCode",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{\"userId\": " + $("#hUserID").val() + ", \"punterId\": " + punterCodeId
            + ", \"puntercode\": \"" + editorPunterCode.val().replace(/ /g, '') + "\""
             + ", \"color\": \"" + $(f_puntercolor).parent().find("select").val()
             + "\", \"fbAh\": " + fbah
             + ", \"fbOu\": " + fbou
             + ", \"fb1x2\": " + fb1x2
             + ", \"enabled\": " + $(f_enable).parent().find("input[editor]").get(0).checked + "}",
        success: function (rs) {
            if (typeof rs == "undefined" || rs == null) {
                return;
            }
            if (rs != "") {
                pc.utils.showError(rs);
                pc.gridpl.endEdit(e, 'save', target);
                return;
            }
            pc.gridpl.updateGrid(target);
            if (!isEnablePunter) {
                pc.utils.showSuccess("Update successfully!");
            }
            else {
                pc.utils.showSuccess("Update successfully. Data copy is in progress, please wait for a while");
            }
            pc.gridpl.endEdit(e, 'save', target);
            pc.gridpl.getData();

            //sync data
            if (isEnablePunter) {
                var timerId = setTimeout(function () {
                    pc.gridpl.callSynData(punterCodeId, 0);
                    clearTimeout(timerId);
                }, 3000);
            }
        },
        error: function (msg) {
            if (typeof msg == "undefined" || msg == null) return;
            pc.utils.showError(msg.toString());
            pc.gridpl.endEdit(e, 'save', target);
        }
    });
};

pc.gridpl.updateGrid = function (target) {
    var tr = $(target).parents("tr:first");
    var f_puntercode = $(tr).find("div[f_puntercode]");
    var f_puntercolor = $(tr).find("div[f_puntercolor]");
    var f_fbah = $(tr).find("div[f_fbah]");
    var f_fbou = $(tr).find("div[f_fbou]");
    var f_fb1x2 = $(tr).find("div[f_fb1x2]");
    var f_enable = $(tr).find("input[f_enable]");

    //punter code
    $(f_puntercode).html($(f_puntercode).parent().find("input[editor]").val());
    $(f_puntercode).parent().find("input[editor]").remove();
    $(f_puntercode).show();

    //punter color
    $(f_puntercolor).html(pc.gridpl.getColorName($(f_puntercolor).parent().find("select").val()));
    $(f_puntercode).css("color", $(f_puntercolor).parent().find("select").val());
    $(f_puntercolor).css("color", $(f_puntercolor).parent().find("select").val());
    $(f_puntercolor).attr("value", $(f_puntercolor).parent().find("select").val());
    $(f_puntercolor).parent().find("select").remove();
    $(f_puntercolor).show();

    //fb ah
    $(f_fbah).html($(f_fbah).parent().find("input[editor]").val());
    $(f_fbah).attr("value", $(f_fbah).parent().find("input[editor]").val());
    $(f_fbah).parent().find("input[editor]").remove();
    $(f_fbah).show();

    //fb ou
    $(f_fbou).html($(f_fbou).parent().find("input[editor]").val());
    $(f_fbou).attr("value", $(f_fbou).parent().find("input[editor]").val());
    $(f_fbou).parent().find("input[editor]").remove();
    $(f_fbou).show();

    //fb 1x2
    $(f_fb1x2).html($(f_fb1x2).parent().find("input[editor]").val());
    $(f_fb1x2).attr("value", $(f_fb1x2).parent().find("input[editor]").val());
    $(f_fb1x2).parent().find("input[editor]").remove();
    $(f_fb1x2).show();

    //checkbox enable
    if ($(f_enable).parent().find("input[editor]").get(0).checked) {
        $(f_enable).attr("checked", "checked");
    }
    else {
        $(f_enable).removeAttr("checked");
    }
    $(f_enable).parent().find("input[editor]").remove();
    $(f_enable).show();
    $("#punterList").removeClass("hidden"); //.reRenderScroller(pc.gridpl.gridWidth, pc.gridpl.gridHeight, true);
};

pc.gridpl.endEdit = function (e, type, _target) {
    if (type == 'cancel') {
        pc.utils.hideMessage();
    }
    this.isEditting = false;
    var target = typeof e.srcElement == "undefined" ? e.target : e.srcElement;
    if (typeof _target != "undefined") target = _target;
    var tr = $(target).parents("tr:first");
    var f_puntercode = $(tr).find("div[f_puntercode]");
    var f_puntercolor = $(tr).find("div[f_puntercolor]");
    var f_fbah = $(tr).find("div[f_fbah]");
    var f_fbou = $(tr).find("div[f_fbou]");
    var f_fb1x2 = $(tr).find("div[f_fb1x2]");
    var f_enable = $(tr).find("input[f_enable]");

    $(tr).find("input[editor]").remove();
    $(tr).find("select[editor]").remove();

    $(f_puntercode).show();
    $(f_puntercolor).show();
    $(f_fbah).show();
    $(f_fbou).show();
    $(f_fb1x2).show();
    $(f_enable).show();

    $(target).addClass("hidden");
    if (type == 'save') {
        $(target).parent().find("input[class='btnCancel']").addClass("hidden");
    }
    else {
        $(target).parent().find("input[class='btnSave']").addClass("hidden");
    }
    $(target).parent().find("input[class='btnEdit hidden']").removeClass("hidden");
};

pc.gridpl.getColorName = function (value) {
    for (var i = 0; i < colorFilter.length; ++i) {
        if (colorFilter[i].Value == value) return colorFilter[i].Name;
    }
    return "";
};

pc.gridpl.cloneVM = function (vm) {
    var _vm = [];
    for (var i = 0; i < vm.length; ++i) {
        _vm[i] = {};
        _vm[i].PunterCodeId = vm[i].PunterCodeId;
        _vm[i].Color = vm[i].Color;
        _vm[i].ExchangeId = vm[i].ExchangeId;
        _vm[i].Enabled = vm[i].Enabled;
        _vm[i].FBAH = vm[i].FBAH;
        _vm[i].FBOU = vm[i].FBOU;
        _vm[i].FB1x2 = vm[i].FB1x2;
        _vm[i].TotalMember = vm[i].TotalMember;
        _vm[i].UserName = vm[i].UserName;
        _vm[i].PunterCode = vm[i].PunterCode;
        _vm[i].TotalAdmin = vm[i].TotalAdmin;
    }
    return _vm;
};

pc.member.searchMembers = function (e) {
    var target = typeof e.srcElement == "undefined" ? e.target : e.srcElement;

    var callBackServer = function () {
        if ($(target).val().replace(/ /g, "") == "") return;
        if (typeof pc.member.xhr != "undefined" && pc.member.xhr != null) {
            pc.member.xhr.abort();
            pc.member.xhr = null;
        }
        pc.member.xhr = $.ajax({
            type: "POST",
            url: "SearchMemberSuggestion",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{\"currency\": " + pc.member.exchangeId + ", \"query\": \"" + $(target).val() + "\", \"isNormal\": " + (pc.member.totalMember == 0 ? true : false) + "}",
            success: function (rs) {
                if (typeof rs == "undefined" || rs == null) return;
                $(target).autoComplete(rs, "UserName");
            }
        });
    };

    var key = e.keyCode;
    switch (key) {
        case 9:
        case 16:
        case 17:
        case 35:
        case 36:
        case 45:
        case 46:
            return;
    }
    if (key >= 37 && key <= 40) return;

    if (key != 40 && key != 38) {
        if ($(target).isShowingAutoComplete()) {
            $(target).removeAutoComplete();
        }
    }

    if (typeof pc.member.timerIdSuggest != "undefined") {
        clearTimeout(pc.member.timerIdSuggest);
    }
    pc.member.timerIdSuggest = setTimeout(function () {
        callBackServer();
        clearTimeout(pc.member.timerIdSuggest);
    }, 200);
};
//pc.user.ListUser = [];
//pc.user.initSearchUsers = function (punterCodeId) {
//    //var groupId = parseInt($("#hABDGroupID").val());
//    $.ajax({
//        type: "POST",
//        url: "GetAdminByPunterCodeId",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        data: "{\"punterCodeId\": " + punterCodeId + ", \"isAssigned\": " + 0 + "}",
//        success: function (rs) {
//            if (typeof rs != "undefined") {
//                pc.user.ListUser = rs;
//            }
//        }
//    });
//};

pc.utils.getCurrency = function (id) {
    for (var i = 0; i < listCurrency.length; ++i) {
        if (listCurrency[i].ExchangeId == id) return listCurrency[i].Currency;
    }
    return "";
};

pc.utils.showError = function (msg) {
    showMessage(msg, 1);
    var t = setTimeout(function () {
        pc.utils.hideMessage();
    }, 3000);
};

pc.utils.showSuccess = function (msg) {
    showMessage(msg, 0);
};

pc.utils.showSuccessNoHide = function (msg) {
    showMessage(msg, 0, true);
};

pc.utils.hideMessage = function () {
    $("#msg").fadeOut(200);
};

$(document).ready(function () {
    pc.panel.init();
    pc.gridpl.init();
});