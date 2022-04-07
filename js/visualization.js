let width_map = 960;
let height_map = 600;
let color_domain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
let ext_color_domain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
let legend_labels = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]
let color = d3.scaleThreshold()
                .domain(color_domain)
                .range(d3.schemeBlues[9]);

// define svg object in #vis-container to create map in
let svg = d3.select("#vis-container").append("svg")
              .attr("width", width_map)
              .attr("height", height_map)
              .style("margin", "-15px auto");
let path = d3.geoPath();

// build map of county names to PCT_LACCESS_POP15
let pct_data = new Map();

// define zoom effect
const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);


// load counties geojson and our food desert data
Promise.all([
    d3.json("data/counties-albers-10m.json"),
    d3.csv("data/finaldata.csv", function(d) {
      pct_data.set(d.County, d.PCT_LACCESS_POP15)
    })
  ]).then((values) => ready(values[0], values[1]));


function ready(us, data) {
  console.log(pct_data);
  console.log(us);

  svg.append("g")
    .attr("class", "county")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      // draw each county
      .attr("d", path)
      // set the color of each county using pct_data map of county name to PCT_LACCESS_POP15
      .attr("fill", function (d) {
        return color(pct_data.get(d.properties.name));
      })
      .on("click", county_clicked)

  // add state borders
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);
  
  // add zoom effect to map
  svg.call(zoom);
};

function county_clicked(event, d) {
  let selected_color = "rgb(255, 0, 0)";
  if (d3.select(this).style("fill") == selected_color) {
    d3.select(this).transition().style("fill", null);
  }
  else {
    d3.select(this).transition().style("fill", selected_color);
  }
}

function zoomed(event) {
  const {transform} = event;
  svg.attr("transform", transform);
  svg.attr("stroke-width", 1 / transform.k);
}

// Legend
var legend = svg.selectAll("g.legend")
                  .data(ext_color_domain)
                  .enter().append("g")
                  .attr("class", "legend");

var ls_w = 80, ls_h = 20;

legend.append("rect")
        .attr("x", function(d, i){ return width_map - (i*ls_w) - (2 * ls_w);})
        .attr("y", 550)
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return color(d); })
        .style("opacity", 0.8);

legend.append("text")
        .attr("x", function(d, i){ return (i*ls_w) + ls_w;})
        .attr("y", 590)
        .text(function(d, i){ return legend_labels[i] });

let legend_title = "Percentage of population with lack of access to grocery stores";

svg.append("text")
    .attr("x", ls_w)
    .attr("y", 540)
    .attr("class", "legend_title")
    .text(function(){return legend_title});