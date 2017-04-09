/*! easytree - v0.0.0 - 2016-05-18 -  */
;
(function (d3, $) {

// This file is used in the build process to enable or disable features in the
// compiled binary.  Here's how it works:  If you have a const defined like so:
//
//   const MY_AWESOME_FEATURE_IS_ENABLED = false;
//
// ...And the compiler (UglifyJS) sees this in your code:
//
//   if (MY_AWESOME_FEATURE_IS_ENABLED) {
//     doSomeStuff();
//   }
//
// ...Then the if statement (and everything in it) is removed - it is
// considered dead code.  If it's set to a truthy value:
//
//   const MY_AWESOME_FEATURE_IS_ENABLED = true;
//
// ...Then the compiler leaves the if (and everything in it) alone.

    var DEBUG = false;

// If you add more consts here, you need to initialize them in library.core.js
// to true.  So if you add:
//
//   const MY_AWESOME_FEATURE_IS_ENABLED = /* any value */;
//
// Then in library.core.js you need to add:
//
//   if (typeof MY_AWESOME_FEATURE_IS_ENABLED === 'undefined') {
//     MY_AWESOME_FEATURE_IS_ENABLED = true;
//   }

// Compiler directive for UglifyJS.  See library.const.js for more info.
    if (typeof DEBUG === 'undefined') {
        DEBUG = true;
    }


// LIBRARY-GLOBAL CONSTANTS
//
// These constants are exposed to all library modules.


// GLOBAL is a reference to the global Object.
    var Fn = Function, GLOBAL = new Fn('return this')();


// LIBRARY-GLOBAL METHODS
//
// The methods here are exposed to all library modules.  Because all of the
// source files are wrapped within a closure at build time, they are not
// exposed globally in the distributable binaries.


    /**
     * A no-op function.  Useful for passing around as a default callback.
     */
    function noop() {
    }


    /**
     * Init wrapper for the core module.
     * @param {Object} The Object that the library gets attached to in
     * library.init.js.  If the library was not loaded with an AMD loader such as
     * require.js, this is the global Object.
     */
    function initEasyTreeCore(context) {


        // It is recommended to use strict mode to help make mistakes easier to find.
        'use strict';


        // PRIVATE MODULE CONSTANTS
        //


        // An example of a CONSTANT variable;
        var CORE_CONSTANT = true;


        // PRIVATE MODULE METHODS
        //
        // These do not get attached to a prototype.  They are private utility
        // functions.


        /**
         *  An example of a private method.  Feel free to remove this.
         *  @param {number} aNumber This is a parameter description.
         *  @returns {number} This is a return value description.
         */
        function corePrivateMethod(aNumber) {
            return aNumber;
        }

        function copyToClipboard(elem) {
            // create hidden text element, if it doesn't already exist
            var targetId = "_hiddenCopyText_";
            var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
            var origSelectionStart, origSelectionEnd;
            if (isInput) {
                // can just use the original source element for the selection and copy
                target = elem;
                origSelectionStart = elem.selectionStart;
                origSelectionEnd = elem.selectionEnd;
            } else {
                // must use a temporary form element for the selection and copy
                target = document.getElementById(targetId);
                if (!target) {
                    var target = document.createElement("textarea");
                    target.style.position = "absolute";
                    target.style.left = "-9999px";
                    target.style.top = "0";
                    target.id = targetId;
                    document.body.appendChild(target);
                }
                target.textContent = elem.textContent;
            }
            // select the content
            var currentFocus = document.activeElement;
            target.focus();
            target.setSelectionRange(0, target.value.length);

            // copy the selection
            var succeed;
            try {
                succeed = document.execCommand("copy");
            } catch (e) {
                succeed = false;
            }
            // restore original focus
            if (currentFocus && typeof currentFocus.focus === "function") {
                currentFocus.focus();
            }

            if (isInput) {
                // restore prior selection
                elem.setSelectionRange(origSelectionStart, origSelectionEnd);
            } else {
                // clear temporary content
                target.textContent = "";
            }
            return succeed;
        }

        /**
         * This is the constructor for the EasyTree Object.  Please rename it to
         * whatever your library's name is.  Note that the constructor is also being
         * attached to the context that the library was loaded in.
         * @param {Object} opt_config Contains any properties that should be used to
         * configure this instance of the library.
         * @constructor
         */
        var zoom = d3.behavior.zoom().translate([100, 50]).scale(.25);

        var zooming = function(d, reset) {
            if (reset) {
                this.svg.attr("transform",
                    "translate([100,50])" + " scale(25)");
            } else {
                this.svg.attr("transform",
                    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
            }
        };

        var EasyTree = context.EasyTree = function (opt_config) {

            opt_config = opt_config || {};

            var width = opt_config.width || "100%";
            var height = opt_config.height || "100%";
            var json = opt_config.data || {};
            var container = opt_config.container || "body";
            var mouseover_cb = opt_config.points.mouseover || noop;
            var mouseout_cb = opt_config.points.mouseout || noop;
            var click_cb = opt_config.points.clicked || noop;
            var show_top_scroll = opt_config.show_top_scroll || false;
            var type = opt_config.type || "anova";
            var defaultOpen = opt_config.type || true;
            var depth = opt_config.type || 1;
            var zoom = this.zoom;


            var root,
                i = 0,
                duration = 750,
                rectW = 180,
                rectH = 110;

            //d3.json(data, function (json) {
            root = json;
            root.x0 = 0;
            root.y0 = height / 2;

            var scale = 1;

            var tree = d3.layout.tree()
                .nodeSize([rectW + 20, rectH + 20]);

            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.x + rectW / 2, d.y + rectH / 2];
                });

            if (show_top_scroll == true) {
                var wrapper = d3.select(container).append("div")
                    .attr("class", "aligner wrapper-1 custom-scroll scrollbar-x custom-scroll-x")
                    .append("div")
                    .attr("class", "topscroll");
            }

            var outer_container = d3.select(container).append("div")
                .attr("class", "aligner outer")
                .append("div")
                .attr("class", "inner");

            var svg = d3.select("div.inner").append("svg")
                .attr("id", "easytree-svg")
                .attr("class", "aligner-item")
                .call(zoom.on("zoom", this.zooming))
                .on("dblclick.zoom", null)
                .append("svg:g")
                .attr("transform", "translate(100,50)scale(.25,.25)");

            this.svg = svg;

            var panCanvas = svg.append("g")
                .attr("class", "svg-child");


            // add the tool tip
            var tooltip = d3.select("body").append("div")
                .attr("class", "et-tooltip")
                .style("opacity", 1);


            $("div.et-tooltip").hide();

            function collapse(d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }

            //root.children.forEach(collapse);
            if (!defaultOpen) {
                collapse(root);
            }

            update(root, true);
            centerNode(root);

            function centerNode(source) {
                var x = -source.y0;
                var y = -source.x0;
                var rectObject = document.getElementById("easytree-svg").getBoundingClientRect();

                x = x * scale + rectObject["width"] / 2 - 90;
                y = 20;

                // d3.select('g').transition()
                //     .duration(duration)
                //     .attr("transform", "translate(" + x + "," + y + ")");
            }

            function update(source, option) {

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                    d.y = d.depth * 150;
                });

                // Update the nodes…
                var node = panCanvas.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });

                function close_popup() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                }

                function showToolTip(parents, parentsData) {

                    // Tooltip
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .95);

                    for (var i = 0; i < parents.length; i++) {
                        d3.select("path#id" + parents[i]).classed("active", true);
                    }

                    $("div.hover-popover").remove();
                    $("div.et-tooltip").empty();
                    // $("div.et-tooltip").append('<div class="hover-popover"><h3>Prediction path</h3><div class="icons-popover"></span><span class="glyphicon glyphicon-copy" aria-hidden="true"></span><span class="glyphicon glyphicon-export" aria-hidden="true"></span><span class="glyphicon glyphicon-remove-sign icon-close" aria-hidden="true"></span></div></div>');
                    $("div.et-tooltip").append('<div class="hover-popover"><h3>Prediction path</h3><ul></ul></div>');

                    for (var i = 0; i < parentsData.length; i++) {

                        if (parentsData[i] != undefined) {
                            if (parentsData[i]["id"] == 1) {
                                $("div.hover-popover ul").append('<li class="path-init">' + parentsData[i]["name"] + '</li>');
                            }
                            else {
                                if (parentsData[i]["children_cnt"] != undefined && parentsData[i]["children_cnt"] > 0) {
                                    $("div.hover-popover ul").append('<li class="path-mid">' + parentsData[i]["name"] + '</li>');
                                }
                                else {
                                    $("div.hover-popover ul").append('<li class="path-end">' + parentsData[i]["name"] + '</li>');
                                }
                            }
                        }
                    }

                    tooltip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");

                    $("div.et-tooltip").show();
                }

                function mouseover(d) {
                    svg.selectAll(".active").classed("active", false);

                    var parents = [];
                    var parentsData = [];
                    var obj = {};
                    obj["id"] = d.id;
                    obj["name"] = d.name;

                    if (d.children != undefined) {
                        obj["children_cnt"] = d.children.length;
                    }
                    else if (d._children != undefined) {
                        obj["children_cnt"] = d._children.length;
                    }

                    if (type == 'classification') {
                        obj["category"] = d.category;
                    }
                    else {
                        obj["size"] = d.size;
                        obj["value"] = d.value;
                    }

                    parentsData[d.id] = obj;
                    parents.push(d.id);

                    getUptoParent(d, parents, parentsData, type);
                    for (var i = 0; i < parents.length; i++) {
                        d3.select("path#id" + parents[i]).classed("active", true);
                    }

                    showToolTip(parents, parentsData);
                    mouseover_cb(d);
                }

                function mouseout(d) {
                    close_popup()
                    mouseout_cb(d);
                }

                // Toggle children on click.
                function click(d) {

                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {

                        d.children = d._children;
                        d._children = null;
                    }
                    update(d, false);

                    var parents = [];
                    var parentsData = [];
                    var obj = {};
                    obj["id"] = d.id;
                    obj["name"] = d.name;
                    //obj["children_cnt"] = d.children.length;
                    if (type == 'classification') {
                        obj["category"] = d.category;
                    }
                    else {
                        obj["size"] = d.size;
                        obj["value"] = d.value;
                    }

                    parentsData[d.id] = obj;
                    parents.push(d.id)
                    getUptoParent(d, parents, parentsData, type);


                    close_popup();
                    click_cb(d, parents, parentsData, tooltip);
                }

                function getUptoParent(d, parents, parentsData, type) {
                    var obj = {};

                    if (d["parent"] != undefined) {
                        obj["id"] = d["parent"]["id"];
                        obj["name"] = d["parent"]["name"];
                        obj["children_cnt"] = d["parent"]["children"].length;

                        if (type == "classification") {
                            obj["category"] = d["parent"]["category"];
                        }
                        else {
                            obj["size"] = d["parent"]["size"];
                            obj["value"] = d["parent"]["value"];
                        }

                        parentsData[d["parent"]["id"]] = obj;
                        parents.push(d["parent"]["id"]);
                        if (d["parent"] != undefined && d["parent"]["parent_id"] != null) {
                            var q = d["parent"];
                            getUptoParent(q, parents, parentsData);
                        }
                    }
                }

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        if (!isNaN(source.y0))
                            return "translate(" + source.x0 + "," + source.y0 + ")";
                    })
                    .on("dblclick", click)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout);

                nodeEnter.append("rect")
                    .attr("width", rectW)
                    .attr("height", rectH)
                    .attr("class", "node-body");

                nodeEnter
                    .append("text")
                    .attr("x", (rectW / 2))
                    .attr("y", -12)
                    .attr("class", "node-title")
                    .text(function (d) {
                        return "Node: " + d.id;
                    }).call(getBB);

                nodeEnter.insert("rect", "text")
                    .attr("x", -0)
                    .attr("y", -30)
                    .attr("width", function (d) {
                        return rectW;
                    })
                    .attr("height", function (d) {
                        return "30"
                    })
                    .attr("class", "node-heading")
                    .attr("shape-rendering", "crispEdges")
                    .attr("stroke", function (d) {
                        if (d.parent_id == null) {
                            return "#00725d";
                        }
                        else {
                            if ((d.children != undefined && d.children.length > 0 ) || (d._children != undefined && d._children.length > 0)) {
                                return "#3B78E7";
                            }
                            else {
                                return "#f04d4c";
                            }
                        }
                    })
                    .attr("stroke-width", 1)
                    .attr("fill", function (d) {
                        if (d.parent_id == null) {
                            return "#00725d";
                        }
                        else {
                            if ((d.children != undefined && d.children.length > 0 ) || (d._children != undefined && d._children.length > 0)) {
                                return "#3B78E7";
                            }
                            else {
                                return "#f04d4c";
                            }
                        }
                    });

                function getBB(selection) {
                    selection.each(function (d) {
                        d.bbox = this.getBBox();
                    })
                }

                nodeEnter.append("foreignObject")
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr("font-size", "5")
                    .attr("font-weight", 100)
                    .attr("style", "width :" + rectW + "px; height :" + rectH + "px; padding-top: 7px")
                    .attr("class", "content")
                    .html(function (d) {
                        var htmlText = '';
                        var color = ['green', 'red', 'blue', 'orange', 'purple'];
                        if (type == 'classification') {
                            var catLen = d["category"].length;
                            if (catLen > 3)
                                catLen = 3;

                            htmlText = htmlText + '<p class="node-rule text-ellipsis"><span class="canvas-label">' + d.name + '</span></p>';
                            for (var j = 0; j < catLen; j++) {
                                htmlText = htmlText + '<p class="marginB5"><span class="canvas-label">' + 'Predicted Value' + ' :' + '</span>' + '<span class="canvas-value"> ' + d["category"][j]["value"] + '</span>' + '</p>';
                            }

                            var xcod = 0;
                            var ycod = 0;
                            // for (var j = 0; j < d["category"].length; j++) {
                            //
                            //     var width = 150;
                            //     if (j == 0) {
                            //         htmlText = htmlText + '<svg width="' + width + '" height="10"><rect x="0" y="' + ycod + '" height="5" style="fill:' + color[j] + '"   width="' + d["category"][j]["percent"] + '%" ></rect>';
                            //     }
                            //     else {
                            //         xcod = xcod + (width * (d["category"][j - 1]["percent"] / 100));
                            //
                            //         htmlText = htmlText + '<rect x="' + xcod + '" y="' + ycod + '" height="5" style="fill:' + color[j] + '"   width="' + d["category"][j]["percent"] + '%" ></rect>';
                            //     }
                            //     if (j == d["category"].length - 1) {
                            //         htmlText = htmlText + "</svg>"
                            //     }
                            //
                            // }for (var j = 0; j < d["category"].length; j++) {
                            //
                            //     var width = 150;
                            //     if (j == 0) {
                            //         htmlText = htmlText + '<svg width="' + width + '" height="10"><rect x="0" y="' + ycod + '" height="5" style="fill:' + color[j] + '"   width="' + d["category"][j]["percent"] + '%" ></rect>';
                            //     }
                            //     else {
                            //         xcod = xcod + (width * (d["category"][j - 1]["percent"] / 100));
                            //
                            //         htmlText = htmlText + '<rect x="' + xcod + '" y="' + ycod + '" height="5" style="fill:' + color[j] + '"   width="' + d["category"][j]["percent"] + '%" ></rect>';
                            //     }
                            //     if (j == d["category"].length - 1) {
                            //         htmlText = htmlText + "</svg>"
                            //     }
                            //
                            // }
                        }
                        else {
                            htmlText = htmlText + '<p class="node-rule text-ellipsis"><span class="canvas-label">' + d.name + '</span></p>';
                            htmlText = htmlText + '<p class="marginB5"><span class="canvas-label">' + 'DV Name' + ' :' + '</span>' + '<span class="canvas-value"> ' + d.var_name + '</span>' + '</p>';
                            htmlText = htmlText + '<p class="marginB5"><span class="canvas-label">' + 'Value' + ' :' + '</span>' + '<span class="canvas-value"> ' + d3.format(".3n")(d.value) + '</span>' + '</p>';
                            htmlText = htmlText + '<p class="marginB5"><span class="canvas-label">' + 'Size' + ' :' + '</span>' + '<span class="canvas-value"> ' + d.size + '</span>' + '</p>';


                        }


                        return htmlText;
                    });

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        if (!isNaN(d.y))
                            return "translate(" + d.x + "," + d.y + ")";
                    });

                nodeUpdate.select("rect")
                    .attr("width", rectW)
                    .attr("height", rectH)
                    .attr("shape-rendering", "crispEdges")
                    .attr("stroke", function (d) {
                        if (d.parent_id == null) {
                            return "#00725d";
                        }
                        else {
                            if ((d.children != undefined && d.children.length > 0 ) || (d._children != undefined && d._children.length > 0)) {
                                return "#3B78E7";
                            }
                            else {
                                return "#f04d4c";
                            }
                        }
                    })
                    .attr("stroke-width", 1)
                    .style("fill", function (d) {
                        if (d.parent_id == null) {
                            return "#e5f5f2";
                        }
                        else {
                            if ((d.children != undefined && d.children.length > 0 ) || (d._children != undefined && d._children.length > 0)) {
                                return "#d7e4fa";
                            }
                            else {
                                return "#fdeded";
                            }
                        }
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + source.x + "," + source.y + ")";
                    })
                    .remove();

                nodeExit.select("rect")
                    .attr("width", rectW)
                    .attr("height", rectH)
                    .attr("stroke", "black")
                    .attr("stroke-width", 0.5);

                nodeExit.select("text");

                // Update the links…
                var link = panCanvas.selectAll("path.link")
                    .data(links, function (d) {
                        return d.target.id;
                    });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("id", function (d) {
                        return ("id" + d.target.id);
                    })
                    .attr("x", rectW / 2)
                    .attr("y", rectH / 2)
                    .attr("stroke-width", function (d) {
                        var w = parseFloat(d.target.weight);
                        if (w > 1) {
                            w = 1;
                        }
                        if (w < 0.009) {
                            w = w * 5;
                        }
                        //console.log(w);
                        return (w * 50) + "px";
                    })
                    .attr("d", function (d) {

                        if (source.x0 == undefined || source.y0 == undefined) {
                            var o = {
                                x: source.x,
                                y: source.y
                            };

                            return diagonal({
                                source: o,
                                target: o
                            });
                        } else {
                            var o = {
                                x: source.x,
                                y: source.y
                            };

                            return diagonal({
                                source: o,
                                target: o
                            });
                        }
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                        var o = {
                            x: source.x,
                            y: source.y
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

                var x = [];
                var y = [];
                for (var node in nodes) {

                    x.push(nodes[node]["x"]);
                    y.push(nodes[node]["y"]);
                }

                var xMin = Math.min.apply(null, x), xMax = Math.max.apply(null, x);
                var yMin = Math.min.apply(null, y), yMax = Math.max.apply(null, y);
                var w = ((xMax - xMin) + 200);
                var h = ((yMax - yMin) + 200);

                var xOffset = -(xMin);
                $("div.inner").attr("style", "width:" + 100 + "%;height:" + 400 + "px");

                if (show_top_scroll == true) {
                    $("div.topscroll").attr("style", "width:" + w + "px");

                    $(".wrapper-1").scroll(function () {
                        $(".outer").scrollLeft($(".wrapper-1").scrollLeft());
                    });
                    $(".outer").scroll(function () {
                        $(".wrapper-1").scrollLeft($(".outer").scrollLeft());
                    });
                }

                $(".svg-child").attr("transform", "translate(" + xOffset + ", 20)");
            }

            //Redraw for zoom
            function redraw() {
                //console.log("here", d3.event.translate, d3.event.scale);
                svg.attr("transform",
                    "translate(" + d3.event.translate + ")"
                    + " scale(" + d3.event.scale + ")");
            }

            // });


            // INSTANCE PROPERTY SETUP
            //
            // Your library likely has some instance-specific properties.  The value of
            // these properties can depend on any number of things, such as properties
            // passed in via opt_config or global state.  Whatever the case, the values
            // should be set in this constructor.

            // Instance variables that have a leading underscore mean that they should
            // not be modified outside of the library.  They can be freely modified
            // internally, however.  If an instance variable will likely be accessed
            // outside of the library, consider making a public getter function for it.
            this._readOnlyVar = 'read only';

            // Instance variables that do not have an underscore prepended are
            // considered to be part of the library's public API.  External code may
            // change the value of these variables freely.
            this.readAndWrite = 'read and write';


            return this;
        };


        // LIBRARY PROTOTYPE METHODS
        //
        // These methods define the public API.


        /**
         * An example of a protoype method.
         * @return {string}
         */
        EasyTree.prototype.getReadOnlyVar = function () {
            return this._readOnlyVar;
        };


        /**
         * This is an example of a chainable method.  That means that the return
         * value of this function is the library instance itself (`this`).  This lets
         * you do chained method calls like this:
         *
         * var myEasyTree = new EasyTree();
         * myEasyTree
         *   .chainableMethod()
         *   .chainableMethod();
         *
         * @return {EasyTree}
         */
        EasyTree.prototype.chainableMethod = function () {
            return this;
        };


        // DEBUG CODE
        //
        // With compiler directives, you can wrap code in a conditional check to
        // ensure that it does not get included in the compiled binaries.  This is
        // useful for exposing certain properties and methods that are needed during
        // development and testing, but should be private in the compiled binaries.


        if (DEBUG) {
            GLOBAL.corePrivateMethod = corePrivateMethod;
        }

    }

// Your library may have many modules.  How you organize the modules is up to
// you, but generally speaking it's best if each module addresses a specific
// concern.  No module should need to know about the implementation details of
// any other module.

// Note:  You must name this function something unique.  If you end up
// copy/pasting this file, the last function defined will clobber the previous
// one.
    function initEasyTreeModule(context) {

        'use strict';

        var EasyTree = context.EasyTree;


        // A library module can do two things to the EasyTree Object:  It can extend
        // the prototype to add more methods, and it can add static properties.  This
        // is useful if your library needs helper methods.


        // PRIVATE MODULE CONSTANTS
        //


        var MODULE_CONSTANT = true;


        // PRIVATE MODULE METHODS
        //


        /**
         *  An example of a private method.  Feel free to remove this.
         */
        function modulePrivateMethod() {
            return;
        }


        // LIBRARY STATIC PROPERTIES
        //


        /**
         * An example of a static EasyTree property.  This particular static property
         * is also an instantiable Object.
         * @constructor
         */
        EasyTree.EasyTreeHelper = function () {
            return this;
        };


        // LIBRARY PROTOTYPE EXTENSIONS
        //
        // A module can extend the prototype of the EasyTree Object.


        /**
         * An example of a prototype method.
         * @return {string}
         */
        EasyTree.prototype.alternateGetReadOnlyVar = function () {
            // Note that a module can access all of the EasyTree instance variables with
            // the `this` keyword.
            return this._readOnlyVar;
        };


        if (DEBUG) {
            // DEBUG CODE
            //
            // Each module can have its own debugging section.  They all get compiled
            // out of the binary.
        }

    }

    /**
     * Submodules are similar to modules, only they do not use the same namespace as
     * the Core, but defined a sub-namespace of their own.
     * @param {Object} The Object that the library gets attached to in
     * library.init.js.  If the library was not loaded with an AMD loader such as
     * require.js, this is the global Object.
     */
    function initEasyTreeSubmodule(context) {
        'use strict';

        var EasyTree = context.EasyTree;

        /*
         * The submodule constructor
         * @param {Object} opt_config Contains any properties that should be used to
         * configure this instance of the library.
         * @constructor
         */
        var submodule = EasyTree.Submodule = function (opt_config) {

            // defines a temporary variable,
            // living only as long as the constructor runs.
            var constructorVariable = "Constructor Variable";

            // set an instance variable
            // will be available after constructor has run.
            this.instanceVariable = null;

            // an optional call to the private method
            // at the end of the construction process
            this._privateMethod(constructorVariable);
        };

        // LIBRARY PROTOTYPE EXTENSIONS
        /**
         * A public method of the submodule
         * @param {object} a variable to be set to the instance variable
         * @returns {object} the final value of the instance variable
         */
        submodule.prototype.publicMethod = function (value) {
            if (value !== undefined) {
                this._privateMethod(value);
            }

            return this.instanceVariable;
        };

        /**
         * a private instance method
         * @param {object} a variable to be set to the instance variable
         * @returns {object} the final value of the instance variable
         */
        submodule.prototype._privateMethod = function (value) {
            return this.instanceVariable = value;
        };
    }

    /*global initEasyTreeCore initEasyTreeModule initEasyTreeSubmodule */
    var initEasyTree = function (context) {

        initEasyTreeCore(context);
        initEasyTreeModule(context);
        initEasyTreeSubmodule(context);
        // Add a similar line as above for each module that you have.  If you have a
        // module named "Awesome Module," it should live in the file
        // "src/library.awesome-module.js" with a wrapper function named
        // "initAwesomeModule".  That function should then be invoked here with:
        //
        // initAwesomeModule(context);

        return context.EasyTree;
    };


    if (typeof define === 'function' && define.amd) {
        // Expose EasyTree as an AMD module if it's loaded with RequireJS or
        // similar.
        define(function () {
            return initEasyTree({});
        });
    } else {
        // Load EasyTree normally (creating a EasyTree global) if not using an AMD
        // loader.
        initEasyTree(this);
    }

}(d3, $));
