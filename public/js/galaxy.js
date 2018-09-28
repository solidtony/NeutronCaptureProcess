"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Galaxy = function () {
    function Galaxy(starData) {
        _classCallCheck(this, Galaxy);

        //Creating star data instance
        this.starData = starData;

        //Selects the div
        var div = d3.select("#GPlot").classed("galaxy", true);

        //Initializes the svg elements required for pTable chart
        this.margin = { top: 15, right: 20, bottom: 40, left: 20 };
        var svgBounds = div.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth;

        //Adds svg to the div
        this.svg = div.append("svg").attr("width", this.svgWidth).attr("height", this.svgHeight + this.svgHeight * 0.056).attr("transform", "translate(0, 0)");

        ///////// Background: Start //////////////
        //Appends background to svg future
        this.svg.append("defs").append("pattern").attr("id", "background").attr("patternUnits", "userSpaceOnUse").attr("width", this.svgWidth).attr("height", this.svgHeight).append("image").attr("xlink:href", "./data/milky_way_anota_2000.jpg").attr("width", this.svgWidth).attr("height", this.svgHeight);

        this.svg.append("rect").attr("width", this.svgWidth).attr("height", this.svgHeight).attr("fill", "url(#background)");
        ///////// Background: End ////////////////
        this.rangeScale = 1.65;
    }

    _createClass(Galaxy, [{
        key: "tooltip_render",


        ///////////////////// Tool Tip Function
        /**
         * Renders the HTML content for tool tip.
         *
         * @param tooltip_data information that needs to be populated in the tool tip
         * @return text HTML content for tool tip
         */
        value: function tooltip_render(tooltip_data) {
            var text = "<h2 class = atomicName> Star Name:  " + tooltip_data.StarName + "</h2>";
            text += "<h2 class = atomicName> Distance to the Sun:  " + tooltip_data.rS + "(ly) </h2>";
            text += "<h2 class = atomicName> Surface Temperature:  " + tooltip_data.Teff + "(K) </h2>";
            text += "<h2 class = atomicName> Log of the Surface Gravity:  " + tooltip_data.logg + "(dexs) </h2>";
            text += "<h2 class = atomicName> Avg. Chemical Enrichment:  " + tooltip_data.Fe_H + "(dexs) </h2>";
            text += "<h2 class = atomicName> Reference:  " + tooltip_data.Ref + "</h2>";

            return text;
        }
    }, {
        key: "create",

        //////////////////////

        value: function create() {
            var _this = this;

            //////////
            // Plotting galaxy location data
            //Used to shift position of stars
            var shiftX = this.svgWidth / 2.0;
            var shiftY = this.svgHeight / 1.89;
            var maxN = d3.max(this.starData, function (d) {
                return parseInt(d.StarName);
            });
            // galaxy scale
            var galaxyScale = d3.scaleLinear().domain([-22104, 22104]).range([-this.svgHeight / this.rangeScale, this.svgHeight / this.rangeScale]);
            // Color scale
            var ColorScale = d3.scaleLinear().domain([d3.min(this.starData, function (d) {
                return parseFloat(d.Sr);
            }), d3.max(this.starData, function (d) {
                return parseFloat(d.Sr);
            })]).range(["black", "red"]);

            //Creates circles for star data
            var circ = this.svg.selectAll("circle").data(this.starData);
            var circNew = circ.enter().append("circle");
            circ.exit().remove();
            circ = circNew.merge(circ);

            circ.attr("cx", function (d) {
                if (isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y))) {
                    return 0;
                } else {
                    return galaxyScale(+d.Coord_X) + shiftX;
                }
            }).attr("cy", function (d) {
                if (isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y))) {
                    return 0;
                } else {
                    return galaxyScale(+d.Coord_Y * -1) + shiftY;
                }
            }).attr("r", function (d) {
                var Radius = 3.5;
                // Radius = galaxyScale(d.logg*100);
                if (isNaN(parseFloat(d.Sr)) | isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y))) {
                    Radius = 0.0;
                }
                return Radius;
            }).style("fill", function (d) {
                return ColorScale(d.Sr);
            });

            //////////

            ///////////////////////////////
            //// PTable ToolTip :Start ////
            ///////////////////////////////
            //for reference:https://github.com/Caged/d3-tip
            //Use this tool tip element to handle any hover over the chart
            var tip = d3.tip().attr('class', 'd3-tip').direction('sw').offset(function () {
                return [0, 0];
            }).html(function (d) {
                // populate data in the following format
                var tooltip_data = {
                    "StarName": String(d.StarName),
                    "rS": Math.sqrt(parseFloat(d.Coord_X) * parseFloat(d.Coord_X) + parseFloat(d.Coord_Y) * parseFloat(d.Coord_Y) + parseFloat(d.Coord_Z) * parseFloat(d.Coord_Z)).toFixed(0),
                    "Teff": parseFloat(d.Teff).toFixed(0),
                    "Fe_H": parseFloat(d.Fe).toFixed(2),
                    "logg": parseFloat(d.logg).toFixed(2),
                    "Ref": String(d.Reference)
                    //pass this as an argument to the tooltip_render function then,
                    //return the HTML content returned from that method.

                };return _this.tooltip_render(tooltip_data);
            });

            //tip for element rectangles
            circ.call(tip);
            var self = this;
            circ.on("mouseover", function (d) {
                d3.select(this).classed("selected", true);
                tip.show(d);
            }).on("mouseout", function (d) {
                d3.select(this).classed("selected", false);
                tip.hide(d);
            });

            /////// Text for selected element
            var fontSize = this.svgWidth * 0.05;
            this.svg.append("text").attr("id", "Chemical").attr("font-size", fontSize).attr("x", 0).attr("y", this.svgHeight + fontSize / 1.05).attr("fill", "white").text("Chemical Distribution for: Strontium");
        }
    }, {
        key: "update",
        value: function update(selection) {
            // Creates an array for possible selection of elements
            d3.select("#Chemical").text("Chemical Distribution for: " + selection.Name);
            var Columns = this.starData.columns;
            if (Columns.indexOf(selection.symbol) > -1) {
                // Galaxy Scale
                var galaxyScale = d3.scaleLinear().domain([-22104, 22104]).range([-this.svgHeight / this.rangeScale, this.svgHeight / this.rangeScale]);
                // Color scale
                var ColorScale = d3.scaleLinear().domain([d3.min(this.starData, function (d) {
                    return parseFloat(d[selection.symbol]);
                }), d3.max(this.starData, function (d) {
                    return parseFloat(d[selection.symbol]);
                })]).range(["black", "red"]);

                this.svg.selectAll("circle").transition().duration(1000).attr("r", function (d) {
                    var Radius = 3.5;
                    if (isNaN(parseFloat(d[selection.symbol])) | isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y))) {
                        Radius = 0.0;
                    }
                    return Radius;
                }).style("fill", function (d) {
                    return ColorScale(+d[selection.symbol]);
                });
            }
        }
    }]);

    return Galaxy;
}();