// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (data, err) {
    if (err) throw err;
    // console.log(data);

    // parse data
    data.forEach(function (data) {
        data.id = +data.id;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });


    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(data, d => d.poverty)])
        .range([0, width]);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed('stateCircle', true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)

    chartGroup.selectAll('.stateText')
        .data(data)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d.poverty))
        .attr('y', d => yLinearScale(d.healthcare))
        .attr('dy', 3)
        .attr('font-size', '10px')
        .text(function (d) { return d.abbr });

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>In Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`);
        });
    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d, this);
    })
        // onmouseout event
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });

    // console.log(data);

    // create group for y- axis label
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(0, ${height / 2})`);

    ylabelsGroup.append("text")
        .attr("y", -25)
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    // create group for x- axis label
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    xlabelsGroup.append("text")
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

}).catch(function (error) {
    console.log(error);
});
