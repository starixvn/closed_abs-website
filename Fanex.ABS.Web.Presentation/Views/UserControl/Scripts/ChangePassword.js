var changePwdHandler = {
};

changePwdHandler.btnSubmit = function () {
    var pass = $("#txtPassword");
    var confirm = $("#txtConfirmPassword");
    if (pass.val() == '') {
        this.showError(strPasswordEmpty);
        pass.focus();
        return;
    }
    if (pass.val().trim().length < 4) {
        this.showError(strPassswordAtLeast4);
        pass.focus();
        return;
    }
    if (confirm.val() == '') {
        this.showError(strConfirmPassword);
        confirm.focus();
        return;
    }

    if (confirm.val().trim() != pass.val().trim()) {
        this.showError(strPasswordNotCorrectConfirm);
        confirm.focus();
        return;
    }
    this.changePassword($("#txtPassword").val());
};

changePwdHandler.btnReset = function () {
    $("#txtPassword").val('').focus();
    $("#txtConfirmPassword").val('');
};

changePwdHandler.changePassword = function (password) {
    if (isNaN(parseInt($("#hiddenUserId").val()))) return;
    var loginId = parseInt($("#hiddenUserId").val());
    $.ajax({
        type: "POST",
        url: "UpdatePassword",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"CustId":' + loginId + ', "UserPwd": "' + password + '", "UserId": ' + loginId + '}',
        success: function (rs) {
            if (rs == "") {
                changePwdHandler.showSuccess("Change password successfully!");
            }
            else {
                changePwdHandler.showError(rs);
            }
        }
    });
};

changePwdHandler.showError = function (msg) {
    showMessage(msg, 1);
};

changePwdHandler.showSuccess = function (msg) {
    showMessage(msg, 0);
};