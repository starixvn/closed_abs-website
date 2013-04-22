/*--Require jquery--*/
/*--Global variable*/
/*--End global variable declaration--*/

/*--Global function--*/
//This prototype is provided by the Mozilla foundation and
//is distributed under the MIT license.
//http://www.ibiblio.org/pub/Linux/LICENSES/mit.license

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}


String.prototype.trim = function() {
    return this.replace( /^\s+|\s+$/g , "");
};
String.prototype.ltrim = function() {
    return this.replace( /^\s+/ , "");
};
String.prototype.rtrim = function() {
    return this.replace( /\s+$/ , "");
};

function AllowNumber(e) {
    var code;
    if (e.which)
        code = e.which;
    else if (e.keyCode)
        code = e.keyCode;
    if (code == 37 || code == 39 || (code>=48 && code<=57) || code==9 || code==13 || code==8)
        return true;
    return false;
}
function allowInt(event)//using with keyup
{ 
   var code=parseInt(event.which);
   var isCtrl = false;
   if(event.ctrlKey) isCtrl = true;
  
   if((code == 67 || code == 86) && isCtrl) {
            return true;
        }
   if (code==8 || code == 13 || code == 16 || code == 27 || code == 37|| code == 39 || code == 46  || (code>=48 && code<=57) || (code>=96 && code<=105))
   {
    return true;
   }
   else
   {
        event.preventDefault();
        return false;
   }
}
function autoFormatNumber(number, precision)
{
    precision = typeof precision == 'undefined' ? 0 : precision;
    var _number=$.number_format(parseInt(number), {precision: precision});
    return  _number=="0,00"? "0":_number;   
}
function roundNumber(num, dec) {
    var result = Math.round(Math.round(num * Math.pow(10, dec + 1)) / Math.pow(10, 1)) / Math.pow(10, dec);
    return result;
}

function toString(obj) {
    if (obj == null)
        return "";
     else return obj.toString();
}

function isInt(value){
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
      return true;
  } else {
      return false;
  }
}

function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}


/*--End Global Funtions--*/

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function BlockUI() {
  
    if (parent.BlockUI) {
        try { parent.BlockUI(); } catch (e) { }
    }
    //Called inside a frame set (#centerFr)
    else {
        if (parent.parent.BlockUI) {
            parent.parent.BlockUI();
        }
    }
    //Called from popup
    if (opener) {
        if (opener.BlockUI) {
            opener.BlockUI();
        }
        opener.parent.BlockUI();
    }
}
function UnBlockUI() {
    
    if (parent.jQuery && parent.jQuery.unblockUI) {
        parent.jQuery.unblockUI();
    }
    //Called inside a frame set (#centerFr)
    if (parent.parent.jQuery && parent.parent.jQuery.unblockUI) {
        parent.parent.jQuery.unblockUI();
    }
    //Called from popup

    if (opener) {
        if (opener.parent.jQuery.unblockUI) {
            opener.parent.jQuery.unblockUI();
        }
    }
}


function hideMessage()
{
    $("#msg").hide();
}


function showMessage(msg, type, noAutoHide, targetId) {
    // Success=0, Error=1, Warning=2
    var msgObj = $("#msg");
    if (typeof targetId !== 'undefined') {
        msgObj = $(targetId);
    }
    
    msgObj.removeClass("info").removeClass("err").removeClass("warn");
    switch (type) {
        case 0:
            msgObj.html(msg).addClass("info");
            if (!noAutoHide) {
                var t = setTimeout(function () {
                    msgObj.fadeOut(500);
                }, 3000);
            }
            break;
        case 1:
            msgObj.html(msg).addClass("err");
            break;
        case 2:
             msgObj.html(msg).addClass("warn");
            break;
        default:
            break
    }
    msgObj.show();
}



function formatAlertMessage(msg, type) {
    // Success=0, Error=1, Warning=2
    switch (type) {
        case 0:
            return "<div id='msg' class='info'>" + msg + "</div>";
            break;
        case 1:
            return "<div id='msg' class='err'>" + msg + "</div>";
            break;
        case 2:
            return "<div id='msg' class='warn'>" + msg + "</div>";
            break;
        default:
            return "";
            break
    }
}

function showEnrichMessage(containerid, ErrorHandler) {
     var isError500=true;
     var isSuccess = true;
     var result = '';
     if (ErrorHandler != null && ErrorHandler.length > 0) {
         $.each(ErrorHandler, function (index, value) {
             if (value.Key > 0) {
                 if (isError500)
                 {
                    result += formatAlertMessage(value.Value, 1);
                 }
                 isSuccess = false;
             }
             else {
                 result += formatAlertMessage(value.Value, 0);
             }
             if (value.Key==500) isError500=false;
         });
     }
     
     if (isSuccess) {
         result = '<div class="boxscc">' + result + '</div>';
         t1 = setTimeout("clearMessage('" + containerid + "')", 8000);
     }
     else {
         result = '<div class="boxerr">' + result + '</div>';
         t2 = setTimeout("clearSuccessMessages()", 8000);
     }
     
     $("#".concat(containerid)).html(result);
  
     window.scroll(0, 0);
     parent.scroll(0, 0);
     return isSuccess;
}

function clearSuccessMessages() {
    $("#err .msgcorrect").remove();
    clearTimeout(t2);
}

function getCurrentDateWithFormat()
{
    var currdate = calcTime("+8");
    return (currdate.getMonth() + 1) + "/" + currdate.getDate() + "/" + currdate.getFullYear() + " " + (currdate.getHours()) + ":" + currdate.getMinutes() + ":" + currdate.getSeconds() + " (GMT+8)";
}

function calcTime(offset) {

    // create Date object for current location
    d = new Date();

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000 * offset));

    // return time as a string
    return nd;
}