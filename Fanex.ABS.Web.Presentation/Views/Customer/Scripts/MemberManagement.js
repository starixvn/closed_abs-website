$(document).ready(function () {
    $("body").delegate(".noneDecimal", "keydown", function (e) {
        allowInt(e);
    });

    $('#tblMemberList').delegate('tr', 'mouseover', function (event) {
        $(this).addClass("mouseon");
    });
    $('#tblMemberList').delegate('tr', 'mouseout', function (event) {
        $(this).removeClass("mouseon");
    });

    $('#btnToggle').click(function () {
        $("#tblAddMember").toggle("fast");
    });

    memberManager.btnGO();
});
var memberManager = {
    pageIndex: 1,
    pageSize: 100,
    totalItems: 0,
    filterParams: {},
    updatedItem: {
        CustId: 0,
        Username: '',
        Level: '',
        Category: '',
        Danger: '',
        Color: '',
        FBAH: '',
        FBOU: '',
        Enabled: true
    },
    data: [],
    userStatus: 0,
    renderRow: function (no, row, cssClass) {
        var html = '';
        html = '<tr class="' + cssClass + '">\
                <td><div class="col40 c">' + no + '</div></td>\
                <td><div class="col120 l">' + row.Username + '</div></td>\
                <td><div class="col80 c" level="true" style="color:' + row.Color + '">' + row.Level + '</div></td>\
                <td><div class="col80 c">' + row.Category + '</div></td>\
                <td><div class="col80 c" danger="true" value="' + row.Danger + '">' + row.Danger + '</div></td>\
                <td><div class="col100 c" colorpicker="true" style="color:' + row.Color + '" value="' + row.Color + '">' + row.Color + '</div></td>\
                <td><div class="col80 r" fbah="true" value="' + autoFormatNumber(row.FBAH) + '">' + autoFormatNumber(row.FBAH) + '</div></td>\
                <td><div class="col80 r" fbou="true" value="' + autoFormatNumber(row.FBOU) + '">' + autoFormatNumber(row.FBOU) + '</div></td>\
                <td><div class="col60 c" ><input id="chkUser' + row.CustId + '" type="checkbox" ' + (row.Enabled ? 'checked="true"' : '') + ' objid="' + row.CustId + '" disabled="disabled" /></td>\
                <td><div class="col60 c"><input type="button" class="btnEdit" title="Edit" objid="' + row.CustId + '" /><input type="button" class="btnCancel" style="display:none" title="Cancel" /></div></td>\
            </tr>';
        return html;
    },
    renderMemberGrid: function (records) {
        var memberGrid = $("#memberList");
        var arr = [];
        var numberitems = records.length;
        if (numberitems > 0) {
            for (var i = 0; i < numberitems; i++) {
                arr.push(memberManager.renderRow(i + 1, records[i], (i % 2 == 0 ? "bgeven" : "")));
            }
            $("#tblMemberList").empty().html(arr.join(''));
            memberManager.initPager(memberManager.totalItems, memberManager.filterParams.pageSize, memberManager.filterParams.pageIndex - 1);
            grid.init(); //Binding Event For Grid
        }
        else {
            arr.push("<td style='border-bottom:0px;'><div class='c ' style='width:807px'>There is no data.</div></td>")
            $("#tblMemberList").empty().html(arr.join(''));
            $("#pagination").html("&nbsp;");
        }

        memberGrid.removeClass("hidden").reRenderScroller(810, 542, true);
    },
    initPager: function (total_item, items_per_page, current_page) {
        var opt = { callback: memberManager.pageselectCallback };
        // Collect options from the text fields - the fields are named like their option counterparts
        opt["items_per_page"] = items_per_page;
        opt["current_page"] = current_page;
        $("#pagination").pagination(total_item, opt);
    },
    pageselectCallback: function (page_index, _items_per_page, jq) {
        var max_page = Math.ceil(memberManager.totalItems / _items_per_page);
        page_index = page_index < max_page ? page_index : max_page - 1;

        memberManager.filterParams.pageSize = _items_per_page;
        memberManager.filterParams.pageIndex = page_index + 1;
        memberManager.filterParams.fromCache = false;

        dataProcess.getMemberData();
        return false;
    },
    btnGO: function () {
        hideMessage();
        dataProcess.setFilterParams(100, 1, false);
        dataProcess.getMemberData();
    }
};

var dataProcess = {
    setFilterParams: function (pageSize, pageIndex, fromCache) {
        var param = {
            username: $("#txtFilterUsername").val(),
            danger: $("#ddlFilterDanger option:selected").val(),
            status: $("#ddlUserStatus option:selected").val(),
            pageSize: pageSize,
            pageIndex: pageIndex,
            fromCache: fromCache
        };
        memberManager.filterParams = param;
    },
    getMemberData: function () {
        $("#btnGO").wait();
        $.ajax({
            type: "POST",
            url: "SelMemberList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(memberManager.filterParams),
            success: function (rs) {
                memberManager.data = rs.Items;
                memberManager.totalItems = rs.TotalItem;
                memberManager.renderMemberGrid(memberManager.data);
                $("#btnGO").unwait();
            }
        });
    },
    checkValidUpdateParams: function (member) {
        var isValid = true;
        if (member.FBAH == "" || !isInt(member.FBAH)) {
            $(grid.divFBAH).parent().find("div[editor] input").focus();
            isValid = false;
            return isValid;
        }
        if (member.FBOU == "" || !isInt(member.FBOU)) {
            $(grid.divFBOU).parent().find("div[editor] input").focus();
            isValid = false;
            return isValid;
        }
        return isValid;
    },
    checkValidParams: function (member) {
        var isValid = true;
        if (member.Username == "") {
            $("#txtUsername").focus();
            isValid = false;
            return isValid;
        }
        if (member.Level == "") {
            $("#txtPunterCode").focus();
            isValid = false;
            return isValid;
        }

        if (member.FBAH == "" || !isInt(member.FBAH)) {
            $("#txtMinBet").focus();
            isValid = false;
            return isValid;
        }
        if (member.FBOU == "" || !isInt(member.FBOU)) {
            $("#txtMaxBet").focus();
            isValid = false;
            return isValid;
        }
        return isValid;
    },
    insMember: function () {
        hideMessage();
        memberManager.updatedItem.CustId = 0;
        memberManager.updatedItem.Username = $.trim($("#txtUsername").val());
        memberManager.updatedItem.Category = $("#ddlCategory option:selected").val();
        memberManager.updatedItem.Level = $("#txtPunterCode").val();
        memberManager.updatedItem.Danger = $("#ddlDanger option:selected").val();
        memberManager.updatedItem.Color = $("#ddlColorFilter option:selected").val();
        memberManager.updatedItem.FBAH = $("#txtMinBet").val().replace(/,/g, '');
        memberManager.updatedItem.FBOU = $("#txtMaxBet").val().replace(/,/g, '');

        if (!dataProcess.checkValidParams(memberManager.updatedItem)) {
            showMessage("Invalid input data.", 1);
            return;
        }

        //BlockUI();
        $("#btnAddMember").wait();
        var param = '{"member":' + JSON.stringify(memberManager.updatedItem) + '}';
        $.ajax({
            type: "POST",
            url: "InsMember",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: param,
            success: function (rs) {
                if (rs.ErrorCode > 0) {
                    showMessage(rs.ErrorMessage, 1);
                }
                else {
                    showMessage(rs.ErrorMessage, 0);
                    var t = setTimeout(function () {
                        memberManager.btnGO();
                    }, 3000);
                }
                $("#btnAddMember").unwait();
                //UnBlockUI();
                //try {  UnBlockUI();  } catch (e) { }
            }
        });
    },
    updMember: function (member, isUpdInfo, isUpdStatus) {
        hideMessage();
        member.FBAH = member.FBAH.replace(/,/g, '');
        member.FBOU = member.FBOU.replace(/,/g, '');

        if (!dataProcess.checkValidUpdateParams(member)) {
            showMessage("Invalid input data.", 1);
            return;
        }

        $("#btnAddMember").wait();
        var param = '{"member":' + JSON.stringify(member) + ',"isUpdInfo":' + isUpdInfo + ',"isUpdStatus":' + isUpdStatus + '}';
        $.ajax({
            type: "POST",
            url: "UpdMember",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: param,
            success: function (rs) {
                if (rs.ErrorCode > 0) {
                    showMessage(rs.ErrorMessage, 1);
                }
                else {
                    showMessage(rs.ErrorMessage, 0);
                    grid.endEdit();
                    showMessage(rs.ErrorMessage, 0);
                    var t = setTimeout(function () {
                        memberManager.btnGO();
                    }, 3000);
                }
                $("#btnAddMember").unwait();
            }
        });
    }
};

var grid = {
};

grid.endEdit = function () {
    $(grid.btnEdit).removeClass().addClass("btnEdit").attr("title", "Edit");
    $(grid.btnEdit).parent().find("input[class='btnCancel']").hide();

    $(grid.tr).find("div[editor]").remove();
    $(grid.divDanger).show();
    $(grid.divColor).show();
    $(grid.divFBAH).show();
    $(grid.divFBOU).show();
    $(grid.tr).find("input[type='checkbox']").attr("disabled", "disabled").show();
};

grid.enabledStatus = function (enabled) {
    if (!enabled) {
        $(grid.divColor).parent().find("div[editor] select").attr("disabled", "disabled")
        $(grid.divDanger).parent().find("div[editor] select").attr("disabled", "disabled");
        $(grid.divFBAH).parent().find("div[editor] input").attr("disabled", "disabled");
        $(grid.divFBOU).parent().find("div[editor] input").attr("disabled", "disabled");
    }
    else {
        //color
        $(grid.colorCell).removeAttr("disabled");
        $(grid.divColor).parent().find("div[editor] select").removeAttr("disabled");
        $(grid.divDanger).parent().find("div[editor] select").removeAttr("disabled");
        $(grid.divFBAH).parent().find("div[editor] input").removeAttr("disabled");
        $(grid.divFBOU).parent().find("div[editor] input").removeAttr("disabled");
    }
};

grid.init = function () {
    $("#tblMemberList").find("input[type='checkbox']").click(function () {
        var enabled = $(this).get(0).checked;
        grid.enabledStatus(enabled);
    });
    $("#tblMemberList").find("input[class='btnEdit']").click(function () {
        var _tr = $(this).parents("tr:first");
        if ($(_tr).parent().find("div[editor]").length > 0) {//is editting
            if (!$(this).parent().find("input[class='btnCancel']").is(":visible")) {
                return;
            }
        }

        grid.btnEdit = this;
        grid.tr = $(grid.btnEdit).parents("tr:first");

        grid.divLevel = $(grid.tr).find("div[level]");
        grid.divColor = $(grid.tr).find("div[colorpicker]");
        grid.divDanger = $(grid.tr).find("div[danger='true']");
        grid.divFBAH = $(grid.tr).find("div[fbah='true']");
        grid.divFBOU = $(grid.tr).find("div[fbou='true']");
        grid.cbxEnable = $(grid.tr).find("input[type='checkbox']");
        $(grid.cbxEnable).removeAttr("disabled");

        var objModel = jlinq.from(memberManager.data).equals("CustId", parseInt($(this).attr("objid"))).select();

        if (objModel.length > 0) objModel = objModel[0];
        else return;

        //save
        if ($(grid.btnEdit).hasClass("btnSave")) {
            memberManager.updatedItem.CustId = objModel.CustId;
            memberManager.updatedItem.Username = objModel.Username;
            memberManager.updatedItem.Level = objModel.Level;
            memberManager.updatedItem.Category = objModel.Category;
            memberManager.updatedItem.Danger = $(grid.divDanger).parent().find("div[editor] select").val();
            $(grid.divDanger).attr("value", memberManager.updatedItem.Danger).html(memberManager.updatedItem.Danger);

            memberManager.updatedItem.Color = $(grid.divColor).parent().find("div[editor] select").val();
            $(grid.divColor).attr("value", memberManager.updatedItem.Color).html(memberManager.updatedItem.Color);

            memberManager.updatedItem.FBAH = $(grid.divFBAH).parent().find("div[editor] input").val();
            $(grid.divFBAH).attr("value", memberManager.updatedItem.FBAH).html(memberManager.updatedItem.FBAH);

            memberManager.updatedItem.FBOU = $(grid.divFBOU).parent().find("div[editor] input").val();
            $(grid.divFBOU).attr("value", memberManager.updatedItem.FBOU).html(memberManager.updatedItem.FBOU);

            memberManager.updatedItem.Enabled = $(grid.cbxEnable).get(0).checked;
            //$(grid.tr).find("input[type='checkbox']").get(0).checked = objModel.Enabled;

            //Check change value
            var isUpdInfo = ((memberManager.updatedItem.Danger != objModel.Danger && memberManager.updatedItem.Enabled) || memberManager.updatedItem.Color != objModel.Color || memberManager.updatedItem.FBAH != autoFormatNumber(objModel.FBAH) || memberManager.updatedItem.FBOU != autoFormatNumber(objModel.FBOU));
            var isUpdStatus = (memberManager.updatedItem.Enabled != objModel.Enabled);

            //Call process update data
            dataProcess.updMember(memberManager.updatedItem, isUpdInfo, isUpdStatus);

            //$(document).find("body").find("div[test]").remove();
            //$(document).find("body").append("<div test='t'>" + JSON.stringify(memberManager.updatedItem) + "</div>");

            return;
        }
        //edit button
        $(grid.btnEdit).removeClass().addClass("btnSave").attr("title", "Save");
        //cancel button
        $(grid.btnEdit).parent().find("input[class='btnCancel']").show().click(function () {
            memberManager.renderMemberGrid(memberManager.data);
            hideMessage();
            //memberManager.btnGO();
        });

        //danger
        $(grid.divDanger).hide();
        var dangerNo = parseInt($(grid.divDanger).attr("value"));
        $(grid.divDanger).parent().append("<div editor='true'></div>");
        var divEditorDanger = $(grid.divDanger).parent().find("div[editor]").addClass($(grid.divDanger).attr("class")).hide();
        var selectDanger = $(divEditorDanger).append('<select class="inlineUpdate inputtext"></select>').find("select");
        var arrDanger = abtDangerConfig.split(',');
        for (var i = 0; i < arrDanger.length; i++) {
            $(selectDanger).append("<option value='" + arrDanger[i] + "'" + (parseInt(arrDanger[i]) == dangerNo ? " selected='selected'" : "") + ">" + arrDanger[i] + "</option>");
        }
        $(divEditorDanger).show();

        //color
        $(grid.divColor).hide();
        var colorValue = $(grid.divColor).attr("value");
        $(grid.divColor).parent().append("<div editor='true'></div>");
        var divEditorColor = $(grid.divColor).parent().find("div[editor]").addClass($(grid.divColor).attr("class")).hide();
        var selectColor = $(divEditorColor).append('<select class="w100 inlineUpdate inputtext colorpicker"></select>').find("select");

        var arrColor = colorFilter.split(',');

        for (var i = 0; i < arrColor.length; ++i) {
            var value = arrColor[i];
            var color = "";
            if (value.indexOf('#') >= 0) {
                color = "#" + value.split('#')[1];
                value = value.split('#')[0];
            }
            $(selectColor).append("<option value='" + value + "' style='background-color: " + value + (color == "" ? "" : ";color:" + color) + ";'" + (colorValue == value ? " selected='selected'" : "") + ">" + value + "</option>");
        }

        $(selectColor).change(function () {
            $(this).css("backgroundColor", $(this).val());
            $(grid.divLevel).css("color", $(this).val());
            $(grid.divColor).css("color", $(this).val());
        });

        $(divEditorColor).show();

        //FB AH
        $(grid.divFBAH).hide();
        $(grid.divFBAH).parent().append("<div editor='true'><input class='w70 inlineUpdate noneDecimal' type='text' value='" + $(grid.divFBAH).attr("value") + "' /></div>");
        $(grid.divFBAH).parent().find("div[editor]").addClass($(grid.divFBAH).attr("class"));

        //FB OU
        $(grid.divFBOU).hide();
        $(grid.divFBOU).parent().append("<div editor='true'><input class='w70 inlineUpdate noneDecimal' type='text' value='" + $(grid.divFBOU).attr("value") + "' /></div>");
        $(grid.divFBOU).parent().find("div[editor]").addClass($(grid.divFBOU).attr("class"));

        var enabled = $(grid.cbxEnable).get(0).checked;
        grid.enabledStatus(enabled);
    });
};

var panelHeader = {
};

panelHeader.init = function () {
    this.intSearchCustomer();
    this.initCategory();
    this.initABTDanger();
    this.initABTDangerFilter();
    panelHeader.initColorFilter();
};

panelHeader.intSearchCustomer = function () {
    //txtUsername
    var txtusername = $('#txtUsername');
    var isonauto = false;
    //Auto complete code
    autosearch = txtusername.autocomplete({ serviceUrl: "../Handlers/QueryUserName.ashx", minChars: 2 });
    $('.autocomplete').mouseover(function () {
        isonauto = true;
    }).mouseout(function () {
        isonauto = false;
    });

    txtusername.blur(function () {
        if (!isonauto) {
            $('#Autocomplete_1').css('display', 'none');
        }
        else {
            txtusername.focus();
        }
    });
};

panelHeader.initCategory = function () {
    $("#ddlCategory").empty();
    var arr = categoryConfig.split(',');
    for (var i = 0; i < arr.length; ++i) {
        $("#ddlCategory").append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
    }
};
panelHeader.initABTDanger = function () {
    $("#ddlDanger").empty();
    var arr = abtDangerConfig.split(',');
    for (var i = 0; i < arr.length; ++i) {
        $("#ddlDanger").append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
    }
};
panelHeader.initABTDangerFilter = function () {
    $("#ddlFilterDanger").empty();
    $("#ddlFilterDanger").append('<option value="0">All</option>');
    var arr = abtDangerConfig.split(',');
    for (var i = 0; i < arr.length; ++i) {
        $("#ddlFilterDanger").append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
    }
};
panelHeader.initColorFilter = function () {
    $("#ddlColorFilter").empty();
    var arr = colorFilter.split(',');
    for (var i = 0; i < arr.length; ++i) {
        var value = arr[i];
        var color = "";
        if (value.indexOf('#') >= 0) {
            color = "#" + value.split('#')[1];
            value = value.split('#')[0];
        }
        $("#ddlColorFilter").append("<option value='" + value + "' style='background-color: " + value + (color == "" ? "" : ";color:" + color) + ";'>" + value + "</option>");
    }
};

panelHeader.init();