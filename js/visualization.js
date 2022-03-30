let width_map = 960;
let height_map = 600;
let color_domain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
let ext_color_domain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
let legend_labels = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]
let color = d3.scaleThreshold()
                .domain(color_domain)
                .range(d3.schemeBlues[9]);

let svg = d3.select("#vis-container").append("svg")
              .attr("width", width_map)
              .attr("height", height_map)
              .style("margin", "-15px auto");
let path = d3.geoPath();

Promise.all([
    d3.json("data/counties-albers-10m.json"),
    d3.csv("data/finaldata.csv")
  ]).then((values) => ready(values[0], values[1]));


function ready(us, data) {
  console.log(data);
  
  svg.append("g")
    .attr("class", "county")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("d", path)
    .style("opacity", 0.8)
};

var legend = svg.selectAll("g.legend")
                  .data(ext_color_domain)
                  .enter().append("g")
                  .attr("class", "legend");

var ls_w = 80, ls_h = 20;

legend.append("rect")
        .attr("x", function(d, i){ return width_map - (i*ls_w) - ls_w;})
        .attr("y", 550)
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return color(d); })
        .style("opacity", 0.8);

legend.append("text")
        .attr("x", function(d, i){ return (i*ls_w) + ls_w;})
        .attr("y", 590)
        .text(function(d, i){ return legend_labels[i]; });

let legend_title = "Percentage of population with lack of access to grocery stores";

svg.append("text")
    .attr("x", ls_w)
    .attr("y", 540)
    .attr("class", "legend_title")
    .text(function(){return legend_title});