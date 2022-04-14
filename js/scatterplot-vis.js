// Set the dimensions and margins of the graph
const scatterMargin = {left:50, right:50, bottom:50, top:50}; 
const scatterWidth = 500 - scatterMargin.left - scatterMargin.right; 
const scatterHeight = 400 - scatterMargin.top - scatterMargin.bottom; 

// Add an svg to build within using deminsions set above
let scatterSvg = d3.select("#scatterplot-vis")
                    .append("svg")
                    .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                    .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                    .attr("viewBox", [0, 0, scatterWidth, scatterHeight]);

updateScatter();

function updateScatter() {
    // Create scatter plot given a dataset
    d3.csv("data/finaldata.csv").then((finalData) => {
        // Set the label groups for the multiple series scatter plot
        const healthGroup = ["diabetes", "obesity"];

        // Filter data to return only from the global counties list
        let filteredData = finalData.filter(function (row) {
            return counties.includes(row["FIPS"]);
        });

        // Return a dictionary format of all data
        let allData = filteredData.map(function(d) {
            return {
                lat: d.Latitude,
                long: d.Longitude,
                fips: d.FIPS,
                state: d.State,
                county: d.County,
                diabetes: d.PCT_DIABETES_ADULTS13,
                obesity: d.PCT_OBESE_ADULTS13,
                lAccessPop: d.PCT_LACCESS_POP15,
                lAccessWhite: d.PCT_LACCESS_WHITE15,
                lAccessBlack: d.PCT_LACCESS_BLACK15,
                lAccessHisp: d.PCT_LACCESS_HISP15,
                lAccessNHAsian: d.PCT_LACCESS_NHASIAN15,
                lAccessNHNA: d.PCT_LACCESS_NHNA15,
                lAccessNHPI: d.PCT_LACCESS_NHPI15,
                lAccessMulti: d.PCT_LACCESS_MULTIR15
            }
        });

        // clear all points and axes
        scatterSvg.selectAll("circle").remove();
        scatterSvg.selectAll("g").remove();

        // Format data for svg
        const dataReady = healthGroup.map(function(grpName) {
            return {
                name: grpName,
                values: allData.map(function(d) {
                    return {lowAccess: d.lAccessPop, value: +d[grpName], countyName: d.county, stateName: d.state}
                })
            }
        });

        // Return color key based on health rate group
        const myColor = d3.scaleOrdinal()
                            .domain(healthGroup)
                            .range([d3.schemeSet3[0], d3.schemeSet3[2]]);

        // Add title to top of scatter plot
        scatterSvg.append("text")
                    .attr("x", scatterWidth / 2)
                    .attr("y", scatterMargin.top - 20)
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .text("Health Rates vs. Low Access to Grocery Stores");

        // Return the linear x scale from 0 to 100
        let xScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([scatterMargin.left, scatterWidth - scatterMargin.right]);
        
        // Add x axis to svg
        scatterSvg.append("g")
                    .attr("transform", `translate(0,${scatterHeight - scatterMargin.bottom})`) 
                    .call(d3.axisBottom(xScale).tickFormat(x => (x == 0 || x == 100) ? x : ""));
        // Add x axis label to svg
        scatterSvg.append("text")
                    .attr("x", scatterWidth / 2)
                    .attr("y", scatterHeight - 20)
                    .attr("text-anchor", "middle")
                    .style("font-size", "10px")
                    .text("% Population Low Access to Grocery Store");

        // Return the linear y scale from 0 to 100
        let yScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([scatterHeight - scatterMargin.bottom, scatterMargin.top]);
        
        // Add y axis to svg
        scatterSvg.append("g")
                    .attr("transform", `translate(${scatterMargin.left}, 0)`) 
                    .call(d3.axisLeft(yScale).tickFormat(y => (y == 0 || y == 100) ? y : ""));
        // Add y axis label to svg
        scatterSvg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "rotate(-90)")
                    .attr("y", scatterHeight - 280)
                    .attr("x", -scatterWidth / 2 + 40)
                    .style("font-size", "10px")
                    .text("% Adult Population w/ Health Condition");
        
        // Create a handmade legend of health rates
        scatterSvg.append("circle")
                    .attr("cx", scatterWidth / 2 - 60)
                    .attr("cy", scatterHeight)
                    .attr("r", 5)
                    .style("fill", d3.schemeSet3[0])
                    .attr("stroke", "white");
        scatterSvg.append("circle")
                    .attr("cx", scatterWidth / 2 + 50)
                    .attr("cy", scatterHeight)
                    .attr("r", 5)
                    .style("fill", d3.schemeSet3[2])
                    .attr("stroke", "white");
        scatterSvg.append("text")
                    .attr("x", scatterWidth / 2 - 50)
                    .attr("y", scatterHeight)
                    .text("Diabetes")
                    .style("font-size", "10px")
                    .attr("alignment-baseline", "middle");
        scatterSvg.append("text")
                    .attr("x", scatterWidth / 2 + 60)
                    .attr("y", scatterHeight)
                    .text("Obesity")
                    .style("font-size", "10px")
                    .attr("alignment-baseline", "middle");

        // Create a tooltip to display county and state of highlighted 
        let scatterToolTip = d3.select("#scatterplot-vis")
                                .append("div")
                                .style("opacity", 0)
                                .attr("class", "tooltip")
                                .attr('id', "tooltip-map")
                                .style("background-color", "white")
                                .style("border", "solid")
                                .style("border-width", "1px")
                                .style("border-radius", "5px")
                                .style("padding", "10px");
            
        // Add data points and tooltip to scatter plot
        scatterSvg.selectAll("myDots")
                    .data(dataReady)
                    .enter()
                    .append("g")
                        .style("fill", function(d){ return myColor(d.name) })
                    .selectAll("myPoints")
                    .data(function(d) { return d.values })
                    .enter()
                    .append("circle")
                        .attr("cx", function(d) { return xScale(d.lowAccess) } )
                        .attr("cy", function(d) { return yScale(d.value) } )
                        .attr("r", 5)
                        .attr("stroke", "white")
                    .on("mouseover", function(event, d) { 
                                        scatterToolTip.html(d.countyName + ", " + d.stateName)
                                                        .style("opacity", 1);
                                        d3.select(this).transition()
                                            .duration("50")
                                            .attr("opacity", ".75"); })
                    .on("mousemove", function(event, d) {
                                        scatterToolTip.style("left", (event.pageX + 5)+"px")
                                                        .style("top", (event.pageY - 25) +"px"); })
                    .on("mouseleave", function(d) { 
                                        scatterToolTip.style("opacity", 0); 
                                        d3.select(this).transition()
                                            .duration("50")
                                            .attr("opacity", "1"); });
    });
}