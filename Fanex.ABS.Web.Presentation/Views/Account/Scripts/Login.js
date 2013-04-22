/// <reference path="../../../Scripts/jquery.min.js" />

var signIn = {
    isRequestLogin: false,
    login: function () {
        //        $("#ErrorMessage").hide();
        //        $("#UserName").parent().find("span[class='field-validation-valid'][username]").hide();
        //        $("#Password").parent().find("span[class='field-validation-valid'][password]").hide();
        //        var username = $("#UserName");
        //        if (username.val() == "") {
        //            $("#UserName").focus();
        //            $("#UserName").parent().find("span[class='field-validation-valid'][username]").show();
        //            return false;
        //        }
        //        else if ($("#Password").val() == "") {
        //            $("#Password").focus();
        //            $("#Password").parent().find("span[class='field-validation-valid'][password]").show();
        //            return false;
        //        }

        //        $('#btnLogin').attr('disabled', true);
        //        signIn.isRequestLogin = true;
        //        var root = location.protocol + '//' + location.host;
        //        $.ajax({
        //            type: "POST",
        //            url: root + "/Account/LogOn",
        //            contentType: "application/json; charset=utf-8",
        //            dataType: "json",
        //            data: '{"username":' + JSON.stringify(username.val()) + ', "password":' + JSON.stringify($("#Password").val()) + '}',
        //            success: function (r) {
        //                if (r.ErrorCode != 0) {
        //                    signIn.loginError(r.ErrorMessage);
        //                }
        //                else {
        //                    top.location.href = root + "/Home/Index";
        //                }
        //            },
        //            error: function (xhr, err) {
        //            },
        //            complete: function () {
        //                signIn.isRequestLogin = false;
        //                $('#btnLogin').attr('disabled', false);
        //            }
        //        });
        //        return true;
        $("#ErrorMessage").hide();
        $("#UserName").parent().find("span[class='field-validation-valid'][username]").hide();
        $("#Password").parent().find("span[class='field-validation-valid'][password]").hide();
        var username = $("#UserName");
        if (username.val() == "") {
            $("#UserName").focus();
            $("#UserName").parent().find("span[class='field-validation-valid'][username]").show();
            return false;
        }
        else if ($("#Password").val() == "") {
            $("#Password").focus();
            $("#Password").parent().find("span[class='field-validation-valid'][password]").show();
            return false;
        }
        return true;
    },
    loginError: function (errMsg) {
        $("#ErrorMessage span").empty().html(errMsg).parent().show();
    }
};
head.ready(function () {
    $("#UserName").focus();
    $("#UserName").change(function () {
        $("#UserName").parent().find("span[class='field-validation-valid'][username]").hide();
    });

    $("#Password").change(function () {
        $("#Password").parent().find("span[class='field-validation-valid'][password]").hide();
    });
});