// set the dimensions and margins of the graph
const scatterMargin = {left:50, right:50, bottom:50, top:50}; 
const scatterWidth = 600 - scatterMargin.left - scatterMargin.right; 
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
        const healthGroup = ["PCT_DIABETES_ADULTS13", "PCT_OBESE_ADULTS13"];

        let filteredData = finalData.filter(function (row) {
            return counties.includes(row['FIPS']);
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

        const dataReady = healthGroup.map(function(grpName) {
            return {
                name: grpName,
                values: allData.map(function(d) {
                    return {lAccessPop: d.PCT_LACCESS_POP15, value: d[grpName]}
                })
            }
        });

        // scatterSvg.selectAll("circle").remove();

        /*
        Scatterplot
        */
        const colorScale = d3.scaleLinear()
	                                .domain([0, 100])
	                                .range(["#ffa474", "#8b0000"]);

        let xScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([scatterMargin.left, scatterWidth - scatterMargin.right]);
        
        // Add x axis to svg
        scatterSvg.append("g") // g is a "placeholder" svg
                    .attr("transform", `translate(0,${scatterHeight - scatterMargin.bottom})`) 
                    // ^ moves axis to bottom of svg 
                    .call(d3.axisBottom(xScale).tickFormat(x => (x == 0 || x == 100) ? x : "")) // built in function for bottom
        
        let yScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([scatterHeight - scatterMargin.bottom, scatterMargin.top]);
        
        // Add y axis to svg
        scatterSvg.append("g") // g is a "placeholder" svg
                    .attr("transform", `translate(${scatterMargin.left}, 0)`) 
                    // ^ move axis inside of left margin
                    .call(d3.axisLeft(yScale).tickFormat(y => (y == 0 || y == 100) ? y : "")) // built in function for left
        
        let shape = d3.scaleOrdinal(healthGroup, d3.symbols.map(s => d3.symbol().type(s)()));        
    
        // Add the data points
        scatterSvg.selectAll("myDots")
                    .data(dataReady)
                    .enter()
                    .append("g")
                        .attr("d", d => d3.symbol().type(function(d) 
                                                            { if (d.name == "PCT_DIABETES_ADULTS13") { return d3.symbolCircle}
                                                            else { return d3.symbolDiamond } }))
                    .selectAll("myPoints")
                    .data(function(d) { return d.values })
                    .enter()
                    .append("g")
                        .attr("transform", function(d){ return "translate(" + xScale(d.lAccessPop) + "," + yScale(d.value) + ")" });
        
        /* 
        Legend 
        */
       
        let defs = scatterSvg.append("defs");

        let linearGradient = defs.append("linearGradient")
                                    .attr("id", "linear-gradient");
            
        linearGradient.attr("x1", "0%")
                        .attr("y1", "0%")
                        .attr("x2", "100%")
                        .attr("y2", "0%");
        
        // Set the color for the start (0%)
        linearGradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", "#73c5b7"); // light blue

        // Set the color for the end (100%)
        linearGradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#3086ac"); // dark blue
        
        // Draw the rectangle and fill with gradient
        scatterSvg.append("rect")
                    .attr("width", scatterWidth)
                    .attr("height", 20)
                    .style("fill", "url(#linear-gradient)");
    });
}


// // find max X
// let maxX = 100;

// // find max Y 
// let maxY = 100;

// let xScale = d3.scaleLinear() // linear scale because we have 
//                               // linear data 
//                 .domain([0, maxX])  // inputs for the function
//                 .range([margin.left, width - margin.right]); 
//                 // ^ outputs for the function 

// let yScale = d3.scaleLinear()
//                 .domain([0, maxY])
//                 .range([height - margin.bottom, margin.top]);

// // Add x axis to svg
// scatterSvg.append("g") // g is a "placeholder" svg
//             .attr("transform", `translate(0,${height - margin.bottom})`) 
//             // ^ moves axis to bottom of svg 
//             .call(d3.axisBottom(xScale).tickFormat(x => (x == 0 || x == 100) ? x : "")) // built in function for bottom
//             .attr("font-size", '20px'); // set font size

// // Add y axis to svg
// scatterSvg.append("g") // g is a "placeholder" svg
//             .attr("transform", `translate(${margin.left}, 0)`) 
//             // ^ move axis inside of left margin
//             .call(d3.axisLeft(yScale).tickFormat(y => (y == 0 || y == 100) ? y : "")) // built in function for left
//              .attr("font-size", '20px'); // set font size

// scatterSvg.selectAll("myDots")
//             .data(seriesData)
//             .enter()
//             .append('g')
//             .attr("fill", (d) => { return myColor(d.keys) })
//             .selectAll("myPoints")
//             .data( (d) => { return d.values() })
//             .enter()
//             .append("circle")
//             .attr("cx", (d) => { return xScale(d.x) } )
//             .attr("cy", (d) => { return yScale(d.y) } )
//             .attr("r", 5)

// let defs = scatterSvg.append("defs");

// let linearGradient = defs.append("linearGradient")
//     .attr("id", "linear-gradient");
    
// linearGradient.attr("x1", "0%")
//                 .attr("y1", "0%")
//                 .attr("x2", "100%")
//                 .attr("y2", "0%");

// scatterSvg.append("rect")
//             .attr("width", width)
//             .attr("height", 20)
//             .style("fill", "url(#linear-gradient)");