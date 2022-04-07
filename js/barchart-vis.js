// set the dimensions and margins of the graph
// const margin = {top: 10, right: 30, bottom: 20, left: 50},
const marginBar = {left:50, right:130, bottom:50, top:50},
    widthBar = 500 - marginBar.left - marginBar.right,
    heightBar = 400 - marginBar.top - marginBar.bottom;

// append the svg object to the body of the page
const svgBar = d3.select("#barchart-vis")
    .append("svg")
    .attr("width", widthBar + marginBar.left + marginBar.right)
    .attr("height", heightBar + marginBar.top + marginBar.bottom)
    .append("g")
    .attr("transform",
        "translate(" + marginBar.left + "," + marginBar.top + ")");

// Parse the Data
d3.csv("data/finaldata.csv").then((finalData) => {

    const counties = ["Autauga", "Baldwin", "Bullock"];

    var data
    filteredData = finalData.filter(function(row) {
        return counties.includes(row['County']);
    });
    data = filteredData.map(function(d) {
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
            PCT_LACCESS_MULTIR15: d.PCT_LACCESS_MULTIR15
        }
    });
    console.log("data", data)

    // List of subgroups = header of the csv files = soil condition here
    const access = finalData.columns.slice(8);

    const unique = array => array.filter((v, i) => array.indexOf(v) === i);

    console.log(access)
    console.log(counties)

    // Add X axis
    var x = d3.scaleBand()
        .domain(counties)
        .range([0, widthBar])
        .padding([0.2])
    svgBar.append("g")
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

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([heightBar, 0]);
    // .padding(0.2);
    svgBar.append("g")
        .call(d3.axisLeft(y))
        .call((g) =>
            g
                .append("text")
                .attr("y", -marginBar.left+20)
                .attr("x", -marginBar.top)
                .attr("fill", "black")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .text("% Population Low Access to Grocery Store")
        );

    svgBar.append("text")
        .attr("x", widthBar/2)
        .attr("y", marginBar.top - 50)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("County Low Access to Food");

    // Handmade legend
    svgBar.append("rect").attr("x",315).attr("y",-5).attr("width", 10).attr("height", 10).style("fill", "#E67E22")
    svgBar.append("rect").attr("x",315).attr("y",15).attr("width", 10).attr("height", 10).style("fill", "#F4D03F")
    svgBar.append("rect").attr("x",315).attr("y",35).attr("width", 10).attr("height", 10).style("fill", "#7D3C98")
    svgBar.append("rect").attr("x",315).attr("y",55).attr("width", 10).attr("height", 10).style("fill", "#48C9B0")
    svgBar.append("rect").attr("x",315).attr("y",75).attr("width", 10).attr("height", 10).style("fill", "#3498DB")
    svgBar.append("rect").attr("x",315).attr("y",95).attr("width", 10).attr("height", 10).style("fill", "#34495E")
    svgBar.append("rect").attr("x",315).attr("y",115).attr("width", 10).attr("height", 10).style("fill", "#E74C3C")
    svgBar.append("text").attr("x", 330).attr("y", 0).text("Multiracial").style("font-size", "15px").attr("alignment-baseline","middle")
    svgBar.append("text").attr("x", 330).attr("y", 20).text("Hawaiian/Pacific").style("font-size", "15px").attr("alignment-baseline","middle")
    svgBar.append("text").attr("x", 330).attr("y", 40).text("American Indian").style("font-size", "15px").attr("alignment-baseline","middle")
    svgBar.append("text").attr("x", 330).attr("y", 60).text("Asian").style("font-size", "15px").attr("alignment-baseline","middle")
    svgBar.append("text").attr("x", 330).attr("y", 80).text("Hispanic").style("font-size", "15px").attr("alignment-baseline","middle")
    svgBar.append("text").attr("x", 330).attr("y", 100).text("Black").style("font-size", "15px").attr("alignment-baseline","middle")
    svgBar.append("text").attr("x", 330).attr("y", 120).text("White").style("font-size", "15px").attr("alignment-baseline","middle")

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(access)
        .range(['#E74C3C', '#34495E', '#3498DB', '#48C9B0', '#7D3C98', '#F4D03F', '#E67E22'])

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
        .keys(access)
        (data)

    console.log(stackedData)

    // Show the bars
    svgBar.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) {return color(d.key);})
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) {return d;})
        .enter().append("rect")
        .attr("x", d => x(d.data["County"]))
        .attr("y", function (d) {return y(d[1]);})
        .attr("height", function (d) {return y(d[0]) - y(d[1]);})
        .attr("width", x.bandwidth())

    legend = svgBar.append("g")
        .attr("class","legend")
        .attr("transform","translate(50,30)")
        .style("font-size","12px")
        .call(d3.legend)


})
