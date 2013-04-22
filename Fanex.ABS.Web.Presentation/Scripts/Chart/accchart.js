var jqChart = null;
var accChart = {
    renderCanvas: function (opts) {
        if (jqChart == null) {
            jqChart = $('<div />').attr('id', 'jqChart').addClass('chart_canvas');
        }
        $(jqChart).empty();
        this.title = opts.title.text;
        opts.title.text = ' ';
        $(jqChart).jqChart({
            title: opts.title,
            watermark: accChart.watermark,
            dimension: opts.dimension,
            series: opts.series
        });
        accChart.viewCanvas();
    },
    viewCanvas: function () {
        if (jqChart != null) {
            $('<div />').attr('id', 'chart_shadow').addClass('chart_shadow').appendTo('body').fadeIn();
            $('<div />').attr('id', 'chart_popup')
                .addClass('chart_popup').css('width', 1000)
                .append('<div id="chart_title" class="chart_title"><div class="setting" title="View">&nbsp;</div><div class="title">' + accChart.title + '</div><div class="close" title="Close">&nbsp;</div></div>')
                .appendTo('body');
            $('<div />').attr('id', 'chart_content').addClass('chart_content').append(jqChart).appendTo('#chart_popup');
            //$('#chart_popup').css("left", ($('body').width() - $(jqChart).width()) / 2);
            $('#chart_popup').css("left", 100);
            $('#chart_popup').slideDown();
            if ($(jqChart).width() > 1000) {
                var pos_ralative = 67; var scroll_frame; var scroll_chart;
                $('canvas[id$=canvas_chart]').css({ left: pos_ralative, top: 79, position: 'absolute' });
                $('#chart_content').scroll(function () {
                    scroll_left_val = $(this).scrollLeft();
                    scroll_frame = '-' + scroll_left_val + 'px';
                    scroll_chart = scroll_left_val == 0 ? pos_ralative : '-' + (scroll_left_val - pos_ralative) + 'px';
                    $('canvas[id$=canvas_frame]').css({ left: scroll_frame });
                    $('canvas[id$=canvas_chart]').css({ left: scroll_chart });
                });
            }
            $('#chart_popup').draggable({
                handle: '#chart_title'
            });
            $('div.close').bind('click', function (e) {
                accChart.close();
            });
        }
    },
    renderSVG: function (opts) {
        jqChart = new Highcharts.Chart({
            chart: {
                renderTo: opts.container,
                defaultSeriesType: opts.type,
                margin: [50, 50, 110, 80]
            },
            title: {
                text: '',
                align: 'left'
            },
            xAxis: {
                categories: opts.categories,
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        font: 'normal 11px Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                //min: 0,
                title: {
                    text: 'Total P&L'
                }
            },
            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'right',
                y: -495,
                x: -50
            },
            tooltip: {
                style: {
                    font: 'italic 12px Verdana, sans-serif'
                },
                formatter: function () {
                    return '<b>' + this.x + '</b>: ' + Highcharts.numberFormat(this.y, 0);
                }
            },
            series: opts.series
        });
    }
};

