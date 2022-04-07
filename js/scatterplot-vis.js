const width = 900; 
const height = 450; 
const margin = {left:50, right:50, bottom:50, top:50}; 

// add an svg to build within using deminsions set above
let scatterSvg = d3.select("#scatterplot-vis")
                    .append("svg")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", height - margin.top - margin.bottom)
                    .attr("viewBox", [0, 0, width, height]);

const seriesData = [[{"x":20, "y":30}, {"x":35, "y":60}, {"x":60, "y":70}],
                    [{"x":20, "y":50}, {"x":35, "y":40}, {"x":60, "y":65}]];

let seriesNames = ["Diabetes", "Obesity"];

let myColor = d3.scaleOrdinal()
                .domain(seriesNames)
                .range(d3.schemeSet2);

// find max X
let maxX = 100;

// find max Y 
let maxY = 100;

let xScale = d3.scaleLinear() // linear scale because we have 
                              // linear data 
                .domain([0, maxX])  // inputs for the function
                .range([margin.left, width - margin.right]); 
                // ^ outputs for the function 

let yScale = d3.scaleLinear()
                .domain([0, maxY])
                .range([height - margin.bottom, margin.top]); 

// Add x axis to svg
scatterSvg.append("g") // g is a "placeholder" svg
            .attr("transform", `translate(0,${height - margin.bottom})`) 
            // ^ moves axis to bottom of svg 
            .call(d3.axisBottom(xScale).tickFormat(x => (x == 0 || x == 100) ? x : "")) // built in function for bottom
            .attr("font-size", '20px'); // set font size

// Add y axis to svg
scatterSvg.append("g") // g is a "placeholder" svg
            .attr("transform", `translate(${margin.left}, 0)`) 
            // ^ move axis inside of left margin
            .call(d3.axisLeft(yScale).tickFormat(y => (y == 0 || y == 100) ? y : "")) // built in function for left
             .attr("font-size", '20px'); // set font size

scatterSvg.append("myDots").selectAll("myDots")
            .data(seriesData)
            .enter()
            .attr("fill", (d) => { return myColor(d.key) })
            .append("myPoints").selectAll("myPoints")
            .data((d) => { return d.values() })
            .enter()
            .append("circle")
            .attr("cx", (d) => { return xScale(d.x) } )
            .attr("cy", (d) => { return yScale(d.y) } )
            .attr("r", 5)

let defs = scatterSvg.append("defs");

let linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient");
    
linearGradient.attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");

// scatterSvg.append("rect")
//             .attr("width", width)
//             .attr("height", 20)
//             .style("fill", "url(#linear-gradient)");