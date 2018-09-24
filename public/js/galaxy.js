class Galaxy {

    constructor (starData)
    {

        //Creating star data instance
        this.starData = starData;

        //Selects the div
        let div = d3.select("#GPlot").classed("galaxy", true);

        //Initializes the svg elements required for pTable chart
        this.margin = {top: 15, right: 20, bottom: 40, left: 20};
        let svgBounds = div.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth;

        //Adds svg to the div
        this.svg = div.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight+this.svgHeight*0.056)
            .attr("transform", "translate(0, 0)");

        ///////// Background: Start //////////////
        //Appends background to svg future
        this.svg.append("defs")
            .append("pattern")
            .attr("id", "background")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .append("image")
            .attr("xlink:href", "./data/milky_way_anota_2000.jpg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);

        this.svg.append("rect")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("fill", "url(#background)");
        ///////// Background: End ////////////////
        this.rangeScale = 1.65;
    };

///////////////////// Tool Tip Function
    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data)
    {
        let text = "<h2 class = atomicName> Star Name:  " + tooltip_data.StarName + "</h2>";
        text += "<h2 class = atomicName> Distance to the Sun:  " + tooltip_data.rS + "(ly) </h2>";
        text += "<h2 class = atomicName> Surface Temperature:  " + tooltip_data.Teff + "(K) </h2>";
        text += "<h2 class = atomicName> Log of the Surface Gravity:  " + tooltip_data.logg + "(dexs) </h2>";
        text += "<h2 class = atomicName> Avg. Chemical Enrichment:  " + tooltip_data.Fe_H + "(dexs) </h2>";
        text += "<h2 class = atomicName> Reference:  " + tooltip_data.Ref + "</h2>";

        return text;
    };
//////////////////////

    create ()
    {
        //////////
        // Plotting galaxy location data
        //Used to shift position of stars
        let shiftX = this.svgWidth/2.0;
        let shiftY = this.svgHeight/1.89;
        let maxN = d3.max(this.starData, function(d)
            {
                return parseInt(d.StarName);
            });
        // galaxy scale
        let galaxyScale = d3.scaleLinear()
            .domain([-22104, 22104])
            .range([-this.svgHeight/this.rangeScale, this.svgHeight/this.rangeScale]);
        // Color scale
        let ColorScale = d3.scaleLinear()
            .domain([d3.min( this.starData, d => parseFloat(d.Sr) ), d3.max( this.starData, d => parseFloat(d.Sr) )])
            .range(["black", "red"]);

        //Creates circles for star data
        let circ = this.svg.selectAll("circle")
            .data(this.starData);
        let circNew = circ.enter().append("circle");
        circ.exit().remove();
        circ = circNew.merge(circ);

        circ.attr("cx", d =>
            {
                if( isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y)) )
                {
                    return 0;
                }
                else
                {
                    return galaxyScale(+d.Coord_X)+shiftX;
                }
            })
            .attr("cy", d =>
            {
                if( isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y)) )
                {
                    return 0;
                }
                else
                {
                    return galaxyScale(+d.Coord_Y*(-1))+shiftY;
                }
            })
            .attr("r", d => {
                let Radius = 3.5;
                // Radius = galaxyScale(d.logg*100);
                if( isNaN(parseFloat(d.Sr)) | isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y))  ){ Radius = 0.0; }
                return Radius;
            })
            .style("fill", d =>
            {
                return ColorScale(d.Sr);
            });

        //////////

        ///////////////////////////////
//// PTable ToolTip :Start ////
///////////////////////////////
        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
            let tip = d3.tip().attr('class', 'd3-tip')
                .direction('sw')
                .offset(function() {
                    return [0,0];
                })
                .html((d)=>{
                    // populate data in the following format
                    let tooltip_data =
                    {
                        "StarName": String(d.StarName),
                        "rS": Math.sqrt(parseFloat(d.Coord_X)*parseFloat(d.Coord_X)+parseFloat(d.Coord_Y)*parseFloat(d.Coord_Y)+parseFloat(d.Coord_Z)*parseFloat(d.Coord_Z)).toFixed(0),
                        "Teff": parseFloat(d.Teff).toFixed(0),
                        "Fe_H": parseFloat(d.Fe).toFixed(2),
                        "logg": parseFloat(d.logg).toFixed(2),
                        "Ref": String(d.Reference)
                    }
                    //pass this as an argument to the tooltip_render function then,
                    //return the HTML content returned from that method.

                    return this.tooltip_render(tooltip_data);
                });

        //tip for element rectangles
        circ.call(tip);
        let self = this;
        circ.on("mouseover", function(d)
            {
                d3.select(this).classed("selected", true);
                tip.show(d);
            })
            .on("mouseout", function(d)
            {
                d3.select(this).classed("selected", false);
                tip.hide(d);
            });

        /////// Text for selected element
        let fontSize = this.svgWidth*0.05
        this.svg.append("text")
            .attr("id", "Chemical")
            .attr("font-size", fontSize)
            .attr("x", 0)
            .attr("y", this.svgHeight+fontSize/1.05)
            .attr("fill", "white")
            .text("Chemical Distribution for: Strontium")
    };

    update(selection)
    {
        // Creates an array for possible selection of elements
        d3.select("#Chemical").text("Chemical Distribution for: "+selection.Name)
        let Columns = this.starData.columns
        if (Columns.indexOf(selection.symbol) > -1)
        {
            // Galaxy Scale
        let galaxyScale = d3.scaleLinear()
            .domain([-22104, 22104])
            .range([-this.svgHeight/this.rangeScale, this.svgHeight/this.rangeScale]);
            // Color scale
        let ColorScale = d3.scaleLinear()
            .domain([ d3.min(this.starData, d => parseFloat(d[selection.symbol]) ), d3.max(this.starData, d => parseFloat(d[selection.symbol]) ) ])
            .range(["black", "red"]);

            this.svg.selectAll("circle")
                .transition().duration(1000)
                .attr("r", d => 
                {
                    let Radius = 3.5;
                    //let Radius = galaxyScale(d.logg*100);
                    if( isNaN(parseFloat(d[selection.symbol])) | isNaN(parseFloat(d.Coord_X)) | isNaN(parseFloat(d.Coord_Y)) ){ Radius = 0.0; }
                    return Radius;
                })
                .style("fill", d => 
                {
                    return ColorScale(+d[selection.symbol]);
                });
        }
    };

}
