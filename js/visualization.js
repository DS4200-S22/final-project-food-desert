//This is filler -- delete it and start coding your visualization tool here
// d3.select("#vis-container")
//   .append("text")
//   .attr("x", 20)
//   .attr("y", 20)
//   .text("Hello World!");

let width = 960;
let height = 600;
let color_domain = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]
let ext_color_domain = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]
let legend_labels = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]
let color = d3.scaleThreshold()
                .domain(color_domain)
                .range(["#004d28", "#125937", "#256546", "#387255", "#4b7e64", "#5e8b73", "#719782", "#84a491", "#97b0a0", "#aabdaf", "#bdc9be"]);

let div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

let svg = d3.select("#vis-container").append("svg")
              .attr("width", width)
              .attr("height", height)
              .style("margin", "-15px auto");
let path = d3.geoPath();

Promise.all([
    d3.json("js/counties-albers-10m.json"),
  ]).then(res => ready(res[0]));


function ready(us) {
  let pairRateWithId = {};
  let pairNameWithId = {};

  //Moves selction to front
  d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
  }; 

  //Moves selction to back
  d3.selection.prototype.moveToBack = function() { 
      return this.each(function() { 
        let firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
      }); 
  };

  // data.forEach(function(d) {
  //   pairRateWithId[d.id] = +d.rate;
  //   pairNameWithId[d.id] = d.name;
  // });
  svg.append("g")
    .attr("class", "county")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("d", path)
    .style ( "fill" , function (d) {
    return color (pairRateWithId[d.id]);
    })
    .style("opacity", 0.8)
    .on("mouseover", function(d) {
      let sel = d3.select(this);
        sel.moveToFront();
      d3.select(this).transition().duration(300).style({'opacity': 1, 'stroke': 'black', 'stroke-width': 1.5});
      div.transition().duration(300)
        .style("opacity", 1)
      div.text(pairNameWithId[d.id] + ": " + pairRateWithId[d.id])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY -30) + "px");
      })
    .on("mouseout", function() {
      let sel = d3.select(this);
        sel.moveToBack();
      d3.select(this)
        .transition().duration(300)
        .style({'opacity': 0.8, 'stroke': 'white', 'stroke-width': 1});
      div.transition().duration(300)
        .style("opacity", 0);
      })

};

var legend = svg.selectAll("g.legend")
                  .data(ext_color_domain)
                  .enter().append("g")
                  .attr("class", "legend");

var ls_w = 80, ls_h = 20;

legend.append("rect")
        .attr("x", function(d, i){ return width - (i*ls_w) - ls_w;})
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
    .attr("x", 10)
    .attr("y", 540)
    .attr("class", "legend_title")
    .text(function(){return legend_title});