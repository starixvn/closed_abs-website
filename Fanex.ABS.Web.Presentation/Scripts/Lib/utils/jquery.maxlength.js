$(document).ready(function(){
    if (typeof $ == "undefined") return;
    jQuery.fn.resMaxLength = function(maxLength) {
        return this.each(function() {
            if (maxLength <= 0) return;
            $(this).keydown(function(e){
                if ($(this).val().length == maxLength) {
                    var key = e.keyCode;
                    var isAccept = (
                        (e.ctrlKey && e.keyCode == 67) || //accept ctrl + c(copy)
                        (e.ctrlKey && e.keyCode == 86) || //accept ctrl + v(paste)
                        key == 16 ||//shift
                        key == 17 ||//ctrl
                        key == 8 || //backspace
                        key == 36 || //home
                        key == 35 ||//end
                        key == 9 ||//tab
                        key == 46 ||//delete
                        (key >= 37 && key <= 40)//left , right , up , down (arrow)
                    );
                    if (isAccept) return true;
                    
                    var curVal = $(this).val();
                    var curPos = $(this).caret().start;
                    if (curPos == 0 || curPos == 1) {
                        $(this).val(curVal.substr(1, maxLength - 1));
                        $(this).setCaretPosition(curPos - 1);
                        return true;
                    }
                    if (curPos >= 2 && curPos <= maxLength - 1) {
                        var s1 = curVal.substr(0, curPos - 1)
                        var s2 = curVal.substr(curPos, maxLength - s1.length - 1)
                        $(this).val(s1 + s2);
                        $(this).setCaretPosition(curPos - 1);
                        return true;
                    }
                    if (curPos == maxLength) {
                        $(this).val(curVal.substr(0, maxLength - 1));
                        $(this).setCaretPosition(curPos - 1);
                    }
                }
                return true;
            });
        });
    };
});