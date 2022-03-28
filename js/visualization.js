//This is filler -- delete it and start coding your visualization tool here
// d3.select("#vis-container")
//   .append("text")
//   .attr("x", 20)
//   .attr("y", 20)
//   .text("Hello World!");

// d3.json("js/food-desert.geojson").then(function (bb) {
//   let width = 800,
//     height = 800;
//   let projection = d3.geoAlbersUsa();
//   projection.fitSize([width, height], bb);
//   let geoGenerator = d3.geoPath().projection(projection);

//   let svg = d3
//     .select("#vis-container")
//     .append("svg")
//     .style("width", width)
//     .style("height", height);

//   svg
//     .append("g")
//     .selectAll("path")
//     .data(bb.features)
//     .join("path")
//     .attr("d", geoGenerator)
//     .attr("fill", "#088")
//     .attr("stroke", "#000");
// });

projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
path = d3.geoPath();
us = FileAttachment("counties-albers-10m.json").json();

topojson = require("topojson-client@3");
d3 = require("d3-geo@2");
