/*

highlight v3

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

jQuery.fn.highlight = function(pat) {
    return this.each(function() {
        var ihtml = $(this).html();
        var index = ihtml.toLowerCase().indexOf(pat.toLowerCase());
        if (index < 0) return;
        pat = ihtml.substr(index, pat.length);
        
        var arr = ihtml.split(pat);
        var newHTML = "";
        for (var i = 0; i < arr.length; ++i) {
            newHTML += arr[i];
            if (i != arr.length - 1) newHTML += "<span class='highlight'>" + pat + "</span>";
        }
        $(this).html(newHTML);
    });
};
