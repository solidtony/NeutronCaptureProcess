"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScatterPlot = function () {
    function ScatterPlot(starData) {
        _classCallCheck(this, ScatterPlot);

        //Creating star data instance
        this.starData = starData;

        //Selects the div
        var div = d3.select("#scatterPlt").classed("content", true);

        //Initializes the svg elements required for pTable chart
        this.margin = { top: 30, right: 15, bottom: 30, left: 25 };
        var svgBounds = div.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth * 0.55;

        //Adds svg to the div
        this.svg = div.append("svg").attr("width", this.svgWidth).attr("height", this.svgHeight).attr("transform", "translate(0, 0)");

        //Appends axis to svg
        this.svg.append("g").attr("id", "xAxis").attr("class", "axisWhite");
        this.svg.append("g").attr("id", "yAxis").attr("class", "axisWhite");
        this.svg.append("g").attr("id", "circs").attr("class", "axisWhite");
    }

    _createClass(ScatterPlot, [{
        key: "update",
        value: function update(xSelected, ySelected, cSelected) {
            ///////
            // Plotting scatter plot

            //Axis
            let cbActive = document.getElementById("sp_checkbox").checked;

            function y_data(d)
            {
                if( cbActive ){ return (parseFloat(d[ySelected]) - parseFloat(d[xSelected])); }
                else { return parseFloat(d[ySelected]); }
            }
            
            var xbuffer = 55.5;
            var ybuffer = 20;
            var pad = 0.1;
            var r = 2.5;

            var d_time = 1000;

            var xmax = d3.max(this.starData, function (d) {
                return parseFloat(d[xSelected]);
            });
            var xmin = d3.min(this.starData, function (d) {
                return parseFloat(d[xSelected]);
            });
            var ymax = d3.max(this.starData, y_data);
            var ymin = d3.min(this.starData, y_data);
            var cmax = d3.max(this.starData, function (d) {
                return parseFloat(d[cSelected]);
            });
            var cmin = d3.min(this.starData, function (d) {
                return parseFloat(d[cSelected]);
            });

            //X scale
            var xScale = d3.scaleLinear().domain([xmin, xmax]).range([r + xbuffer, this.svgWidth - r]);
            //Y scale
            var yScale = d3.scaleLinear().domain([ymax, ymin]).range([r, this.svgHeight - ybuffer - r]);
            var cScale = d3.scaleLinear().domain([cmin, cmax]).range(["#a21201", "#0ae4d3"]);

            //x-axis setup
            var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format(".2f"));
            d3.select("#xAxis").attr("transform", "translate( 0, " + (this.svgHeight - ybuffer) + ")").transition().duration(d_time).call(xAxis);
            d3.select("#xAxis").selectAll("text");
            //y-axis setup
            var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format(".2f"));
            d3.select("#yAxis").attr("transform", "translate(" + xbuffer + ", 0)").transition().duration(d_time).call(yAxis);

            //Plots data
            var circs = d3.select("#circs").selectAll("circle").data(this.starData);

            var circsNew = circs.enter().append("circle");
            circs.exit().remove;
            circs = circsNew.merge(circs);

            circs.transition().duration(d_time).attr("cx", function (d) {
                if (isNaN(parseFloat(d[xSelected])) | isNaN(parseFloat(d[ySelected])) | isNaN(parseFloat(d[cSelected]))) {
                    return -2*r;
                } else {
                    return xScale(parseFloat(d[xSelected]));
                }
            }).attr("cy", function (d) {
                if (isNaN(parseFloat(d[xSelected])) | isNaN(parseFloat(d[ySelected])) | isNaN(parseFloat(d[cSelected]))) {
                    return 0;
                } else {
                    return yScale(y_data(d));
                }
            }).attr("r", r).style("fill", function (d) {
                if (isNaN(parseFloat(d[xSelected])) | isNaN(parseFloat(d[ySelected])) | isNaN(parseFloat(d[cSelected]))) {
                    return "black";
                } else {
                    return cScale(+d[cSelected]);
                }
            });

            //////
            // Brush selection
            this.svg.select("#brush").remove();
            this.svg.append("g").attr("id", "brush").call(d3.brush().extent([[xbuffer, 0], [this.svgWidth, this.svgHeight - ybuffer]]).on("brush", brushed).on("end", brushended));

            var self = this;
            function brushed() {
                var s = d3.event.selection,
                    x0 = s[0][0],
                    y0 = s[0][1],
                    dx = s[1][0] - x0,
                    dy = s[1][1] - y0;

                self.svg.selectAll('circle').classed("unselected", function (d) {
                    if (xScale(parseFloat(d[xSelected])) >= x0 && xScale(parseFloat(d[xSelected])) <= x0 + dx && yScale(y_data(d)) >= y0 && yScale(parseFloat(y_data(d))) <= y0 + dy) {
                        return false;
                    } else {
                        return true;
                    }
                });

                d3.select("#GPlot").selectAll('circle').classed("unselected", function (d) {
                    if (xScale(parseFloat(d[xSelected])) >= x0 && xScale(parseFloat(d[xSelected])) <= x0 + dx && yScale(parseFloat(y_data(d))) >= y0 && yScale(parseFloat(y_data(d))) <= y0 + dy) {
                        return false;
                    } else {
                        return true;
                    }
                });
            };

            function brushended() {
                if (!d3.event.selection) {
                    self.svg.selectAll('circle').classed("unselected", false);

                    d3.select("#GPlot").selectAll('circle').classed("unselected", false);
                }
            }
        }
    }]);

    return ScatterPlot;
}();