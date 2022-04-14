// set the dimensions and margins of the graph
const marginBar = { left: 50, right: 130, bottom: 50, top: 50 },
  widthBar = 500 - marginBar.left - marginBar.right,
  heightBar = 400 - marginBar.top - marginBar.bottom;

// append the svg object to the body of the page
const svgBar = d3
  .select("#barchart-vis")
  .append("svg")
  .attr("width", widthBar + marginBar.left + marginBar.right)
  .attr("height", heightBar + marginBar.top + marginBar.bottom)
  .append("g")
  .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

// starting list of counties to be in the bar chart (global variable)
var counties = [];

update_bar();

function update_bar() {
  // Parse the Data
  d3.csv("data/finaldata.csv").then((finalData) => {
    var data;
    filteredData = finalData.filter(function (row) {
      return counties.includes(row["FIPS"]);
    });

    data = filteredData.map(function (d) {
      return {
        Latitude: d.Latitude,
        Longitude: d.Longitude,
        FIPS: d.FIPS,
        State: d.State,
        County: d.County,
        PCT_DIABETES_ADULTS13: d.PCT_DIABETES_ADULTS13,
        PCT_OBESE_ADULTS13: d.PCT_OBESE_ADULTS13,
        PCT_LACCESS_POP15: d.PCT_LACCESS_POP15,
        PCT_LACCESS_WHITE15: d.PCT_LACCESS_WHITE15,
        PCT_LACCESS_BLACK15: d.PCT_LACCESS_BLACK15,
        PCT_LACCESS_HISP15: d.PCT_LACCESS_HISP15,
        PCT_LACCESS_NHASIAN15: d.PCT_LACCESS_NHASIAN15,
        PCT_LACCESS_NHNA15: d.PCT_LACCESS_NHNA15,
        PCT_LACCESS_NHPI15: d.PCT_LACCESS_NHPI15,
        PCT_LACCESS_MULTIR15: d.PCT_LACCESS_MULTIR15,
      };
    });

    // CLEAR all the bars and axes
    svgBar.selectAll("rect").remove();
    svgBar.selectAll('g').remove();

    // List of subgroups = header of the csv files = soil condition here
    const access = finalData.columns.slice(8);

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack().keys(access)(data);

    // get x domain
    let domainX = data.map(function(d) {
      if (counties.includes(d['FIPS'])) {
        // return d.County;
        return d.County + ', ' + d.State;
      }
    });

    // Add X axis
    var x = d3.scaleBand().domain(domainX).range([0, widthBar]).padding([0.2]);
    svgBar
      .append("g")
      .attr("transform", "translate(0," + heightBar + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g) =>
        g
          .append("text")
          .attr("x", widthBar - marginBar.right)
          .attr("y", marginBar.bottom - 4)
          .attr("fill", "black")
          .attr("text-anchor", "end")
          .text("County")
      );

    // Find max y
    let maxY = d3.max(data, (d) => {
      return Number(d.PCT_LACCESS_POP15) + 5;
    });

    let domainY = Math.min(maxY, 100);

    // Add Y axis
    const y = d3.scaleLinear().domain([0, domainY]).range([heightBar, 0]);
    // .padding(0.2);

    svgBar
      .append("g")
      .call(d3.axisLeft(y))
      .call((g) =>
        g
          .append("text")
          .attr("y", -marginBar.left + 20)
          .attr("x", -marginBar.top)
          .attr("fill", "black")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .text("% Population Low Access to Grocery Store")
      );

    svgBar
      .append("text")
      .attr("x", widthBar / 2)
      .attr("y", marginBar.top - 60)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("County Low Access to Grocery Stores");

    // Handmade legend
    svgBar
      .append("rect")
      .attr("x", 315)
      .attr("y", -5)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#003f5c");
    svgBar
      .append("rect")
      .attr("x", 315)
      .attr("y", 15)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#374c80");
    svgBar
      .append("rect")
      .attr("x", 315)
      .attr("y", 35)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#7a5195");
    svgBar
      .append("rect")
      .attr("x", 315)
      .attr("y", 55)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#bc5090");
    svgBar
      .append("rect")
      .attr("x", 315)
      .attr("y", 75)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#ef5675");
    svgBar
      .append("rect")
      .attr("x", 315)
      .attr("y", 95)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#ff764a");
    svgBar
      .append("rect")
      .attr("x", 315)
      .attr("y", 115)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#ffa600");
    svgBar
      .append("text")
      .attr("x", 330)
      .attr("y", 0)
      .text("Multiracial")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svgBar
      .append("text")
      .attr("x", 330)
      .attr("y", 20)
      .text("Hawaiian/Pacific")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svgBar
      .append("text")
      .attr("x", 330)
      .attr("y", 40)
      .text("American Indian")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svgBar
      .append("text")
      .attr("x", 330)
      .attr("y", 60)
      .text("Asian")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svgBar
      .append("text")
      .attr("x", 330)
      .attr("y", 80)
      .text("Hispanic")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svgBar
      .append("text")
      .attr("x", 330)
      .attr("y", 100)
      .text("Black")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svgBar
      .append("text")
      .attr("x", 330)
      .attr("y", 120)
      .text("White")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    // color palette = one color per subgroup
    const color = d3
      .scaleOrdinal()
      .domain(access)
      .range([
        "#ffa600",
        "#ff764a",
        "#ef5675",
        "#bc5090",
        "#7a5195",
        "#374c80",
        "#003f5c",
      ]);


    // ----------------
    // Create a tooltip
    // ----------------

    var bar_tooltip = d3.select("#barchart-vis")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr('id', "tooltip-map")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")


    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(event, d) {
      const subgroupName = d3.select(this.parentNode).datum().key;
      var subgroupValue = Number(d.data[subgroupName]).toFixed(2);

      var MutableString = function(value) {
        switch (value) {
          case 'PCT_LACCESS_WHITE15':
            this.text = 'White';
            break;
          case 'PCT_LACCESS_BLACK15':
            this.text = 'Black';
            break;
          case 'PCT_LACCESS_HISP15':
            this.text = 'Hispanic';
            break;
          case 'PCT_LACCESS_NHASIAN15':
            this.text = 'Asian';
            break;
          case 'PCT_LACCESS_NHNA15':
            this.text = 'American Indian';
            break;
          case 'PCT_LACCESS_NHPI15':
            this.text = 'Hawaiian/Pacific';
            break;
          case 'PCT_LACCESS_MULTIR15':
            this.text = 'Multiracial';
            break;
          default:
            this.text = ''
            console.log('default');
        }
      };

      MutableString.prototype = {
        toString: function() {
          return this.text;
        }
      };

      var demo_abbrev = new MutableString(subgroupName);

      bar_tooltip
          // .html("Demographic: " + demo_abbrev + "<br>" + "% Low Access: " + subgroupValue + "%")
          .html(demo_abbrev + ": " + subgroupValue + "%")
          .style("opacity", 1)
    }

    mousemove = function(event, d) {
      bar_tooltip
          .style("left", (event.pageX + 5)+"px")
          .style("top", (event.pageY - 25) +"px");
    }

    var mouseleave = function(d) {
      bar_tooltip
          .style("opacity", 0)
    }


    // Show the bars
    svgBar
      .append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", function (d) {
        return color(d.key);
      })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", d => x(d.data["County"] + ", " + d.data["State"]))
      .attr("y", function (d) {
        return y(d[1]);
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

  });
}
