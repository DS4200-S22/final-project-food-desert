const width = 900; 
const height = 450; 
const margin = {left:50, right:50, bottom:50, top:50}; 

// add an svg to build within using deminsions set above
let scatterSvg = d3.select("#scatterplot-vis")
                    .append("svg")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", height - margin.top - margin.bottom)
                    .attr("viewBox", [0, 0, width, height]);

const data1 = [{"x":10, "y":20, "location": "Suffolk, MA"},
                {"x":50, "y":30, "location": "Windham, CT"},
                {"x":30, "y":40, "location": "Hamilton, NY"}]

const data2 = [{"x":20, "y":20, "location": "Suffolk, MA"},
                {"x":40, "y":30, "location": "Windham, CT"},
                {"x": 80, "y":40, "location": "Hamilton, NY"}]

// find max X
let maxX = 100

// find max Y 
let maxY = 100

let xScale = d3.scaleLinear() // linear scale because we have 
                              // linear data 
                .domain([0, maxX])  // inputs for the function
                .range([margin.left, width - margin.right]); 
                // ^ outputs for the function 

let yScale = d3.scaleLinear()
            .domain([0, maxY])
            .range([height - margin.bottom, margin.top]); 

// Add x axis to svg6  
scatterSvg.append("g") // g is a "placeholder" svg
            .attr("transform", `translate(0,${height - margin.bottom})`) 
            // ^ moves axis to bottom of svg 
            .call(d3.axisBottom(xScale)) // built in function for bottom
                                        // axis given a scale function 
            .attr("font-size", '20px'); // set font size

// Add y axis to svg6 
scatterSvg.append("g") // g is a "placeholder" svg
            .attr("transform", `translate(${margin.left}, 0)`) 
            // ^ move axis inside of left margin
            .call(d3.axisLeft(yScale)) // built in function for left
                                        // axis given a scale function 
            .attr("font-size", '20px'); // set font size

// great, we have axes! next, let's add points just like before
// but using our scale functions 
scatterSvg.selectAll("circle") 
            .data(data1)
            .enter()  
            .append("circle")
            .attr("cx", (d) => xScale(d.x)) // use xScale to return 
                                            // pixel value for given
                                            // datum 
            .attr("cy", (d) => yScale(d.y)) // use yScale to return 
                                            // pixel value for given
                                            // datum 
            .attr("r", 10) 
            // we could also set color based on data useing a 
            // colormap, which like scale functions, maps data to 
            // colors 

scatterSvg.selectAll("text")
            .data(data1)
            .enter()
            .append("text")
            .text((d) => d.location);