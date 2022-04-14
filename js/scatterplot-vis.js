// set the dimensions and margins of the graph
const scatterMargin = {left:50, right:50, bottom:50, top:50}; 
const scatterWidth = 500 - scatterMargin.left - scatterMargin.right; 
const scatterHeight = 400 - scatterMargin.top - scatterMargin.bottom; 

// add an svg to build within using deminsions set above
let scatterSvg = d3.select("#scatterplot-vis")
                    .append("svg")
                    .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                    .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                    .attr("viewBox", [0, 0, scatterWidth, scatterHeight]);

updateScatter();

function updateScatter() {
    d3.csv("data/finaldata.csv").then((finalData) => {
        /*
        Data
        */
        const healthGroup = ["diabetes", "obesity"];

        let filteredData = finalData.filter(function (row) {
            return counties.includes(row["FIPS"]);
        });

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

        scatterSvg.selectAll("circle").remove();
        scatterSvg.selectAll('g').remove();

        const dataReady = healthGroup.map(function(grpName) {
            return {
                name: grpName,
                values: allData.map(function(d) {
                    return {lowAccess: d.lAccessPop, value: +d[grpName]}
                })
            }
        });

        const myColor = d3.scaleOrdinal()
                            .domain(healthGroup)
                            .range(d3.schemeSet2);

        let xScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([scatterMargin.left, scatterWidth - scatterMargin.right]);
        
        // Add x axis to svg
        scatterSvg.append("g")
                    .attr("transform", `translate(0,${scatterHeight - scatterMargin.bottom})`) 
                    .call(d3.axisBottom(xScale).tickFormat(x => (x == 0 || x == 100) ? x : ""))
        
        let yScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([scatterHeight - scatterMargin.bottom, scatterMargin.top]);
        
        // Add y axis to svg
        scatterSvg.append("g")
                    .attr("transform", `translate(${scatterMargin.left}, 0)`) 
                    .call(d3.axisLeft(yScale).tickFormat(y => (y == 0 || y == 100) ? y : ""))
        
        // Add x axis label
        scatterSvg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("x", scatterWidth / 2)
                    .attr("y", scatterHeight + scatterMargin.top + 20)
                    .text("% Population Low Access to Grocery Store");

        // Add y axis label
        scatterSvg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -scatterMargin.left + 20)
                    .attr("x", -scatterMargin.top)
                    .text("% Adult Population w/ Health Condition")
                
        scatterSvg.append("circle")
                    .attr("cx", 250)
                    .attr("cy", 650)
                    .attr("r", 5)
                    .style("fill", d3.schemeSet2[0])
                    .attr("stroke", "white");
        scatterSvg.append("circle")
                    .attr("cx", 300)
                    .attr("cy", 650)
                    .attr("r", 5)
                    .style("fill", d3.schemeSet2[1])
                    .attr("stroke", "white");
        scatterSvg.append("text")
                    .attr("x", 210)
                    .attr("y", 650)
                    .text("Diabetes")
                    .style("font-size", "15px")
                    .attr("alignment-baseline", "middle");
        scatterSvg.append("text")
                    .attr("x", 310)
                    .attr("y", 650)
                    .text("Obesity")
                    .style("font-size", "15px")
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
            
        // let mouseover = function(event, d) {
        //     scatterToolTip.html(d.allData[county] + ", " + d.allData[state])
        //                     .style("opacity", 1);
        // }

        // let mousemove = function(event, d) {
        //     scatterToolTip.style("left", (event.pageX + 5)+"px")
        //                     .style("top", (event.pageY - 25) +"px");
        // }
      
        // let mouseleave = function(d) {
        //     scatterToolTip.style("opacity", 0);
        // }

        // Add the data points
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
                                        scatterToolTip.html(d.allData[county] + ", " + d.allData[state])
                                                        .style("opacity", 1);
                                        d3.select(this).transition()
                                            .duration("50")
                                            .attr("opacity", ".80"); })
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