/**
 * This plugin will add a search filter to tables. When typing in the filter,
 * any rows that do not contain the filter will be hidden.
 */
(function (e) {
    var t = e.fn.jquery.split("."),
        n = parseFloat(t[0]),
        r = parseFloat(t[1]);
    n < 2 && r < 8 ? e.expr[":"].filterTableFind = function (t, n, r) {
        return e(t).text().toUpperCase().indexOf(r[3].toUpperCase()) >= 0
    } : e.expr[":"].filterTableFind = jQuery.expr.createPseudo(function (t) {
        return function (n) {
            return e(n).text().toUpperCase().indexOf(t.toUpperCase()) >= 0
        }
    });
    e.fn.filterTable = function (t) {
        var n = {
            callback: null,
            containerClass: "filter-table",
            containerTag: "p",
            hideTFootOnFilter: !1,
            highlightClass: "alt",
            inputName: "",
            inputType: "search",
            label: "Filter:",
            minRows: 8,
            placeholder: "",
            quickList: [],
            quickListClass: "quick",
            quickListGroupTag: "",
            quickListTag: "a",
            visibleClass: "visible"
        }, r = function (e) {
                return e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }, i = e.extend({}, n, t),
            s = function (e, t) {
                var n = e.find("tbody");
                if (t === "") {
                    n.find("tr").show().addClass(i.visibleClass);
                    n.find("td").removeClass(i.highlightClass);
                    i.hideTFootOnFilter && e.find("tfoot").show()
                } else {
                    n.find("tr").hide().removeClass(i.visibleClass);
                    i.hideTFootOnFilter && e.find("tfoot").hide();
                    n.find("td").removeClass(i.highlightClass).filter(':filterTableFind("' + t.replace(/(['"])/g, "\\$1") + '")').addClass(i.highlightClass).closest("tr").show().addClass(i.visibleClass)
                }
                i.callback && i.callback(t, e)
            };
        return this.each(function () {
            var t = e(this),
                n = t.find("tbody"),
                o = null,
                u = null,
                a = null;
            if (t[0].nodeName === "TABLE" && n.length > 0 && (i.minRows === 0 || i.minRows > 0 && n.find("tr").length > i.minRows) && !t.prev().hasClass(i.containerClass)) {
                o = e("<" + i.containerTag + " />");
                i.containerClass !== "" && o.addClass(i.containerClass);
                o.prepend(i.label + " ");
                a = e('<input type="' + i.inputType + '" placeholder="' + i.placeholder + '" name="' + i.inputName + '" />');
                e.fn.bindWithDelay ? a.bindWithDelay("keyup", function () {
                    s(t, e(this).val())
                }, 200) : a.bind("keyup", function () {
                    s(t, e(this).val())
                });
                a.bind("click search", function () {
                    s(t, e(this).val())
                });
                o.append(a);
                if (i.quickList.length > 0) {
                    u = i.quickListGroupTag ? e("<" + i.quickListGroupTag + " />") : o;
                    e.each(i.quickList, function (t, n) {
                        var s = e("<" + i.quickListTag + ' class="' + i.quickListClass + '" />');
                        s.text(r(n));
                        s[0].nodeName === "A" && s.attr("href", "#");
                        s.bind("click", function (e) {
                            e.preventDefault();
                            a.val(n).focus().trigger("click")
                        });
                        u.append(s)
                    });
                    u !== o && o.append(u)
                }
                t.before(o)
            }
        })
    }
})(jQuery);