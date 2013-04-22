(function($){
if (typeof $ == "undefined" || $ == null) return;
    $.fn.bindColorPicker = function(value, f) {  
        return this.each(function() {
            this.colorPickerClick = function (e) {
                $(this).ColorPicker({
	                color: value,
	                onShow: function (colpkr) {
		                $(colpkr).fadeIn(500);
		                return false;
	                },
	                onHide: function (colpkr) {
		                $(colpkr).fadeOut(500);
		                return false;
	                },
	                onChange: function (hsb, hex, rgb) {
		                f(hex);
	                }
                }).ColorPickerShow();
            };
            $(this).click(this.colorPickerClick);
        });  
    };
    $.fn.unbindColorPicker = function() { 
        $(this).unbind("click", this.colorPickerClick);
    };
})(jQuery); 