/*!
 Papa Parse
 v4.1.2
 https://github.com/mholt/PapaParse
 */
!function (a, b) {
    "function" == typeof define && define.amd ? define([], b) : "object" == typeof module && module.exports ? module.exports = b() : a.Papa = b()
}(this, function () {
    "use strict";
    function a(a, b) {
        if (b = b || {}, b.worker && y.WORKERS_SUPPORTED) {
            var c = j();
            return c.userStep = b.step, c.userChunk = b.chunk, c.userComplete = b.complete, c.userError = b.error, b.step = q(b.step), b.chunk = q(b.chunk), b.complete = q(b.complete), b.error = q(b.error), delete b.worker, void c.postMessage({
                input: a,
                config: b,
                workerId: c.id
            })
        }
        var g = null;
        return "string" == typeof a ? g = b.download ? new d(b) : new f(b) : (s.File && a instanceof File || a instanceof Object) && (g = new e(b)), g.stream(a)
    }

    function b(a, b) {
        function c() {
            "object" == typeof b && ("string" == typeof b.delimiter && 1 === b.delimiter.length && -1 === y.BAD_DELIMITERS.indexOf(b.delimiter) && (i = b.delimiter), ("boolean" == typeof b.quotes || b.quotes instanceof Array) && (h = b.quotes), "string" == typeof b.newline && (j = b.newline))
        }

        function d(a) {
            if ("object" != typeof a)return [];
            var b = [];
            for (var c in a)b.push(c);
            return b
        }

        function e(a, b) {
            var c = "";
            "string" == typeof a && (a = JSON.parse(a)), "string" == typeof b && (b = JSON.parse(b));
            var d = a instanceof Array && a.length > 0, e = !(b[0] instanceof Array);
            if (d) {
                for (var g = 0; g < a.length; g++)g > 0 && (c += i), c += f(a[g], g);
                b.length > 0 && (c += j)
            }
            for (var h = 0; h < b.length; h++) {
                for (var k = d ? a.length : b[h].length, l = 0; k > l; l++) {
                    l > 0 && (c += i);
                    var m = d && e ? a[l] : l;
                    c += f(b[h][m], l)
                }
                h < b.length - 1 && (c += j)
            }
            return c
        }

        function f(a, b) {
            if ("undefined" == typeof a || null === a)return "";
            a = a.toString().replace(/"/g, '""');
            var c = "boolean" == typeof h && h || h instanceof Array && h[b] || g(a, y.BAD_DELIMITERS) || a.indexOf(i) > -1 || " " === a.charAt(0) || " " === a.charAt(a.length - 1);
            return c ? '"' + a + '"' : a
        }

        function g(a, b) {
            for (var c = 0; c < b.length; c++)if (a.indexOf(b[c]) > -1)return !0;
            return !1
        }

        var h = !1, i = ",", j = "\r\n";
        if (c(), "string" == typeof a && (a = JSON.parse(a)), a instanceof Array) {
            if (!a.length || a[0] instanceof Array)return e(null, a);
            if ("object" == typeof a[0])return e(d(a[0]), a)
        } else if ("object" == typeof a)return "string" == typeof a.data && (a.data = JSON.parse(a.data)), a.data instanceof Array && (a.fields || (a.fields = a.meta && a.meta.fields), a.fields || (a.fields = a.data[0] instanceof Array ? a.fields : d(a.data[0])), a.data[0] instanceof Array || "object" == typeof a.data[0] || (a.data = [a.data])), e(a.fields || [], a.data || []);
        throw"exception: Unable to serialize unrecognized input"
    }

    function c(a) {
        function b(a) {
            var b = o(a);
            b.chunkSize = parseInt(b.chunkSize), a.step || a.chunk || (b.chunkSize = null), this._handle = new g(b), this._handle.streamer = this, this._config = b
        }

        this._handle = null, this._paused = !1, this._finished = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = {
            data: [],
            errors: [],
            meta: {}
        }, b.call(this, a), this.parseChunk = function (a) {
            if (this.isFirstChunk && q(this._config.beforeFirstChunk)) {
                var b = this._config.beforeFirstChunk(a);
                void 0 !== b && (a = b)
            }
            this.isFirstChunk = !1;
            var c = this._partialLine + a;
            this._partialLine = "";
            var d = this._handle.parse(c, this._baseIndex, !this._finished);
            if (!this._handle.paused() && !this._handle.aborted()) {
                var e = d.meta.cursor;
                this._finished || (this._partialLine = c.substring(e - this._baseIndex), this._baseIndex = e), d && d.data && (this._rowCount += d.data.length);
                var f = this._finished || this._config.preview && this._rowCount >= this._config.preview;
                if (u)s.postMessage({results: d, workerId: y.WORKER_ID, finished: f}); else if (q(this._config.chunk)) {
                    if (this._config.chunk(d, this._handle), this._paused)return;
                    d = void 0, this._completeResults = void 0
                }
                return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(d.data), this._completeResults.errors = this._completeResults.errors.concat(d.errors), this._completeResults.meta = d.meta), !f || !q(this._config.complete) || d && d.meta.aborted || this._config.complete(this._completeResults, this._input), f || d && d.meta.paused || this._nextChunk(), d
            }
        }, this._sendError = function (a) {
            q(this._config.error) ? this._config.error(a) : u && this._config.error && s.postMessage({
                workerId: y.WORKER_ID,
                error: a,
                finished: !1
            })
        }
    }

    function d(a) {
        function b(a) {
            var b = a.getResponseHeader("Content-Range");
            return parseInt(b.substr(b.lastIndexOf("/") + 1))
        }

        a = a || {}, a.chunkSize || (a.chunkSize = y.RemoteChunkSize), c.call(this, a);
        var d;
        t ? this._nextChunk = function () {
            this._readChunk(), this._chunkLoaded()
        } : this._nextChunk = function () {
            this._readChunk()
        }, this.stream = function (a) {
            this._input = a, this._nextChunk()
        }, this._readChunk = function () {
            if (this._finished)return void this._chunkLoaded();
            if (d = new XMLHttpRequest, this._config.withCredentials && (d.withCredentials = this._config.withCredentials), t || (d.onload = p(this._chunkLoaded, this), d.onerror = p(this._chunkError, this)), d.open("GET", this._input, !t), this._config.chunkSize) {
                var a = this._start + this._config.chunkSize - 1;
                d.setRequestHeader("Range", "bytes=" + this._start + "-" + a), d.setRequestHeader("If-None-Match", "webkit-no-cache")
            }
            try {
                d.send()
            } catch (b) {
                this._chunkError(b.message)
            }
            t && 0 === d.status ? this._chunkError() : this._start += this._config.chunkSize
        }, this._chunkLoaded = function () {
            if (4 == d.readyState) {
                if (d.status < 200 || d.status >= 400)return void this._chunkError();
                this._finished = !this._config.chunkSize || this._start > b(d), this.parseChunk(d.responseText)
            }
        }, this._chunkError = function (a) {
            var b = d.statusText || a;
            this._sendError(b)
        }
    }

    function e(a) {
        a = a || {}, a.chunkSize || (a.chunkSize = y.LocalChunkSize), c.call(this, a);
        var b, d, e = "undefined" != typeof FileReader;
        this.stream = function (a) {
            this._input = a, d = a.slice || a.webkitSlice || a.mozSlice, e ? (b = new FileReader, b.onload = p(this._chunkLoaded, this), b.onerror = p(this._chunkError, this)) : b = new FileReaderSync, this._nextChunk()
        }, this._nextChunk = function () {
            this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk()
        }, this._readChunk = function () {
            var a = this._input;
            if (this._config.chunkSize) {
                var c = Math.min(this._start + this._config.chunkSize, this._input.size);
                a = d.call(a, this._start, c)
            }
            var f = b.readAsText(a, this._config.encoding);
            e || this._chunkLoaded({target: {result: f}})
        }, this._chunkLoaded = function (a) {
            this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(a.target.result)
        }, this._chunkError = function () {
            this._sendError(b.error)
        }
    }

    function f(a) {
        a = a || {}, c.call(this, a);
        var b, d;
        this.stream = function (a) {
            return b = a, d = a, this._nextChunk()
        }, this._nextChunk = function () {
            if (!this._finished) {
                var a = this._config.chunkSize, b = a ? d.substr(0, a) : d;
                return d = a ? d.substr(a) : "", this._finished = !d, this.parseChunk(b)
            }
        }
    }

    function g(a) {
        function b() {
            if (v && m && (j("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + y.DefaultDelimiter + "'"), m = !1), a.skipEmptyLines)for (var b = 0; b < v.data.length; b++)1 === v.data[b].length && "" === v.data[b][0] && v.data.splice(b--, 1);
            return c() && d(), e()
        }

        function c() {
            return a.header && 0 === u.length
        }

        function d() {
            if (v) {
                for (var a = 0; c() && a < v.data.length; a++)for (var b = 0; b < v.data[a].length; b++)u.push(v.data[a][b]);
                v.data.splice(0, 1)
            }
        }

        function e() {
            if (!v || !a.header && !a.dynamicTyping)return v;
            for (var b = 0; b < v.data.length; b++) {
                for (var c = {}, d = 0; d < v.data[b].length; d++) {
                    if (a.dynamicTyping) {
                        var e = v.data[b][d];
                        "true" === e || "TRUE" === e ? v.data[b][d] = !0 : "false" === e || "FALSE" === e ? v.data[b][d] = !1 : v.data[b][d] = i(e)
                    }
                    a.header && (d >= u.length ? (c.__parsed_extra || (c.__parsed_extra = []), c.__parsed_extra.push(v.data[b][d])) : c[u[d]] = v.data[b][d])
                }
                a.header && (v.data[b] = c, d > u.length ? j("FieldMismatch", "TooManyFields", "Too many fields: expected " + u.length + " fields but parsed " + d, b) : d < u.length && j("FieldMismatch", "TooFewFields", "Too few fields: expected " + u.length + " fields but parsed " + d, b))
            }
            return a.header && v.meta && (v.meta.fields = u), v
        }

        function f(b, c) {
            for (var d, e, f, g = [",", "	", "|", ";", y.RECORD_SEP, y.UNIT_SEP], i = 0; i < g.length; i++) {
                var j = g[i], k = 0, l = 0;
                f = void 0;
                for (var m = new h({delimiter: j, newline: c, preview: 10}).parse(b), n = 0; n < m.data.length; n++) {
                    var o = m.data[n].length;
                    l += o, "undefined" != typeof f ? o > 1 && (k += Math.abs(o - f), f = o) : f = o
                }
                m.data.length > 0 && (l /= m.data.length), ("undefined" == typeof e || e > k) && l > 1.99 && (e = k, d = j)
            }
            return a.delimiter = d, {successful: !!d, bestDelimiter: d}
        }

        function g(a) {
            a = a.substr(0, 1048576);
            var b = a.split("\r"), c = a.split("\n"), d = c.length > 1 && c[0].length < b[0].length;
            if (1 === b.length || d)return "\n";
            for (var e = 0, f = 0; f < b.length; f++)"\n" === b[f][0] && e++;
            return e >= b.length / 2 ? "\r\n" : "\r"
        }

        function i(a) {
            var b = n.test(a);
            return b ? parseFloat(a) : a
        }

        function j(a, b, c, d) {
            v.errors.push({type: a, code: b, message: c, row: d})
        }

        var k, l, m, n = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i, p = this, r = 0, s = !1, t = !1, u = [], v = {
            data: [],
            errors: [],
            meta: {}
        };
        if (q(a.step)) {
            var w = a.step;
            a.step = function (d) {
                if (v = d, c())b(); else {
                    if (b(), 0 === v.data.length)return;
                    r += d.data.length, a.preview && r > a.preview ? l.abort() : w(v, p)
                }
            }
        }
        this.parse = function (c, d, e) {
            if (a.newline || (a.newline = g(c)), m = !1, !a.delimiter) {
                var i = f(c, a.newline);
                i.successful ? a.delimiter = i.bestDelimiter : (m = !0, a.delimiter = y.DefaultDelimiter), v.meta.delimiter = a.delimiter
            }
            var j = o(a);
            return a.preview && a.header && j.preview++, k = c, l = new h(j), v = l.parse(k, d, e), b(), s ? {meta: {paused: !0}} : v || {meta: {paused: !1}}
        }, this.paused = function () {
            return s
        }, this.pause = function () {
            s = !0, l.abort(), k = k.substr(l.getCharIndex())
        }, this.resume = function () {
            s = !1, p.streamer.parseChunk(k)
        }, this.aborted = function () {
            return t
        }, this.abort = function () {
            t = !0, l.abort(), v.meta.aborted = !0, q(a.complete) && a.complete(v), k = ""
        }
    }

    function h(a) {
        a = a || {};
        var b = a.delimiter, c = a.newline, d = a.comments, e = a.step, f = a.preview, g = a.fastMode;
        if (("string" != typeof b || y.BAD_DELIMITERS.indexOf(b) > -1) && (b = ","), d === b)throw"Comment character same as delimiter";
        d === !0 ? d = "#" : ("string" != typeof d || y.BAD_DELIMITERS.indexOf(d) > -1) && (d = !1), "\n" != c && "\r" != c && "\r\n" != c && (c = "\n");
        var h = 0, i = !1;
        this.parse = function (a, j, k) {
            function l(a) {
                v.push(a), y = h
            }

            function m(b) {
                return k ? o() : ("undefined" == typeof b && (b = a.substr(h)), x.push(b), h = q, l(x), u && p(), o())
            }

            function n(b) {
                h = b, l(x), x = [], C = a.indexOf(c, h)
            }

            function o(a) {
                return {
                    data: v,
                    errors: w,
                    meta: {delimiter: b, linebreak: c, aborted: i, truncated: !!a, cursor: y + (j || 0)}
                }
            }

            function p() {
                e(o()), v = [], w = []
            }

            if ("string" != typeof a)throw"Input must be a string";
            var q = a.length, r = b.length, s = c.length, t = d.length, u = "function" == typeof e;
            h = 0;
            var v = [], w = [], x = [], y = 0;
            if (!a)return o();
            if (g || g !== !1 && -1 === a.indexOf('"')) {
                for (var z = a.split(c), A = 0; A < z.length; A++) {
                    var x = z[A];
                    if (h += x.length, A !== z.length - 1)h += c.length; else if (k)return o();
                    if (!d || x.substr(0, t) !== d) {
                        if (u) {
                            if (v = [], l(x.split(b)), p(), i)return o()
                        } else l(x.split(b));
                        if (f && A >= f)return v = v.slice(0, f), o(!0)
                    }
                }
                return o()
            }
            for (var B = a.indexOf(b, h), C = a.indexOf(c, h); ;)if ('"' !== a[h])if (d && 0 === x.length && a.substr(h, t) === d) {
                if (-1 === C)return o();
                h = C + s, C = a.indexOf(c, h), B = a.indexOf(b, h)
            } else if (-1 !== B && (C > B || -1 === C))x.push(a.substring(h, B)), h = B + r, B = a.indexOf(b, h); else {
                if (-1 === C)break;
                if (x.push(a.substring(h, C)), n(C + s), u && (p(), i))return o();
                if (f && v.length >= f)return o(!0)
            } else {
                var D = h;
                for (h++; ;) {
                    var D = a.indexOf('"', D + 1);
                    if (-1 === D)return k || w.push({
                        type: "Quotes",
                        code: "MissingQuotes",
                        message: "Quoted field unterminated",
                        row: v.length,
                        index: h
                    }), m();
                    if (D === q - 1) {
                        var E = a.substring(h, D).replace(/""/g, '"');
                        return m(E)
                    }
                    if ('"' !== a[D + 1]) {
                        if (a[D + 1] === b) {
                            x.push(a.substring(h, D).replace(/""/g, '"')), h = D + 1 + r, B = a.indexOf(b, h), C = a.indexOf(c, h);
                            break
                        }
                        if (a.substr(D + 1, s) === c) {
                            if (x.push(a.substring(h, D).replace(/""/g, '"')), n(D + 1 + s), B = a.indexOf(b, h), u && (p(), i))return o();
                            if (f && v.length >= f)return o(!0);
                            break
                        }
                    } else D++
                }
            }
            return m()
        }, this.abort = function () {
            i = !0
        }, this.getCharIndex = function () {
            return h
        }
    }

    function i() {
        var a = document.getElementsByTagName("script");
        return a.length ? a[a.length - 1].src : ""
    }

    function j() {
        if (!y.WORKERS_SUPPORTED)return !1;
        if (!v && null === y.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");
        var a = y.SCRIPT_PATH || r;
        a += (-1 !== a.indexOf("?") ? "&" : "?") + "papaworker";
        var b = new s.Worker(a);
        return b.onmessage = k, b.id = x++, w[b.id] = b, b
    }

    function k(a) {
        var b = a.data, c = w[b.workerId], d = !1;
        if (b.error)c.userError(b.error, b.file); else if (b.results && b.results.data) {
            var e = function () {
                d = !0, l(b.workerId, {data: [], errors: [], meta: {aborted: !0}})
            }, f = {abort: e, pause: m, resume: m};
            if (q(c.userStep)) {
                for (var g = 0; g < b.results.data.length && (c.userStep({
                    data: [b.results.data[g]],
                    errors: b.results.errors,
                    meta: b.results.meta
                }, f), !d); g++);
                delete b.results
            } else q(c.userChunk) && (c.userChunk(b.results, f, b.file), delete b.results)
        }
        b.finished && !d && l(b.workerId, b.results)
    }

    function l(a, b) {
        var c = w[a];
        q(c.userComplete) && c.userComplete(b), c.terminate(), delete w[a]
    }

    function m() {
        throw"Not implemented."
    }

    function n(a) {
        var b = a.data;
        if ("undefined" == typeof y.WORKER_ID && b && (y.WORKER_ID = b.workerId), "string" == typeof b.input)s.postMessage({
            workerId: y.WORKER_ID,
            results: y.parse(b.input, b.config),
            finished: !0
        }); else if (s.File && b.input instanceof File || b.input instanceof Object) {
            var c = y.parse(b.input, b.config);
            c && s.postMessage({workerId: y.WORKER_ID, results: c, finished: !0})
        }
    }

    function o(a) {
        if ("object" != typeof a)return a;
        var b = a instanceof Array ? [] : {};
        for (var c in a)b[c] = o(a[c]);
        return b
    }

    function p(a, b) {
        return function () {
            a.apply(b, arguments)
        }
    }

    function q(a) {
        return "function" == typeof a
    }

    var r, s = Function("return this")(), t = !s.document && !!s.postMessage, u = t && /(\?|&)papaworker(=|&|$)/.test(s.location.search), v = !1, w = {}, x = 0, y = {};
    if (y.parse = a, y.unparse = b, y.RECORD_SEP = String.fromCharCode(30), y.UNIT_SEP = String.fromCharCode(31), y.BYTE_ORDER_MARK = "\ufeff", y.BAD_DELIMITERS = ["\r", "\n", '"', y.BYTE_ORDER_MARK], y.WORKERS_SUPPORTED = !t && !!s.Worker, y.SCRIPT_PATH = null, y.LocalChunkSize = 10485760, y.RemoteChunkSize = 5242880, y.DefaultDelimiter = ",", y.Parser = h, y.ParserHandle = g, y.NetworkStreamer = d, y.FileStreamer = e, y.StringStreamer = f, s.jQuery) {
        var z = s.jQuery;
        z.fn.parse = function (a) {
            function b() {
                if (0 === f.length)return void(q(a.complete) && a.complete());
                var b = f[0];
                if (q(a.before)) {
                    var e = a.before(b.file, b.inputElem);
                    if ("object" == typeof e) {
                        if ("abort" === e.action)return void c("AbortError", b.file, b.inputElem, e.reason);
                        if ("skip" === e.action)return void d();
                        "object" == typeof e.config && (b.instanceConfig = z.extend(b.instanceConfig, e.config))
                    } else if ("skip" === e)return void d()
                }
                var g = b.instanceConfig.complete;
                b.instanceConfig.complete = function (a) {
                    q(g) && g(a, b.file, b.inputElem), d()
                }, y.parse(b.file, b.instanceConfig)
            }

            function c(b, c, d, e) {
                q(a.error) && a.error({name: b}, c, d, e)
            }

            function d() {
                f.splice(0, 1), b()
            }

            var e = a.config || {}, f = [];
            return this.each(function (a) {
                var b = "INPUT" === z(this).prop("tagName").toUpperCase() && "file" === z(this).attr("type").toLowerCase() && s.FileReader;
                if (!b || !this.files || 0 === this.files.length)return !0;
                for (var c = 0; c < this.files.length; c++)f.push({
                    file: this.files[c],
                    inputElem: this,
                    instanceConfig: z.extend({}, e)
                })
            }), b(), this
        }
    }
    return u ? s.onmessage = n : y.WORKERS_SUPPORTED && (r = i(), document.body ? document.addEventListener("DOMContentLoaded", function () {
        v = !0
    }, !0) : v = !0), d.prototype = Object.create(c.prototype), d.prototype.constructor = d, e.prototype = Object.create(c.prototype), e.prototype.constructor = e, f.prototype = Object.create(f.prototype), f.prototype.constructor = f, y
});