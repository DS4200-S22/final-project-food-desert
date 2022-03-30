// //This is filler -- delete it and start coding your visualization tool here
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

//   let counties = topojson.feature(us, us.objects.counties).features;
//   console.log(counties);

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

//https://d3js.org/us-10m.v1.json

d3.json("https://d3js.org/us-10m.v1.json").then(function (us) {
  // if (error) {
  //   console.log("Error!");
  //   console.log(error);
  // }

  console.log(us);

  let width = 1000,
    height = 800;

  let svg = d3
    .select("#vis-container")
    .append("svg")
    .style("width", width)
    .style("height", height);

  let path = d3.geoPath();

  svg
    .append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path);

  svg
    .append("path")
    .attr("class", "state-borders")
    .attr(
      "d",
      path(
        topojson.mesh(us, us.objects.states, function (a, b) {
          return a !== b;
        })
      )
    );

  let zoom = d3.behavior.zoom().on("zoom", function () {
    g.attr(
      "transform",
      "translate(" +
        d3.event.translate.join(",") +
        ")scale(" +
        d3.event.scale +
        ")"
    );
    g.selectAll("path").attr("d", path.projection(projection));
  });

  svg.call(zoom);
});

// projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
// path = d3.geoPath().projection(projection);
// us = FileAttachment("counties-albers-10m.json").json();

// topojson = require("topojson-client@3");
// d3 = require("d3-geo@2");
