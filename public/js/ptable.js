"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PTable = function () {
    function PTable(elements, GPlot, starData) {
        _classCallCheck(this, PTable);

        //Initializes Galaxy.js
        this.GPlot = GPlot;

        //Creating elements data instance
        this.elements = elements;
        this.starData = starData;

        //Selects the tiles
        var divTiles = d3.select("#ptable").classed("content", true);

        //Initializes the svg elements required for pTable chart
        this.margin = { top: 40, right: 20, bottom: 30, left: 50 };
        var svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width; // - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth * 0.65;

        //Adds svg to the div
        this.svg = divTiles.append("svg").attr("width", this.svgWidth).attr("height", this.svgHeight - this.margin.bottom).attr("transform", "translate(0, 0)");
    }

    _createClass(PTable, [{
        key: "tooltip_render",


        ///////////////////// Tool Tip Function
        /**
         * Renders the HTML content for tool tip.
         *
         * @param tooltip_data information that needs to be populated in the tool tip
         * @return text HTML content for tool tip
         */
        value: function tooltip_render(tooltip_data) {
            var text = "<h2 class = atomicName>" + tooltip_data.Name + " (" + tooltip_data.symbol + ") </h2>"; //Change class here future
            text += "Atomic mass: " + tooltip_data.atomicMass + "(au)";
            text += "<ul>";
            tooltip_data.info.forEach(function (row) {
                //if (row.votecount == "" || row.party == "" || row.nominee == "") {}
                text += "<li class = " + row.type + ">" + row.entry + "\t\t" + "</li>";
            });
            text += "</ul>";

            return text;
        }
        //////////////////////

    }, {
        key: "create",
        value: function create() {
            var _this = this;

            ///////////////////
            //Calculates the maximum number of rows and columns to be laid out on the svg
            var maxColumns = d3.max(this.elements, function (d) {
                return parseInt(d.col);
            });

            var maxRows = d3.max(this.elements, function (d) {
                return parseInt(d.row);
            });

            /////////////////////////////
            //// PTable Tiles :Start ////
            /////////////////////////////
            //Rectangle sizes and position
            var CurrentPos = 0;
            var padding = 2;
            var rectWidth = this.svgWidth / (maxColumns + 1) - 2 * padding - 1;
            var rectHeight = this.svgHeight / (maxRows + 1) - 2 * padding - 1;

            /////////////////// Source of the elements
            //Big Bang Fusion rectangles
            var bbF = this.svg.selectAll(".bbF").data(this.elements).enter().append("rect").attr("class", "bbf").classed("BigBangFusion", true).attr("width", rectWidth).attr("height", function (d) {
                return rectHeight * d.BigBangFusion;
            }).attr("x", function (d) {
                return d.col * rectWidth + d.col * padding + padding;
            }).attr("y", function (d) {
                CurrentPos = +d.CurrentPosition;
                d.CurrentPosition = CurrentPos + parseFloat(d.BigBangFusion);
                return d.row * rectHeight + CurrentPos * rectHeight + d.row * padding + padding;
            });

            //Cosmic Ray Fission rectangles
            var crF = this.svg.selectAll(".crF").data(this.elements).enter().append("rect").attr("class", "crf").classed("CosmicRayFission", true).attr("width", rectWidth).attr("height", function (d) {
                return rectHeight * d.CosmicRayFission;
            }).attr("x", function (d) {
                return d.col * rectWidth + d.col * padding + padding;
            }).attr("y", function (d) {
                CurrentPos = +d.CurrentPosition;
                d.CurrentPosition = CurrentPos + parseFloat(d.CosmicRayFission);
                return d.row * rectHeight + CurrentPos * rectHeight + d.row * padding + padding;
            });

            //Merging Neutron Stars rectangles
            var mns = this.svg.selectAll(".mns").data(this.elements).enter().append("rect").attr("class", "mns").classed("MergingNeutronStars", true).attr("width", rectWidth).attr("height", function (d) {
                return rectHeight * d.MergingNeutronStars;
            }).attr("x", function (d) {
                return d.col * rectWidth + d.col * padding + padding;
            }).attr("y", function (d) {
                CurrentPos = +d.CurrentPosition;
                d.CurrentPosition = CurrentPos + parseFloat(d.MergingNeutronStars);
                return d.row * rectHeight + CurrentPos * rectHeight + d.row * padding + padding;
            });

            //Exploding Massive Stars rectangles
            var ems = this.svg.selectAll(".ems").data(this.elements).enter().append("rect").attr("class", "ems").classed("ExplodingMassiveStars", true).attr("width", rectWidth).attr("height", function (d) {
                return rectHeight * d.ExplodingMassiveStars;
            }).attr("x", function (d) {
                return d.col * rectWidth + d.col * padding + padding;
            }).attr("y", function (d) {
                CurrentPos = +d.CurrentPosition;
                d.CurrentPosition = CurrentPos + parseFloat(d.ExplodingMassiveStars);
                return d.row * rectHeight + CurrentPos * rectHeight + d.row * padding + padding;
            });

            //Dying Low Mass Stars rectangles
            var dlms = this.svg.selectAll(".dlms").data(this.elements).enter().append("rect").attr("class", "dlms").classed("DyingLowMassStars", true).attr("width", rectWidth).attr("height", function (d) {
                return rectHeight * d.DyingLowMassStars;
            }).attr("x", function (d) {
                return d.col * rectWidth + d.col * padding + padding;
            }).attr("y", function (d) {
                CurrentPos = +d.CurrentPosition;
                d.CurrentPosition = CurrentPos + parseFloat(d.DyingLowMassStars);
                return d.row * rectHeight + CurrentPos * rectHeight + d.row * padding + padding;
            });

            //Exploding White Dwarfs rectangles
            var ewd = this.svg.selectAll(".ewd").data(this.elements).enter().append("rect").attr("class", "ewd").classed("ExplodingWhiteDwarfs", true).attr("width", rectWidth).attr("height", function (d) {
                return rectHeight * d.ExplodingWhiteDwarfs;
            }).attr("x", function (d) {
                return d.col * rectWidth + d.col * padding + padding;
            }).attr("y", function (d) {
                CurrentPos = +d.CurrentPosition;
                d.CurrentPosition = CurrentPos + parseFloat(d.ExplodingWhiteDwarfs);
                return d.row * rectHeight + CurrentPos * rectHeight + d.row * padding + padding;
            });
            // For s- and r-process 
            ////s-Process rectangles
            //let sp = this.svg.selectAll(".sp")
            //    .data(this.elements)
            //    .enter()
            //    .append("rect")
            //    .attr("class", "sp")
            //    .classed("sProcess", true)
            //    .attr("width", rectWidth)
            //    .attr("height", d => {
            //        return rectHeight*d.sProcess;
            //    })
            //    .attr("x", d => {
            //        return d.col*rectWidth+d.col*padding+padding;
            //    })
            //    .attr("y", d => {
            //        CurrentPos = +d.CurrentPosition;
            //        d.CurrentPosition = CurrentPos + parseFloat(d.sProcess);
            //        return d.row*rectHeight+CurrentPos*rectHeight+d.row*padding+padding;
            //    });
            //    
            ////r-Process rectangles
            //let rp = this.svg.selectAll(".rp")
            //    .data(this.elements)
            //    .enter()
            //    .append("rect")
            //    .attr("class", "rp")
            //    .classed("rProcess", true)
            //    .attr("width", rectWidth)
            //    .attr("height", d => {
            //        return rectHeight*d.rProcess;
            //    })
            //    .attr("x", d => {
            //        return d.col*rectWidth+d.col*padding+padding;
            //    })
            //    .attr("y", d => {
            //        CurrentPos = +d.CurrentPosition;
            //        d.CurrentPosition = CurrentPos + parseFloat(d.rProcess);
            //        return d.row*rectHeight+CurrentPos*rectHeight+d.row*padding+padding;
            //    });
            ///////////////////

            //Creates rect for tiles of the pTable 
            var rect = this.svg.selectAll(".rect").data(this.elements);
            var rectNew = rect.enter().append("rect");
            rect.exit().remove();
            rect = rectNew.merge(rect);

            //Rectangle attributes
            var selectableElements = ["Fe", "Sr", "Y", "Zr", "Nb", "Pd", "Ag", "Eu", "Tb", "Tm", "Hf", "Ir"];
            rect.attr("width", rectWidth).attr("height", rectHeight).attr("x", function (d) {
                return d.col * rectWidth + d.col * padding + padding;
            }).attr("y", function (d) {
                return d.row * rectHeight + d.row * padding + padding;
            })
            //.attr("fill", "white")
            .classed("rect", true).style("stroke", function (d) {
                if (selectableElements.indexOf(d.symbol) > -1) {
                    return "green";
                } else {
                    return "#eee";
                }
            }).style("stroke-width", padding).attr("fill", function (d) {
                if (d.CurrentPosition == 0) {
                    return "grey";
                } else {
                    return "transparent";
                }
            }).classed("selected", function (d) {
                if (d.symbol == "Sr") {
                    return true;
                } else {
                    return false;
                }
            });

            // On click function
            var self = this;
            rect.on("click", function (d) {
                if (selectableElements.indexOf(d.symbol) > -1) {
                    self.GPlot.update(d);
                    // Run function to update plot in the future
                    d3.selectAll("rect").classed("selected", false); //Un-selects previously selected tile
                    d3.select(this).classed("selected", true);
                }
            });
            ///////////////////////////
            //// PTable Tiles :End ////
            ///////////////////////////

            ///////////////////////////////
            //// PTable ToolTip :Start ////
            ///////////////////////////////
            //for reference:https://github.com/Caged/d3-tip
            //Use this tool tip element to handle any hover over the chart
            var tip = d3.tip().attr('class', 'd3-tip').direction('se').offset(function () {
                return [0, 0];
            }).html(function (d) {
                // populate data in the following format
                var tooltip_data = {
                    "Name": d.Name,
                    "symbol": d.symbol,
                    "atomicMass": d.atomicMass, //future need to change something
                    "info": [{ "entry": "Big Bang Fusion: " + parseInt(d.BigBangFusion * 100) + "%", "type": "BigBangFusion" }, { "entry": "Cosmic Ray Fission: " + parseInt(d.CosmicRayFission * 100) + "%", "type": "CosmicRayFission" }, { "entry": "Merging Neutron Stars (r-process): " + parseInt(d.MergingNeutronStars * 100) + "%", "type": "MergingNeutronStars" }, { "entry": "Exploding Massive Stars: " + parseInt(d.ExplodingMassiveStars * 100) + "%", "type": "ExplodingMassiveStars" }, { "entry": "Dying Low Mass Stars (s-process): " + parseInt(d.DyingLowMassStars * 100) + "%", "type": "DyingLowMassStars" }, { "entry": "Exploding White Dwarfs: " + parseInt(d.ExplodingWhiteDwarfs * 100) + "%", "type": "ExplodingWhiteDwarfs"
                        // for s- and r-process
                        //{"entry": "s-Process: "+(d.sProcess*100)+"%", "type": "sProcess"},
                        //{"entry": "r-Process: "+(d.rProcess*100)+"%", "type": "rProcess"}
                    }]
                    //pass this as an argument to the tooltip_render function then,
                    //return the HTML content returned from that method.

                };return _this.tooltip_render(tooltip_data);
            });

            //tip for element rectangles
            rect.call(tip);
            rect.on("mouseover", tip.show).on("mouseout", tip.hide);
            /////////////////////////////
            //// PTable ToolTip :End ////
            /////////////////////////////

            ////////////////////////////
            //// PTable Text :Start ////
            ////////////////////////////
            //Font size from .atomicNumber and .atomicSymbol in style.css
            var N_fontSize = rectWidth * 0.25;
            var S_fontSize = rectWidth * 0.30;
            //Element labels
            var Etext = this.svg.selectAll("text").data(this.elements);
            var EtextNew = Etext.enter().append("text");
            Etext.exit().remove();
            Etext = EtextNew.merge(Etext);

            Etext.text(function (d) {
                return d.atomicNumber;
            }).attr("class", "atomicNumber").attr("font-size", N_fontSize).attr("x", function (d) {
                return d.col * rectWidth + 5.0 + d.col * padding + padding;
            }).attr("y", function (d) {
                return d.row * rectHeight + N_fontSize + 2.5 + d.row * padding + padding;
            }).attr("pointer-events", "none").append("tspan").attr("class", "atomicSymbol").attr("font-size", S_fontSize).attr("y", function (d) {
                return d.row * rectHeight + rectHeight / 2 + S_fontSize / 2 + d.row * padding + padding;
            }).attr("x", function (d) {
                return d.col * rectWidth + rectWidth / 2 + d.col * padding + padding;
            }).text(function (d) {
                return d.symbol;
            });

            ///// Labeling
            this.svg.append("text").attr("fill", "white").attr("x", this.svgWidth / 10).attr("y", this.svgWidth / 38).attr("font-size", this.svgWidth / 36).text("Periodic Table:");
            this.svg.append("text").attr("fill", "white").attr("x", this.svgWidth / 10).attr("y", this.svgWidth / 38 + this.svgWidth / 46).attr("font-size", this.svgWidth / 45).text("Click a green bordered element to display distribution.");
            //////////////////////////
            //// PTable Text :End ////
            //////////////////////////

            ///////////////////
        }
    }]);

    return PTable;
}();