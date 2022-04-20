let width_map = 960;
let height_map = 750;
const margin_map = { left: 50, right: 50, bottom: 50, top: 50 };
let color_domain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
let ext_color_domain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
let legend_labels = [
  "0",
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
  "90",
  "100",
];
let color = d3.scaleThreshold().domain(color_domain).range(d3.schemeBlues[9]);

// build map of county names to PCT_LACCESS_POP15
let pct_data = new Map();
// build map of county ids to their names (county + state name)
let id_to_name = new Map();
// build map of county names (county + state name) to their ids
let name_to_id = new Map();
// build map of county names from Albers to county ids in our own dataset
let FIPS = new Map();
let state_code_to_name = new Map();

// create functions for tooltip to show name of moused-over county
let mouseover_map;
let mousemove_map;
let mouseleave_map;

// define svg object in #vis-container to create map in
let svg = d3
  .select("#vis-container")
  .append("svg")
  .attr("viewBox", [0, 0, width_map, height_map])
  .attr("width", width_map + margin_map.left + margin_map.right)
  .attr("height", height_map + margin_map.top + margin_map.bottom);

let map = svg
  .append("g")
  .attr("class", "map")
  .attr(
    "transform",
    "translate(" + margin_map.left + "," + margin_map.top + ")"
  )
  .attr("width", width_map + margin_map.left + margin_map.right)
  .attr("height", height_map + margin_map.top + margin_map.bottom);

let path = d3.geoPath();

const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

// load counties geojson and our food desert data
Promise.all([
  d3.json("data/counties-albers-10m.json"),
  d3.csv("data/finaldata.csv", function (d) {
    pct_data.set(d.County, d.PCT_LACCESS_POP15);
    id_to_name.set(d.FIPS, `${d.County}, ${d.State}`);
    name_to_id.set(`${d.County}, ${d.State}`, d.FIPS);
    FIPS.set(`${d.County}${d.FIPS.substring(0, 2)}`, d.FIPS);
    return d;
  }),
  d3.tsv("data/us-state-names.tsv", function (state) {
    state_code_to_name.set(state.code, state.name);
  }),
]).then((values) => ready(values[0]));

function ready(us) {
  /* 
    Tooltip  
  */

  const tooltip_map = d3
    .select("#vis-container")
    .append("div")
    .attr("id", "tooltip-map")
    .style("opacity", 0)
    .attr("class", "tooltip");

  const topojson_states = topojson.feature(us, us.objects.states).features;

  // when moused over, tooltip shows name of data and the score
  mouseover_map = function (event, d) {
    current_state = topojson_states.filter(function (s) {
      return d.id.substring(0, 2) == s.id;
    });
    tooltip_map
      .html(d.properties.name + ", " + current_state[0].properties.name)
      .style("opacity", 1);
  };

  // when mouse moves, the tooltip will show where mouse is
  mousemove_map = function (event, d) {
    tooltip_map
      .style("left", event.pageX + 5 + "px")
      .style("top", event.pageY - 25 + "px");
  };

  // when moused out, tooltip disappears
  mouseleave_map = function (event, d) {
    tooltip_map.style("opacity", 0);
  };

  /*
    Map
  */

  map
    .append("g")
    .attr("id", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    // draw each county
    .attr("d", path)
    // set the color of each county using pct_data map of county name to PCT_LACCESS_POP15
    .attr("fill", function (d) {
      return color(pct_data.get(d.properties.name));
    })
    .attr("id", function (d) {
      const current_state = topojson_states.filter(function (s) {
        return d.id.substring(0, 2) == s.id;
      });
      // set path's id = CountyState
      return `${d.properties.name}${current_state[0].properties.name}`;
    })
    .on("mouseover", mouseover_map)
    .on("mousemove", mousemove_map)
    .on("mouseleave", mouseleave_map)
    .on("click", county_clicked);

  map
    .append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("d", path);

  // add state borders
  map
    .append("path")
    .datum(
      topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })
    )
    .attr("id", "state-borders")
    .attr("d", path);

  // add zoom effect to map
  map.call(zoom);
}

function county_clicked(event, d) {
  let county = d3.select(this);
  if (counties.length >= 3 && !county.classed("county-selected")) {
    alert("Please select at most 3 counties");
  } else if (county.classed("county-selected")) {
    county.classed("county-selected", false);

    // remove the county id from the list of counties to be included in the bar chart
    d3.select(this).transition().style("fill", null);
    let index = counties.indexOf(d.id);
    counties.splice(index, 1);

    // update search bar selections
    updateSearchBar();

    // update the bar chart
    update_bar();
    // update the scatter plot
    updateScatter();
  } else {
    county.classed("county-selected", true);

    // add the county id to the list of counties to be included in the bar chart
    if (counties.indexOf(d.id) === -1) {
      counties.push(d.id);
    }

    // update search bar selections
    updateSearchBar();

    // update the bar chart
    update_bar();
    // update the scatter plot
    updateScatter();
  }
}

function zoomed(event) {
  const { transform } = event;
  map.attr("transform", transform);
  map.attr("stroke-width", 1 / transform.k);
}

/* 
  Legend  
*/

let legend = svg
  .selectAll("map.legend")
  .data(ext_color_domain.reverse())
  .enter()
  .append("g")
  .attr("class", "legend");

let ls_w = 80,
  ls_h = 20;

legend
  .append("rect")
  .attr("x", function (d, i) {
    return width_map - i * ls_w - 2 * ls_w;
  })
  .attr("y", 700)
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function (d, i) {
    return color(d);
  });

legend
  .append("text")
  .attr("x", function (d, i) {
    return i * ls_w + ls_w;
  })
  .attr("y", 740)
  .text(function (d, i) {
    return legend_labels[i];
  });

let legend_title =
  "Percentage of population with lack of access to grocery stores";

svg
  .append("text")
  .attr("x", ls_w)
  .attr("y", 690)
  .attr("class", "legend_title")
  .text(function () {
    return legend_title;
  });
