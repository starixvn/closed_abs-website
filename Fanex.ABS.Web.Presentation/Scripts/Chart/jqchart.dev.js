(function (a) {
    a.fn.jqChart = function (b) {
        b.dimension ? this.css("width", "".concat(b.dimension.width).concat("px")) : void (0);
        this.height() == 0 && this.css("height", b.dimension ? "".concat(b.dimension.height).concat("px") : "250px");
        this.setOptions = function (c) {
            var b = a.extend(true, {}, a.fn.jqChart.defaults, c || {});
            a.extend(this, b);
            this.border = new v(b.border);
            this.paletteColors = new I(b.paletteColors);
            this.title = new H(b.title);
            this.title.chart = this;
            this.legend = new B;
            this.legend.chart = this;
            this.legend.setOptions(c.legend);
            this.series = new n(c.series, this);
            this.axes = new g(c.axes, this);
            /** new optional **/
            this.watermark = b.watermark;
            this.dimension = b.dimension;
        };
        this.init = function () {
            this.canvas = this.createCanvas('frame');
            this.chartRenderer = new C(this.canvas);
            this.ctx = this.chartRenderer.ctx;
            this.areaCanvas = this.createCanvas('chart');
            this.areaRenderer = new C(this.areaCanvas);
            this.gridArea = new A(this);
            this.setOptions(b);
            this.width() == 0 && this.css("width", "400px");
            this.height() == 0 && this.css("height", "250px");
            this.update();
        };
        this.update = function () {
            /** function repair chart data **/
            this.clear();
            this.series.initData();
            this.axes.initSeriesAxes();
            this.axes.initSeries();
            this.axes.initRanges();
            this.series.initColors();
            this.legend.init();
            this.measure();
            this.arrange();
            this.axes.updateOrigins();
            this.axes.initRanges();
            /** function render chart data **/
            var a = [];
            this.border.render(a);
            this.title.render(a);
            this.legend.render(a);
            this.gridArea.render(a);
            this.axes.render(a);
            this.addWatermark(a);
            this.chartRenderer.render(a);
            var b = [];
            this.gridArea.renderSeries(b);
            this.areaRenderer.render(b);
        };
        this.createCanvas = function (id) {
            var b = document.createElement("canvas");
            b.width = this.width();
            b.height = this.height();
            a(b).css({ position: "absolute" }).attr("id", "canvas_" + id);
            if (a.fn.jqChart.use_excanvas) {
                window.G_vmlCanvasManager.init_(document);
                window.G_vmlCanvasManager.initElement(b)
            }
            this.append(b);
            return b;
        };
        this.measure = function () {
            this.title.measure();
            this.legend.measure();
            this.axes.measure()
        };
        this.arrange = function () {
            var f = this.width(), g = this.height();
            this.border.width = f;
            this.border.height = g;
            var e = this.border.getPadding(); f -= 2 * e; g -= 2 * e;
            this.title.x = e + (f - this.title.width) / 2;
            this.title.y = e;
            this.legend.x = e + f - this.legend.width;
            this.legend.y = e + (g - this.legend.height) / 2;
            var n = this.axes.getTotalWidth(), m = this.axes.getTotalHeight();
            this.gridArea.width = Math.round(f - (n + this.legend.width));
            this.gridArea.height = Math.round(g - (m + this.title.height));
            for (var c = e, d = this.title.y + this.title.height, h = this.axes.getAxesInLoc("left"), b = h.length - 1; b >= 0; b--) {
                var a = h[b]; a.x = c; a.height = this.gridArea.height; c = Math.ceil(c + a.width);
            }
            this.gridArea.x = c; c += this.gridArea.width;
            for (var i = this.axes.getAxesInLoc("right"), b = 0; b < i.length; b++) {
                var a = i[b]; a.x = c; a.height = this.gridArea.height; c = Math.ceil(c + a.width)
            }
            for (var l = this.axes.getAxesInLoc("top"), b = l.length - 1; b >= 0; b--) {
                var a = l[b]; a.x = this.gridArea.x; a.y = d; a.width = this.gridArea.width; d = Math.ceil(d + a.height)
            }
            this.gridArea.y = d; d += this.gridArea.height;
            for (var k = this.axes.getAxesInLoc("bottom"), b = 0; b < k.length; b++) {
                var a = k[b]; a.x = this.gridArea.x; a.y = d; a.width = this.gridArea.width; d = Math.ceil(d + a.height)
            }
            for (var j = h.concat(i), b = 0; b < j.length; b++) {
                var a = j[b]; a.y = this.gridArea.y
            } this.gridArea.arrange(); this.axes.arrange(); this.legend.arrange();
        };
        this.clear = function () {
            this.chartRenderer.clear();
            this.areaRenderer.clear();
        };
        this.findAxis = function (a) {
            if (this.axes) return this.axes.find(a)
        };
        this.addWatermark = function (c) {
            if (this.watermark) {
                var b = window.location.host.indexOf(this.watermark.text);
                if (b != -1) return;
                b = window.location.host.indexOf(this.watermark.text);
                if (b != -1) return;
                var a = new l(this.watermark.text);
                a.chart = this;
                a.font = this.watermark.font ? this.watermark.font : "14px sans-serif";
                a.fillStyle = this.watermark.color ? this.watermark.color : "grey";
                a.measure(this.ctx);
                a.x = this.width() - a.width - 16;
                a.y = this.height() - a.height;
                c.push(a);
            }
        };
        this.init(); return this;
    };
    a.fn.jqChart.support_canvas = function () {
        return !!document.createElement("canvas").getContext;
    };
    a.fn.jqChart.use_excanvas = a.browser.msie && !a.fn.jqChart.support_canvas() ? true : false;
    a.fn.jqChart.defaults = { title: { margin: 8, font: "22px sans-serif"} };
    var o = Number.MIN_VALUE, m = Number.MAX_VALUE;
    function e() { }
    e.roundH = function (a) { return Math.round(a) - .5 };
    e.round = function (a) { var b = 1 / a; if (Math.abs(b) > 1e4) { var c = e.log10(Math.abs(b)); if (c > 13) return a } var d = a.toPrecision(14), f = parseFloat(d); return f };
    e.log10 = function (a) { return Math.log(a) / Math.LN10 };
    e.fitInRange = function (a, c, b) { if (a < c) a = c; else if (a > b) a = b; return a };
    e.sum = function (b) { for (var c = 0, a = 0; a < b.length; a++) c += b[a]; return c };
    function c() { this.fillStyle = "black"; this.strokeStyle = "white"; this.lineWidth = 1; this.lineCap = "butt"; this.lineJoin = "miter"; this.miterLimit = 10 }
    c.prototype.render = function (a) { this.setProperties(a) };
    c.prototype.setProperties = function (a) { a.fillStyle = this.fillStyle; a.strokeStyle = this.strokeStyle; a.lineWidth = this.lineWidth || 0; a.lineCap = this.lineCap; a.lineJoin = this.lineJoin; a.miterLimit = this.miterLimit };
    function p(a, d, b, e) { c.call(this); this.x1 = a; this.y1 = d; this.x2 = b; this.y2 = e }
    p.prototype = new c;
    p.constructor = new p;
    p.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        a.beginPath();
        var b = e.roundH(this.x1), f = e.roundH(this.y1), d = e.roundH(this.x2), g = e.roundH(this.y2);
        a.moveTo(b, f);
        a.lineTo(d, g);
        this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
    };
    function k(d, e, b, a) {
        c.call(this);
        this.x = d;
        this.y = e;
        this.width = b;
        this.height = a;
        this.cornerRadius = 0
    }
    k.prototype = new c;
    k.constructor = new k;
    k.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        var f = e.roundH(this.x), g = e.roundH(this.y), d = Math.round(this.width), b = Math.round(this.height);
        if (d <= 0 || b <= 0) return;
        if (this.cornerRadius == 0) this.renderRectPath(a, f, g, d, b); else this.renderRoundedRectPath(a, f, g, d, b); this.fillStyle != null && a.fill();
        this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
    };
    k.prototype.renderRectPath = function (a, b, c, e, d) {
        a.beginPath();
        a.moveTo(b, c);
        a.lineTo(b + e, c);
        a.lineTo(b + e, c + d);
        a.lineTo(b, c + d);
        a.closePath();
    };
    k.prototype.renderRoundedRectPath = function (b, c, d, g, f) {
        var a = this.cornerRadius, e = Math.PI / 2;
        b.beginPath();
        b.moveTo(c + a, d);
        b.lineTo(c + g - a, d); b.arc(c + g - a, d + a, a, -e, 0, false);
        b.lineTo(c + g, d + f - a);
        b.arc(c + g - a, d + f - a, a, 0, e, false);
        b.lineTo(c + a, d + f);
        b.arc(c + a, d + f - a, a, e, 2 * e, false);
        b.lineTo(c, d + a);
        b.arc(c + a, d + a, a, 2 * e, -e, false);
        b.closePath()
    };
    function K(d, e, b, a) {
        c.call(this); this.x = d; this.y = e; this.width = b; this.height = a
    }
    K.prototype = new c;
    K.constructor = new K;
    K.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        var d = this.x, f = this.y, l = this.width, k = this.height, g = this.width / 2 * .5522848, h = this.height / 2 * .5522848, i = d + l, j = f + k, e = d + l / 2, b = f + k / 2;
        a.beginPath();
        a.moveTo(d, b);
        a.bezierCurveTo(d, b - h, e - g, f, e, f);
        a.bezierCurveTo(e + g, f, i, b - h, i, b);
        a.bezierCurveTo(i, b + h, e + g, j, e, j);
        a.bezierCurveTo(e - g, j, d, b + h, d, b);
        a.closePath();
        this.fillStyle != null && a.fill();
        this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
    };
    function G(b, d, a) {
        c.call(this);
        this.x = b; this.y = d;
        this.radius = a; this.width = this.height = 2 * a
    }
    G.prototype = new c;
    G.constructor = new G;
    G.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        a.beginPath();
        a.arc(Math.round(this.x), Math.round(this.y), Math.round(this.radius), 0, Math.PI * 2, false);
        a.closePath();
        this.fillStyle != null && a.fill();
        this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
    };
    function F(e, f, d, a, b) {
        c.call(this); this.x = e;
        this.y = f; this.radius = d;
        this.startAngle = a; this.endAngle = b
    }
    F.prototype = new c; F.constructor = new F;
    F.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        a.beginPath();
        var b = Math.round(this.x), d = Math.round(this.y);
        a.moveTo(b, d);
        a.arc(b, d, Math.round(this.radius), this.startAngle, this.endAngle, false);
        a.closePath();
        this.fillStyle != null && a.fill();
        this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
    };
    function t(a) {
        c.call(this); this.pts = a
    }
    t.prototype = new c;
    t.constructor = new t;
    t.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        var h = this.pts, g = h.length;
        if (g < 4) return;
        for (var f = false, d = 0; d < g; d += 2) {
            var b = h[d]; if (b == null) { a.stroke(); f = false; continue }
            var e = h[d + 1];
            if (g < 100) { b = Math.round(b); e = Math.round(e) }
            if (!f) { a.beginPath(); a.moveTo(b, e); f = true; continue }
            a.lineTo(b, e);
            if (d % 1e3 == 0) { a.stroke(); a.beginPath(); a.moveTo(b, e) }
        }
        this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
    };
    function u(a) {
        c.call(this);
        this.pts = a
    }
    u.prototype = new c;
    u.constructor = new u;
    u.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        var b = this.pts, e = b.length;
        if (e < 4) return;
        a.beginPath();
        a.moveTo(Math.round(b[0]), Math.round(b[1]));
        for (var d = 2; d < e; d += 2) a.lineTo(Math.round(b[d]), Math.round(b[d + 1]));
        a.closePath();
        this.fillStyle != null && a.fill();
        this.strokeStyle != null && this.lineWidth > 0 && a.stroke();
    };
    /** format text & label **/
    function l(a, b, c) {
        this.text = a;
        this.x = b;
        this.y = c;
        this.strokeStyle = null;
        this.textBaseline = "middle";
        this.font = "10px sans-serif";
        this.textAlign = "left";
    }
    l.prototype = new c;
    l.constructor = l;
    l.prototype.render = function (a) {
        c.prototype.render.call(this, a);
        var b = Math.round(this.x), d = Math.round(this.y);
        this.fillStyle != null && a.fillText(this.text, b, d);
        this.strokeStyle != null && a.strokeText(this.text, b, d)
    };
    l.prototype.measure = function (a) {
        this.setProperties(a);
        var d = a.measureText(this.text),
		b = parseFloat(this.font) || 0, c = d.width;
        this.width = c;
        this.height = b;
        return { width: c, height: b }
    };
    l.prototype.setProperties = function (a) {
        c.prototype.setProperties.call(this, a);
        a.font = this.font;
        a.textAlign = this.textAlign;
        a.textBaseline = this.textBaseline
    };
    function E(a) {
        this.defaults = { strokeStyle: "gray", lineWidth: 1, visible: true };
        this.setOptions(a)
    }
    E.prototype.setOptions = function (c) {
        var b = a.extend({}, this.defaults, c || {});
        a.extend(this, b)
    };
    E.prototype.setLineSettings = function (a) {
        a.strokeStyle = this.strokeStyle; a.lineWidth = this.lineWidth
    };
    function J(a) {
        this.defaults = { strokeStyle: "black", lineWidth: 1, length: 6, visible: true };
        this.setOptions(a)
    }
    J.prototype.setOptions = function (c) {
        var b = a.extend({}, this.defaults, c || {}); a.extend(this, b)
    };
    J.prototype.setLineSettings = function (a) {
        a.strokeStyle = this.strokeStyle; a.lineWidth = this.lineWidth
    };
    function L(a) {
        this.defaults = { fillStyle: "black", lineWidth: 1, font: "11px sans-serif", visible: true };
        this.setOptions(a)
    }
    L.prototype.setOptions = function (c) {
        var b = a.extend({}, this.defaults, c || {});
        a.extend(this, b)
    };
    L.prototype.setTextSettings = function (a) {
        a.fillStyle = this.fillStyle; a.strokeStyle = this.strokeStyle;
        a.lineWidth = this.lineWidth; a.font = this.font
    };
    function C(a) {
        if (this.canvas == null) {
            this.canvas = a; this.ctx = this.getContext(this.canvas)
        }
    }
    C.prototype.getContext = function (a) {
        return a.getContext ? a.getContext("2d") : null
    };
    C.prototype.render = function (d) {
        var c = this.offsetX && this.offsetY, a = this.ctx; if (c) { a.save(); a.translate(this.offsetX, this.offsetY) }
        for (var b = 0; b < d.length; b++) { var e = d[b]; e && e.render(a) } c && a.restore()
    };
    C.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    };
    function I(a) {
        this.colorsDefault = ["#418CF0", "#FCB441", "#E0400A", "#056492", "#BFBFBF", "#1A3B69", "#FFE382", "#129CDD", "#CA6B4B", "#005CDB", "#F3D288", "#506381", "#F1B9A8", "#E0830A", "#7893BE"];
        this.colorsGrayScale = M();
        this.defaults = { type: "default" };
        this.setOptions(a)
    }
    I.prototype.setOptions = function (c) {
        var b = a.extend({}, this.defaults, c || {});
        a.extend(this, b)
    };
    function M() {
        for (var e = 16, c = [], b = 0; b < e; b++) { var a = 200 - b * 11; a = a.toString(); var d = "rgb(" + a + "," + a + "," + a + ")"; c.push(d) } return c
    }
    I.prototype.getColor = function (b) {
        var a = this.getColors(this.type), c = a.length; b %= c; return a[b]
    };
    I.prototype.getColors = function (a) {
        switch (a) { case "grayscale": return this.colorsGrayScale; case "default": default: return this.colorsDefault }
    };
    function H(a) {
        this.defaults = { font: "14px sans-serif", fillStyle: "black", lineWidth: 1, margin: 6 };
        this.x = 0; this.y = 0;
        this.setOptions(a)
    }
    H.prototype.setOptions = function (c) {
        var b = a.extend({}, this.defaults, c || {});
        a.extend(this, b);
        this.textBlock = new l(this.text);
        this.textBlock.textBaseline = "top";
        this.textBlock.font = this.font;
        this.textBlock.fillStyle = this.fillStyle;
        this.textBlock.strokeStyle = this.strokeStyle;
        this.textBlock.lineWidth = this.lineWidth
    };
    H.prototype.render = function (a) {
        if (this.text == null) return;
        this.textBlock.x = this.x + this.margin;
        this.textBlock.y = this.y + this.margin;
        a.push(this.textBlock)
    };
    H.prototype.measure = function () {
        var a; if (!this.text) { this.width = 0; this.height = 0; return }
        a = this.textBlock.measure(this.chart.ctx);
        var b = 2 * this.margin; this.width = a.width + b; this.height = a.height + b
    };
    /** draw outsize border **/
    function v(a) {
        this.defaults = { strokeStyle: "white", lineWidth: 1, lineCap: "butt", lineJoin: "miter", miterLimit: 10, cornerRadius: 10, padding: 8 };
        this.x = 0; this.y = 0; this.setOptions(a)
    }
    v.prototype.setOptions = function (c) {
        var b = a.extend({}, this.defaults, c || {});
        a.extend(this, b)
    };
    v.prototype.getPadding = function () {
        return this.lineWidth + this.cornerRadius / 2 + this.padding
    };
    v.prototype.setShapeSettings = function (a) {
        a.fillStyle = this.fillStyle; a.strokeStyle = this.strokeStyle;
        a.lineWidth = this.lineWidth; a.lineCap = this.lineCap; a.lineJoin = this.lineJoin;
        a.miterLimit = this.miterLimit; a.cornerRadius = this.cornerRadius
    };
    v.prototype.render = function (c) {
        var a = this.lineWidth / 2, f = this.x + a, g = this.y + a, e = this.width - 2 * a, d = this.height - 2 * a, b = new k(f, g, e, d);
        this.setShapeSettings(b); c.push(b)
    };
    function w(a) {
        this.defaults = { lineWidth: 1, lineCap: "butt", lineJoin: "miter", miterLimit: 10, size: 8, type: "circle" };
        this.setOptions(a)
    }
    w.prototype.setOptions = function (c) {
        var b = a.extend({}, this.defaults, c || {});
        a.extend(this, b)
    };
    w.prototype.setShapeSettings = function (a) {
        a.fillStyle = this.fillStyle; a.strokeStyle = this.strokeStyle; a.lineWidth = this.lineWidth;
        a.lineCap = this.lineCap; a.lineJoin = this.lineJoin; a.miterLimit = this.miterLimit
    };
    w.prototype.getSize = function () {
        return { width: this.size, height: this.size }
    };
    w.prototype.getShape = function (c, d, b) {
        var g = 2 * b, i;
        switch (this.type) {
            case "circle": return new G(c, d, b);
            case "rectangle": return new k(c - b, d - b, g, g);
            case "diamond": var a = []; a.push(c); a.push(d - b); a.push(c + b); a.push(d); a.push(c); a.push(d + b); a.push(c - b); a.push(d); var f = new u(a); return f;
            case "triangle": var a = []; a.push(c); a.push(d - b); a.push(c + b); a.push(d + b); a.push(c - b); a.push(d + b); var f = new u(a); return f;
            case "line": return new p(c - b, d, c + b, d);
            case "plus": var a = []; a.push(c - b); a.push(d); a.push(c + b); a.push(d); a.push(null); a.push(null); a.push(c); a.push(d - b); a.push(c); a.push(d + b); var e = new t(a); return e;
            case "plus": var a = []; a.push(c - b); a.push(d); a.push(c + b); a.push(d); a.push(null); a.push(null); a.push(c); a.push(d - b); a.push(c); a.push(d + b); var e = new t(a); return e;
            default: return null
        }
    };
    function B(a) {
        this.defaults = { title: { margin: 2 }, border: { padding: 4, strokeStyle: "grey" }, margin: 6 };
        this.setOptions(a)
    }
    B.prototype.setOptions = function (c) {
        var b = a.extend(true, {}, this.defaults, c || {});
        this.margin = b.margin; this.border = new v(b.border);
        this.title = new H(b.title);
        this.title.chart = this.chart
    };
    B.prototype.init = function () {
        this.items = [];
        if (this.visible == false) return;
        for (var c = this.chart.series.items, b = 0; b < c.length; b++) {
            var d = c[b]; a.merge(this.items, d.getLegendItems())
        }
    };
    B.prototype.measure = function () {
        if (this.visible == false) {
            this.width = 0; this.height = 0; return
        } this.padding = this.border.getPadding(); this.title.measure();
        var d = this.title.width, b = this.title.height;
        if (this.title.text) b += this.padding;
        for (var c = 0; c < this.items.length; c++) {
            var a = this.items[c]; a.measure(); d = Math.max(d, a.width); b += a.height
        }
        var e = 2 * this.margin + 2 * this.padding; this.width = d + e; this.height = b + e
    };
    B.prototype.arrange = function () {
        if (this.visible == false) return;
        var c = this.x + this.margin, a = this.y + this.margin, f = 2 * this.margin;
        this.border.x = c; this.border.y = a;
        var e = this.width - f; this.border.width = e;
        this.border.height = this.height - f; e -= 2 * this.padding;
        c += this.padding; a += this.padding;
        if (this.title.text) { this.title.x = c + (e - this.title.width) / 2; this.title.y = a; a += this.title.height + this.padding }
        for (var d = 0; d < this.items.length; d++) { var b = this.items[d]; b.x = c; b.y = a; b.arrange(); a += b.height }
    };
    B.prototype.render = function (a) {
        if (this.visible == false) return;
        this.border.render(a);
        this.title.render(a);
        for (var b = 0; b < this.items.length; b++) { var c = this.items[b]; c.render(a) }
    };
    function y(a) {
        this.defaults = { font: "12px sans-serif", fillStyle: "black", lineWidth: 1 };
        this.lblMargin = 4; this.setOptions(a)
    }
    y.prototype.setOptions = function (c) {
        var b = a.extend(true, {}, this.defaults, c || {});
        a.extend(this, b);
        this.textBlock = new l(this.text);
        this.textBlock.textBaseline = "top";
        this.textBlock.font = this.font;
        this.textBlock.fillStyle = this.fillStyle;
        this.textBlock.strokeStyle = this.strokeStyle;
        this.textBlock.lineWidth = this.lineWidth
    };
    y.prototype.measure = function () {
        var a;
        if (this.text) a = this.textBlock.measure(this.chart.ctx); else a = { width: 0, height: 0 }; this.width = a.width + this.marker.size + this.lblMargin; this.height = a.height
    };
    y.prototype.arrange = function () {
        var a = this.marker.size / 2, b = this.x + a, c = this.y + a + (this.height - this.marker.size) / 2; this.markerShape = this.marker.getShape(b, c, a); this.markerShape && this.marker.setShapeSettings(this.markerShape); this.textBlock.x = this.x + this.marker.size + this.lblMargin; this.textBlock.y = this.y
    };
    y.prototype.render = function (a) {
        a.push(this.markerShape); a.push(this.textBlock)
    };
    function A(a) { this.chart = a; this.border = new v; this.border.lineWidth = 0 }
    A.prototype.arrange = function () { var c = this.x, d = this.y; this.border.x = c - 1; this.border.y = d - 1; this.border.width = this.width + 1; this.border.height = this.height + 1; var b = this.chart.areaCanvas; a(b).css({ position: "relative", left: c, top: d }); b.width = Math.max(this.width, 0); b.height = Math.max(this.height, 0); this.chart.areaRenderer.offsetX = -c; this.chart.areaRenderer.offsetY = -d };
    A.prototype.render = function (a) { this.border.render(a); this.renderGridLines(a) };
    A.prototype.renderSeries = function (c) { for (var b = this.chart.series.items, a = 0; a < b.length; a++) { var d = b[a]; d.render(c) } };
    A.prototype.renderGridLines = function (e) { for (var f = this.chart.axes.items, d = 0; d < f.length; d++) { var b = f[d], h = this.getGridLines(b, b.minorGridLines, false); a.merge(e, h); var c = b.majorGridLines; if (c == null && b.getOrientation() == "y") c = new E; var g = this.getGridLines(b, c, true); a.merge(e, g) } };
    A.prototype.getGridLines = function (b, a, l) { if (a == null || a.visible != true) return []; for (var h = [], m = b.getMarkInterval(a, l), i = b.getIntervals(m, a), c, d, e, f, g = 0; g < i.length; g++) { var k = b.getPosition(i[g]); switch (b.location) { case "left": case "right": d = f = k; c = this.x; e = c + this.width; break; case "top": case "bottom": c = e = k; d = this.y; f = d + this.height } var j = new p(c, d, e, f); a.setLineSettings(j); h.push(j) } return h };
    /** options for shape chart **/
    function n(d, f) {
        this.chart = f; this.items = [];
        if (a.isArray(d) == false) return;
        for (var e = 0; e < d.length; e++) {
            var c = d[e]; if (c == null) continue;
            var b;
            switch (c.type) {
                case "area": b = new x(c); break;
                case "bar": b = new i(c); break;
                case "bubble": b = new r(c); break;
                case "line": b = new z(c); break;
                case "pie": b = new j(c); break;
                case "scatter": b = new q(c); break;
                case "column": default: b = new s(c);
            }
            b.type = c.type; b.chart = f; this.items.push(b);
        }
    }
    n.prototype.initData = function () { for (var b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.initData() } };
    n.prototype.initCategories = function () { for (var c = [], d = 0, a = 0, e = this.items, b = 0; b < e.length; b++) { var f = e[b]; for (a = d; a < f.categories.length; a++) { var g = f.categories[a]; c.push(g) } d = a } this.categories = c };
    n.prototype.initRanges = function () { for (var e = m, d = o, c = m, b = o, g = this.items, f = 0; f < g.length; f++) { var a = g[f]; if (e > a.min) e = a.min; if (d < a.max) d = a.max; if (c > a.minX) c = a.minX; if (b < a.maxX) b = a.maxX } this.min = e; this.max = d; this.minX = c; this.maxX = b };
    n.prototype.findClusters = function (g, f) { for (var c = -1, a = 0, d = this.items, b = 0; b < d.length; b++) { var e = d[b]; if (e == g) c = a; if (e.type == f) a++ } return { index: c, count: a} };
    n.prototype.initColors = function () { for (var b = this.chart.paletteColors, c = this.items, a = 0; a < c.length; a++) { var d = c[a]; d.initColors(b.getColor(a), b) } };
    n.prototype.getPixelMargins = function (f) { for (var b = 0, a = 0, e = this.items, c = 0; c < e.length; c++) { var g = e[c], d = g.getPixelMargins(f); b = Math.max(b, d.left); a = Math.max(a, d.right) } return { left: b, right: a} };
    n.prototype.isAnchoredToOrigin = function () { for (var b = this.items, a = 0; a < b.length; a++) { var c = b[a]; if (c.isAnchoredToOrigin()) return true } return false };
    function b(a) { this.setOptions(a) }
    b.prototype.defaults = { lineCap: "butt", lineJoin: "round", miterLimit: 10, pointWidth: .6 };
    b.prototype.setOptions = function (c) { var b = a.extend({}, this.defaults, c || {}); a.extend(this, b); if (b.markers != null) this.markers = new w(b.markers) };
    b.prototype.getMarker = function (c, d, b) { if (b == null) b = this.markers.size / 2; var a = this.markers.getShape(c, d, b); if (a == null) return null; this.markers.setShapeSettings(a); this.setMarkerSettings(a); return a };
    b.prototype.setMarkerSettings = function (a) { a.fillStyle = a.fillStyle || this.fillStyle };
    b.prototype.setShapeSettings = function (a) { a.fillStyle = this.fillStyle; a.strokeStyle = this.strokeStyle; a.lineWidth = this.lineWidth; a.lineCap = this.lineCap; a.lineJoin = this.lineJoin; a.miterLimit = this.miterLimit };
    b.prototype.initData = function () { var j = this.data; if (a.isArray(j) == false) return; for (var f = m, e = o, c = [], i = m, k = o, n = j.length, h = 0; h < n; h++) { var b = j[h]; if (b == null) { c.push(h.toString()); continue } if (a.isArray(b) == false) { if (f > b) f = b; if (e < b) e = b; c.push(h.toString()) } else { var d = b[0], l = typeof d; if (l == "string") c.push(d); else if (l == "number") { if (i > d) i = d; if (k < d) k = d } var g = b[1]; if (typeof g == "number") { if (f > g) f = g; if (e < g) e = g } } } this.min = f; this.max = e; if (c.length > 0 && i != m) throw "The data is not valid"; if (c.length > 0) this.categories = c; else { this.minX = i; this.maxX = k; this.categories = null } };
    b.prototype.createXAxis = function () { var b = { location: "bottom", orientation: "x" }, a; if (this.categories) a = new h(b); else a = new f(b); a.chart = this.chart; return a };
    b.prototype.createYAxis = function () { var a = new f({ location: "left", orientation: "y" }); a.chart = this.chart; return a };
    b.prototype.initXAxis = function (b) { var a = this.findXAxis(b); if (a == null) { a = this.createXAxis(); b.push(a) } this.realXAxis = a };
    b.prototype.initYAxis = function (b) { var a = this.findYAxis(b); if (a == null) { a = this.createYAxis(); b.push(a) } this.realYAxis = a };
    b.prototype.findAxis = function (b, d) { if (d != null) for (var a = 0; a < b.length; a++) { var c = b[a]; if (c.name == d) return c } return null };
    b.prototype.findXAxis = function (b) { var a = this.findAxis(b, this.axisX); if (a != null) return a; var c; if (this.categories) c = h; else c = f; for (var d = 0; d < b.length; d++) { a = b[d]; if (a.getOrientation(this.type) != "x" || a.isVertical()) continue; if (a instanceof c) return a } return null };
    b.prototype.findYAxis = function (b) { var a = this.findAxis(b, this.axisY); if (a != null) return a; for (var c = 0; c < b.length; c++) { a = b[c]; if (a.getOrientation(this.type) != "y" || a.isVertical() == false) continue; if (a instanceof f) return a } return null };
    /** set legen label **/
    b.prototype.getLegendItems = function () {
        var e = [], b;
        if (this.title != null) b = this.title; else { var f = a.inArray(this, this.chart.series.items) + 1; b = "Series " + f.toString() } var d = new w; this.setLegendMarkerSettings(d); var c = new y({ text: b, marker: d }); c.chart = this.chart; c.series = this; e.push(c); return e;
    };
    b.prototype.setLegendMarkerSettings = function (a) { a.fillStyle = this.fillStyle; a.lineWidth = this.lineWidth; a.strokeStyle = this.strokeStyle };
    b.prototype.initColors = function (a) { this.fillStyle = this.fillStyle || a; this.strokeStyle = this.strokeStyle || a };
    b.prototype.getPixelMargins = function (d) { var c = 4, b; if (this.markers) b = this.markers.getSize(); else b = { width: 0, height: 0 }; var a; if (d.isVertical()) a = b.height / 2 + c; else a = b.width / 2 + c; if (d.getOrientation(this.type) == "x") a = Math.max(a, 6); else a = Math.max(a, 12); return { left: a, right: a} };
    b.prototype.isAnchoredToOrigin = function () { return false };
    function x(a) { b.call(this, a) }
    x.prototype = new b;
    x.constructor = x;
    x.prototype.render = function (n) { var j = this.chart.gridArea, w = j.y, t = j.y + j.height, h = this.realYAxis.getCrossingPosition(); h = e.fitInRange(h, w, t); for (var v = this.data.length, c = [], l = [], b, d, i, q, k, o, g = 0; g < v; g++) { var f = this.data[g]; if (f == null) continue; if (a.isArray(f) == false) { b = g + .5; d = f } else { var r = f[0], p = typeof r; if (p == "string") b = g + .5; else if (p == "number") b = r; var s = f[1]; if (typeof s == "number") d = s } b = this.realXAxis.getPosition(b); d = this.realYAxis.getPosition(d); if (i == null) { i = b; q = h } k = b; o = h; this.markers && l.push(this.getMarker(b, d)); c.push(b); c.push(d) } if (k) { c.push(k); c.push(o) } if (i) { c.push(i); c.push(q) } var m = new u(c); this.setShapeSettings(m); n.push(m); a.merge(n, l) };
    x.prototype.isAnchoredToOrigin = function () { return true };
    function i(a) { b.call(this, a) }
    i.prototype = new b;
    i.constructor = i;
    i.prototype.createXAxis = function () { var b = { location: "left", orientation: "x" }, a; if (this.categories) a = new h(b); else a = new f(b); a.chart = this.chart; return a };
    i.prototype.createYAxis = function () { var a = new f({ location: "bottom", orientation: "y" }); a.chart = this.chart; return a };
    i.prototype.findXAxis = function (b) { var a = this.findAxis(b, this.axisX); if (a != null) return a; var c; if (this.categories) c = h; else c = f; for (var d = 0; d < b.length; d++) { a = b[d]; if (a.getOrientation(this.type) != "x" || a.isVertical() == false) continue; if (a instanceof c) return a } return null };
    i.prototype.findYAxis = function (b) { var a = this.findAxis(b, this.axisY); if (a != null) return a; for (var c = 0; c < b.length; c++) { a = b[c]; if (a.getOrientation(this.type) != "y" || a.isVertical()) continue; if (a instanceof f) return a } return null };
    i.prototype.render = function (q) { var m = this.chart.gridArea, r = m.x, v = r + m.width, b = this.realYAxis.getCrossingPosition(); b = e.fitInRange(b, r, v); b = Math.round(b); var l = this.chart.series.findClusters(this, "bar"), t = this.data.length, p = m.height / t, w = p / l.count, d = Math.round(this.pointWidth * w), u = l.count * d, j = (p - u) / 2; j = Math.round(j + l.index * d); for (var o = [], c, i, h = 0; h < t; h++) { var g = this.data[h]; if (g == null) continue; var x = h, f; if (a.isArray(g) == false) f = g; else f = g[1]; i = Math.round(this.realXAxis.getPosition(x) - j - d); c = Math.round(this.realYAxis.getPosition(f)); var y = c, n; if (c <= b) n = b - c; else { n = c - b; c = b } var s = new k(c, i, n, d); this.setShapeSettings(s); q.push(s); if (this.markers && this.realYAxis.isValueVisible(f)) { i += d / 2; o.push(this.getMarker(y, i)) } } a.merge(q, o) };
    i.prototype.getPixelMargins = function (d) { var a = b.prototype.getPixelMargins.call(this, d), c = d.length / 10, f = Math.max(c, a.left), e = Math.max(c, a.right); return { left: f, right: e} };
    i.prototype.isAnchoredToOrigin = function () { return true };
    function r(c) { var d = a.extend(true, {}, this.defaults, { markers: {} }); this.defaults = d; b.call(this, c) }
    r.prototype = new b;
    r.constructor = r;
    r.prototype.initData = function () { var c = []; a.merge(c, this.data); for (var p = this.chart.series.items, b = 0; b < p.length; b++) { var k = p[b]; if (k == this || k.type != "bubble") continue; a.merge(c, k.data) } if (a.isArray(c) == false) return; for (var j = m, i = o, h = m, g = o, e = m, d = o, q = c.length, b = 0; b < q; b++) { var l = c[b][0], n = c[b][1], f = c[b][2]; if (l == null || n == null || f == null) continue; h = Math.min(h, l); g = Math.max(g, l); j = Math.min(j, n); i = Math.max(i, n); e = Math.min(e, f); d = Math.max(d, f) } this.min = j; this.max = i; this.minX = h; this.maxX = g; this.minSize = e; this.maxSize = d };
    r.prototype.render = function (h) { for (var f = this.chart.gridArea, g = Math.min(f.width, f.height) * .25, k = this.data.length, b = 0; b < k; b++) { var a = this.data[b]; if (a == null) continue; var c = a[0], d = a[1], l = a[2], i = l / this.maxSize, j = Math.max(i * g, 0); c = this.realXAxis.getPosition(c); d = this.realYAxis.getPosition(d); if (this.markers) { var e = this.getMarker(c, d, j / 2); e && h.push(e) } } };
    r.prototype.getPixelMargins = function () { var a = this.chart.gridArea; if (a.width == null) return { left: 0, right: 0 }; var c = Math.min(a.width, a.height) * .35, b = c / 2; return { left: b + 4, right: b + 4} };
    function s(a) { b.call(this, a) }
    s.prototype = new b;
    s.constructor = s;
    s.prototype.render = function (q) { var f = this.chart.gridArea, w = f.y, v = f.y + f.height, b = this.realYAxis.getCrossingPosition(); b = e.fitInRange(b, w, v); b = Math.round(b); var n = this.chart.series.findClusters(this, "column"), s = this.data.length, p = f.width / s, u = p / n.count, j = Math.round(this.pointWidth * u), t = n.count * j, m = (p - t) / 2; m = Math.round(m + n.index * j); for (var o = [], d, c, i = 0; i < s; i++) { var h = this.data[i]; if (h == null) continue; d = i; var g; if (a.isArray(h) == false) g = h; else g = h[1]; d = Math.round(this.realXAxis.getPosition(d) + m); c = Math.round(this.realYAxis.getPosition(g)); var x = c, l; if (c <= b) l = b - c; else { l = c - b; c = b } var r = new k(d, c, j, l); this.setShapeSettings(r); q.push(r); if (this.markers && this.realYAxis.isValueVisible(g)) { d += j / 2; o.push(this.getMarker(d, x)) } } a.merge(q, o) };
    s.prototype.getPixelMargins = function (d) { var a = b.prototype.getPixelMargins.call(this, d), c = d.length / 10, f = Math.max(c, a.left), e = Math.max(c, a.right); return { left: f, right: e} };
    s.prototype.isAnchoredToOrigin = function () { return true };
    function z(c) { var d = a.extend(true, {}, this.defaults, { lineWidth: 2, markers: {} }); this.defaults = d; b.call(this, c) }
    z.prototype = new b;
    z.constructor = z;
    z.prototype.render = function (j) { for (var n = this.data.length, b = [], h = [], c, d, f = 0; f < n; f++) { var e = this.data[f]; if (e == null) { b.push(null); b.push(null); continue } if (a.isArray(e) == false) { c = f + .5; d = e } else { var l = e[0], k = typeof l; if (k == "string") c = f + .5; else if (k == "number") c = l; var m = e[1]; if (typeof m == "number") d = m; else { b.push(null); b.push(null); continue } } c = this.realXAxis.getPosition(c); d = this.realYAxis.getPosition(d); if (this.markers && this.markers.type != "none") { var i = this.getMarker(c, d); i && h.push(i) } b.push(c); b.push(d) } var g = new t(b); this.setShapeSettings(g); j.push(g); a.merge(j, h) };
    z.prototype.setLegendMarkerSettings = function (a) { b.prototype.setLegendMarkerSettings.call(this, a); a.type = "line" };
    function j(a) { b.call(this, a) }
    j.prototype = new b;
    j.constructor = j;
    j.prototype.initXAxis = function () { };
    j.prototype.initYAxis = function () { };
    j.prototype.getYValues = function () { for (var e = [], f = this.data.length, d = 0; d < f; d++) { var b = this.data[d]; if (b == null) continue; var c; if (a.isArray(b) == false) c = b; else c = b[1]; e.push(Math.abs(c)) } return e };
    j.prototype.render = function (j) { var a = this.chart.gridArea, f = this.getYValues(), m = e.sum(f), l = f.length, i = 10, d; if (a.width < a.height) d = a.width / 2 - i; else d = a.height / 2 - i; for (var o = a.x + a.width / 2, p = a.y + a.height / 2, k = Math.PI * 2 / m, c = -Math.PI / 2, b = 0; b < l; b++) { var n = f[b], h = c + n * k, g = new F(o, p, d, c, h); this.setShapeSettings(g); g.fillStyle = this.palette.getColor(b); j.push(g); c = h } };
    j.prototype.getLegendItems = function () { for (var g = [], c, i = this.data.length, b = 0; b < i; b++) { var e = this.data[b]; if (e == null) continue; var j; if (a.isArray(e) == false) { var h = b + 1; c = h.toString() } else c = e[0]; var f = new w; f.fillStyle = this.palette.getColor(b); var d = new y({ text: c, marker: f }); d.chart = this.chart; d.series = this; g.push(d) } return g };
    j.prototype.initColors = function (b, a) { this.palette = a };
    function q(c) { var d = a.extend(true, {}, this.defaults, { markers: { type: "diamond"} }); this.defaults = d; b.call(this, c) }
    q.prototype = new b;
    q.constructor = q;
    q.prototype.initData = function () { var c = this.data; if (a.isArray(c) == false) return; for (var i = m, h = o, g = m, f = o, j = c.length, e = 0; e < j; e++) { var b = c[e][1]; if (b == null) continue; if (i > b) i = b; if (h < b) h = b; var d = c[e][0]; if (g > d) g = d; if (f < d) f = d } this.min = i; this.max = h; this.minX = g; this.maxX = f };
    q.prototype.render = function (f) { for (var g = this.data.length, a, b, d = 0; d < g; d++) { var c = this.data[d]; if (c == null) continue; a = c[0]; b = c[1]; if (this.realXAxis.isValueVisible(a) == false || this.realYAxis.isValueVisible(b) == false) continue; a = this.realXAxis.getPosition(a); b = this.realYAxis.getPosition(b); if (this.markers) { var e = this.getMarker(a, b); e && f.push(e) } } };
    q.prototype.setLegendMarkerSettings = function (a) { a.fillStyle = this.fillStyle; if (this.markers) a.type = this.markers.type };
    function g(a, e) { a = a || {}; this.chart = e; for (var g = [], d = 0; d < a.length; d++) { var c = a[d], b; switch (c.type) { case "category": b = new h(c); break; case "linear": default: b = new f(c) } b.chart = e; g.push(b) } this.userAxes = g }
    g.prototype.initSeriesAxes = function () { var b = []; a.merge(b, this.userAxes); for (var d = this.chart.series.items, c = 0; c < d.length; c++) { var e = d[c]; e.initXAxis(b); e.initYAxis(b) } this.items = b };
    g.prototype.initSeries = function () { for (var b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.initSeries() } };
    g.prototype.find = function (d) { var b = this.items; if (d != null) for (var a = 0; a < b.length; a++) { var c = b[a]; if (c.name == d) return c } return null };
    g.prototype.initRanges = function () { for (var b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.initRange() } };
    g.prototype.measure = function () { for (var b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.measure() } };
    g.prototype.arrange = function () { for (var b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.arrange() } };
    g.prototype.getAxesInLoc = function (e) { for (var d = [], b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.location == e && d.push(c) } return d };
    g.prototype.getVAxes = function () { for (var d = [], b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.isVertical() && d.push(c) } return d };
    g.prototype.getHAxes = function () { for (var d = [], b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.isVertical() == false && d.push(c) } return d };
    g.prototype.getTotalWidth = function () { for (var a = 0, c = this.items, b = 0; b < c.length; b++) { var d = c[b]; if (d.isVertical()) a = a + d.width } return a };
    g.prototype.getTotalHeight = function () { for (var a = 0, c = this.items, b = 0; b < c.length; b++) { var d = c[b]; if (d.isVertical() == false) a = a + d.height } return a };
    g.prototype.render = function (c) { for (var b = this.items, a = 0; a < b.length; a++) { var d = b[a]; d.render(c) } };
    g.prototype.updateOrigins = function () { for (var b = this.items, a = 0; a < b.length; a++) { var c = b[a]; c.updateOrigin() } };
    function d(a) { this.minScaleValue = .001; this.maxInter200Px = 8; this.lblMargin = 4; this.length = 300; this.defaults = { strokeStyle: "black", lineWidth: 1, margin: 5, crossing: 0, zoomEnabled: false, scaleValue: 1, scrollValue: 0 }; this.setOptions(a) }
    d.prototype.setOptions = function (c) { var b = a.extend({}, this.defaults, c || {}); a.extend(this, b); this.majorTickMarks = new J(b.majorTickMarks); if (b.minorTickMarks) this.minorTickMarks = new J(b.minorTickMarks); if (b.majorGridLines) this.majorGridLines = new E(b.majorGridLines); if (b.minorGridLines) this.minorGridLines = new E(b.minorGridLines); this.label = new L(b.labels) };
    d.prototype.initSeries = function () { for (var c = new n(null, this.chart), d = this.chart.series.items, b = 0; b < d.length; b++) { var a = d[b]; (a.realXAxis == this || a.realYAxis == this) && c.items.push(a) } this.series = c };
    d.prototype.isVertical = function () { return this.location == "left" || this.location == "right" ? true : false };
    d.prototype.setVisibleRanges = function () { var a = Math.max(this.scaleValue, this.minScaleValue); a = Math.min(a, 1); var b = Math.max(this.scrollValue, 0); b = Math.min(b, 1); this.range = this.actualMaximum - this.actualMinimum; this.visibleMinimum = this.actualMinimum + (1 - a) * b * this.range; this.visibleMaximum = this.visibleMinimum + a * this.range };
    d.prototype.getPosition = function (b) { var a = this.length / (this.visibleMaximum - this.visibleMinimum) * (b - this.visibleMinimum); if (this.isVertical()) a = this.origin + this.length - a; else a += this.origin; return a };
    d.prototype.getValue = function (a) { return a * (this.actualMaximum - this.actualMinimum) / this.length + this.actualMinimum };
    d.prototype.isValueVisible = function (a) { return a >= this.actualMinimum && a <= this.actualMaximum };
    d.prototype.getNextPosition = function (b, a) { return e.round(b + a) };
    d.prototype.getMarkInterval = function (b, c) { var a; if (b.interval) a = b.interval; else if (c) a = this.actualInterval; else a = this.actualInterval / 2; return a };
    d.prototype.getIntervals = function (c, b) { var d = 0; if (b && b.intervalOffset) d = b.intervalOffset; for (var f = [], g = this.getIntervalStart(this.visibleMinimum, c), a = g + d; a <= this.visibleMaximum; a = e.round(a + c)) f.push(a); return f };
    d.prototype.getIntervalStart = function (d, b) { var c = d - this.crossing, a = this.alignToInterval(c, b); if (a < d) a = this.alignToInterval(c + b, b); return a };
    d.prototype.alignToInterval = function (b, a) { return e.round(e.round(Math.floor(b / a)) * a) + this.crossing };
    d.prototype.getLabelIntervals = function (a, b) { return this.getIntervals(a, b) };
    d.prototype.measure = function () { for (var e = this.getLabels(this.label), d = 0, b = 0, c = 0; c < e.length; c++) { var a = e[c]; a.measure(this.chart.ctx); d = Math.max(d, a.width); b = Math.max(b, a.height) } var f = this.lblMargin + this.margin + this.getMaxTickMarksLenght(); if (this.isVertical()) this.width = d + f; else this.height = b + f };
    d.prototype.arrange = function () { var a = this.x, c = this.y, b = this.x + this.width, d = this.y + this.height; switch (this.location) { case "left": b = a = this.x + this.width; break; case "right": b = a = this.x; break; case "top": d = c = this.y + this.height; break; case "bottom": d = c = this.y } this.x1 = a; this.y1 = c; this.x2 = b; this.y2 = d };
    d.prototype.updateOrigin = function () { if (this.isVertical()) { this.origin = this.y; this.length = this.height } else { this.origin = this.x; this.length = this.width } };
    d.prototype.render = function (b) { var e = this.getTickMarks(this.minorTickMarks, false); a.merge(b, e); var d = this.getTickMarks(this.majorTickMarks, true); a.merge(b, d); var f = this.getMainLine(); b.push(f); var c = this.getLabels(this.label); a.merge(b, c) };
    d.prototype.getMainLine = function () { var a = new p(this.x1, this.y1, this.x2, this.y2); a.strokeStyle = this.strokeStyle; a.lineWidth = this.lineWidth; return a };
    d.prototype.getMaxTickMarksLenght = function () { var a = 0; if (this.minorTickMarks != null && this.minorTickMarks.visible) a = Math.max(a, this.minorTickMarks.length); if (this.majorTickMarks != null && this.majorTickMarks.visible) a = Math.max(a, this.majorTickMarks.length); return a };
    d.prototype.getLabel = function (a) { return a.toString() };
    d.prototype.getLabels = function (b) { if (b == null || b.visible != true) return []; for (var c = this.getMaxTickMarksLenght() + this.lblMargin, f = [], j = this.getMarkInterval(b, true), g = this.getLabelIntervals(j, b), e = 0; e < g.length; e++) { var h = g[e], i = this.getLabel(h), a = new l(i), d = this.getPosition(h); switch (this.location) { case "left": a.x = this.x + this.width - c; a.y = d; a.textAlign = "right"; break; case "right": a.x = this.x + c; a.y = d; break; case "top": a.x = d; a.y = this.y + this.height - c; a.textAlign = "center"; a.textBaseline = "bottom"; break; case "bottom": a.x = d; a.y = this.y + c; a.textAlign = "center"; a.textBaseline = "top" } b.setTextSettings(a); f.push(a) } return f };
    d.prototype.getTickMarks = function (b, l) { if (b == null || b.visible != true) return []; for (var i = [], m = this.getMarkInterval(b, l), f = b.length, j = this.getIntervals(m, b), c, e, d, a, h = 0; h < j.length; h++) { var g = this.getPosition(j[h]); switch (this.location) { case "left": e = a = g; d = this.x + this.width; c = d - f; break; case "right": e = a = g; c = this.x; d = c + f; break; case "top": c = d = g; a = this.y + this.height; e = a - f; break; case "bottom": c = d = g; a = this.y; e = a + f } var k = new p(c, e, d, a); b.setLineSettings(k); i.push(k) } return i };
    function h(a) { d.call(this, a) }
    h.prototype = new d;
    h.constructor = h;
    h.prototype.initRange = function () { var b = this.series; b.initCategories(); var c = b.categories, a = c.length; if (this.categories) a = Math.max(a, this.categories.length); this.actualMinimum = 0; this.actualMaximum = a; this.setVisibleRanges(); this.actualInterval = 1; this.seriesCategories = c };
    h.prototype.getLabel = function (b) { var a = Math.round(b - .5); return this.categories && a < this.categories.length ? this.categories[a] : this.seriesCategories[a] };
    h.prototype.getLabelIntervals = function (c) { for (var b = [], a = this.visibleMinimum + .5; a <= this.visibleMaximum; a = e.round(a + c)) b.push(a); return b };
    h.prototype.getOrientation = function () { return "x" };
    function D(a) { d.call(this, a) }
    D.prototype = new d;
    D.constructor = D;
    function f(a) { D.call(this, a) }
    f.prototype = new D;
    f.constructor = f;
    f.prototype.initRange = function () { var b = this.series; b.initRanges(); var f, e; if (this.getOrientation() == "x") { f = b.minX; e = b.maxX } else { f = b.min; e = b.max } var g = Math.abs(e - f); if (g == 0) g = 1; var i = b.getPixelMargins(this), h = g / this.length, d = f - h * (i.left + .5), c = e + h * (i.right + .5), j = this.series.isAnchoredToOrigin(), a = this.crossing; if (j) if (f >= a && d < a) d = a; else if (e <= a && c > a) c = a; if (this.extendRangeToOrigin) if (d > a) d = a; else if (c < a) c = a; this.actualMinimum = this.minimum || d; this.actualMaximum = this.maximum || c; this.setVisibleRanges(); this.actualInterval = this.calculateActualInterval(this.visibleMinimum, this.visibleMaximum) };
    f.prototype.calculateActualInterval = function (m, l) { if (this.interval) return this.interval; var g = 1; if (this.getOrientation() == "x") g = .8; for (var j = g * this.maxInter200Px, d = Math.max(this.length * j / 200, 1), f = l - m, a = f / d, i = Math.pow(10, Math.floor(e.log10(a))), k = [10, 5, 2, 1], b = 0; b < 4; b++) { var h = k[b], c = i * h; if (d < f / c) break; a = c } return a };
    f.prototype.getCrossingPosition = function () { return this.getPosition(this.crossing) };
    f.prototype.getOrientation = function (c) { var a = this.isVertical(); if (this.series) for (var b = 0; b < this.series.items.length; b++) c = this.series.items[b].type; if (c == "bar") a = !a; return a ? "y" : "x" }
})(jQuery);