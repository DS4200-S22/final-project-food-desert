const width = 1000;
const height = 400;
const margin = {left:50, right:50, bottom:50, top:50};

// append the svg object to the body of the page
const svg = d3.select("#barchart-vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data/finaldata.csv").then((data) => {

    // List of subgroups = header of the csv files = soil condition here
    const access = data.columns.slice(8);

    const counties = ["Autauga", "Baldwin", "Barbour"];

    const unique = array => array.filter((v, i) => array.indexOf(v) === i);

    console.log(access)
    console.log(counties)

    //Add X axis
    const x = d3.scaleBand()
        .domain(counties)
        .range([margin.left, width - margin.right]) //[0, width]
        .padding(0.2)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 200])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(access)
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#85C1E9', '#ABEBC6', '#F7DC6F', '#E67E22'])

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
        .keys(access)
        (data)

    console.log(stackedData)

    // Show the bars
    svg.append("g")
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

})


