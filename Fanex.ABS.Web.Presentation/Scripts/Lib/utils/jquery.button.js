(function($){
    if (typeof $ == "undefined" || $ == null) return;
    $.fn.wait = function(value, f) {  
        return this.each(function() {
            $(this).prop("disabled", true);
            if (!$(this).hasClass("loading")) $(this).addClass("loading");
        });  
    };
    $.fn.unwait = function(value, f) {  
        return this.each(function() {
            $(this).removeProp("disabled").removeClass("loading");
        });  
    };
    
    $.fn.blockInputs=function(){
        return this.each(function(){
           $(this).find("input, select").attr("disabled","disabled");
        });
    };
    $.fn.unBlockInputs=function(){
        return this.each(function(){
           $(this).find("input, select").removeAttr("disabled");
        });
    };
})(jQuery);
