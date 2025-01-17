/*
 Highcharts JS v9.1.0 (2021-05-03)

 Accessibility module

 (c) 2010-2021 Highsoft AS
 Author: Oystein Moseng

 License: www.highcharts.com/license
*/
(function (b) {
  "object" === typeof module && module.exports
    ? ((b["default"] = b), (module.exports = b))
    : "function" === typeof define && define.amd
    ? define("highcharts/modules/accessibility", ["highcharts"], function (v) {
        b(v);
        b.Highcharts = v;
        return b;
      })
    : b("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function (b) {
  function v(b, g, n, l) {
    b.hasOwnProperty(g) || (b[g] = l.apply(null, n));
  }
  b = b ? b._modules : {};
  v(
    b,
    "Accessibility/Utils/HTMLUtilities.js",
    [b["Core/Globals.js"], b["Core/Utilities.js"]],
    function (b, g) {
      var w = b.doc,
        l = b.win,
        t = g.merge;
      return {
        addClass: function (b, f) {
          b.classList
            ? b.classList.add(f)
            : 0 > b.className.indexOf(f) && (b.className += f);
        },
        escapeStringForHTML: function (b) {
          return b
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;");
        },
        getElement: function (b) {
          return w.getElementById(b);
        },
        getFakeMouseEvent: function (b) {
          if ("function" === typeof l.MouseEvent) return new l.MouseEvent(b);
          if (w.createEvent) {
            var f = w.createEvent("MouseEvent");
            if (f.initMouseEvent)
              return (
                f.initMouseEvent(
                  b,
                  !0,
                  !0,
                  l,
                  "click" === b ? 1 : 0,
                  0,
                  0,
                  0,
                  0,
                  !1,
                  !1,
                  !1,
                  !1,
                  0,
                  null
                ),
                f
              );
          }
          return { type: b };
        },
        getHeadingTagNameForElement: function (b) {
          var f = function (b) {
              b = parseInt(b.slice(1), 10);
              return "h" + Math.min(6, b + 1);
            },
            q = function (b) {
              var k;
              a: {
                for (k = b; (k = k.previousSibling); ) {
                  var e = k.tagName || "";
                  if (/H[1-6]/.test(e)) {
                    k = e;
                    break a;
                  }
                }
                k = "";
              }
              if (k) return f(k);
              b = b.parentElement;
              if (!b) return "p";
              k = b.tagName;
              return /H[1-6]/.test(k) ? f(k) : q(b);
            };
          return q(b);
        },
        removeElement: function (b) {
          b && b.parentNode && b.parentNode.removeChild(b);
        },
        reverseChildNodes: function (b) {
          for (var f = b.childNodes.length; f--; )
            b.appendChild(b.childNodes[f]);
        },
        setElAttrs: function (b, f) {
          Object.keys(f).forEach(function (q) {
            var k = f[q];
            null === k ? b.removeAttribute(q) : b.setAttribute(q, k);
          });
        },
        stripHTMLTagsFromString: function (b) {
          return "string" === typeof b ? b.replace(/<\/?[^>]+(>|$)/g, "") : b;
        },
        visuallyHideElement: function (b) {
          t(!0, b.style, {
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            clip: "rect(1px, 1px, 1px, 1px)",
            marginTop: "-3px",
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)",
            filter: "alpha(opacity=1)",
            opacity: "0.01",
          });
        },
      };
    }
  );
  v(
    b,
    "Accessibility/Utils/ChartUtilities.js",
    [b["Accessibility/Utils/HTMLUtilities.js"], b["Core/Utilities.js"]],
    function (b, g) {
      function w(a) {
        var c = a.chart,
          d = {},
          h = "Seconds";
        d.Seconds = ((a.max || 0) - (a.min || 0)) / 1e3;
        d.Minutes = d.Seconds / 60;
        d.Hours = d.Minutes / 60;
        d.Days = d.Hours / 24;
        ["Minutes", "Hours", "Days"].forEach(function (a) {
          2 < d[a] && (h = a);
        });
        var e = d[h].toFixed("Seconds" !== h && "Minutes" !== h ? 1 : 0);
        return c.langFormat("accessibility.axis.timeRange" + h, {
          chart: c,
          axis: a,
          range: e.replace(".0", ""),
        });
      }
      function l(a) {
        var c = a.chart,
          d =
            (c.options &&
              c.options.accessibility &&
              c.options.accessibility.screenReaderSection
                .axisRangeDateFormat) ||
            "",
          h = function (h) {
            return a.dateTime ? c.time.dateFormat(d, a[h]) : a[h];
          };
        return c.langFormat("accessibility.axis.rangeFromTo", {
          chart: c,
          axis: a,
          rangeFrom: h("min"),
          rangeTo: h("max"),
        });
      }
      function t(a) {
        if (a.points && a.points.length)
          return (
            (a = p(a.points, function (a) {
              return !!a.graphic;
            })) &&
            a.graphic &&
            a.graphic.element
          );
      }
      function r(a) {
        var c = t(a);
        return (
          (c && c.parentNode) ||
          (a.graph && a.graph.element) ||
          (a.group && a.group.element)
        );
      }
      function f(a, c) {
        c.setAttribute("aria-hidden", !1);
        c !== a.renderTo &&
          c.parentNode &&
          (Array.prototype.forEach.call(c.parentNode.childNodes, function (a) {
            a.hasAttribute("aria-hidden") || a.setAttribute("aria-hidden", !0);
          }),
          f(a, c.parentNode));
      }
      var q = b.stripHTMLTagsFromString,
        k = g.defined,
        p = g.find,
        e = g.fireEvent;
      return {
        getChartTitle: function (a) {
          return q(
            a.options.title.text ||
              a.langFormat("accessibility.defaultChartTitle", { chart: a })
          );
        },
        getAxisDescription: function (a) {
          return (
            a &&
            ((a.userOptions &&
              a.userOptions.accessibility &&
              a.userOptions.accessibility.description) ||
              (a.axisTitle && a.axisTitle.textStr) ||
              a.options.id ||
              (a.categories && "categories") ||
              (a.dateTime && "Time") ||
              "values")
          );
        },
        getAxisRangeDescription: function (a) {
          var c = a.options || {};
          return c.accessibility &&
            "undefined" !== typeof c.accessibility.rangeDescription
            ? c.accessibility.rangeDescription
            : a.categories
            ? ((c = a.chart),
              (a =
                a.dataMax && a.dataMin
                  ? c.langFormat("accessibility.axis.rangeCategories", {
                      chart: c,
                      axis: a,
                      numCategories: a.dataMax - a.dataMin + 1,
                    })
                  : ""),
              a)
            : !a.dateTime || (0 !== a.min && 0 !== a.dataMin)
            ? l(a)
            : w(a);
        },
        getPointFromXY: function (a, c, d) {
          for (var h = a.length, e; h--; )
            if (
              (e = p(a[h].points || [], function (a) {
                return a.x === c && a.y === d;
              }))
            )
              return e;
        },
        getSeriesFirstPointElement: t,
        getSeriesFromName: function (a, c) {
          return c
            ? (a.series || []).filter(function (a) {
                return a.name === c;
              })
            : a.series;
        },
        getSeriesA11yElement: r,
        unhideChartElementFromAT: f,
        hideSeriesFromAT: function (a) {
          (a = r(a)) && a.setAttribute("aria-hidden", !0);
        },
        scrollToPoint: function (a) {
          var c = a.series.xAxis,
            d = a.series.yAxis,
            h = c && c.scrollbar ? c : d;
          if ((c = h && h.scrollbar) && k(c.to) && k(c.from)) {
            d = c.to - c.from;
            if (k(h.dataMin) && k(h.dataMax)) {
              var b = h.toPixels(h.dataMin),
                f = h.toPixels(h.dataMax);
              a =
                (h.toPixels(a["xAxis" === h.coll ? "x" : "y"] || 0) - b) /
                (f - b);
            } else a = 0;
            c.updatePosition(a - d / 2, a + d / 2);
            e(c, "changed", {
              from: c.from,
              to: c.to,
              trigger: "scrollbar",
              DOMEvent: null,
            });
          }
        },
      };
    }
  );
  v(
    b,
    "Accessibility/KeyboardNavigationHandler.js",
    [b["Core/Utilities.js"]],
    function (b) {
      function g(b, g) {
        this.chart = b;
        this.keyCodeMap = g.keyCodeMap || [];
        this.validate = g.validate;
        this.init = g.init;
        this.terminate = g.terminate;
        this.response = { success: 1, prev: 2, next: 3, noHandler: 4, fail: 5 };
      }
      var w = b.find;
      g.prototype = {
        run: function (b) {
          var g = b.which || b.keyCode,
            r = this.response.noHandler,
            f = w(this.keyCodeMap, function (b) {
              return -1 < b[0].indexOf(g);
            });
          f
            ? (r = f[1].call(this, g, b))
            : 9 === g && (r = this.response[b.shiftKey ? "prev" : "next"]);
          return r;
        },
      };
      return g;
    }
  );
  v(
    b,
    "Accessibility/Utils/DOMElementProvider.js",
    [
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n) {
      var w = b.doc,
        t = g.removeElement;
      b = n.extend;
      g = function () {
        this.elements = [];
      };
      b(g.prototype, {
        createElement: function () {
          var b = w.createElement.apply(w, arguments);
          this.elements.push(b);
          return b;
        },
        destroyCreatedElements: function () {
          this.elements.forEach(function (b) {
            t(b);
          });
          this.elements = [];
        },
      });
      return g;
    }
  );
  v(
    b,
    "Accessibility/Utils/EventProvider.js",
    [b["Core/Globals.js"], b["Core/Utilities.js"]],
    function (b, g) {
      var w = g.addEvent;
      g = g.extend;
      var l = function () {
        this.eventRemovers = [];
      };
      g(l.prototype, {
        addEvent: function () {
          var g = w.apply(b, arguments);
          this.eventRemovers.push(g);
          return g;
        },
        removeAddedEvents: function () {
          this.eventRemovers.forEach(function (b) {
            b();
          });
          this.eventRemovers = [];
        },
      });
      return l;
    }
  );
  v(
    b,
    "Accessibility/AccessibilityComponent.js",
    [
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/DOMElementProvider.js"],
      b["Accessibility/Utils/EventProvider.js"],
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n, l, t, r) {
      function f() {}
      var q = b.unhideChartElementFromAT,
        k = l.doc,
        p = l.win,
        e = t.removeElement,
        a = t.getFakeMouseEvent;
      b = r.extend;
      var c = r.fireEvent,
        d = r.merge;
      f.prototype = {
        initBase: function (a) {
          this.chart = a;
          this.eventProvider = new n();
          this.domElementProvider = new g();
          this.keyCodes = {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            enter: 13,
            space: 32,
            esc: 27,
            tab: 9,
          };
        },
        addEvent: function () {
          return this.eventProvider.addEvent.apply(
            this.eventProvider,
            arguments
          );
        },
        createElement: function () {
          return this.domElementProvider.createElement.apply(
            this.domElementProvider,
            arguments
          );
        },
        fireEventOnWrappedOrUnwrappedElement: function (a, d) {
          var h = d.type;
          k.createEvent && (a.dispatchEvent || a.fireEvent)
            ? a.dispatchEvent
              ? a.dispatchEvent(d)
              : a.fireEvent(h, d)
            : c(a, h, d);
        },
        fakeClickEvent: function (h) {
          if (h) {
            var d = a("click");
            this.fireEventOnWrappedOrUnwrappedElement(h, d);
          }
        },
        addProxyGroup: function (a) {
          this.createOrUpdateProxyContainer();
          var d = this.createElement("div");
          Object.keys(a || {}).forEach(function (h) {
            null !== a[h] && d.setAttribute(h, a[h]);
          });
          this.chart.a11yProxyContainer.appendChild(d);
          return d;
        },
        createOrUpdateProxyContainer: function () {
          var a = this.chart,
            d = a.renderer.box;
          a.a11yProxyContainer =
            a.a11yProxyContainer || this.createProxyContainerElement();
          d.nextSibling !== a.a11yProxyContainer &&
            a.container.insertBefore(a.a11yProxyContainer, d.nextSibling);
        },
        createProxyContainerElement: function () {
          var a = k.createElement("div");
          a.className = "highcharts-a11y-proxy-container";
          return a;
        },
        createProxyButton: function (a, c, e, b, f) {
          var h = a.element,
            z = this.createElement("button"),
            k = d({ "aria-label": h.getAttribute("aria-label") }, e);
          Object.keys(k).forEach(function (a) {
            null !== k[a] && z.setAttribute(a, k[a]);
          });
          z.className = "highcharts-a11y-proxy-button";
          f && this.addEvent(z, "click", f);
          this.setProxyButtonStyle(z);
          this.updateProxyButtonPosition(z, b || a);
          this.proxyMouseEventsForButton(h, z);
          c.appendChild(z);
          k["aria-hidden"] || q(this.chart, z);
          return z;
        },
        getElementPosition: function (a) {
          var d = a.element;
          return (a = this.chart.renderTo) && d && d.getBoundingClientRect
            ? ((d = d.getBoundingClientRect()),
              (a = a.getBoundingClientRect()),
              {
                x: d.left - a.left,
                y: d.top - a.top,
                width: d.right - d.left,
                height: d.bottom - d.top,
              })
            : { x: 0, y: 0, width: 1, height: 1 };
        },
        setProxyButtonStyle: function (a) {
          d(!0, a.style, {
            borderWidth: "0",
            backgroundColor: "transparent",
            cursor: "pointer",
            outline: "none",
            opacity: "0.001",
            filter: "alpha(opacity=1)",
            zIndex: "999",
            overflow: "hidden",
            padding: "0",
            margin: "0",
            display: "block",
            position: "absolute",
          });
          a.style["-ms-filter"] =
            "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)";
        },
        updateProxyButtonPosition: function (a, c) {
          c = this.getElementPosition(c);
          d(!0, a.style, {
            width: (c.width || 1) + "px",
            height: (c.height || 1) + "px",
            left: (c.x || 0) + "px",
            top: (c.y || 0) + "px",
          });
        },
        proxyMouseEventsForButton: function (a, d) {
          var c = this;
          "click touchstart touchend touchcancel touchmove mouseover mouseenter mouseleave mouseout"
            .split(" ")
            .forEach(function (h) {
              var e = 0 === h.indexOf("touch");
              c.addEvent(
                d,
                h,
                function (d) {
                  var b = e ? c.cloneTouchEvent(d) : c.cloneMouseEvent(d);
                  a && c.fireEventOnWrappedOrUnwrappedElement(a, b);
                  d.stopPropagation();
                  "touchstart" !== h &&
                    "touchmove" !== h &&
                    "touchend" !== h &&
                    d.preventDefault();
                },
                { passive: !1 }
              );
            });
        },
        cloneMouseEvent: function (d) {
          if ("function" === typeof p.MouseEvent)
            return new p.MouseEvent(d.type, d);
          if (k.createEvent) {
            var c = k.createEvent("MouseEvent");
            if (c.initMouseEvent)
              return (
                c.initMouseEvent(
                  d.type,
                  d.bubbles,
                  d.cancelable,
                  d.view || p,
                  d.detail,
                  d.screenX,
                  d.screenY,
                  d.clientX,
                  d.clientY,
                  d.ctrlKey,
                  d.altKey,
                  d.shiftKey,
                  d.metaKey,
                  d.button,
                  d.relatedTarget
                ),
                c
              );
          }
          return a(d.type);
        },
        cloneTouchEvent: function (a) {
          var d = function (a) {
            for (var d = [], c = 0; c < a.length; ++c) {
              var e = a.item(c);
              e && d.push(e);
            }
            return d;
          };
          if ("function" === typeof p.TouchEvent)
            return (
              (d = new p.TouchEvent(a.type, {
                touches: d(a.touches),
                targetTouches: d(a.targetTouches),
                changedTouches: d(a.changedTouches),
                ctrlKey: a.ctrlKey,
                shiftKey: a.shiftKey,
                altKey: a.altKey,
                metaKey: a.metaKey,
                bubbles: a.bubbles,
                cancelable: a.cancelable,
                composed: a.composed,
                detail: a.detail,
                view: a.view,
              })),
              a.defaultPrevented && d.preventDefault(),
              d
            );
          d = this.cloneMouseEvent(a);
          d.touches = a.touches;
          d.changedTouches = a.changedTouches;
          d.targetTouches = a.targetTouches;
          return d;
        },
        destroyBase: function () {
          e(this.chart.a11yProxyContainer);
          this.domElementProvider.destroyCreatedElements();
          this.eventProvider.removeAddedEvents();
        },
      };
      b(f.prototype, {
        init: function () {},
        getKeyboardNavigation: function () {},
        onChartUpdate: function () {},
        onChartRender: function () {},
        destroy: function () {},
      });
      return f;
    }
  );
  v(
    b,
    "Accessibility/KeyboardNavigation.js",
    [
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Accessibility/Utils/EventProvider.js"],
    ],
    function (b, g, n, l) {
      function w(e, a) {
        this.init(e, a);
      }
      var r = b.doc,
        f = b.win,
        q = g.addEvent,
        k = g.fireEvent,
        p = n.getElement;
      q(r, "keydown", function (e) {
        27 === (e.which || e.keyCode) &&
          b.charts &&
          b.charts.forEach(function (a) {
            a && a.dismissPopupContent && a.dismissPopupContent();
          });
      });
      b.Chart.prototype.dismissPopupContent = function () {
        var e = this;
        k(this, "dismissPopupContent", {}, function () {
          e.tooltip && e.tooltip.hide(0);
          e.hideExportMenu();
        });
      };
      w.prototype = {
        init: function (e, a) {
          var c = this,
            d = (this.eventProvider = new l());
          this.chart = e;
          this.components = a;
          this.modules = [];
          this.currentModuleIx = 0;
          this.update();
          d.addEvent(this.tabindexContainer, "keydown", function (a) {
            return c.onKeydown(a);
          });
          d.addEvent(this.tabindexContainer, "focus", function (a) {
            return c.onFocus(a);
          });
          ["mouseup", "touchend"].forEach(function (a) {
            return d.addEvent(r, a, function () {
              return c.onMouseUp();
            });
          });
          ["mousedown", "touchstart"].forEach(function (a) {
            return d.addEvent(e.renderTo, a, function () {
              c.isClickingChart = !0;
            });
          });
          d.addEvent(e.renderTo, "mouseover", function () {
            c.pointerIsOverChart = !0;
          });
          d.addEvent(e.renderTo, "mouseout", function () {
            c.pointerIsOverChart = !1;
          });
          this.modules.length && this.modules[0].init(1);
        },
        update: function (e) {
          var a = this.chart.options.accessibility;
          a = a && a.keyboardNavigation;
          var c = this.components;
          this.updateContainerTabindex();
          a && a.enabled && e && e.length
            ? ((this.modules = e.reduce(function (a, e) {
                e = c[e].getKeyboardNavigation();
                return a.concat(e);
              }, [])),
              this.updateExitAnchor())
            : ((this.modules = []),
              (this.currentModuleIx = 0),
              this.removeExitAnchor());
        },
        onFocus: function (e) {
          var a = this.chart;
          e = e.relatedTarget && a.container.contains(e.relatedTarget);
          this.exiting ||
            this.isClickingChart ||
            e ||
            !this.modules[0] ||
            this.modules[0].init(1);
          this.exiting = !1;
        },
        onMouseUp: function () {
          delete this.isClickingChart;
          if (!this.keyboardReset && !this.pointerIsOverChart) {
            var e = this.chart,
              a = this.modules && this.modules[this.currentModuleIx || 0];
            a && a.terminate && a.terminate();
            e.focusElement && e.focusElement.removeFocusBorder();
            this.currentModuleIx = 0;
            this.keyboardReset = !0;
          }
        },
        onKeydown: function (e) {
          e = e || f.event;
          var a,
            c =
              this.modules &&
              this.modules.length &&
              this.modules[this.currentModuleIx];
          this.exiting = this.keyboardReset = !1;
          if (c) {
            var d = c.run(e);
            d === c.response.success
              ? (a = !0)
              : d === c.response.prev
              ? (a = this.prev())
              : d === c.response.next && (a = this.next());
            a && (e.preventDefault(), e.stopPropagation());
          }
        },
        prev: function () {
          return this.move(-1);
        },
        next: function () {
          return this.move(1);
        },
        move: function (e) {
          var a = this.modules && this.modules[this.currentModuleIx];
          a && a.terminate && a.terminate(e);
          this.chart.focusElement &&
            this.chart.focusElement.removeFocusBorder();
          this.currentModuleIx += e;
          if ((a = this.modules && this.modules[this.currentModuleIx])) {
            if (a.validate && !a.validate()) return this.move(e);
            if (a.init) return a.init(e), !0;
          }
          this.currentModuleIx = 0;
          this.exiting = !0;
          0 < e ? this.exitAnchor.focus() : this.tabindexContainer.focus();
          return !1;
        },
        updateExitAnchor: function () {
          var e = p("highcharts-end-of-chart-marker-" + this.chart.index);
          this.removeExitAnchor();
          e
            ? (this.makeElementAnExitAnchor(e), (this.exitAnchor = e))
            : this.createExitAnchor();
        },
        updateContainerTabindex: function () {
          var e = this.chart.options.accessibility;
          e = e && e.keyboardNavigation;
          e = !(e && !1 === e.enabled);
          var a = this.chart,
            c = a.container;
          a.renderTo.hasAttribute("tabindex") &&
            (c.removeAttribute("tabindex"), (c = a.renderTo));
          this.tabindexContainer = c;
          var d = c.getAttribute("tabindex");
          e && !d
            ? c.setAttribute("tabindex", "0")
            : e || a.container.removeAttribute("tabindex");
        },
        makeElementAnExitAnchor: function (e) {
          var a = this.tabindexContainer.getAttribute("tabindex") || 0;
          e.setAttribute("class", "highcharts-exit-anchor");
          e.setAttribute("tabindex", a);
          e.setAttribute("aria-hidden", !1);
          this.addExitAnchorEventsToEl(e);
        },
        createExitAnchor: function () {
          var e = this.chart,
            a = (this.exitAnchor = r.createElement("div"));
          e.renderTo.appendChild(a);
          this.makeElementAnExitAnchor(a);
        },
        removeExitAnchor: function () {
          this.exitAnchor &&
            this.exitAnchor.parentNode &&
            (this.exitAnchor.parentNode.removeChild(this.exitAnchor),
            delete this.exitAnchor);
        },
        addExitAnchorEventsToEl: function (e) {
          var a = this.chart,
            c = this;
          this.eventProvider.addEvent(e, "focus", function (d) {
            d = d || f.event;
            (d.relatedTarget && a.container.contains(d.relatedTarget)) ||
            c.exiting
              ? (c.exiting = !1)
              : (c.tabindexContainer.focus(),
                d.preventDefault(),
                c.modules &&
                  c.modules.length &&
                  ((c.currentModuleIx = c.modules.length - 1),
                  (d = c.modules[c.currentModuleIx]) &&
                  d.validate &&
                  !d.validate()
                    ? c.prev()
                    : d && d.init(-1)));
          });
        },
        destroy: function () {
          this.removeExitAnchor();
          this.eventProvider.removeAddedEvents();
          this.chart.container.removeAttribute("tabindex");
        },
      };
      return w;
    }
  );
  v(
    b,
    "Accessibility/Components/LegendComponent.js",
    [
      b["Core/Globals.js"],
      b["Core/Legend.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, g, n, l, t, r) {
      function f(a) {
        var d = a.legend && a.legend.allItems,
          c = a.options.legend.accessibility || {};
        return !(
          !d ||
          !d.length ||
          (a.colorAxis && a.colorAxis.length) ||
          !1 === c.enabled
        );
      }
      var q = n.addEvent,
        k = n.extend,
        p = n.find,
        e = n.fireEvent,
        a = r.removeElement,
        c = r.stripHTMLTagsFromString;
      b.Chart.prototype.highlightLegendItem = function (a) {
        var d = this.legend.allItems,
          c = this.highlightedLegendItemIx;
        if (d[a]) {
          d[c] && e(d[c].legendGroup.element, "mouseout");
          c = this.legend;
          var b = c.allItems[a].pageIx,
            k = c.currentPage;
          "undefined" !== typeof b && b + 1 !== k && c.scroll(1 + b - k);
          this.setFocusToElement(d[a].legendItem, d[a].a11yProxyElement);
          e(d[a].legendGroup.element, "mouseover");
          return !0;
        }
        return !1;
      };
      q(g, "afterColorizeItem", function (a) {
        var d = a.item;
        this.chart.options.accessibility.enabled &&
          d &&
          d.a11yProxyElement &&
          d.a11yProxyElement.setAttribute(
            "aria-pressed",
            a.visible ? "true" : "false"
          );
      });
      n = function () {};
      n.prototype = new l();
      k(n.prototype, {
        init: function () {
          var a = this;
          this.proxyElementsList = [];
          this.recreateProxies();
          this.addEvent(g, "afterScroll", function () {
            this.chart === a.chart &&
              (a.updateProxiesPositions(),
              a.updateLegendItemProxyVisibility(),
              this.chart.highlightLegendItem(a.highlightedLegendItemIx));
          });
          this.addEvent(g, "afterPositionItem", function (d) {
            this.chart === a.chart &&
              this.chart.renderer &&
              a.updateProxyPositionForItem(d.item);
          });
        },
        updateLegendItemProxyVisibility: function () {
          var a = this.chart.legend,
            c = a.currentPage || 1,
            e = a.clipHeight || 0;
          (a.allItems || []).forEach(function (d) {
            var b = d.pageIx || 0,
              h = d._legendItemPos ? d._legendItemPos[1] : 0,
              k = d.legendItem ? Math.round(d.legendItem.getBBox().height) : 0;
            b = h + k - a.pages[b] > e || b !== c - 1;
            d.a11yProxyElement &&
              (d.a11yProxyElement.style.visibility = b ? "hidden" : "visible");
          });
        },
        onChartRender: function () {
          f(this.chart) ? this.updateProxiesPositions() : this.removeProxies();
        },
        onChartUpdate: function () {
          this.updateLegendTitle();
        },
        updateProxiesPositions: function () {
          for (var a = 0, c = this.proxyElementsList; a < c.length; a++) {
            var e = c[a];
            this.updateProxyButtonPosition(e.element, e.posElement);
          }
        },
        updateProxyPositionForItem: function (a) {
          var d = p(this.proxyElementsList, function (d) {
            return d.item === a;
          });
          d && this.updateProxyButtonPosition(d.element, d.posElement);
        },
        recreateProxies: function () {
          this.removeProxies();
          f(this.chart) &&
            (this.addLegendProxyGroup(),
            this.proxyLegendItems(),
            this.updateLegendItemProxyVisibility());
        },
        removeProxies: function () {
          a(this.legendProxyGroup);
          this.proxyElementsList = [];
        },
        updateLegendTitle: function () {
          var a = this.chart,
            e = c(
              (
                (a.legend &&
                  a.legend.options.title &&
                  a.legend.options.title.text) ||
                ""
              ).replace(/<br ?\/?>/g, " ")
            );
          a = a.langFormat(
            "accessibility.legend.legendLabel" + (e ? "" : "NoTitle"),
            { chart: a, legendTitle: e }
          );
          this.legendProxyGroup &&
            this.legendProxyGroup.setAttribute("aria-label", a);
        },
        addLegendProxyGroup: function () {
          this.legendProxyGroup = this.addProxyGroup({
            "aria-label": "_placeholder_",
            role:
              "all" === this.chart.options.accessibility.landmarkVerbosity
                ? "region"
                : null,
          });
        },
        proxyLegendItems: function () {
          var a = this;
          ((this.chart.legend && this.chart.legend.allItems) || []).forEach(
            function (d) {
              d.legendItem && d.legendItem.element && a.proxyLegendItem(d);
            }
          );
        },
        proxyLegendItem: function (a) {
          if (a.legendItem && a.legendGroup) {
            var d = this.chart.langFormat("accessibility.legend.legendItem", {
                chart: this.chart,
                itemName: c(a.name),
                item: a,
              }),
              e = a.legendGroup.div ? a.legendItem : a.legendGroup;
            a.a11yProxyElement = this.createProxyButton(
              a.legendItem,
              this.legendProxyGroup,
              { tabindex: -1, "aria-pressed": a.visible, "aria-label": d },
              e
            );
            this.proxyElementsList.push({
              item: a,
              element: a.a11yProxyElement,
              posElement: e,
            });
          }
        },
        getKeyboardNavigation: function () {
          var a = this.keyCodes,
            c = this;
          return new t(this.chart, {
            keyCodeMap: [
              [
                [a.left, a.right, a.up, a.down],
                function (a) {
                  return c.onKbdArrowKey(this, a);
                },
              ],
              [
                [a.enter, a.space],
                function (d) {
                  return b.isFirefox && d === a.space
                    ? this.response.success
                    : c.onKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return c.shouldHaveLegendNavigation();
            },
            init: function (a) {
              return c.onKbdNavigationInit(a);
            },
          });
        },
        onKbdArrowKey: function (a, c) {
          var d = this.keyCodes,
            e = a.response,
            b = this.chart,
            h = b.options.accessibility,
            k = b.legend.allItems.length;
          c = c === d.left || c === d.up ? -1 : 1;
          return b.highlightLegendItem(this.highlightedLegendItemIx + c)
            ? ((this.highlightedLegendItemIx += c), e.success)
            : 1 < k && h.keyboardNavigation.wrapAround
            ? (a.init(c), e.success)
            : e[0 < c ? "next" : "prev"];
        },
        onKbdClick: function (a) {
          var c = this.chart.legend.allItems[this.highlightedLegendItemIx];
          c && c.a11yProxyElement && e(c.a11yProxyElement, "click");
          return a.response.success;
        },
        shouldHaveLegendNavigation: function () {
          var a = this.chart,
            c = a.colorAxis && a.colorAxis.length,
            e = (a.options.legend || {}).accessibility || {};
          return !!(
            a.legend &&
            a.legend.allItems &&
            a.legend.display &&
            !c &&
            e.enabled &&
            e.keyboardNavigation &&
            e.keyboardNavigation.enabled
          );
        },
        onKbdNavigationInit: function (a) {
          var c = this.chart,
            d = c.legend.allItems.length - 1;
          a = 0 < a ? 0 : d;
          c.highlightLegendItem(a);
          this.highlightedLegendItemIx = a;
        },
      });
      return n;
    }
  );
  v(
    b,
    "Accessibility/Components/MenuComponent.js",
    [
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, g, n, l, t, r) {
      function f(e) {
        return e.exportSVGElements && e.exportSVGElements[0];
      }
      g = g.extend;
      var q = t.unhideChartElementFromAT,
        k = r.removeElement,
        p = r.getFakeMouseEvent;
      b.Chart.prototype.showExportMenu = function () {
        var e = f(this);
        if (e && ((e = e.element), e.onclick)) e.onclick(p("click"));
      };
      b.Chart.prototype.hideExportMenu = function () {
        var e = this.exportDivElements;
        e &&
          this.exportContextMenu &&
          (e.forEach(function (a) {
            if ("highcharts-menu-item" === a.className && a.onmouseout)
              a.onmouseout(p("mouseout"));
          }),
          (this.highlightedExportItemIx = 0),
          this.exportContextMenu.hideMenu(),
          this.container.focus());
      };
      b.Chart.prototype.highlightExportItem = function (e) {
        var a = this.exportDivElements && this.exportDivElements[e],
          c =
            this.exportDivElements &&
            this.exportDivElements[this.highlightedExportItemIx];
        if (a && "LI" === a.tagName && (!a.children || !a.children.length)) {
          var d = !!(this.renderTo.getElementsByTagName("g")[0] || {}).focus;
          a.focus && d && a.focus();
          if (c && c.onmouseout) c.onmouseout(p("mouseout"));
          if (a.onmouseover) a.onmouseover(p("mouseover"));
          this.highlightedExportItemIx = e;
          return !0;
        }
        return !1;
      };
      b.Chart.prototype.highlightLastExportItem = function () {
        var e;
        if (this.exportDivElements)
          for (e = this.exportDivElements.length; e--; )
            if (this.highlightExportItem(e)) return !0;
        return !1;
      };
      b = function () {};
      b.prototype = new n();
      g(b.prototype, {
        init: function () {
          var e = this.chart,
            a = this;
          this.addEvent(e, "exportMenuShown", function () {
            a.onMenuShown();
          });
          this.addEvent(e, "exportMenuHidden", function () {
            a.onMenuHidden();
          });
        },
        onMenuHidden: function () {
          var e = this.chart.exportContextMenu;
          e && e.setAttribute("aria-hidden", "true");
          this.isExportMenuShown = !1;
          this.setExportButtonExpandedState("false");
        },
        onMenuShown: function () {
          var e = this.chart,
            a = e.exportContextMenu;
          a && (this.addAccessibleContextMenuAttribs(), q(e, a));
          this.isExportMenuShown = !0;
          this.setExportButtonExpandedState("true");
        },
        setExportButtonExpandedState: function (e) {
          var a = this.exportButtonProxy;
          a && a.setAttribute("aria-expanded", e);
        },
        onChartRender: function () {
          var e = this.chart,
            a = e.options.accessibility;
          k(this.exportProxyGroup);
          var c = e.options.exporting,
            d = f(e);
          c &&
            !1 !== c.enabled &&
            c.accessibility &&
            c.accessibility.enabled &&
            d &&
            d.element &&
            ((this.exportProxyGroup = this.addProxyGroup(
              "all" === a.landmarkVerbosity
                ? {
                    "aria-label": e.langFormat(
                      "accessibility.exporting.exportRegionLabel",
                      { chart: e }
                    ),
                    role: "region",
                  }
                : {}
            )),
            (a = f(this.chart)),
            (this.exportButtonProxy = this.createProxyButton(
              a,
              this.exportProxyGroup,
              {
                "aria-label": e.langFormat(
                  "accessibility.exporting.menuButtonLabel",
                  { chart: e }
                ),
                "aria-expanded": !1,
              }
            )));
        },
        addAccessibleContextMenuAttribs: function () {
          var e = this.chart,
            a = e.exportDivElements;
          a &&
            a.length &&
            (a.forEach(function (a) {
              "LI" !== a.tagName || (a.children && a.children.length)
                ? a.setAttribute("aria-hidden", "true")
                : a.setAttribute("tabindex", -1);
            }),
            (a = a[0].parentNode),
            a.removeAttribute("aria-hidden"),
            a.setAttribute(
              "aria-label",
              e.langFormat("accessibility.exporting.chartMenuLabel", {
                chart: e,
              })
            ));
        },
        getKeyboardNavigation: function () {
          var e = this.keyCodes,
            a = this.chart,
            c = this;
          return new l(a, {
            keyCodeMap: [
              [
                [e.left, e.up],
                function () {
                  return c.onKbdPrevious(this);
                },
              ],
              [
                [e.right, e.down],
                function () {
                  return c.onKbdNext(this);
                },
              ],
              [
                [e.enter, e.space],
                function () {
                  return c.onKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return (
                a.exportChart &&
                !1 !== a.options.exporting.enabled &&
                !1 !== a.options.exporting.accessibility.enabled
              );
            },
            init: function () {
              var d = c.exportButtonProxy,
                e = a.exportingGroup;
              e && d && a.setFocusToElement(e, d);
            },
            terminate: function () {
              a.hideExportMenu();
            },
          });
        },
        onKbdPrevious: function (e) {
          var a = this.chart,
            c = a.options.accessibility;
          e = e.response;
          for (var d = a.highlightedExportItemIx || 0; d--; )
            if (a.highlightExportItem(d)) return e.success;
          return c.keyboardNavigation.wrapAround
            ? (a.highlightLastExportItem(), e.success)
            : e.prev;
        },
        onKbdNext: function (e) {
          var a = this.chart,
            c = a.options.accessibility;
          e = e.response;
          for (
            var d = (a.highlightedExportItemIx || 0) + 1;
            d < a.exportDivElements.length;
            ++d
          )
            if (a.highlightExportItem(d)) return e.success;
          return c.keyboardNavigation.wrapAround
            ? (a.highlightExportItem(0), e.success)
            : e.next;
        },
        onKbdClick: function (e) {
          var a = this.chart,
            c = a.exportDivElements[a.highlightedExportItemIx],
            d = f(a).element;
          this.isExportMenuShown
            ? this.fakeClickEvent(c)
            : (this.fakeClickEvent(d), a.highlightExportItem(0));
          return e.response.success;
        },
      });
      return b;
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js",
    [
      b["Core/Chart/Chart.js"],
      b["Core/Series/Point.js"],
      b["Core/Series/Series.js"],
      b["Core/Series/SeriesRegistry.js"],
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/EventProvider.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
    ],
    function (b, g, n, l, t, r, f, q, k) {
      function p(a) {
        var c = a.index,
          d = a.series.points,
          e = d.length;
        if (d[c] !== a)
          for (; e--; ) {
            if (d[e] === a) return e;
          }
        else return c;
      }
      function e(a) {
        var c =
            a.chart.options.accessibility.keyboardNavigation.seriesNavigation,
          d = a.options.accessibility || {},
          e = d.keyboardNavigation;
        return (
          (e && !1 === e.enabled) ||
          !1 === d.enabled ||
          !1 === a.options.enableMouseTracking ||
          !a.visible ||
          (c.pointNavigationEnabledThreshold &&
            c.pointNavigationEnabledThreshold <= a.points.length)
        );
      }
      function a(a) {
        var c = a.series.chart.options.accessibility,
          d = a.options.accessibility && !1 === a.options.accessibility.enabled;
        return (
          (a.isNull && c.keyboardNavigation.seriesNavigation.skipNullPoints) ||
          !1 === a.visible ||
          !1 === a.isInside ||
          d ||
          e(a.series)
        );
      }
      function c(a, c, d, e) {
        var b = Infinity,
          u = c.points.length,
          h = function (a) {
            return !(D(a.plotX) && D(a.plotY));
          };
        if (!h(a)) {
          for (; u--; ) {
            var m = c.points[u];
            if (
              !h(m) &&
              ((m =
                (a.plotX - m.plotX) * (a.plotX - m.plotX) * (d || 1) +
                (a.plotY - m.plotY) * (a.plotY - m.plotY) * (e || 1)),
              m < b)
            ) {
              b = m;
              var k = u;
            }
          }
          return D(k) ? c.points[k] : void 0;
        }
      }
      function d(a) {
        var c = !1;
        delete a.highlightedPoint;
        return (c = a.series.reduce(function (a, c) {
          return a || c.highlightFirstValidPoint();
        }, !1));
      }
      function h(a, c) {
        this.keyCodes = c;
        this.chart = a;
      }
      var z = l.seriesTypes,
        H = t.doc,
        D = r.defined;
      l = r.extend;
      var w = r.fireEvent,
        v = k.getPointFromXY,
        E = k.getSeriesFromName,
        F = k.scrollToPoint;
      n.prototype.keyboardMoveVertical = !0;
      ["column", "pie"].forEach(function (a) {
        z[a] && (z[a].prototype.keyboardMoveVertical = !1);
      });
      g.prototype.highlight = function () {
        var a = this.series.chart;
        if (this.isNull) a.tooltip && a.tooltip.hide(0);
        else this.onMouseOver();
        F(this);
        this.graphic && a.setFocusToElement(this.graphic);
        a.highlightedPoint = this;
        return this;
      };
      b.prototype.highlightAdjacentPoint = function (c) {
        var d = this.series,
          b = this.highlightedPoint,
          h = (b && p(b)) || 0,
          k = b && b.series.points,
          f = this.series && this.series[this.series.length - 1];
        f = f && f.points && f.points[f.points.length - 1];
        if (!d[0] || !d[0].points) return !1;
        if (b) {
          if (
            ((d = d[b.series.index + (c ? 1 : -1)]),
            (h = k[h + (c ? 1 : -1)]),
            !h && d && (h = d.points[c ? 0 : d.points.length - 1]),
            !h)
          )
            return !1;
        } else h = c ? d[0].points[0] : f;
        return a(h)
          ? ((d = h.series),
            e(d)
              ? (this.highlightedPoint = c
                  ? d.points[d.points.length - 1]
                  : d.points[0])
              : (this.highlightedPoint = h),
            this.highlightAdjacentPoint(c))
          : h.highlight();
      };
      n.prototype.highlightFirstValidPoint = function () {
        var c = this.chart.highlightedPoint,
          d = (c && c.series) === this ? p(c) : 0;
        c = this.points;
        var e = c.length;
        if (c && e) {
          for (var b = d; b < e; ++b) if (!a(c[b])) return c[b].highlight();
          for (; 0 <= d; --d) if (!a(c[d])) return c[d].highlight();
        }
        return !1;
      };
      b.prototype.highlightAdjacentSeries = function (a) {
        var d,
          b = this.highlightedPoint;
        var h =
          (d = this.series && this.series[this.series.length - 1]) &&
          d.points &&
          d.points[d.points.length - 1];
        if (!this.highlightedPoint)
          return (
            (d = a ? this.series && this.series[0] : d),
            (h = a ? d && d.points && d.points[0] : h) ? h.highlight() : !1
          );
        d = this.series[b.series.index + (a ? -1 : 1)];
        if (!d) return !1;
        h = c(b, d, 4);
        if (!h) return !1;
        if (e(d))
          return (
            h.highlight(),
            (a = this.highlightAdjacentSeries(a)),
            a ? a : (b.highlight(), !1)
          );
        h.highlight();
        return h.series.highlightFirstValidPoint();
      };
      b.prototype.highlightAdjacentPointVertical = function (c) {
        var d = this.highlightedPoint,
          b = Infinity,
          h;
        if (!D(d.plotX) || !D(d.plotY)) return !1;
        this.series.forEach(function (u) {
          e(u) ||
            u.points.forEach(function (e) {
              if (D(e.plotY) && D(e.plotX) && e !== d) {
                var k = e.plotY - d.plotY,
                  m = Math.abs(e.plotX - d.plotX);
                m = Math.abs(k) * Math.abs(k) + m * m * 4;
                u.yAxis && u.yAxis.reversed && (k *= -1);
                !((0 >= k && c) || (0 <= k && !c) || 5 > m || a(e)) &&
                  m < b &&
                  ((b = m), (h = e));
              }
            });
        });
        return h ? h.highlight() : !1;
      };
      l(h.prototype, {
        init: function () {
          var a = this,
            c = this.chart,
            e = (this.eventProvider = new q());
          e.addEvent(n, "destroy", function () {
            return a.onSeriesDestroy(this);
          });
          e.addEvent(c, "afterDrilldown", function () {
            d(this);
            this.focusElement && this.focusElement.removeFocusBorder();
          });
          e.addEvent(c, "drilldown", function (c) {
            c = c.point;
            var d = c.series;
            a.lastDrilledDownPoint = {
              x: c.x,
              y: c.y,
              seriesName: d ? d.name : "",
            };
          });
          e.addEvent(c, "drillupall", function () {
            setTimeout(function () {
              a.onDrillupAll();
            }, 10);
          });
          e.addEvent(g, "afterSetState", function () {
            var a = this.graphic && this.graphic.element;
            c.highlightedPoint === this &&
              H.activeElement !== a &&
              a &&
              a.focus &&
              a.focus();
          });
        },
        onDrillupAll: function () {
          var a = this.lastDrilledDownPoint,
            c = this.chart,
            d = a && E(c, a.seriesName),
            e;
          a && d && D(a.x) && D(a.y) && (e = v(d, a.x, a.y));
          c.container && c.container.focus();
          e && e.highlight && e.highlight();
          c.focusElement && c.focusElement.removeFocusBorder();
        },
        getKeyboardNavigationHandler: function () {
          var a = this,
            c = this.keyCodes,
            d = this.chart,
            e = d.inverted;
          return new f(d, {
            keyCodeMap: [
              [
                e ? [c.up, c.down] : [c.left, c.right],
                function (c) {
                  return a.onKbdSideways(this, c);
                },
              ],
              [
                e ? [c.left, c.right] : [c.up, c.down],
                function (c) {
                  return a.onKbdVertical(this, c);
                },
              ],
              [
                [c.enter, c.space],
                function (a, c) {
                  if ((a = d.highlightedPoint))
                    (c.point = a),
                      w(a.series, "click", c),
                      a.firePointEvent("click");
                  return this.response.success;
                },
              ],
            ],
            init: function (c) {
              return a.onHandlerInit(this, c);
            },
            terminate: function () {
              return a.onHandlerTerminate();
            },
          });
        },
        onKbdSideways: function (a, c) {
          var d = this.keyCodes;
          return this.attemptHighlightAdjacentPoint(
            a,
            c === d.right || c === d.down
          );
        },
        onKbdVertical: function (a, c) {
          var d = this.chart,
            e = this.keyCodes;
          c = c === e.down || c === e.right;
          e = d.options.accessibility.keyboardNavigation.seriesNavigation;
          if (e.mode && "serialize" === e.mode)
            return this.attemptHighlightAdjacentPoint(a, c);
          d[
            d.highlightedPoint && d.highlightedPoint.series.keyboardMoveVertical
              ? "highlightAdjacentPointVertical"
              : "highlightAdjacentSeries"
          ](c);
          return a.response.success;
        },
        onHandlerInit: function (a, c) {
          var e = this.chart;
          if (0 < c) d(e);
          else {
            c = e.series.length;
            for (
              var b;
              c-- &&
              !((e.highlightedPoint =
                e.series[c].points[e.series[c].points.length - 1]),
              (b = e.series[c].highlightFirstValidPoint()));

            );
          }
          return a.response.success;
        },
        onHandlerTerminate: function () {
          var a = this.chart;
          a.tooltip && a.tooltip.hide(0);
          if (a.highlightedPoint && a.highlightedPoint.onMouseOut)
            a.highlightedPoint.onMouseOut();
          delete a.highlightedPoint;
        },
        attemptHighlightAdjacentPoint: function (a, c) {
          var d = this.chart,
            e = d.options.accessibility.keyboardNavigation.wrapAround;
          return d.highlightAdjacentPoint(c)
            ? a.response.success
            : e
            ? a.init(c ? 1 : -1)
            : a.response[c ? "next" : "prev"];
        },
        onSeriesDestroy: function (a) {
          var c = this.chart;
          c.highlightedPoint &&
            c.highlightedPoint.series === a &&
            (delete c.highlightedPoint,
            c.focusElement && c.focusElement.removeFocusBorder());
        },
        destroy: function () {
          this.eventProvider.removeAddedEvents();
        },
      });
      return h;
    }
  );
  v(
    b,
    "Accessibility/Components/AnnotationsA11y.js",
    [b["Accessibility/Utils/HTMLUtilities.js"]],
    function (b) {
      function g(b) {
        return (b.annotations || []).reduce(function (b, f) {
          f.options && !1 !== f.options.visible && (b = b.concat(f.labels));
          return b;
        }, []);
      }
      function n(b) {
        return (
          (b.options &&
            b.options.accessibility &&
            b.options.accessibility.description) ||
          (b.graphic && b.graphic.text && b.graphic.text.textStr) ||
          ""
        );
      }
      function l(b) {
        var k =
          b.options &&
          b.options.accessibility &&
          b.options.accessibility.description;
        if (k) return k;
        k = b.chart;
        var f = n(b),
          e = b.points
            .filter(function (a) {
              return !!a.graphic;
            })
            .map(function (a) {
              var c =
                (a.accessibility && a.accessibility.valueDescription) ||
                (a.graphic &&
                  a.graphic.element &&
                  a.graphic.element.getAttribute("aria-label")) ||
                "";
              a = (a && a.series.name) || "";
              return (a ? a + ", " : "") + "data point " + c;
            })
            .filter(function (a) {
              return !!a;
            }),
          a = e.length,
          c =
            "accessibility.screenReaderSection.annotations.description" +
            (1 < a ? "MultiplePoints" : a ? "SinglePoint" : "NoPoints");
        b = {
          annotationText: f,
          annotation: b,
          numPoints: a,
          annotationPoint: e[0],
          additionalAnnotationPoints: e.slice(1),
        };
        return k.langFormat(c, b);
      }
      function t(b) {
        return g(b).map(function (b) {
          return (b = r(f(l(b)))) ? "<li>" + b + "</li>" : "";
        });
      }
      var r = b.escapeStringForHTML,
        f = b.stripHTMLTagsFromString;
      return {
        getAnnotationsInfoHTML: function (b) {
          var f = b.annotations;
          return f && f.length
            ? '<ul style="list-style-type: none">' + t(b).join(" ") + "</ul>"
            : "";
        },
        getAnnotationLabelDescription: l,
        getAnnotationListItems: t,
        getPointAnnotationTexts: function (b) {
          var f = g(b.series.chart).filter(function (f) {
            return -1 < f.points.indexOf(b);
          });
          return f.length
            ? f.map(function (b) {
                return "" + n(b);
              })
            : [];
        },
      };
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/SeriesDescriber.js",
    [
      b["Accessibility/Components/AnnotationsA11y.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/FormatUtilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Tooltip.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n, l, t, r) {
      function f(a) {
        var c = a.index;
        return a.series && a.series.data && L(c)
          ? C(a.series.data, function (a) {
              return !!(
                a &&
                "undefined" !== typeof a.index &&
                a.index > c &&
                a.graphic &&
                a.graphic.element
              );
            }) || null
          : null;
      }
      function q(a) {
        var c =
          a.chart.options.accessibility.series.pointDescriptionEnabledThreshold;
        return !!(!1 !== c && a.points && a.points.length >= c);
      }
      function k(a) {
        var c = a.options.accessibility || {};
        return !q(a) && !c.exposeAsGroupOnly;
      }
      function p(a) {
        var c =
          a.chart.options.accessibility.keyboardNavigation.seriesNavigation;
        return !(
          !a.points ||
          !(
            a.points.length < c.pointNavigationEnabledThreshold ||
            !1 === c.pointNavigationEnabledThreshold
          )
        );
      }
      function e(a, c) {
        var d = a.series.chart,
          b = d.options.accessibility.point || {};
        a = a.series.tooltipOptions || {};
        d = d.options.lang;
        return I(c)
          ? K(
              c,
              b.valueDecimals || a.valueDecimals || -1,
              d.decimalPoint,
              d.accessibility.thousandsSep || d.thousandsSep
            )
          : c;
      }
      function a(a) {
        var c = (a.options.accessibility || {}).description;
        return (
          (c &&
            a.chart.langFormat("accessibility.series.description", {
              description: c,
              series: a,
            })) ||
          ""
        );
      }
      function c(a, c) {
        return a.chart.langFormat("accessibility.series." + c + "Description", {
          name: B(a[c]),
          series: a,
        });
      }
      function d(a) {
        var c = a.series,
          d = c.chart,
          b = d.options.accessibility.point || {};
        if (c.xAxis && c.xAxis.dateTime)
          return (
            (c = t.prototype.getXDateFormat.call(
              { getDateFormat: t.prototype.getDateFormat, chart: d },
              a,
              d.options.tooltip,
              c.xAxis
            )),
            (b = (b.dateFormatter && b.dateFormatter(a)) || b.dateFormat || c),
            d.time.dateFormat(b, a.x, void 0)
          );
      }
      function h(a) {
        var c = d(a),
          b =
            (a.series.xAxis || {}).categories &&
            L(a.category) &&
            ("" + a.category).replace("<br/>", " "),
          e = a.id && 0 > a.id.indexOf("highcharts-"),
          m = "x, " + a.x;
        return a.name || c || b || (e ? a.id : m);
      }
      function z(a, c, d) {
        var b = c || "",
          m = d || "";
        return a.series.pointArrayMap.reduce(function (c, d) {
          c += c.length ? ", " : "";
          var h = e(a, G(a[d], a.options[d]));
          return c + (d + ": " + b + h + m);
        }, "");
      }
      function H(a) {
        var c = a.series,
          d = c.chart.options.accessibility.point || {},
          b = c.tooltipOptions || {},
          m = d.valuePrefix || b.valuePrefix || "";
        d = d.valueSuffix || b.valueSuffix || "";
        b = e(a, a["undefined" !== typeof a.value ? "value" : "y"]);
        return a.isNull
          ? c.chart.langFormat("accessibility.series.nullPointValue", {
              point: a,
            })
          : c.pointArrayMap
          ? z(a, m, d)
          : m + b + d;
      }
      function D(a) {
        var c = a.series,
          d = c.chart,
          b = d.options.accessibility.point.valueDescriptionFormat,
          e = (c = G(
            c.xAxis &&
              c.xAxis.options.accessibility &&
              c.xAxis.options.accessibility.enabled,
            !d.angular
          ))
            ? h(a)
            : "";
        a = {
          point: a,
          index: L(a.index) ? a.index + 1 : "",
          xDescription: e,
          value: H(a),
          separator: c ? ", " : "",
        };
        return J(b, a, d);
      }
      function w(a) {
        var c = a.series,
          d = c.chart,
          b = D(a),
          e =
            a.options &&
            a.options.accessibility &&
            a.options.accessibility.description;
        e = e ? " " + e : "";
        c = 1 < d.series.length && c.name ? " " + c.name + "." : "";
        d = a.series.chart;
        var m = F(a),
          h = { point: a, annotations: m };
        d = m.length
          ? d.langFormat("accessibility.series.pointAnnotationsDescription", h)
          : "";
        a.accessibility = a.accessibility || {};
        a.accessibility.valueDescription = b;
        return b + e + c + (d ? " " + d : "");
      }
      function v(a) {
        var c = k(a),
          d = p(a);
        (c || d) &&
          a.points.forEach(function (a) {
            var d;
            if (
              !(d = a.graphic && a.graphic.element) &&
              ((d = a.series && a.series.is("sunburst")), (d = a.isNull && !d))
            ) {
              var b = a.series,
                e = f(a);
              b = (d = e && e.graphic) ? d.parentGroup : b.graph || b.group;
              e = e
                ? { x: G(a.plotX, e.plotX, 0), y: G(a.plotY, e.plotY, 0) }
                : { x: G(a.plotX, 0), y: G(a.plotY, 0) };
              e = a.series.chart.renderer.rect(e.x, e.y, 1, 1);
              e.attr({
                class: "highcharts-a11y-dummy-point",
                fill: "none",
                opacity: 0,
                "fill-opacity": 0,
                "stroke-opacity": 0,
              });
              b && b.element
                ? ((a.graphic = e),
                  (a.hasDummyGraphic = !0),
                  e.add(b),
                  b.element.insertBefore(e.element, d ? d.element : null),
                  (d = e.element))
                : (d = void 0);
            }
            b =
              a.options &&
              a.options.accessibility &&
              !1 === a.options.accessibility.enabled;
            d &&
              (d.setAttribute("tabindex", "-1"),
              (d.style.outline = "0"),
              c && !b
                ? ((e = a.series),
                  (b = e.chart.options.accessibility.point || {}),
                  (e = e.options.accessibility || {}),
                  (a = m(
                    (e.pointDescriptionFormatter &&
                      e.pointDescriptionFormatter(a)) ||
                      (b.descriptionFormatter && b.descriptionFormatter(a)) ||
                      w(a)
                  )),
                  d.setAttribute("role", "img"),
                  d.setAttribute("aria-label", a))
                : d.setAttribute("aria-hidden", !0));
          });
      }
      function E(d) {
        var b = d.chart,
          e = b.types || [],
          m = a(d),
          h = function (a) {
            return b[a] && 1 < b[a].length && d[a];
          },
          f = c(d, "xAxis"),
          k = c(d, "yAxis"),
          y = {
            name: d.name || "",
            ix: d.index + 1,
            numSeries: b.series && b.series.length,
            numPoints: d.points && d.points.length,
            series: d,
          };
        e = 1 < e.length ? "Combination" : "";
        return (
          (b.langFormat("accessibility.series.summary." + d.type + e, y) ||
            b.langFormat("accessibility.series.summary.default" + e, y)) +
          (m ? " " + m : "") +
          (h("yAxis") ? " " + k : "") +
          (h("xAxis") ? " " + f : "")
        );
      }
      var F = b.getPointAnnotationTexts,
        B = g.getAxisDescription,
        u = g.getSeriesFirstPointElement,
        A = g.getSeriesA11yElement,
        x = g.unhideChartElementFromAT,
        J = n.format,
        K = n.numberFormat,
        y = l.reverseChildNodes,
        m = l.stripHTMLTagsFromString,
        C = r.find,
        I = r.isNumber,
        G = r.pick,
        L = r.defined;
      return {
        describeSeries: function (a) {
          var c = a.chart,
            d = u(a),
            b = A(a),
            e = c.is3d && c.is3d();
          if (b) {
            b.lastChild !== d || e || y(b);
            v(a);
            x(c, b);
            e = a.chart;
            c = e.options.chart;
            d = 1 < e.series.length;
            e = e.options.accessibility.series.describeSingleSeries;
            var h = (a.options.accessibility || {}).exposeAsGroupOnly;
            (c.options3d && c.options3d.enabled && d) || !(d || e || h || q(a))
              ? b.setAttribute("aria-label", "")
              : ((c = a.chart.options.accessibility),
                (d = c.landmarkVerbosity),
                (a.options.accessibility || {}).exposeAsGroupOnly
                  ? b.setAttribute("role", "img")
                  : "all" === d && b.setAttribute("role", "region"),
                b.setAttribute("tabindex", "-1"),
                (b.style.outline = "0"),
                b.setAttribute(
                  "aria-label",
                  m(
                    (c.series.descriptionFormatter &&
                      c.series.descriptionFormatter(a)) ||
                      E(a)
                  )
                ));
          }
        },
        defaultPointDescriptionFormatter: w,
        defaultSeriesDescriptionFormatter: E,
        getPointA11yTimeDescription: d,
        getPointXDescription: h,
        getPointValue: H,
        getPointValueDescription: D,
      };
    }
  );
  v(
    b,
    "Accessibility/Utils/Announcer.js",
    [
      b["Core/Globals.js"],
      b["Core/Renderer/HTML/AST.js"],
      b["Accessibility/Utils/DOMElementProvider.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, g, n, l) {
      var t = b.doc,
        r = l.setElAttrs,
        f = l.visuallyHideElement;
      l = (function () {
        function b(b, f) {
          this.chart = b;
          this.domElementProvider = new n();
          this.announceRegion = this.addAnnounceRegion(f);
        }
        b.prototype.destroy = function () {
          this.domElementProvider.destroyCreatedElements();
        };
        b.prototype.announce = function (b) {
          var f = this;
          g.setElementHTML(this.announceRegion, b);
          this.clearAnnouncementRegionTimer &&
            clearTimeout(this.clearAnnouncementRegionTimer);
          this.clearAnnouncementRegionTimer = setTimeout(function () {
            f.announceRegion.innerHTML = "";
            delete f.clearAnnouncementRegionTimer;
          }, 1e3);
        };
        b.prototype.addAnnounceRegion = function (b) {
          var k =
              this.chart.announcerContainer || this.createAnnouncerContainer(),
            e = this.domElementProvider.createElement("div");
          r(e, { "aria-hidden": !1, "aria-live": b });
          f(e);
          k.appendChild(e);
          return e;
        };
        b.prototype.createAnnouncerContainer = function () {
          var b = this.chart,
            f = t.createElement("div");
          r(f, {
            "aria-hidden": !1,
            style: "position:relative",
            class: "highcharts-announcer-container",
          });
          b.renderTo.insertBefore(f, b.renderTo.firstChild);
          return (b.announcerContainer = f);
        };
        return b;
      })();
      return (b.Announcer = l);
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/NewDataAnnouncer.js",
    [
      b["Core/Globals.js"],
      b["Core/Series/Series.js"],
      b["Core/Utilities.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Components/SeriesComponent/SeriesDescriber.js"],
      b["Accessibility/Utils/Announcer.js"],
      b["Accessibility/Utils/EventProvider.js"],
    ],
    function (b, g, n, l, t, r, f) {
      function q(a) {
        var c = a.series.data.filter(function (c) {
          return a.x === c.x && a.y === c.y;
        });
        return 1 === c.length ? c[0] : a;
      }
      function k(a, c) {
        var d = (a || []).concat(c || []).reduce(function (a, c) {
          a[c.name + c.index] = c;
          return a;
        }, {});
        return Object.keys(d).map(function (a) {
          return d[a];
        });
      }
      var p = n.extend,
        e = n.defined,
        a = l.getChartTitle,
        c = t.defaultPointDescriptionFormatter,
        d = t.defaultSeriesDescriptionFormatter;
      n = function (a) {
        this.chart = a;
      };
      p(n.prototype, {
        init: function () {
          var a = this.chart,
            c = a.options.accessibility.announceNewData.interruptUser
              ? "assertive"
              : "polite";
          this.lastAnnouncementTime = 0;
          this.dirty = { allSeries: {} };
          this.eventProvider = new f();
          this.announcer = new r(a, c);
          this.addEventListeners();
        },
        destroy: function () {
          this.eventProvider.removeAddedEvents();
          this.announcer.destroy();
        },
        addEventListeners: function () {
          var a = this,
            c = this.chart,
            d = this.eventProvider;
          d.addEvent(c, "afterDrilldown", function () {
            a.lastAnnouncementTime = 0;
          });
          d.addEvent(g, "updatedData", function () {
            a.onSeriesUpdatedData(this);
          });
          d.addEvent(c, "afterAddSeries", function (c) {
            a.onSeriesAdded(c.series);
          });
          d.addEvent(g, "addPoint", function (c) {
            a.onPointAdded(c.point);
          });
          d.addEvent(c, "redraw", function () {
            a.announceDirtyData();
          });
        },
        onSeriesUpdatedData: function (a) {
          var c = this.chart;
          a.chart === c &&
            c.options.accessibility.announceNewData.enabled &&
            ((this.dirty.hasDirty = !0),
            (this.dirty.allSeries[a.name + a.index] = a));
        },
        onSeriesAdded: function (a) {
          this.chart.options.accessibility.announceNewData.enabled &&
            ((this.dirty.hasDirty = !0),
            (this.dirty.allSeries[a.name + a.index] = a),
            (this.dirty.newSeries = e(this.dirty.newSeries) ? void 0 : a));
        },
        onPointAdded: function (a) {
          var c = a.series.chart;
          this.chart === c &&
            c.options.accessibility.announceNewData.enabled &&
            (this.dirty.newPoint = e(this.dirty.newPoint) ? void 0 : a);
        },
        announceDirtyData: function () {
          var a = this;
          if (
            this.chart.options.accessibility.announceNewData &&
            this.dirty.hasDirty
          ) {
            var c = this.dirty.newPoint;
            c && (c = q(c));
            this.queueAnnouncement(
              Object.keys(this.dirty.allSeries).map(function (c) {
                return a.dirty.allSeries[c];
              }),
              this.dirty.newSeries,
              c
            );
            this.dirty = { allSeries: {} };
          }
        },
        queueAnnouncement: function (a, c, d) {
          var b = this,
            e = this.chart.options.accessibility.announceNewData;
          if (e.enabled) {
            var h = +new Date();
            e = Math.max(
              0,
              e.minAnnounceInterval - (h - this.lastAnnouncementTime)
            );
            a = k(this.queuedAnnouncement && this.queuedAnnouncement.series, a);
            if ((c = this.buildAnnouncementMessage(a, c, d)))
              this.queuedAnnouncement &&
                clearTimeout(this.queuedAnnouncementTimer),
                (this.queuedAnnouncement = { time: h, message: c, series: a }),
                (this.queuedAnnouncementTimer = setTimeout(function () {
                  b &&
                    b.announcer &&
                    ((b.lastAnnouncementTime = +new Date()),
                    b.announcer.announce(b.queuedAnnouncement.message),
                    delete b.queuedAnnouncement,
                    delete b.queuedAnnouncementTimer);
                }, e));
          }
        },
        buildAnnouncementMessage: function (e, f, k) {
          var h = this.chart,
            g = h.options.accessibility.announceNewData;
          if (
            g.announcementFormatter &&
            ((e = g.announcementFormatter(e, f, k)), !1 !== e)
          )
            return e.length ? e : null;
          e = b.charts && 1 < b.charts.length ? "Multiple" : "Single";
          e = f
            ? "newSeriesAnnounce" + e
            : k
            ? "newPointAnnounce" + e
            : "newDataAnnounce";
          g = a(h);
          return h.langFormat("accessibility.announceNewData." + e, {
            chartTitle: g,
            seriesDesc: f ? d(f) : null,
            pointDesc: k ? c(k) : null,
            point: k,
            series: f,
          });
        },
      });
      return n;
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/ForcedMarkers.js",
    [b["Core/Series/Series.js"], b["Core/Utilities.js"]],
    function (b, g) {
      function n(b) {
        t(!0, b, {
          marker: { enabled: !0, states: { normal: { opacity: 0 } } },
        });
      }
      var l = g.addEvent,
        t = g.merge;
      return function () {
        l(b, "render", function () {
          var b = this.options,
            f =
              !1 !==
              (this.options.accessibility &&
                this.options.accessibility.enabled);
          if ((f = this.chart.options.accessibility.enabled && f))
            (f = this.chart.options.accessibility),
              (f =
                this.points.length <
                  f.series.pointDescriptionEnabledThreshold ||
                !1 === f.series.pointDescriptionEnabledThreshold);
          if (f) {
            if (
              (b.marker &&
                !1 === b.marker.enabled &&
                ((this.a11yMarkersForced = !0), n(this.options)),
              this._hasPointMarkers && this.points && this.points.length)
            )
              for (b = this.points.length; b--; ) {
                f = this.points[b];
                var g = f.options;
                delete f.hasForcedA11yMarker;
                g.marker &&
                  (g.marker.enabled
                    ? (t(!0, g.marker, {
                        states: {
                          normal: {
                            opacity:
                              (g.marker.states &&
                                g.marker.states.normal &&
                                g.marker.states.normal.opacity) ||
                              1,
                          },
                        },
                      }),
                      (f.hasForcedA11yMarker = !1))
                    : (n(g), (f.hasForcedA11yMarker = !0)));
              }
          } else this.a11yMarkersForced && (delete this.a11yMarkersForced, (b = this.resetA11yMarkerOptions) && t(!0, this.options, { marker: { enabled: b.enabled, states: { normal: { opacity: b.states && b.states.normal && b.states.normal.opacity } } } }));
        });
        l(b, "afterSetOptions", function (b) {
          this.resetA11yMarkerOptions = t(
            b.options.marker || {},
            this.userOptions.marker || {}
          );
        });
        l(b, "afterRender", function () {
          if (this.chart.styledMode) {
            if (this.markerGroup)
              this.markerGroup[
                this.a11yMarkersForced ? "addClass" : "removeClass"
              ]("highcharts-a11y-markers-hidden");
            this._hasPointMarkers &&
              this.points &&
              this.points.length &&
              this.points.forEach(function (b) {
                b.graphic &&
                  (b.graphic[
                    b.hasForcedA11yMarker ? "addClass" : "removeClass"
                  ]("highcharts-a11y-marker-hidden"),
                  b.graphic[
                    !1 === b.hasForcedA11yMarker ? "addClass" : "removeClass"
                  ]("highcharts-a11y-marker-visible"));
              });
          }
        });
      };
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/SeriesComponent.js",
    [
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js"],
      b["Accessibility/Components/SeriesComponent/NewDataAnnouncer.js"],
      b["Accessibility/Components/SeriesComponent/ForcedMarkers.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Components/SeriesComponent/SeriesDescriber.js"],
      b["Core/Tooltip.js"],
    ],
    function (b, g, n, l, t, r, f, q, k) {
      g = g.extend;
      var p = f.hideSeriesFromAT,
        e = q.describeSeries;
      b.SeriesAccessibilityDescriber = q;
      r();
      b = function () {};
      b.prototype = new n();
      g(b.prototype, {
        init: function () {
          this.newDataAnnouncer = new t(this.chart);
          this.newDataAnnouncer.init();
          this.keyboardNavigation = new l(this.chart, this.keyCodes);
          this.keyboardNavigation.init();
          this.hideTooltipFromATWhenShown();
          this.hideSeriesLabelsFromATWhenShown();
        },
        hideTooltipFromATWhenShown: function () {
          var a = this;
          this.addEvent(k, "refresh", function () {
            this.chart === a.chart &&
              this.label &&
              this.label.element &&
              this.label.element.setAttribute("aria-hidden", !0);
          });
        },
        hideSeriesLabelsFromATWhenShown: function () {
          this.addEvent(this.chart, "afterDrawSeriesLabels", function () {
            this.series.forEach(function (a) {
              a.labelBySeries && a.labelBySeries.attr("aria-hidden", !0);
            });
          });
        },
        onChartRender: function () {
          this.chart.series.forEach(function (a) {
            !1 !==
              (a.options.accessibility && a.options.accessibility.enabled) &&
            a.visible
              ? e(a)
              : p(a);
          });
        },
        getKeyboardNavigation: function () {
          return this.keyboardNavigation.getKeyboardNavigationHandler();
        },
        destroy: function () {
          this.newDataAnnouncer.destroy();
          this.keyboardNavigation.destroy();
        },
      });
      return b;
    }
  );
  v(
    b,
    "Accessibility/Components/ZoomComponent.js",
    [
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n, l, t, r) {
      var f = g.unhideChartElementFromAT;
      g = n.noop;
      var q = l.removeElement,
        k = l.setElAttrs;
      l = r.extend;
      var p = r.pick;
      n.Axis.prototype.panStep = function (b, a) {
        var c = a || 3;
        a = this.getExtremes();
        var d = ((a.max - a.min) / c) * b;
        c = a.max + d;
        d = a.min + d;
        var e = c - d;
        0 > b && d < a.dataMin
          ? ((d = a.dataMin), (c = d + e))
          : 0 < b && c > a.dataMax && ((c = a.dataMax), (d = c - e));
        this.setExtremes(d, c);
      };
      g.prototype = new b();
      l(g.prototype, {
        init: function () {
          var b = this,
            a = this.chart;
          ["afterShowResetZoom", "afterDrilldown", "drillupall"].forEach(
            function (c) {
              b.addEvent(a, c, function () {
                b.updateProxyOverlays();
              });
            }
          );
        },
        onChartUpdate: function () {
          var b = this.chart,
            a = this;
          b.mapNavButtons &&
            b.mapNavButtons.forEach(function (c, d) {
              f(b, c.element);
              a.setMapNavButtonAttrs(
                c.element,
                "accessibility.zoom.mapZoom" + (d ? "Out" : "In")
              );
            });
        },
        setMapNavButtonAttrs: function (b, a) {
          var c = this.chart;
          a = c.langFormat(a, { chart: c });
          k(b, { tabindex: -1, role: "button", "aria-label": a });
        },
        onChartRender: function () {
          this.updateProxyOverlays();
        },
        updateProxyOverlays: function () {
          var b = this.chart;
          q(this.drillUpProxyGroup);
          q(this.resetZoomProxyGroup);
          b.resetZoomButton &&
            this.recreateProxyButtonAndGroup(
              b.resetZoomButton,
              "resetZoomProxyButton",
              "resetZoomProxyGroup",
              b.langFormat("accessibility.zoom.resetZoomButton", { chart: b })
            );
          b.drillUpButton &&
            this.recreateProxyButtonAndGroup(
              b.drillUpButton,
              "drillUpProxyButton",
              "drillUpProxyGroup",
              b.langFormat("accessibility.drillUpButton", {
                chart: b,
                buttonText: b.getDrilldownBackText(),
              })
            );
        },
        recreateProxyButtonAndGroup: function (b, a, c, d) {
          q(this[c]);
          this[c] = this.addProxyGroup();
          this[a] = this.createProxyButton(b, this[c], {
            "aria-label": d,
            tabindex: -1,
          });
        },
        getMapZoomNavigation: function () {
          var b = this.keyCodes,
            a = this.chart,
            c = this;
          return new t(a, {
            keyCodeMap: [
              [
                [b.up, b.down, b.left, b.right],
                function (a) {
                  return c.onMapKbdArrow(this, a);
                },
              ],
              [
                [b.tab],
                function (a, b) {
                  return c.onMapKbdTab(this, b);
                },
              ],
              [
                [b.space, b.enter],
                function () {
                  return c.onMapKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return !!(a.mapZoom && a.mapNavButtons && a.mapNavButtons.length);
            },
            init: function (a) {
              return c.onMapNavInit(a);
            },
          });
        },
        onMapKbdArrow: function (b, a) {
          var c = this.keyCodes;
          this.chart[a === c.up || a === c.down ? "yAxis" : "xAxis"][0].panStep(
            a === c.left || a === c.up ? -1 : 1
          );
          return b.response.success;
        },
        onMapKbdTab: function (b, a) {
          var c = this.chart;
          b = b.response;
          var d =
            ((a = a.shiftKey) && !this.focusedMapNavButtonIx) ||
            (!a && this.focusedMapNavButtonIx);
          c.mapNavButtons[this.focusedMapNavButtonIx].setState(0);
          if (d) return c.mapZoom(), b[a ? "prev" : "next"];
          this.focusedMapNavButtonIx += a ? -1 : 1;
          a = c.mapNavButtons[this.focusedMapNavButtonIx];
          c.setFocusToElement(a.box, a.element);
          a.setState(2);
          return b.success;
        },
        onMapKbdClick: function (b) {
          this.fakeClickEvent(
            this.chart.mapNavButtons[this.focusedMapNavButtonIx].element
          );
          return b.response.success;
        },
        onMapNavInit: function (b) {
          var a = this.chart,
            c = a.mapNavButtons[0],
            d = a.mapNavButtons[1];
          c = 0 < b ? c : d;
          a.setFocusToElement(c.box, c.element);
          c.setState(2);
          this.focusedMapNavButtonIx = 0 < b ? 0 : 1;
        },
        simpleButtonNavigation: function (b, a, c) {
          var d = this.keyCodes,
            e = this,
            f = this.chart;
          return new t(f, {
            keyCodeMap: [
              [
                [d.tab, d.up, d.down, d.left, d.right],
                function (a, c) {
                  return this.response[
                    (a === d.tab && c.shiftKey) || a === d.left || a === d.up
                      ? "prev"
                      : "next"
                  ];
                },
              ],
              [
                [d.space, d.enter],
                function () {
                  var a = c(this, f);
                  return p(a, this.response.success);
                },
              ],
            ],
            validate: function () {
              return f[b] && f[b].box && e[a];
            },
            init: function () {
              f.setFocusToElement(f[b].box, e[a]);
            },
          });
        },
        getKeyboardNavigation: function () {
          return [
            this.simpleButtonNavigation(
              "resetZoomButton",
              "resetZoomProxyButton",
              function (b, a) {
                a.zoomOut();
              }
            ),
            this.simpleButtonNavigation(
              "drillUpButton",
              "drillUpProxyButton",
              function (b, a) {
                a.drillUp();
                return b.response.prev;
              }
            ),
            this.getMapZoomNavigation(),
          ];
        },
      });
      return g;
    }
  );
  v(
    b,
    "Extensions/RangeSelector.js",
    [
      b["Core/Axis/Axis.js"],
      b["Core/Chart/Chart.js"],
      b["Core/Globals.js"],
      b["Core/Options.js"],
      b["Core/Color/Palette.js"],
      b["Core/Renderer/SVG/SVGElement.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n, l, t, r, f) {
      function q(a) {
        if (-1 !== a.indexOf("%L")) return "text";
        var c = "aAdewbBmoyY".split("").some(function (c) {
            return -1 !== a.indexOf("%" + c);
          }),
          b = "HkIlMS".split("").some(function (c) {
            return -1 !== a.indexOf("%" + c);
          });
        return c && b ? "datetime-local" : c ? "date" : b ? "time" : "text";
      }
      var k = l.defaultOptions,
        p = f.addEvent,
        e = f.createElement,
        a = f.css,
        c = f.defined,
        d = f.destroyObjectProperties,
        h = f.discardElement,
        z = f.extend,
        H = f.find,
        D = f.fireEvent,
        w = f.isNumber,
        v = f.merge,
        E = f.objectEach,
        F = f.pad,
        B = f.pick,
        u = f.pInt,
        A = f.splat;
      z(k, {
        rangeSelector: {
          allButtonsEnabled: !1,
          buttons: void 0,
          buttonSpacing: 5,
          dropdown: "responsive",
          enabled: void 0,
          verticalAlign: "top",
          buttonTheme: { width: 28, height: 18, padding: 2, zIndex: 7 },
          floating: !1,
          x: 0,
          y: 0,
          height: void 0,
          inputBoxBorderColor: "none",
          inputBoxHeight: 17,
          inputBoxWidth: void 0,
          inputDateFormat: "%b %e, %Y",
          inputDateParser: void 0,
          inputEditDateFormat: "%Y-%m-%d",
          inputEnabled: !0,
          inputPosition: { align: "right", x: 0, y: 0 },
          inputSpacing: 5,
          selected: void 0,
          buttonPosition: { align: "left", x: 0, y: 0 },
          inputStyle: { color: t.highlightColor80, cursor: "pointer" },
          labelStyle: { color: t.neutralColor60 },
        },
      });
      z(k.lang, {
        rangeSelectorZoom: "Zoom",
        rangeSelectorFrom: "",
        rangeSelectorTo: "\u2192",
      });
      var x = (function () {
        function f(a) {
          this.buttons = void 0;
          this.buttonOptions = f.prototype.defaultButtons;
          this.initialButtonGroupWidth = 0;
          this.options = void 0;
          this.chart = a;
          this.init(a);
        }
        f.prototype.clickButton = function (a, d) {
          var e = this.chart,
            m = this.buttonOptions[a],
            f = e.xAxis[0],
            h = (e.scroller && e.scroller.getUnionExtremes()) || f || {},
            k = h.dataMin,
            C = h.dataMax,
            g = f && Math.round(Math.min(f.max, B(C, f.max))),
            u = m.type;
          h = m._range;
          var y,
            x = m.dataGrouping;
          if (null !== k && null !== C) {
            e.fixedRange = h;
            this.setSelected(a);
            x &&
              ((this.forcedDataGrouping = !0),
              b.prototype.setDataGrouping.call(
                f || { chart: this.chart },
                x,
                !1
              ),
              (this.frozenStates = m.preserveDataGrouping));
            if ("month" === u || "year" === u)
              if (f) {
                u = { range: m, max: g, chart: e, dataMin: k, dataMax: C };
                var q = f.minFromRange.call(u);
                w(u.newMax) && (g = u.newMax);
              } else h = m;
            else if (h) (q = Math.max(g - h, k)), (g = Math.min(q + h, C));
            else if ("ytd" === u)
              if (f)
                "undefined" === typeof C &&
                  ((k = Number.MAX_VALUE),
                  (C = Number.MIN_VALUE),
                  e.series.forEach(function (a) {
                    a = a.xData;
                    k = Math.min(a[0], k);
                    C = Math.max(a[a.length - 1], C);
                  }),
                  (d = !1)),
                  (g = this.getYTDExtremes(C, k, e.time.useUTC)),
                  (q = y = g.min),
                  (g = g.max);
              else {
                this.deferredYTDClick = a;
                return;
              }
            else "all" === u && f && ((q = k), (g = C));
            c(q) && (q += m._offsetMin);
            c(g) && (g += m._offsetMax);
            this.dropdown && (this.dropdown.selectedIndex = a + 1);
            if (f)
              f.setExtremes(q, g, B(d, !0), void 0, {
                trigger: "rangeSelectorButton",
                rangeSelectorButton: m,
              });
            else {
              var l = A(e.options.xAxis)[0];
              var z = l.range;
              l.range = h;
              var n = l.min;
              l.min = y;
              p(e, "load", function () {
                l.range = z;
                l.min = n;
              });
            }
            D(this, "afterBtnClick");
          }
        };
        f.prototype.setSelected = function (a) {
          this.selected = this.options.selected = a;
        };
        f.prototype.init = function (a) {
          var c = this,
            b = a.options.rangeSelector,
            d = b.buttons || c.defaultButtons.slice(),
            e = b.selected,
            m = function () {
              var a = c.minInput,
                b = c.maxInput;
              a && a.blur && D(a, "blur");
              b && b.blur && D(b, "blur");
            };
          c.chart = a;
          c.options = b;
          c.buttons = [];
          c.buttonOptions = d;
          this.eventsToUnbind = [];
          this.eventsToUnbind.push(p(a.container, "mousedown", m));
          this.eventsToUnbind.push(p(a, "resize", m));
          d.forEach(c.computeButtonRange);
          "undefined" !== typeof e && d[e] && this.clickButton(e, !1);
          this.eventsToUnbind.push(
            p(a, "load", function () {
              a.xAxis &&
                a.xAxis[0] &&
                p(a.xAxis[0], "setExtremes", function (b) {
                  this.max - this.min !== a.fixedRange &&
                    "rangeSelectorButton" !== b.trigger &&
                    "updatedData" !== b.trigger &&
                    c.forcedDataGrouping &&
                    !c.frozenStates &&
                    this.setDataGrouping(!1, !1);
                });
            })
          );
        };
        f.prototype.updateButtonStates = function () {
          var a = this,
            c = this.chart,
            b = this.dropdown,
            d = c.xAxis[0],
            e = Math.round(d.max - d.min),
            f = !d.hasVisibleSeries,
            h = (c.scroller && c.scroller.getUnionExtremes()) || d,
            k = h.dataMin,
            g = h.dataMax;
          c = a.getYTDExtremes(g, k, c.time.useUTC);
          var u = c.min,
            y = c.max,
            p = a.selected,
            q = w(p),
            l = a.options.allButtonsEnabled,
            x = a.buttons;
          a.buttonOptions.forEach(function (c, m) {
            var h = c._range,
              C = c.type,
              G = c.count || 1,
              L = x[m],
              I = 0,
              A = c._offsetMax - c._offsetMin;
            c = m === p;
            var O = h > g - k,
              z = h < d.minRange,
              n = !1,
              t = !1;
            h = h === e;
            ("month" === C || "year" === C) &&
            e + 36e5 >= 864e5 * { month: 28, year: 365 }[C] * G - A &&
            e - 36e5 <= 864e5 * { month: 31, year: 366 }[C] * G + A
              ? (h = !0)
              : "ytd" === C
              ? ((h = y - u + A === e), (n = !c))
              : "all" === C &&
                ((h = d.max - d.min >= g - k), (t = !c && q && h));
            C = !l && (O || z || t || f);
            G = (c && h) || (h && !q && !n) || (c && a.frozenStates);
            C ? (I = 3) : G && ((q = !0), (I = 2));
            L.state !== I &&
              (L.setState(I),
              b &&
                ((b.options[m + 1].disabled = C),
                2 === I && (b.selectedIndex = m + 1)),
              0 === I && p === m && a.setSelected());
          });
        };
        f.prototype.computeButtonRange = function (a) {
          var c = a.type,
            b = a.count || 1,
            d = {
              millisecond: 1,
              second: 1e3,
              minute: 6e4,
              hour: 36e5,
              day: 864e5,
              week: 6048e5,
            };
          if (d[c]) a._range = d[c] * b;
          else if ("month" === c || "year" === c)
            a._range = 864e5 * { month: 30, year: 365 }[c] * b;
          a._offsetMin = B(a.offsetMin, 0);
          a._offsetMax = B(a.offsetMax, 0);
          a._range += a._offsetMax - a._offsetMin;
        };
        f.prototype.getInputValue = function (a) {
          a = "min" === a ? this.minInput : this.maxInput;
          var c = this.chart.options.rangeSelector,
            b = this.chart.time;
          return a
            ? (
                ("text" === a.type && c.inputDateParser) ||
                this.defaultInputDateParser
              )(a.value, b.useUTC, b)
            : 0;
        };
        f.prototype.setInputValue = function (a, b) {
          var d = this.options,
            e = this.chart.time,
            f = "min" === a ? this.minInput : this.maxInput;
          a = "min" === a ? this.minDateBox : this.maxDateBox;
          if (f) {
            var m = f.getAttribute("data-hc-time");
            m = c(m) ? Number(m) : void 0;
            c(b) &&
              (c(m) && f.setAttribute("data-hc-time-previous", m),
              f.setAttribute("data-hc-time", b),
              (m = b));
            f.value = e.dateFormat(
              this.inputTypeFormats[f.type] || d.inputEditDateFormat,
              m
            );
            a && a.attr({ text: e.dateFormat(d.inputDateFormat, m) });
          }
        };
        f.prototype.setInputExtremes = function (a, c, b) {
          if ((a = "min" === a ? this.minInput : this.maxInput)) {
            var d = this.inputTypeFormats[a.type],
              e = this.chart.time;
            d &&
              ((c = e.dateFormat(d, c)),
              a.min !== c && (a.min = c),
              (b = e.dateFormat(d, b)),
              a.max !== b && (a.max = b));
          }
        };
        f.prototype.showInput = function (c) {
          var b = "min" === c ? this.minDateBox : this.maxDateBox;
          if (
            (c = "min" === c ? this.minInput : this.maxInput) &&
            b &&
            this.inputGroup
          ) {
            var d = "text" === c.type,
              e = this.inputGroup,
              f = e.translateX;
            e = e.translateY;
            var m = this.options.inputBoxWidth;
            a(c, {
              width: d ? b.width + (m ? -2 : 20) + "px" : "auto",
              height: d ? b.height - 2 + "px" : "auto",
              border: "2px solid silver",
            });
            d && m
              ? a(c, { left: f + b.x + "px", top: e + "px" })
              : a(c, {
                  left:
                    Math.min(
                      Math.round(b.x + f - (c.offsetWidth - b.width) / 2),
                      this.chart.chartWidth - c.offsetWidth
                    ) + "px",
                  top: e - 1 - (c.offsetHeight - b.height) / 2 + "px",
                });
          }
        };
        f.prototype.hideInput = function (c) {
          (c = "min" === c ? this.minInput : this.maxInput) &&
            a(c, { top: "-9999em", border: 0, width: "1px", height: "1px" });
        };
        f.prototype.defaultInputDateParser = function (a, c, b) {
          var d = a.split("/").join("-").split(" ").join("T");
          -1 === d.indexOf("T") && (d += "T00:00");
          if (c) d += "Z";
          else {
            var e;
            if ((e = n.isSafari))
              (e = d),
                (e = !(
                  6 < e.length &&
                  (e.lastIndexOf("-") === e.length - 6 ||
                    e.lastIndexOf("+") === e.length - 6)
                ));
            e &&
              ((e = new Date(d).getTimezoneOffset() / 60),
              (d += 0 >= e ? "+" + F(-e) + ":00" : "-" + F(e) + ":00"));
          }
          d = Date.parse(d);
          w(d) ||
            ((a = a.split("-")), (d = Date.UTC(u(a[0]), u(a[1]) - 1, u(a[2]))));
          b && c && w(d) && (d += b.getTimezoneOffset(d));
          return d;
        };
        f.prototype.drawInput = function (c) {
          function b() {
            var a = m.getInputValue(c),
              b = d.xAxis[0],
              e = d.scroller && d.scroller.xAxis ? d.scroller.xAxis : b,
              f = e.dataMin;
            e = e.dataMax;
            var h = m.maxInput,
              k = m.minInput;
            a !== Number(x.getAttribute("data-hc-time-previous")) &&
              w(a) &&
              (x.setAttribute("data-hc-time-previous", a),
              p && h && w(f)
                ? a > Number(h.getAttribute("data-hc-time"))
                  ? (a = void 0)
                  : a < f && (a = f)
                : k &&
                  w(e) &&
                  (a < Number(k.getAttribute("data-hc-time"))
                    ? (a = void 0)
                    : a > e && (a = e)),
              "undefined" !== typeof a &&
                b.setExtremes(p ? a : b.min, p ? b.max : a, void 0, void 0, {
                  trigger: "rangeSelectorInput",
                }));
          }
          var d = this.chart,
            f = this.div,
            h = this.inputGroup,
            m = this,
            g = d.renderer.style || {},
            u = d.renderer,
            y = d.options.rangeSelector,
            p = "min" === c,
            l = k.lang[p ? "rangeSelectorFrom" : "rangeSelectorTo"];
          l = u
            .label(l, 0)
            .addClass("highcharts-range-label")
            .attr({ padding: l ? 2 : 0 })
            .add(h);
          u = u
            .label("", 0)
            .addClass("highcharts-range-input")
            .attr({
              padding: 2,
              width: y.inputBoxWidth,
              height: y.inputBoxHeight,
              "text-align": "center",
            })
            .on("click", function () {
              m.showInput(c);
              m[c + "Input"].focus();
            });
          d.styledMode ||
            u.attr({ stroke: y.inputBoxBorderColor, "stroke-width": 1 });
          u.add(h);
          var x = e(
            "input",
            { name: c, className: "highcharts-range-selector" },
            void 0,
            f
          );
          x.setAttribute("type", q(y.inputDateFormat || "%b %e, %Y"));
          d.styledMode ||
            (l.css(v(g, y.labelStyle)),
            u.css(v({ color: t.neutralColor80 }, g, y.inputStyle)),
            a(
              x,
              z(
                {
                  position: "absolute",
                  border: 0,
                  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  textAlign: "center",
                  fontSize: g.fontSize,
                  fontFamily: g.fontFamily,
                  top: "-9999em",
                },
                y.inputStyle
              )
            ));
          x.onfocus = function () {
            m.showInput(c);
          };
          x.onblur = function () {
            x === n.doc.activeElement && b();
            m.hideInput(c);
            m.setInputValue(c);
            x.blur();
          };
          var A = !1;
          x.onchange = function () {
            A || (b(), m.hideInput(c), x.blur());
          };
          x.onkeypress = function (a) {
            13 === a.keyCode && b();
          };
          x.onkeydown = function (a) {
            A = !0;
            (38 !== a.keyCode && 40 !== a.keyCode) || b();
          };
          x.onkeyup = function () {
            A = !1;
          };
          return { dateBox: u, input: x, label: l };
        };
        f.prototype.getPosition = function () {
          var a = this.chart,
            c = a.options.rangeSelector;
          a = "top" === c.verticalAlign ? a.plotTop - a.axisOffset[0] : 0;
          return {
            buttonTop: a + c.buttonPosition.y,
            inputTop: a + c.inputPosition.y - 10,
          };
        };
        f.prototype.getYTDExtremes = function (a, c, b) {
          var d = this.chart.time,
            e = new d.Date(a),
            f = d.get("FullYear", e);
          b = b ? d.Date.UTC(f, 0, 1) : +new d.Date(f, 0, 1);
          c = Math.max(c, b);
          e = e.getTime();
          return { max: Math.min(a || e, e), min: c };
        };
        f.prototype.render = function (a, b) {
          var d = this.chart,
            f = d.renderer,
            h = d.container,
            m = d.options,
            k = m.rangeSelector,
            g = B(m.chart.style && m.chart.style.zIndex, 0) + 1;
          m = k.inputEnabled;
          if (!1 !== k.enabled) {
            this.rendered ||
              ((this.group = f
                .g("range-selector-group")
                .attr({ zIndex: 7 })
                .add()),
              (this.div = e("div", void 0, {
                position: "relative",
                height: 0,
                zIndex: g,
              })),
              this.buttonOptions.length && this.renderButtons(),
              h.parentNode && h.parentNode.insertBefore(this.div, h),
              m &&
                ((this.inputGroup = f.g("input-group").add(this.group)),
                (f = this.drawInput("min")),
                (this.minDateBox = f.dateBox),
                (this.minLabel = f.label),
                (this.minInput = f.input),
                (f = this.drawInput("max")),
                (this.maxDateBox = f.dateBox),
                (this.maxLabel = f.label),
                (this.maxInput = f.input)));
            if (
              m &&
              (this.setInputValue("min", a),
              this.setInputValue("max", b),
              (a =
                (d.scroller && d.scroller.getUnionExtremes()) ||
                d.xAxis[0] ||
                {}),
              c(a.dataMin) &&
                c(a.dataMax) &&
                ((d = d.xAxis[0].minRange || 0),
                this.setInputExtremes(
                  "min",
                  a.dataMin,
                  Math.min(a.dataMax, this.getInputValue("max")) - d
                ),
                this.setInputExtremes(
                  "max",
                  Math.max(a.dataMin, this.getInputValue("min")) + d,
                  a.dataMax
                )),
              this.inputGroup)
            ) {
              var u = 0;
              [
                this.minLabel,
                this.minDateBox,
                this.maxLabel,
                this.maxDateBox,
              ].forEach(function (a) {
                if (a) {
                  var c = a.getBBox().width;
                  c && (a.attr({ x: u }), (u += c + k.inputSpacing));
                }
              });
            }
            this.alignElements();
            this.rendered = !0;
          }
        };
        f.prototype.renderButtons = function () {
          var a = this,
            c = this.buttons,
            b = this.options,
            d = k.lang,
            f = this.chart.renderer,
            h = v(b.buttonTheme),
            g = h && h.states,
            u = h.width || 28;
          delete h.width;
          delete h.states;
          this.buttonGroup = f.g("range-selector-buttons").add(this.group);
          var y = (this.dropdown = e(
            "select",
            void 0,
            {
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              border: 0,
              top: "-9999em",
              cursor: "pointer",
              opacity: 0.0001,
            },
            this.div
          ));
          p(y, "touchstart", function () {
            y.style.fontSize = "16px";
          });
          [
            [n.isMS ? "mouseover" : "mouseenter"],
            [n.isMS ? "mouseout" : "mouseleave"],
            ["change", "click"],
          ].forEach(function (b) {
            var d = b[0],
              e = b[1];
            p(y, d, function () {
              var b = c[a.currentButtonIndex()];
              b && D(b.element, e || d);
            });
          });
          this.zoomText = f
            .text(d.rangeSelectorZoom, 0, 15)
            .add(this.buttonGroup);
          this.chart.styledMode ||
            (this.zoomText.css(b.labelStyle),
            (h["stroke-width"] = B(h["stroke-width"], 0)));
          e(
            "option",
            { textContent: this.zoomText.textStr, disabled: !0 },
            void 0,
            y
          );
          this.buttonOptions.forEach(function (b, d) {
            e("option", { textContent: b.title || b.text }, void 0, y);
            c[d] = f
              .button(
                b.text,
                0,
                0,
                function (c) {
                  var e = b.events && b.events.click,
                    f;
                  e && (f = e.call(b, c));
                  !1 !== f && a.clickButton(d);
                  a.isActive = !0;
                },
                h,
                g && g.hover,
                g && g.select,
                g && g.disabled
              )
              .attr({ "text-align": "center", width: u })
              .add(a.buttonGroup);
            b.title && c[d].attr("title", b.title);
          });
        };
        f.prototype.alignElements = function () {
          var a = this,
            c = this.buttonGroup,
            b = this.buttons,
            d = this.chart,
            e = this.group,
            f = this.inputGroup,
            h = this.options,
            k = this.zoomText,
            g = d.options,
            u =
              g.exporting &&
              !1 !== g.exporting.enabled &&
              g.navigation &&
              g.navigation.buttonOptions;
          g = h.buttonPosition;
          var y = h.inputPosition,
            p = h.verticalAlign,
            x = function (c, b) {
              return u &&
                a.titleCollision(d) &&
                "top" === p &&
                "right" === b.align &&
                b.y - c.getBBox().height - 12 <
                  (u.y || 0) + (u.height || 0) + d.spacing[0]
                ? -40
                : 0;
            },
            l = d.plotLeft;
          if (e && g && y) {
            var q = g.x - d.spacing[3];
            if (c) {
              this.positionButtons();
              if (!this.initialButtonGroupWidth) {
                var A = 0;
                k && (A += k.getBBox().width + 5);
                b.forEach(function (a, c) {
                  A += a.width;
                  c !== b.length - 1 && (A += h.buttonSpacing);
                });
                this.initialButtonGroupWidth = A;
              }
              l -= d.spacing[3];
              this.updateButtonStates();
              k = x(c, g);
              this.alignButtonGroup(k);
              e.placed = c.placed = d.hasLoaded;
            }
            c = 0;
            f &&
              ((c = x(f, y)),
              "left" === y.align
                ? (q = l)
                : "right" === y.align && (q = -Math.max(d.axisOffset[1], -c)),
              f.align(
                {
                  y: y.y,
                  width: f.getBBox().width,
                  align: y.align,
                  x: y.x + q - 2,
                },
                !0,
                d.spacingBox
              ),
              (f.placed = d.hasLoaded));
            this.handleCollision(c);
            e.align({ verticalAlign: p }, !0, d.spacingBox);
            f = e.alignAttr.translateY;
            c = e.getBBox().height + 20;
            x = 0;
            "bottom" === p &&
              ((x =
                (x = d.legend && d.legend.options) &&
                "bottom" === x.verticalAlign &&
                x.enabled &&
                !x.floating
                  ? d.legend.legendHeight + B(x.margin, 10)
                  : 0),
              (c = c + x - 20),
              (x =
                f -
                c -
                (h.floating ? 0 : h.y) -
                (d.titleOffset ? d.titleOffset[2] : 0) -
                10));
            if ("top" === p)
              h.floating && (x = 0),
                d.titleOffset && d.titleOffset[0] && (x = d.titleOffset[0]),
                (x += d.margin[0] - d.spacing[0] || 0);
            else if ("middle" === p)
              if (y.y === g.y) x = f;
              else if (y.y || g.y)
                x = 0 > y.y || 0 > g.y ? x - Math.min(y.y, g.y) : f - c;
            e.translate(h.x, h.y + Math.floor(x));
            g = this.minInput;
            y = this.maxInput;
            f = this.dropdown;
            h.inputEnabled &&
              g &&
              y &&
              ((g.style.marginTop = e.translateY + "px"),
              (y.style.marginTop = e.translateY + "px"));
            f && (f.style.marginTop = e.translateY + "px");
          }
        };
        f.prototype.alignButtonGroup = function (a, c) {
          var b = this.chart,
            d = this.buttonGroup,
            e = this.options.buttonPosition,
            f = b.plotLeft - b.spacing[3],
            h = e.x - b.spacing[3];
          "right" === e.align
            ? (h += a - f)
            : "center" === e.align && (h -= f / 2);
          d &&
            d.align(
              {
                y: e.y,
                width: B(c, this.initialButtonGroupWidth),
                align: e.align,
                x: h,
              },
              !0,
              b.spacingBox
            );
        };
        f.prototype.positionButtons = function () {
          var a = this.buttons,
            c = this.chart,
            b = this.options,
            d = this.zoomText,
            e = c.hasLoaded ? "animate" : "attr",
            f = b.buttonPosition,
            h = c.plotLeft,
            k = h;
          d &&
            "hidden" !== d.visibility &&
            (d[e]({ x: B(h + f.x, h) }), (k += f.x + d.getBBox().width + 5));
          this.buttonOptions.forEach(function (c, d) {
            if ("hidden" !== a[d].visibility)
              a[d][e]({ x: k }), (k += a[d].width + b.buttonSpacing);
            else a[d][e]({ x: h });
          });
        };
        f.prototype.handleCollision = function (a) {
          var c = this,
            b = this.chart,
            d = this.buttonGroup,
            e = this.inputGroup,
            f = this.options,
            h = f.buttonPosition,
            k = f.dropdown,
            g = f.inputPosition;
          f = function () {
            var a = 0;
            c.buttons.forEach(function (c) {
              c = c.getBBox();
              c.width > a && (a = c.width);
            });
            return a;
          };
          var m = function (c) {
              if (e && d) {
                var b =
                    e.alignAttr.translateX +
                    e.alignOptions.x -
                    a +
                    e.getBBox().x +
                    2,
                  f = e.alignOptions.width,
                  k = d.alignAttr.translateX + d.getBBox().x;
                return k + c > b && b + f > k && h.y < g.y + e.getBBox().height;
              }
              return !1;
            },
            u = function () {
              e &&
                d &&
                e.attr({
                  translateX:
                    e.alignAttr.translateX + (b.axisOffset[1] >= -a ? 0 : -a),
                  translateY: e.alignAttr.translateY + d.getBBox().height + 10,
                });
            };
          if (d) {
            if ("always" === k) {
              this.collapseButtons(a);
              m(f()) && u();
              return;
            }
            "never" === k && this.expandButtons();
          }
          e && d
            ? g.align === h.align || m(this.initialButtonGroupWidth + 20)
              ? "responsive" === k
                ? (this.collapseButtons(a), m(f()) && u())
                : u()
              : "responsive" === k && this.expandButtons()
            : d &&
              "responsive" === k &&
              (this.initialButtonGroupWidth > b.plotWidth
                ? this.collapseButtons(a)
                : this.expandButtons());
        };
        f.prototype.collapseButtons = function (a) {
          var c = this.buttons,
            b = this.buttonOptions,
            d = this.dropdown,
            e = this.options,
            f = this.zoomText,
            h = function (a) {
              return {
                text: a ? a + " \u25be" : "\u25be",
                width: "auto",
                paddingLeft: 8,
                paddingRight: 8,
              };
            };
          f && f.hide();
          var k = !1;
          b.forEach(function (a, b) {
            b = c[b];
            2 !== b.state ? b.hide() : (b.show(), b.attr(h(a.text)), (k = !0));
          });
          k ||
            (d && (d.selectedIndex = 0),
            c[0].show(),
            c[0].attr(h(this.zoomText && this.zoomText.textStr)));
          b = e.buttonPosition.align;
          this.positionButtons();
          ("right" !== b && "center" !== b) ||
            this.alignButtonGroup(
              a,
              c[this.currentButtonIndex()].getBBox().width
            );
          this.showDropdown();
        };
        f.prototype.expandButtons = function () {
          var a = this.buttons,
            c = this.buttonOptions,
            b = this.options,
            d = this.zoomText;
          this.hideDropdown();
          d && d.show();
          c.forEach(function (c, d) {
            d = a[d];
            d.show();
            d.attr({
              text: c.text,
              width: b.buttonTheme.width || 28,
              paddingLeft: "unset",
              paddingRight: "unset",
            });
            2 > d.state && d.setState(0);
          });
          this.positionButtons();
        };
        f.prototype.currentButtonIndex = function () {
          var a = this.dropdown;
          return a && 0 < a.selectedIndex ? a.selectedIndex - 1 : 0;
        };
        f.prototype.showDropdown = function () {
          var c = this.buttonGroup,
            b = this.buttons,
            d = this.chart,
            e = this.dropdown;
          if (c && e) {
            var f = c.translateX;
            c = c.translateY;
            b = b[this.currentButtonIndex()].getBBox();
            a(e, {
              left: d.plotLeft + f + "px",
              top: c + 0.5 + "px",
              width: b.width + "px",
              height: b.height + "px",
            });
            this.hasVisibleDropdown = !0;
          }
        };
        f.prototype.hideDropdown = function () {
          var c = this.dropdown;
          c &&
            (a(c, { top: "-9999em", width: "1px", height: "1px" }),
            (this.hasVisibleDropdown = !1));
        };
        f.prototype.getHeight = function () {
          var a = this.options,
            c = this.group,
            b = a.y,
            d = a.buttonPosition.y,
            e = a.inputPosition.y;
          if (a.height) return a.height;
          this.alignElements();
          a = c ? c.getBBox(!0).height + 13 + b : 0;
          c = Math.min(e, d);
          if ((0 > e && 0 > d) || (0 < e && 0 < d)) a += Math.abs(c);
          return a;
        };
        f.prototype.titleCollision = function (a) {
          return !(a.options.title.text || a.options.subtitle.text);
        };
        f.prototype.update = function (a) {
          var c = this.chart;
          v(!0, c.options.rangeSelector, a);
          this.destroy();
          this.init(c);
          this.render();
        };
        f.prototype.destroy = function () {
          var a = this,
            c = a.minInput,
            b = a.maxInput;
          a.eventsToUnbind &&
            (a.eventsToUnbind.forEach(function (a) {
              return a();
            }),
            (a.eventsToUnbind = void 0));
          d(a.buttons);
          c && (c.onfocus = c.onblur = c.onchange = null);
          b && (b.onfocus = b.onblur = b.onchange = null);
          E(
            a,
            function (c, b) {
              c &&
                "chart" !== b &&
                (c instanceof r
                  ? c.destroy()
                  : c instanceof window.HTMLElement && h(c));
              c !== f.prototype[b] && (a[b] = null);
            },
            this
          );
        };
        return f;
      })();
      x.prototype.defaultButtons = [
        { type: "month", count: 1, text: "1m", title: "View 1 month" },
        { type: "month", count: 3, text: "3m", title: "View 3 months" },
        { type: "month", count: 6, text: "6m", title: "View 6 months" },
        { type: "ytd", text: "YTD", title: "View year to date" },
        { type: "year", count: 1, text: "1y", title: "View 1 year" },
        { type: "all", text: "All", title: "View all" },
      ];
      x.prototype.inputTypeFormats = {
        "datetime-local": "%Y-%m-%dT%H:%M:%S",
        date: "%Y-%m-%d",
        time: "%H:%M:%S",
      };
      b.prototype.minFromRange = function () {
        var a = this.range,
          c = a.type,
          b = this.max,
          d = this.chart.time,
          e = function (a, b) {
            var e = "year" === c ? "FullYear" : "Month",
              f = new d.Date(a),
              h = d.get(e, f);
            d.set(e, f, h + b);
            h === d.get(e, f) && d.set("Date", f, 0);
            return f.getTime() - a;
          };
        if (w(a)) {
          var f = b - a;
          var h = a;
        } else
          (f = b + e(b, -a.count)),
            this.chart && (this.chart.fixedRange = b - f);
        var k = B(this.dataMin, Number.MIN_VALUE);
        w(f) || (f = k);
        f <= k &&
          ((f = k),
          "undefined" === typeof h && (h = e(f, a.count)),
          (this.newMax = Math.min(f + h, this.dataMax)));
        w(b) || (f = void 0);
        return f;
      };
      if (!n.RangeSelector) {
        var J = [],
          K = function (a) {
            function c() {
              d &&
                ((b = a.xAxis[0].getExtremes()),
                (e = a.legend),
                (h = d && d.options.verticalAlign),
                w(b.min) && d.render(b.min, b.max),
                e.display &&
                  "top" === h &&
                  h === e.options.verticalAlign &&
                  ((f = v(a.spacingBox)),
                  (f.y =
                    "vertical" === e.options.layout
                      ? a.plotTop
                      : f.y + d.getHeight()),
                  (e.group.placed = !1),
                  e.align(f)));
            }
            var b,
              d = a.rangeSelector,
              e,
              f,
              h;
            d &&
              (H(J, function (c) {
                return c[0] === a;
              }) ||
                J.push([
                  a,
                  [
                    p(a.xAxis[0], "afterSetExtremes", function (a) {
                      d && d.render(a.min, a.max);
                    }),
                    p(a, "redraw", c),
                  ],
                ]),
              c());
          };
        p(g, "afterGetContainer", function () {
          this.options.rangeSelector &&
            this.options.rangeSelector.enabled &&
            (this.rangeSelector = new x(this));
        });
        p(g, "beforeRender", function () {
          var a = this.axes,
            c = this.rangeSelector;
          c &&
            (w(c.deferredYTDClick) &&
              (c.clickButton(c.deferredYTDClick), delete c.deferredYTDClick),
            a.forEach(function (a) {
              a.updateNames();
              a.setScale();
            }),
            this.getAxisMargins(),
            c.render(),
            (a = c.options.verticalAlign),
            c.options.floating ||
              ("bottom" === a
                ? (this.extraBottomMargin = !0)
                : "middle" !== a && (this.extraTopMargin = !0)));
        });
        p(g, "update", function (a) {
          var b = a.options.rangeSelector;
          a = this.rangeSelector;
          var d = this.extraBottomMargin,
            e = this.extraTopMargin;
          b &&
            b.enabled &&
            !c(a) &&
            this.options.rangeSelector &&
            ((this.options.rangeSelector.enabled = !0),
            (this.rangeSelector = a = new x(this)));
          this.extraTopMargin = this.extraBottomMargin = !1;
          a &&
            (K(this),
            (b =
              (b && b.verticalAlign) || (a.options && a.options.verticalAlign)),
            a.options.floating ||
              ("bottom" === b
                ? (this.extraBottomMargin = !0)
                : "middle" !== b && (this.extraTopMargin = !0)),
            this.extraBottomMargin !== d || this.extraTopMargin !== e) &&
            (this.isDirtyBox = !0);
        });
        p(g, "render", function () {
          var a = this.rangeSelector;
          a &&
            !a.options.floating &&
            (a.render(),
            (a = a.options.verticalAlign),
            "bottom" === a
              ? (this.extraBottomMargin = !0)
              : "middle" !== a && (this.extraTopMargin = !0));
        });
        p(g, "getMargins", function () {
          var a = this.rangeSelector;
          a &&
            ((a = a.getHeight()),
            this.extraTopMargin && (this.plotTop += a),
            this.extraBottomMargin && (this.marginBottom += a));
        });
        g.prototype.callbacks.push(K);
        p(g, "destroy", function () {
          for (var a = 0; a < J.length; a++) {
            var c = J[a];
            if (c[0] === this) {
              c[1].forEach(function (a) {
                return a();
              });
              J.splice(a, 1);
              break;
            }
          }
        });
        n.RangeSelector = x;
      }
      return n.RangeSelector;
    }
  );
  v(
    b,
    "Accessibility/Components/RangeSelectorComponent.js",
    [
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/Announcer.js"],
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Core/Utilities.js"],
      b["Extensions/RangeSelector.js"],
    ],
    function (b, g, n, l, t, r, f, q) {
      var k = g.unhideChartElementFromAT,
        p = g.getAxisRangeDescription,
        e = t.setElAttrs,
        a = f.addEvent;
      g = f.extend;
      l.Chart.prototype.highlightRangeSelectorButton = function (a) {
        var c = (this.rangeSelector && this.rangeSelector.buttons) || [],
          b = this.highlightedRangeSelectorItemIx,
          e = this.rangeSelector && this.rangeSelector.selected;
        "undefined" !== typeof b &&
          c[b] &&
          b !== e &&
          c[b].setState(this.oldRangeSelectorItemState || 0);
        this.highlightedRangeSelectorItemIx = a;
        return c[a]
          ? (this.setFocusToElement(c[a].box, c[a].element),
            a !== e &&
              ((this.oldRangeSelectorItemState = c[a].state), c[a].setState(1)),
            !0)
          : !1;
      };
      a(q, "afterBtnClick", function () {
        if (
          this.chart.accessibility &&
          this.chart.accessibility.components.rangeSelector
        )
          return this.chart.accessibility.components.rangeSelector.onAfterBtnClick();
      });
      l = function () {};
      l.prototype = new b();
      g(l.prototype, {
        init: function () {
          this.announcer = new n(this.chart, "polite");
        },
        onChartUpdate: function () {
          var a = this.chart,
            b = this,
            e = a.rangeSelector;
          e &&
            (this.updateSelectorVisibility(),
            this.setDropdownAttrs(),
            e.buttons &&
              e.buttons.length &&
              e.buttons.forEach(function (a) {
                b.setRangeButtonAttrs(a);
              }),
            e.maxInput &&
              e.minInput &&
              ["minInput", "maxInput"].forEach(function (c, d) {
                if ((c = e[c]))
                  k(a, c),
                    b.setRangeInputAttrs(
                      c,
                      "accessibility.rangeSelector." +
                        (d ? "max" : "min") +
                        "InputLabel"
                    );
              }));
        },
        updateSelectorVisibility: function () {
          var a = this.chart,
            b = a.rangeSelector,
            e = b && b.dropdown,
            f = (b && b.buttons) || [];
          b && b.hasVisibleDropdown && e
            ? (k(a, e),
              f.forEach(function (a) {
                return a.element.setAttribute("aria-hidden", !0);
              }))
            : (e && e.setAttribute("aria-hidden", !0),
              f.forEach(function (c) {
                return k(a, c.element);
              }));
        },
        setDropdownAttrs: function () {
          var a = this.chart,
            b = a.rangeSelector && a.rangeSelector.dropdown;
          b &&
            ((a = a.langFormat("accessibility.rangeSelector.dropdownLabel", {
              rangeTitle: a.options.lang.rangeSelectorZoom,
            })),
            b.setAttribute("aria-label", a),
            b.setAttribute("tabindex", -1));
        },
        setRangeButtonAttrs: function (a) {
          e(a.element, { tabindex: -1, role: "button" });
        },
        setRangeInputAttrs: function (a, b) {
          var c = this.chart;
          e(a, { tabindex: -1, "aria-label": c.langFormat(b, { chart: c }) });
        },
        onButtonNavKbdArrowKey: function (a, b) {
          var c = a.response,
            d = this.keyCodes,
            e = this.chart,
            f = e.options.accessibility.keyboardNavigation.wrapAround;
          b = b === d.left || b === d.up ? -1 : 1;
          return e.highlightRangeSelectorButton(
            e.highlightedRangeSelectorItemIx + b
          )
            ? c.success
            : f
            ? (a.init(b), c.success)
            : c[0 < b ? "next" : "prev"];
        },
        onButtonNavKbdClick: function (a) {
          a = a.response;
          var c = this.chart;
          3 !== c.oldRangeSelectorItemState &&
            this.fakeClickEvent(
              c.rangeSelector.buttons[c.highlightedRangeSelectorItemIx].element
            );
          return a.success;
        },
        onAfterBtnClick: function () {
          var a = this.chart,
            b = p(a.xAxis[0]);
          (a = a.langFormat(
            "accessibility.rangeSelector.clickButtonAnnouncement",
            { chart: a, axisRangeDescription: b }
          )) && this.announcer.announce(a);
        },
        onInputKbdMove: function (a) {
          var c = this.chart,
            b = c.rangeSelector,
            e = (c.highlightedInputRangeIx =
              (c.highlightedInputRangeIx || 0) + a);
          1 < e || 0 > e
            ? c.accessibility &&
              (c.accessibility.keyboardNavigation.tabindexContainer.focus(),
              c.accessibility.keyboardNavigation[0 > a ? "prev" : "next"]())
            : b &&
              ((a = b[e ? "maxDateBox" : "minDateBox"]),
              (b = b[e ? "maxInput" : "minInput"]),
              a && b && c.setFocusToElement(a, b));
        },
        onInputNavInit: function (c) {
          var b = this,
            e = this,
            f = this.chart,
            k = 0 < c ? 0 : 1,
            g = f.rangeSelector,
            p = g && g[k ? "maxDateBox" : "minDateBox"];
          c = g && g.minInput;
          g = g && g.maxInput;
          f.highlightedInputRangeIx = k;
          if (p && c && g) {
            f.setFocusToElement(p, k ? g : c);
            this.removeInputKeydownHandler && this.removeInputKeydownHandler();
            f = function (a) {
              (a.which || a.keyCode) === b.keyCodes.tab &&
                (a.preventDefault(),
                a.stopPropagation(),
                e.onInputKbdMove(a.shiftKey ? -1 : 1));
            };
            var l = a(c, "keydown", f),
              q = a(g, "keydown", f);
            this.removeInputKeydownHandler = function () {
              l();
              q();
            };
          }
        },
        onInputNavTerminate: function () {
          var a = this.chart.rangeSelector || {};
          a.maxInput && a.hideInput("max");
          a.minInput && a.hideInput("min");
          this.removeInputKeydownHandler &&
            (this.removeInputKeydownHandler(),
            delete this.removeInputKeydownHandler);
        },
        initDropdownNav: function () {
          var c = this,
            b = this.chart,
            e = b.rangeSelector,
            f = e && e.dropdown;
          e &&
            f &&
            (b.setFocusToElement(e.buttonGroup, f),
            this.removeDropdownKeydownHandler &&
              this.removeDropdownKeydownHandler(),
            (this.removeDropdownKeydownHandler = a(f, "keydown", function (a) {
              (a.which || a.keyCode) === c.keyCodes.tab &&
                (a.preventDefault(),
                a.stopPropagation(),
                b.accessibility &&
                  (b.accessibility.keyboardNavigation.tabindexContainer.focus(),
                  b.accessibility.keyboardNavigation[
                    a.shiftKey ? "prev" : "next"
                  ]()));
            })));
        },
        getRangeSelectorButtonNavigation: function () {
          var a = this.chart,
            b = this.keyCodes,
            e = this;
          return new r(a, {
            keyCodeMap: [
              [
                [b.left, b.right, b.up, b.down],
                function (a) {
                  return e.onButtonNavKbdArrowKey(this, a);
                },
              ],
              [
                [b.enter, b.space],
                function () {
                  return e.onButtonNavKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return !!(
                a.rangeSelector &&
                a.rangeSelector.buttons &&
                a.rangeSelector.buttons.length
              );
            },
            init: function (b) {
              var c = a.rangeSelector;
              c && c.hasVisibleDropdown
                ? e.initDropdownNav()
                : c &&
                  ((c = c.buttons.length - 1),
                  a.highlightRangeSelectorButton(0 < b ? 0 : c));
            },
            terminate: function () {
              e.removeDropdownKeydownHandler &&
                (e.removeDropdownKeydownHandler(),
                delete e.removeDropdownKeydownHandler);
            },
          });
        },
        getRangeSelectorInputNavigation: function () {
          var a = this.chart,
            b = this;
          return new r(a, {
            keyCodeMap: [],
            validate: function () {
              return !!(
                a.rangeSelector &&
                a.rangeSelector.inputGroup &&
                "hidden" !==
                  a.rangeSelector.inputGroup.element.getAttribute(
                    "visibility"
                  ) &&
                !1 !== a.options.rangeSelector.inputEnabled &&
                a.rangeSelector.minInput &&
                a.rangeSelector.maxInput
              );
            },
            init: function (a) {
              b.onInputNavInit(a);
            },
            terminate: function () {
              b.onInputNavTerminate();
            },
          });
        },
        getKeyboardNavigation: function () {
          return [
            this.getRangeSelectorButtonNavigation(),
            this.getRangeSelectorInputNavigation(),
          ];
        },
        destroy: function () {
          this.removeDropdownKeydownHandler &&
            this.removeDropdownKeydownHandler();
          this.removeInputKeydownHandler && this.removeInputKeydownHandler();
          this.announcer && this.announcer.destroy();
        },
      });
      return l;
    }
  );
  v(
    b,
    "Accessibility/Components/InfoRegionsComponent.js",
    [
      b["Core/Renderer/HTML/AST.js"],
      b["Core/FormatUtilities.js"],
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Utils/Announcer.js"],
      b["Accessibility/Components/AnnotationsA11y.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, g, n, l, t, r, f, q, k) {
      var p = g.format,
        e = n.doc;
      g = l.extend;
      var a = l.pick,
        c = f.getAnnotationsInfoHTML,
        d = q.getAxisDescription,
        h = q.getAxisRangeDescription,
        w = q.getChartTitle,
        v = q.unhideChartElementFromAT,
        D = k.addClass,
        M = k.getElement,
        N = k.getHeadingTagNameForElement,
        E = k.setElAttrs,
        F = k.stripHTMLTagsFromString,
        B = k.visuallyHideElement;
      n.Chart.prototype.getTypeDescription = function (a) {
        var b = a[0],
          c = (this.series && this.series[0]) || {};
        c = {
          numSeries: this.series.length,
          numPoints: c.points && c.points.length,
          chart: this,
          mapTitle: c.mapTitle,
        };
        if (!b)
          return this.langFormat("accessibility.chartTypes.emptyChart", c);
        if ("map" === b)
          return c.mapTitle
            ? this.langFormat("accessibility.chartTypes.mapTypeDescription", c)
            : this.langFormat("accessibility.chartTypes.unknownMap", c);
        if (1 < this.types.length)
          return this.langFormat(
            "accessibility.chartTypes.combinationChart",
            c
          );
        a = a[0];
        b = this.langFormat("accessibility.seriesTypeDescriptions." + a, c);
        var d = this.series && 2 > this.series.length ? "Single" : "Multiple";
        return (
          (this.langFormat("accessibility.chartTypes." + a + d, c) ||
            this.langFormat("accessibility.chartTypes.default" + d, c)) +
          (b ? " " + b : "")
        );
      };
      l = function () {};
      l.prototype = new t();
      g(l.prototype, {
        init: function () {
          var a = this.chart,
            b = this;
          this.initRegionsDefinitions();
          this.addEvent(a, "aftergetTableAST", function (a) {
            b.onDataTableCreated(a);
          });
          this.addEvent(a, "afterViewData", function (a) {
            b.dataTableDiv = a;
            setTimeout(function () {
              b.focusDataTable();
            }, 300);
          });
          this.announcer = new r(a, "assertive");
        },
        initRegionsDefinitions: function () {
          var a = this;
          this.screenReaderSections = {
            before: {
              element: null,
              buildContent: function (b) {
                var c =
                  b.options.accessibility.screenReaderSection
                    .beforeChartFormatter;
                return c ? c(b) : a.defaultBeforeChartFormatter(b);
              },
              insertIntoDOM: function (a, b) {
                b.renderTo.insertBefore(a, b.renderTo.firstChild);
              },
              afterInserted: function () {
                "undefined" !== typeof a.sonifyButtonId &&
                  a.initSonifyButton(a.sonifyButtonId);
                "undefined" !== typeof a.dataTableButtonId &&
                  a.initDataTableButton(a.dataTableButtonId);
              },
            },
            after: {
              element: null,
              buildContent: function (b) {
                var c =
                  b.options.accessibility.screenReaderSection
                    .afterChartFormatter;
                return c ? c(b) : a.defaultAfterChartFormatter();
              },
              insertIntoDOM: function (a, b) {
                b.renderTo.insertBefore(a, b.container.nextSibling);
              },
            },
          };
        },
        onChartRender: function () {
          var a = this;
          this.linkedDescriptionElement = this.getLinkedDescriptionElement();
          this.setLinkedDescriptionAttrs();
          Object.keys(this.screenReaderSections).forEach(function (b) {
            a.updateScreenReaderSection(b);
          });
        },
        getLinkedDescriptionElement: function () {
          var a = this.chart.options.accessibility.linkedDescription;
          if (a) {
            if ("string" !== typeof a) return a;
            a = p(a, this.chart);
            a = e.querySelectorAll(a);
            if (1 === a.length) return a[0];
          }
        },
        setLinkedDescriptionAttrs: function () {
          var a = this.linkedDescriptionElement;
          a &&
            (a.setAttribute("aria-hidden", "true"),
            D(a, "highcharts-linked-description"));
        },
        updateScreenReaderSection: function (a) {
          var c = this.chart,
            d = this.screenReaderSections[a],
            e = d.buildContent(c),
            f = (d.element = d.element || this.createElement("div")),
            h = f.firstChild || this.createElement("div");
          this.setScreenReaderSectionAttribs(f, a);
          b.setElementHTML(h, e);
          f.appendChild(h);
          d.insertIntoDOM(f, c);
          B(h);
          v(c, h);
          d.afterInserted && d.afterInserted();
        },
        setScreenReaderSectionAttribs: function (a, b) {
          var c = this.chart,
            d = c.langFormat(
              "accessibility.screenReaderSection." + b + "RegionLabel",
              { chart: c }
            );
          E(a, {
            id: "highcharts-screen-reader-region-" + b + "-" + c.index,
            "aria-label": d,
          });
          a.style.position = "relative";
          "all" === c.options.accessibility.landmarkVerbosity &&
            d &&
            a.setAttribute("role", "region");
        },
        defaultBeforeChartFormatter: function () {
          var a = this.chart,
            b = a.options.accessibility.screenReaderSection.beforeChartFormat,
            d = this.getAxesDescription(),
            e =
              a.sonify &&
              a.options.sonification &&
              a.options.sonification.enabled,
            f = "highcharts-a11y-sonify-data-btn-" + a.index,
            h = "hc-linkto-highcharts-data-table-" + a.index,
            k = c(a),
            g = a.langFormat(
              "accessibility.screenReaderSection.annotations.heading",
              { chart: a }
            );
          d = {
            headingTagName: N(a.renderTo),
            chartTitle: w(a),
            typeDescription: this.getTypeDescriptionText(),
            chartSubtitle: this.getSubtitleText(),
            chartLongdesc: this.getLongdescText(),
            xAxisDescription: d.xAxis,
            yAxisDescription: d.yAxis,
            playAsSoundButton: e ? this.getSonifyButtonText(f) : "",
            viewTableButton: a.getCSV ? this.getDataTableButtonText(h) : "",
            annotationsTitle: k ? g : "",
            annotationsList: k,
          };
          a = n.i18nFormat(b, d, a);
          this.dataTableButtonId = h;
          this.sonifyButtonId = f;
          return a.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, "");
        },
        defaultAfterChartFormatter: function () {
          var a = this.chart,
            b = a.options.accessibility.screenReaderSection.afterChartFormat,
            c = { endOfChartMarker: this.getEndOfChartMarkerText() };
          return n.i18nFormat(b, c, a).replace(/<(\w+)[^>]*?>\s*<\/\1>/g, "");
        },
        getLinkedDescription: function () {
          var a = this.linkedDescriptionElement;
          return F((a && a.innerHTML) || "");
        },
        getLongdescText: function () {
          var a = this.chart.options,
            b = a.caption;
          b = b && b.text;
          var c = this.getLinkedDescription();
          return a.accessibility.description || c || b || "";
        },
        getTypeDescriptionText: function () {
          var a = this.chart;
          return a.types
            ? a.options.accessibility.typeDescription ||
                a.getTypeDescription(a.types)
            : "";
        },
        getDataTableButtonText: function (a) {
          var b = this.chart;
          b = b.langFormat("accessibility.table.viewAsDataTableButtonText", {
            chart: b,
            chartTitle: w(b),
          });
          return '<button id="' + a + '">' + b + "</button>";
        },
        getSonifyButtonText: function (a) {
          var b = this.chart;
          if (b.options.sonification && !1 === b.options.sonification.enabled)
            return "";
          b = b.langFormat("accessibility.sonification.playAsSoundButtonText", {
            chart: b,
            chartTitle: w(b),
          });
          return '<button id="' + a + '">' + b + "</button>";
        },
        getSubtitleText: function () {
          var a = this.chart.options.subtitle;
          return F((a && a.text) || "");
        },
        getEndOfChartMarkerText: function () {
          var a = this.chart,
            b = a.langFormat(
              "accessibility.screenReaderSection.endOfChartMarker",
              { chart: a }
            );
          return (
            '<div id="highcharts-end-of-chart-marker-' +
            a.index +
            '">' +
            b +
            "</div>"
          );
        },
        onDataTableCreated: function (a) {
          var b = this.chart;
          if (b.options.accessibility.enabled) {
            this.viewDataTableButton &&
              this.viewDataTableButton.setAttribute("aria-expanded", "true");
            var c = a.tree.attributes || {};
            c.tabindex = -1;
            c.summary = b.langFormat("accessibility.table.tableSummary", {
              chart: b,
            });
            a.tree.attributes = c;
          }
        },
        focusDataTable: function () {
          var a = this.dataTableDiv;
          (a = a && a.getElementsByTagName("table")[0]) && a.focus && a.focus();
        },
        initSonifyButton: function (a) {
          var b = this,
            c = (this.sonifyButton = M(a)),
            d = this.chart,
            e = function (a) {
              c &&
                (c.setAttribute("aria-hidden", "true"),
                c.setAttribute("aria-label", ""));
              a.preventDefault();
              a.stopPropagation();
              a = d.langFormat(
                "accessibility.sonification.playAsSoundClickAnnouncement",
                { chart: d }
              );
              b.announcer.announce(a);
              setTimeout(function () {
                c &&
                  (c.removeAttribute("aria-hidden"),
                  c.removeAttribute("aria-label"));
                d.sonify && d.sonify();
              }, 1e3);
            };
          c &&
            d &&
            (E(c, { tabindex: -1 }),
            (c.onclick = function (a) {
              (
                (d.options.accessibility &&
                  d.options.accessibility.screenReaderSection
                    .onPlayAsSoundClick) ||
                e
              ).call(this, a, d);
            }));
        },
        initDataTableButton: function (a) {
          var b = (this.viewDataTableButton = M(a)),
            c = this.chart;
          a = a.replace("hc-linkto-", "");
          b &&
            (E(b, { tabindex: -1, "aria-expanded": !!M(a) }),
            (b.onclick =
              c.options.accessibility.screenReaderSection
                .onViewDataTableClick ||
              function () {
                c.viewData();
              }));
        },
        getAxesDescription: function () {
          var b = this.chart,
            c = function (c, d) {
              c = b[c];
              return (
                1 < c.length ||
                (c[0] &&
                  a(
                    c[0].options.accessibility &&
                      c[0].options.accessibility.enabled,
                    d
                  ))
              );
            },
            d = !!b.types && 0 > b.types.indexOf("map"),
            e = !!b.hasCartesianSeries,
            f = c("xAxis", !b.angular && e && d);
          c = c("yAxis", e && d);
          d = {};
          f && (d.xAxis = this.getAxisDescriptionText("xAxis"));
          c && (d.yAxis = this.getAxisDescriptionText("yAxis"));
          return d;
        },
        getAxisDescriptionText: function (a) {
          var b = this.chart,
            c = b[a];
          return b.langFormat(
            "accessibility.axis." +
              a +
              "Description" +
              (1 < c.length ? "Plural" : "Singular"),
            {
              chart: b,
              names: c.map(function (a) {
                return d(a);
              }),
              ranges: c.map(function (a) {
                return h(a);
              }),
              numAxes: c.length,
            }
          );
        },
        destroy: function () {
          this.announcer && this.announcer.destroy();
        },
      });
      return l;
    }
  );
  v(
    b,
    "Accessibility/Components/ContainerComponent.js",
    [
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n, l, t, r) {
      var f = n.unhideChartElementFromAT,
        q = n.getChartTitle,
        k = l.doc,
        p = t.stripHTMLTagsFromString;
      n = r.extend;
      l = function () {};
      l.prototype = new b();
      n(l.prototype, {
        onChartUpdate: function () {
          this.handleSVGTitleElement();
          this.setSVGContainerLabel();
          this.setGraphicContainerAttrs();
          this.setRenderToAttrs();
          this.makeCreditsAccessible();
        },
        handleSVGTitleElement: function () {
          var b = this.chart,
            a = "highcharts-title-" + b.index,
            c = p(
              b.langFormat("accessibility.svgContainerTitle", {
                chartTitle: q(b),
              })
            );
          if (c.length) {
            var d = (this.svgTitleElement =
              this.svgTitleElement ||
              k.createElementNS("http://www.w3.org/2000/svg", "title"));
            d.textContent = c;
            d.id = a;
            b.renderTo.insertBefore(d, b.renderTo.firstChild);
          }
        },
        setSVGContainerLabel: function () {
          var b = this.chart,
            a = b.langFormat("accessibility.svgContainerLabel", {
              chartTitle: q(b),
            });
          b.renderer.box &&
            a.length &&
            b.renderer.box.setAttribute("aria-label", a);
        },
        setGraphicContainerAttrs: function () {
          var b = this.chart,
            a = b.langFormat("accessibility.graphicContainerLabel", {
              chartTitle: q(b),
            });
          a.length && b.container.setAttribute("aria-label", a);
        },
        setRenderToAttrs: function () {
          var b = this.chart;
          "disabled" !== b.options.accessibility.landmarkVerbosity
            ? b.renderTo.setAttribute("role", "region")
            : b.renderTo.removeAttribute("role");
          b.renderTo.setAttribute(
            "aria-label",
            b.langFormat("accessibility.chartContainerLabel", {
              title: q(b),
              chart: b,
            })
          );
        },
        makeCreditsAccessible: function () {
          var b = this.chart,
            a = b.credits;
          a &&
            (a.textStr &&
              a.element.setAttribute(
                "aria-label",
                b.langFormat("accessibility.credits", {
                  creditsStr: p(a.textStr),
                })
              ),
            f(b, a.element));
        },
        getKeyboardNavigation: function () {
          var b = this.chart;
          return new g(b, {
            keyCodeMap: [],
            validate: function () {
              return !0;
            },
            init: function () {
              var a = b.accessibility;
              a && a.keyboardNavigation.tabindexContainer.focus();
            },
          });
        },
        destroy: function () {
          this.chart.renderTo.setAttribute("aria-hidden", !0);
        },
      });
      return l;
    }
  );
  v(
    b,
    "Accessibility/HighContrastMode.js",
    [b["Core/Globals.js"]],
    function (b) {
      var g = b.doc,
        n = b.isMS,
        l = b.win;
      return {
        isHighContrastModeActive: function () {
          var b = /(Edg)/.test(l.navigator.userAgent);
          if (l.matchMedia && b)
            return l.matchMedia("(-ms-high-contrast: active)").matches;
          if (n && l.getComputedStyle) {
            b = g.createElement("div");
            b.style.backgroundImage =
              "url(data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)";
            g.body.appendChild(b);
            var r = (b.currentStyle || l.getComputedStyle(b)).backgroundImage;
            g.body.removeChild(b);
            return "none" === r;
          }
          return !1;
        },
        setHighContrastTheme: function (b) {
          b.highContrastModeActive = !0;
          var g = b.options.accessibility.highContrastTheme;
          b.update(g, !1);
          b.series.forEach(function (b) {
            var f = g.plotOptions[b.type] || {};
            b.update({
              color: f.color || "windowText",
              colors: [f.color || "windowText"],
              borderColor: f.borderColor || "window",
            });
            b.points.forEach(function (b) {
              b.options &&
                b.options.color &&
                b.update(
                  {
                    color: f.color || "windowText",
                    borderColor: f.borderColor || "window",
                  },
                  !1
                );
            });
          });
          b.redraw();
        },
      };
    }
  );
  v(b, "Accessibility/HighContrastTheme.js", [], function () {
    return {
      chart: { backgroundColor: "window" },
      title: { style: { color: "windowText" } },
      subtitle: { style: { color: "windowText" } },
      colorAxis: { minColor: "windowText", maxColor: "windowText", stops: [] },
      colors: ["windowText"],
      xAxis: {
        gridLineColor: "windowText",
        labels: { style: { color: "windowText" } },
        lineColor: "windowText",
        minorGridLineColor: "windowText",
        tickColor: "windowText",
        title: { style: { color: "windowText" } },
      },
      yAxis: {
        gridLineColor: "windowText",
        labels: { style: { color: "windowText" } },
        lineColor: "windowText",
        minorGridLineColor: "windowText",
        tickColor: "windowText",
        title: { style: { color: "windowText" } },
      },
      tooltip: {
        backgroundColor: "window",
        borderColor: "windowText",
        style: { color: "windowText" },
      },
      plotOptions: {
        series: {
          lineColor: "windowText",
          fillColor: "window",
          borderColor: "windowText",
          edgeColor: "windowText",
          borderWidth: 1,
          dataLabels: {
            connectorColor: "windowText",
            color: "windowText",
            style: { color: "windowText", textOutline: "none" },
          },
          marker: { lineColor: "windowText", fillColor: "windowText" },
        },
        pie: {
          color: "window",
          colors: ["window"],
          borderColor: "windowText",
          borderWidth: 1,
        },
        boxplot: { fillColor: "window" },
        candlestick: { lineColor: "windowText", fillColor: "window" },
        errorbar: { fillColor: "window" },
      },
      legend: {
        backgroundColor: "window",
        itemStyle: { color: "windowText" },
        itemHoverStyle: { color: "windowText" },
        itemHiddenStyle: { color: "#555" },
        title: { style: { color: "windowText" } },
      },
      credits: { style: { color: "windowText" } },
      labels: { style: { color: "windowText" } },
      drilldown: {
        activeAxisLabelStyle: { color: "windowText" },
        activeDataLabelStyle: { color: "windowText" },
      },
      navigation: {
        buttonOptions: {
          symbolStroke: "windowText",
          theme: { fill: "window" },
        },
      },
      rangeSelector: {
        buttonTheme: {
          fill: "window",
          stroke: "windowText",
          style: { color: "windowText" },
          states: {
            hover: {
              fill: "window",
              stroke: "windowText",
              style: { color: "windowText" },
            },
            select: {
              fill: "#444",
              stroke: "windowText",
              style: { color: "windowText" },
            },
          },
        },
        inputBoxBorderColor: "windowText",
        inputStyle: { backgroundColor: "window", color: "windowText" },
        labelStyle: { color: "windowText" },
      },
      navigator: {
        handles: { backgroundColor: "window", borderColor: "windowText" },
        outlineColor: "windowText",
        maskFill: "transparent",
        series: { color: "windowText", lineColor: "windowText" },
        xAxis: { gridLineColor: "windowText" },
      },
      scrollbar: {
        barBackgroundColor: "#444",
        barBorderColor: "windowText",
        buttonArrowColor: "windowText",
        buttonBackgroundColor: "window",
        buttonBorderColor: "windowText",
        rifleColor: "windowText",
        trackBackgroundColor: "window",
        trackBorderColor: "windowText",
      },
    };
  });
  v(
    b,
    "Accessibility/Options/Options.js",
    [b["Core/Color/Palette.js"]],
    function (b) {
      return {
        accessibility: {
          enabled: !0,
          screenReaderSection: {
            beforeChartFormat:
              "<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{playAsSoundButton}</div><div>{viewTableButton}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div><div>{annotationsTitle}{annotationsList}</div>",
            afterChartFormat: "{endOfChartMarker}",
            axisRangeDateFormat: "%Y-%m-%d %H:%M:%S",
          },
          series: {
            describeSingleSeries: !1,
            pointDescriptionEnabledThreshold: 200,
          },
          point: {
            valueDescriptionFormat:
              "{index}. {xDescription}{separator}{value}.",
          },
          landmarkVerbosity: "all",
          linkedDescription:
            '*[data-highcharts-chart="{index}"] + .highcharts-description',
          keyboardNavigation: {
            enabled: !0,
            focusBorder: {
              enabled: !0,
              hideBrowserFocusOutline: !0,
              style: {
                color: b.highlightColor80,
                lineWidth: 2,
                borderRadius: 3,
              },
              margin: 2,
            },
            order: ["series", "zoom", "rangeSelector", "legend", "chartMenu"],
            wrapAround: !0,
            seriesNavigation: {
              skipNullPoints: !0,
              pointNavigationEnabledThreshold: !1,
            },
          },
          announceNewData: {
            enabled: !1,
            minAnnounceInterval: 5e3,
            interruptUser: !1,
          },
        },
        legend: {
          accessibility: { enabled: !0, keyboardNavigation: { enabled: !0 } },
        },
        exporting: { accessibility: { enabled: !0 } },
      };
    }
  );
  v(b, "Accessibility/Options/LangOptions.js", [], function () {
    return {
      accessibility: {
        defaultChartTitle: "Chart",
        chartContainerLabel: "{title}. Highcharts interactive chart.",
        svgContainerLabel: "Interactive chart",
        drillUpButton: "{buttonText}",
        credits: "Chart credits: {creditsStr}",
        thousandsSep: ",",
        svgContainerTitle: "",
        graphicContainerLabel: "",
        screenReaderSection: {
          beforeRegionLabel: "Chart screen reader information.",
          afterRegionLabel: "",
          annotations: {
            heading: "Chart annotations summary",
            descriptionSinglePoint:
              "{annotationText}. Related to {annotationPoint}",
            descriptionMultiplePoints:
              "{annotationText}. Related to {annotationPoint}{ Also related to, #each(additionalAnnotationPoints)}",
            descriptionNoPoints: "{annotationText}",
          },
          endOfChartMarker: "End of interactive chart.",
        },
        sonification: {
          playAsSoundButtonText: "Play as sound, {chartTitle}",
          playAsSoundClickAnnouncement: "Play",
        },
        legend: {
          legendLabelNoTitle: "Toggle series visibility",
          legendLabel: "Chart legend: {legendTitle}",
          legendItem: "Show {itemName}",
        },
        zoom: {
          mapZoomIn: "Zoom chart",
          mapZoomOut: "Zoom out chart",
          resetZoomButton: "Reset zoom",
        },
        rangeSelector: {
          dropdownLabel: "{rangeTitle}",
          minInputLabel: "Select start date.",
          maxInputLabel: "Select end date.",
          clickButtonAnnouncement: "Viewing {axisRangeDescription}",
        },
        table: {
          viewAsDataTableButtonText: "View as data table, {chartTitle}",
          tableSummary: "Table representation of chart.",
        },
        announceNewData: {
          newDataAnnounce: "Updated data for chart {chartTitle}",
          newSeriesAnnounceSingle: "New data series: {seriesDesc}",
          newPointAnnounceSingle: "New data point: {pointDesc}",
          newSeriesAnnounceMultiple:
            "New data series in chart {chartTitle}: {seriesDesc}",
          newPointAnnounceMultiple:
            "New data point in chart {chartTitle}: {pointDesc}",
        },
        seriesTypeDescriptions: {
          boxplot:
            "Box plot charts are typically used to display groups of statistical data. Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile, and maximum.",
          arearange:
            "Arearange charts are line charts displaying a range between a lower and higher value for each point.",
          areasplinerange:
            "These charts are line charts displaying a range between a lower and higher value for each point.",
          bubble:
            "Bubble charts are scatter charts where each data point also has a size value.",
          columnrange:
            "Columnrange charts are column charts displaying a range between a lower and higher value for each point.",
          errorbar:
            "Errorbar series are used to display the variability of the data.",
          funnel:
            "Funnel charts are used to display reduction of data in stages.",
          pyramid:
            "Pyramid charts consist of a single pyramid with item heights corresponding to each point value.",
          waterfall:
            "A waterfall chart is a column chart where each column contributes towards a total end value.",
        },
        chartTypes: {
          emptyChart: "Empty chart",
          mapTypeDescription: "Map of {mapTitle} with {numSeries} data series.",
          unknownMap: "Map of unspecified region with {numSeries} data series.",
          combinationChart: "Combination chart with {numSeries} data series.",
          defaultSingle:
            "Chart with {numPoints} data {#plural(numPoints, points, point)}.",
          defaultMultiple: "Chart with {numSeries} data series.",
          splineSingle:
            "Line chart with {numPoints} data {#plural(numPoints, points, point)}.",
          splineMultiple: "Line chart with {numSeries} lines.",
          lineSingle:
            "Line chart with {numPoints} data {#plural(numPoints, points, point)}.",
          lineMultiple: "Line chart with {numSeries} lines.",
          columnSingle:
            "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.",
          columnMultiple: "Bar chart with {numSeries} data series.",
          barSingle:
            "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.",
          barMultiple: "Bar chart with {numSeries} data series.",
          pieSingle:
            "Pie chart with {numPoints} {#plural(numPoints, slices, slice)}.",
          pieMultiple: "Pie chart with {numSeries} pies.",
          scatterSingle:
            "Scatter chart with {numPoints} {#plural(numPoints, points, point)}.",
          scatterMultiple: "Scatter chart with {numSeries} data series.",
          boxplotSingle:
            "Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.",
          boxplotMultiple: "Boxplot with {numSeries} data series.",
          bubbleSingle:
            "Bubble chart with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
          bubbleMultiple: "Bubble chart with {numSeries} data series.",
        },
        axis: {
          xAxisDescriptionSingular:
            "The chart has 1 X axis displaying {names[0]}. {ranges[0]}",
          xAxisDescriptionPlural:
            "The chart has {numAxes} X axes displaying {#each(names, -1) }and {names[-1]}.",
          yAxisDescriptionSingular:
            "The chart has 1 Y axis displaying {names[0]}. {ranges[0]}",
          yAxisDescriptionPlural:
            "The chart has {numAxes} Y axes displaying {#each(names, -1) }and {names[-1]}.",
          timeRangeDays: "Range: {range} days.",
          timeRangeHours: "Range: {range} hours.",
          timeRangeMinutes: "Range: {range} minutes.",
          timeRangeSeconds: "Range: {range} seconds.",
          rangeFromTo: "Range: {rangeFrom} to {rangeTo}.",
          rangeCategories: "Range: {numCategories} categories.",
        },
        exporting: {
          chartMenuLabel: "Chart menu",
          menuButtonLabel: "View chart menu",
          exportRegionLabel: "Chart menu",
        },
        series: {
          summary: {
            default:
              "{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            defaultCombination:
              "{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            line: "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            lineCombination:
              "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
            spline:
              "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            splineCombination:
              "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
            column:
              "{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.",
            columnCombination:
              "{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.",
            bar: "{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.",
            barCombination:
              "{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.",
            pie: "{name}, pie {ix} of {numSeries} with {numPoints} {#plural(numPoints, slices, slice)}.",
            pieCombination:
              "{name}, series {ix} of {numSeries}. Pie with {numPoints} {#plural(numPoints, slices, slice)}.",
            scatter:
              "{name}, scatter plot {ix} of {numSeries} with {numPoints} {#plural(numPoints, points, point)}.",
            scatterCombination:
              "{name}, series {ix} of {numSeries}, scatter plot with {numPoints} {#plural(numPoints, points, point)}.",
            boxplot:
              "{name}, boxplot {ix} of {numSeries} with {numPoints} {#plural(numPoints, boxes, box)}.",
            boxplotCombination:
              "{name}, series {ix} of {numSeries}. Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.",
            bubble:
              "{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
            bubbleCombination:
              "{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
            map: "{name}, map {ix} of {numSeries} with {numPoints} {#plural(numPoints, areas, area)}.",
            mapCombination:
              "{name}, series {ix} of {numSeries}. Map with {numPoints} {#plural(numPoints, areas, area)}.",
            mapline:
              "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            maplineCombination:
              "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
            mapbubble:
              "{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
            mapbubbleCombination:
              "{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
          },
          description: "{description}",
          xAxisDescription: "X axis, {name}",
          yAxisDescription: "Y axis, {name}",
          nullPointValue: "No value",
          pointAnnotationsDescription: "{Annotation: #each(annotations). }",
        },
      },
    };
  });
  v(
    b,
    "Accessibility/Options/DeprecatedOptions.js",
    [b["Core/Utilities.js"]],
    function (b) {
      function g(b, f, e) {
        for (var a, c = 0; c < f.length - 1; ++c)
          (a = f[c]), (b = b[a] = q(b[a], {}));
        b[f[f.length - 1]] = e;
      }
      function n(b, p, e, a) {
        function c(a, b) {
          return b.reduce(function (a, b) {
            return a[b];
          }, a);
        }
        var d = c(b.options, p),
          h = c(b.options, e);
        Object.keys(a).forEach(function (c) {
          var k,
            l = d[c];
          "undefined" !== typeof l &&
            (g(h, a[c], l),
            f(
              32,
              !1,
              b,
              ((k = {}),
              (k[p.join(".") + "." + c] = e.join(".") + "." + a[c].join(".")),
              k)
            ));
        });
      }
      function l(b) {
        var g = b.options.chart,
          e = b.options.accessibility || {};
        ["description", "typeDescription"].forEach(function (a) {
          var c;
          g[a] &&
            ((e[a] = g[a]),
            f(
              32,
              !1,
              b,
              ((c = {}), (c["chart." + a] = "use accessibility." + a), c)
            ));
        });
      }
      function t(b) {
        b.axes.forEach(function (g) {
          (g = g.options) &&
            g.description &&
            ((g.accessibility = g.accessibility || {}),
            (g.accessibility.description = g.description),
            f(32, !1, b, {
              "axis.description": "use axis.accessibility.description",
            }));
        });
      }
      function r(b) {
        var k = {
          description: ["accessibility", "description"],
          exposeElementToA11y: ["accessibility", "exposeAsGroupOnly"],
          pointDescriptionFormatter: [
            "accessibility",
            "pointDescriptionFormatter",
          ],
          skipKeyboardNavigation: [
            "accessibility",
            "keyboardNavigation",
            "enabled",
          ],
        };
        b.series.forEach(function (e) {
          Object.keys(k).forEach(function (a) {
            var c,
              d = e.options[a];
            "undefined" !== typeof d &&
              (g(e.options, k[a], "skipKeyboardNavigation" === a ? !d : d),
              f(
                32,
                !1,
                b,
                ((c = {}), (c["series." + a] = "series." + k[a].join(".")), c)
              ));
          });
        });
      }
      var f = b.error,
        q = b.pick;
      return function (b) {
        l(b);
        t(b);
        b.series && r(b);
        n(b, ["accessibility"], ["accessibility"], {
          pointDateFormat: ["point", "dateFormat"],
          pointDateFormatter: ["point", "dateFormatter"],
          pointDescriptionFormatter: ["point", "descriptionFormatter"],
          pointDescriptionThreshold: [
            "series",
            "pointDescriptionEnabledThreshold",
          ],
          pointNavigationThreshold: [
            "keyboardNavigation",
            "seriesNavigation",
            "pointNavigationEnabledThreshold",
          ],
          pointValueDecimals: ["point", "valueDecimals"],
          pointValuePrefix: ["point", "valuePrefix"],
          pointValueSuffix: ["point", "valueSuffix"],
          screenReaderSectionFormatter: [
            "screenReaderSection",
            "beforeChartFormatter",
          ],
          describeSingleSeries: ["series", "describeSingleSeries"],
          seriesDescriptionFormatter: ["series", "descriptionFormatter"],
          onTableAnchorClick: ["screenReaderSection", "onViewDataTableClick"],
          axisRangeDateFormat: ["screenReaderSection", "axisRangeDateFormat"],
        });
        n(
          b,
          ["accessibility", "keyboardNavigation"],
          ["accessibility", "keyboardNavigation", "seriesNavigation"],
          { skipNullPoints: ["skipNullPoints"], mode: ["mode"] }
        );
        n(b, ["lang", "accessibility"], ["lang", "accessibility"], {
          legendItem: ["legend", "legendItem"],
          legendLabel: ["legend", "legendLabel"],
          mapZoomIn: ["zoom", "mapZoomIn"],
          mapZoomOut: ["zoom", "mapZoomOut"],
          resetZoomButton: ["zoom", "resetZoomButton"],
          screenReaderRegionLabel: ["screenReaderSection", "beforeRegionLabel"],
          rangeSelectorButton: ["rangeSelector", "buttonText"],
          rangeSelectorMaxInput: ["rangeSelector", "maxInputLabel"],
          rangeSelectorMinInput: ["rangeSelector", "minInputLabel"],
          svgContainerEnd: ["screenReaderSection", "endOfChartMarker"],
          viewAsDataTable: ["table", "viewAsDataTableButtonText"],
          tableSummary: ["table", "tableSummary"],
        });
      };
    }
  );
  v(
    b,
    "Accessibility/A11yI18n.js",
    [
      b["Core/Globals.js"],
      b["Core/FormatUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n) {
      function l(b, g) {
        var f = b.indexOf("#each("),
          l = b.indexOf("#plural("),
          e = b.indexOf("["),
          a = b.indexOf("]");
        if (-1 < f) {
          a = b.slice(f).indexOf(")") + f;
          l = b.substring(0, f);
          e = b.substring(a + 1);
          a = b.substring(f + 6, a).split(",");
          f = Number(a[1]);
          b = "";
          if ((g = g[a[0]]))
            for (
              f = isNaN(f) ? g.length : f,
                f = 0 > f ? g.length + f : Math.min(f, g.length),
                a = 0;
              a < f;
              ++a
            )
              b += l + g[a] + e;
          return b.length ? b : "";
        }
        if (-1 < l) {
          e = b.slice(l).indexOf(")") + l;
          l = b.substring(l + 8, e).split(",");
          switch (Number(g[l[0]])) {
            case 0:
              b = r(l[4], l[1]);
              break;
            case 1:
              b = r(l[2], l[1]);
              break;
            case 2:
              b = r(l[3], l[1]);
              break;
            default:
              b = l[1];
          }
          b
            ? ((g = b),
              (g = (g.trim && g.trim()) || g.replace(/^\s+|\s+$/g, "")))
            : (g = "");
          return g;
        }
        return -1 < e
          ? ((l = b.substring(0, e)),
            (e = Number(b.substring(e + 1, a))),
            (b = void 0),
            (g = g[l]),
            !isNaN(e) &&
              g &&
              (0 > e
                ? ((b = g[g.length + e]),
                  "undefined" === typeof b && (b = g[0]))
                : ((b = g[e]),
                  "undefined" === typeof b && (b = g[g.length - 1]))),
            "undefined" !== typeof b ? b : "")
          : "{" + b + "}";
      }
      var t = g.format,
        r = n.pick;
      b.i18nFormat = function (b, g, k) {
        var f = function (a, b) {
            a = a.slice(b || 0);
            var c = a.indexOf("{"),
              d = a.indexOf("}");
            if (-1 < c && d > c)
              return {
                statement: a.substring(c + 1, d),
                begin: b + c + 1,
                end: b + d,
              };
          },
          e = [],
          a = 0;
        do {
          var c = f(b, a);
          var d = b.substring(a, c && c.begin - 1);
          d.length && e.push({ value: d, type: "constant" });
          c && e.push({ value: c.statement, type: "statement" });
          a = c ? c.end + 1 : a + 1;
        } while (c);
        e.forEach(function (a) {
          "statement" === a.type && (a.value = l(a.value, g));
        });
        return t(
          e.reduce(function (a, b) {
            return a + b.value;
          }, ""),
          g,
          k
        );
      };
      b.Chart.prototype.langFormat = function (f, g) {
        f = f.split(".");
        for (var k = this.options.lang, l = 0; l < f.length; ++l)
          k = k && k[f[l]];
        return "string" === typeof k ? b.i18nFormat(k, g, this) : "";
      };
    }
  );
  v(
    b,
    "Accessibility/FocusBorder.js",
    [
      b["Core/Globals.js"],
      b["Core/Renderer/SVG/SVGElement.js"],
      b["Core/Renderer/SVG/SVGLabel.js"],
      b["Core/Utilities.js"],
    ],
    function (b, g, n, l) {
      function t(a) {
        if (!a.focusBorderDestroyHook) {
          var b = a.destroy;
          a.destroy = function () {
            a.focusBorder && a.focusBorder.destroy && a.focusBorder.destroy();
            return b.apply(a, arguments);
          };
          a.focusBorderDestroyHook = b;
        }
      }
      function r(a) {
        for (var b = [], d = 1; d < arguments.length; d++)
          b[d - 1] = arguments[d];
        a.focusBorderUpdateHooks ||
          ((a.focusBorderUpdateHooks = {}),
          e.forEach(function (c) {
            c += "Setter";
            var d = a[c] || a._defaultSetter;
            a.focusBorderUpdateHooks[c] = d;
            a[c] = function () {
              var c = d.apply(a, arguments);
              a.addFocusBorder.apply(a, b);
              return c;
            };
          }));
      }
      function f(a) {
        a.focusBorderUpdateHooks &&
          (Object.keys(a.focusBorderUpdateHooks).forEach(function (b) {
            var c = a.focusBorderUpdateHooks[b];
            c === a._defaultSetter ? delete a[b] : (a[b] = c);
          }),
          delete a.focusBorderUpdateHooks);
      }
      var q = l.addEvent,
        k = l.extend,
        p = l.pick,
        e = "x y transform width height r d stroke-width".split(" ");
      k(g.prototype, {
        addFocusBorder: function (a, c) {
          this.focusBorder && this.removeFocusBorder();
          var d = this.getBBox(),
            e = p(a, 3);
          d.x += this.translateX ? this.translateX : 0;
          d.y += this.translateY ? this.translateY : 0;
          var f = d.x - e,
            g = d.y - e,
            k = d.width + 2 * e,
            l = d.height + 2 * e,
            q = this instanceof n;
          if ("text" === this.element.nodeName || q) {
            var v = !!this.rotation;
            if (q) var w = { x: v ? 1 : 0, y: 0 };
            else {
              var B = (w = 0);
              "middle" === this.attr("text-anchor")
                ? ((w = b.isFirefox && this.rotation ? 0.25 : 0.5),
                  (B = b.isFirefox && !this.rotation ? 0.75 : 0.5))
                : this.rotation
                ? (w = 0.25)
                : (B = 0.75);
              w = { x: w, y: B };
            }
            B = +this.attr("x");
            var u = +this.attr("y");
            isNaN(B) || (f = B - d.width * w.x - e);
            isNaN(u) || (g = u - d.height * w.y - e);
            q &&
              v &&
              ((q = k),
              (k = l),
              (l = q),
              isNaN(B) || (f = B - d.height * w.x - e),
              isNaN(u) || (g = u - d.width * w.y - e));
          }
          this.focusBorder = this.renderer
            .rect(f, g, k, l, parseInt(((c && c.r) || 0).toString(), 10))
            .addClass("highcharts-focus-border")
            .attr({ zIndex: 99 })
            .add(this.parentGroup);
          this.renderer.styledMode ||
            this.focusBorder.attr({
              stroke: c && c.stroke,
              "stroke-width": c && c.strokeWidth,
            });
          r(this, a, c);
          t(this);
        },
        removeFocusBorder: function () {
          f(this);
          this.focusBorderDestroyHook &&
            ((this.destroy = this.focusBorderDestroyHook),
            delete this.focusBorderDestroyHook);
          this.focusBorder &&
            (this.focusBorder.destroy(), delete this.focusBorder);
        },
      });
      b.Chart.prototype.renderFocusBorder = function () {
        var a = this.focusElement,
          b = this.options.accessibility.keyboardNavigation.focusBorder;
        a &&
          (a.removeFocusBorder(),
          b.enabled &&
            a.addFocusBorder(b.margin, {
              stroke: b.style.color,
              strokeWidth: b.style.lineWidth,
              r: b.style.borderRadius,
            }));
      };
      b.Chart.prototype.setFocusToElement = function (a, b) {
        var c = this.options.accessibility.keyboardNavigation.focusBorder;
        (b = b || a.element) &&
          b.focus &&
          ((b.hcEvents && b.hcEvents.focusin) ||
            q(b, "focusin", function () {}),
          b.focus(),
          c.hideBrowserFocusOutline && (b.style.outline = "none"));
        this.focusElement && this.focusElement.removeFocusBorder();
        this.focusElement = a;
        this.renderFocusBorder();
      };
    }
  );
  v(
    b,
    "Accessibility/Accessibility.js",
    [
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/Globals.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Core/Options.js"],
      b["Core/Series/Point.js"],
      b["Core/Series/Series.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigation.js"],
      b["Accessibility/Components/LegendComponent.js"],
      b["Accessibility/Components/MenuComponent.js"],
      b["Accessibility/Components/SeriesComponent/SeriesComponent.js"],
      b["Accessibility/Components/ZoomComponent.js"],
      b["Accessibility/Components/RangeSelectorComponent.js"],
      b["Accessibility/Components/InfoRegionsComponent.js"],
      b["Accessibility/Components/ContainerComponent.js"],
      b["Accessibility/HighContrastMode.js"],
      b["Accessibility/HighContrastTheme.js"],
      b["Accessibility/Options/Options.js"],
      b["Accessibility/Options/LangOptions.js"],
      b["Accessibility/Options/DeprecatedOptions.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (
      b,
      g,
      n,
      l,
      t,
      r,
      f,
      q,
      k,
      p,
      e,
      a,
      c,
      d,
      h,
      v,
      H,
      D,
      M,
      N,
      E,
      F
    ) {
      function w(a) {
        this.init(a);
      }
      var u = g.doc,
        A = f.addEvent,
        x = f.extend,
        z = f.fireEvent,
        K = f.merge;
      K(!0, l.defaultOptions, M, {
        accessibility: { highContrastTheme: D },
        lang: N,
      });
      g.A11yChartUtilities = b;
      g.A11yHTMLUtilities = F;
      g.KeyboardNavigationHandler = n;
      g.AccessibilityComponent = q;
      w.prototype = {
        init: function (a) {
          this.chart = a;
          u.addEventListener && a.renderer.isSVG
            ? (E(a),
              this.initComponents(),
              (this.keyboardNavigation = new k(a, this.components)),
              this.update())
            : a.renderTo.setAttribute("aria-hidden", !0);
        },
        initComponents: function () {
          var b = this.chart,
            f = b.options.accessibility;
          this.components = {
            container: new v(),
            infoRegions: new h(),
            legend: new p(),
            chartMenu: new e(),
            rangeSelector: new d(),
            series: new a(),
            zoom: new c(),
          };
          f.customComponents && x(this.components, f.customComponents);
          var g = this.components;
          this.getComponentOrder().forEach(function (a) {
            g[a].initBase(b);
            g[a].init();
          });
        },
        getComponentOrder: function () {
          if (!this.components) return [];
          if (!this.components.series) return Object.keys(this.components);
          var a = Object.keys(this.components).filter(function (a) {
            return "series" !== a;
          });
          return ["series"].concat(a);
        },
        update: function () {
          var a = this.components,
            b = this.chart,
            c = b.options.accessibility;
          z(b, "beforeA11yUpdate");
          b.types = this.getChartTypes();
          this.getComponentOrder().forEach(function (c) {
            a[c].onChartUpdate();
            z(b, "afterA11yComponentUpdate", { name: c, component: a[c] });
          });
          this.keyboardNavigation.update(c.keyboardNavigation.order);
          !b.highContrastModeActive &&
            H.isHighContrastModeActive() &&
            H.setHighContrastTheme(b);
          z(b, "afterA11yUpdate", { accessibility: this });
        },
        destroy: function () {
          var a = this.chart || {},
            b = this.components;
          Object.keys(b).forEach(function (a) {
            b[a].destroy();
            b[a].destroyBase();
          });
          this.keyboardNavigation && this.keyboardNavigation.destroy();
          a.renderTo && a.renderTo.setAttribute("aria-hidden", !0);
          a.focusElement && a.focusElement.removeFocusBorder();
        },
        getChartTypes: function () {
          var a = {};
          this.chart.series.forEach(function (b) {
            a[b.type] = 1;
          });
          return Object.keys(a);
        },
      };
      g.Chart.prototype.updateA11yEnabled = function () {
        var a = this.accessibility,
          b = this.options.accessibility;
        b && b.enabled
          ? a
            ? a.update()
            : (this.accessibility = new w(this))
          : a
          ? (a.destroy && a.destroy(), delete this.accessibility)
          : this.renderTo.setAttribute("aria-hidden", !0);
      };
      A(g.Chart, "render", function (a) {
        this.a11yDirty &&
          this.renderTo &&
          (delete this.a11yDirty, this.updateA11yEnabled());
        var b = this.accessibility;
        b &&
          b.getComponentOrder().forEach(function (a) {
            b.components[a].onChartRender();
          });
      });
      A(g.Chart, "update", function (a) {
        if ((a = a.options.accessibility))
          a.customComponents &&
            ((this.options.accessibility.customComponents = a.customComponents),
            delete a.customComponents),
            K(!0, this.options.accessibility, a),
            this.accessibility &&
              this.accessibility.destroy &&
              (this.accessibility.destroy(), delete this.accessibility);
        this.a11yDirty = !0;
      });
      A(t, "update", function () {
        this.series.chart.accessibility && (this.series.chart.a11yDirty = !0);
      });
      ["addSeries", "init"].forEach(function (a) {
        A(g.Chart, a, function () {
          this.a11yDirty = !0;
        });
      });
      ["update", "updatedData", "remove"].forEach(function (a) {
        A(r, a, function () {
          this.chart.accessibility && (this.chart.a11yDirty = !0);
        });
      });
      ["afterDrilldown", "drillupall"].forEach(function (a) {
        A(g.Chart, a, function () {
          this.accessibility && this.accessibility.update();
        });
      });
      A(g.Chart, "destroy", function () {
        this.accessibility && this.accessibility.destroy();
      });
    }
  );
  v(b, "masters/modules/accessibility.src.js", [], function () {});
});
//# sourceMappingURL=accessibility.js.map
