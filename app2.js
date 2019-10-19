var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 50
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("census.csv", function(err, censusData) {
    if (err) throw err;
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;

    });

    console.log(censusData)

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d["poverty"] - 1),
            d3.max(censusData, d => d["poverty"])
        ])
        .range([0, chartWidth]);

    console.log("x-axis data");
    console.log(d3.min(censusData, d => d["poverty"]));
    console.log(d3.max(censusData, d => d["poverty"]));
    console.log("y-axis data");
    console.log(d3.min(censusData, d => d["healthcare"]));
    console.log(d3.max(censusData, d => d["healthcare"]));


    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d["healthcare"] - 1),
            d3.max(censusData, d => d["healthcare"])
        ])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    var gdots = chartGroup.selectAll("g.dot")
        .data(censusData)
        .enter()
        .append('g');

    var circlesGroup = gdots.append("circle")
        .attr("cx", d => xLinearScale(d["poverty"]))
        .attr("cy", d => yLinearScale(d["healthcare"]))
        .attr("r", d => 13)
        .attr("fill", "teal")
        .attr("opacity", ".5");
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${data.poverty}<br>${label} ${d[chosenXAxis]}`);
        })

    gdots.append("text").text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty) - 4)
        .attr("y", d => yLinearScale(d.healthcare) + 2)
        .style("font-size", ".6em")
        .classed("fill-text", true);

    console.log(d => xLinearScale(d.poverty));
    console.log(d => yLinearScale(d.healthcare));
    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var censusDataLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Healthcare");
});