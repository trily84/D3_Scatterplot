// fetch data from json file
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
	.then(response => response.json())
	.then(response => {
        const data = response
        createBar(data)
	})

function createBar(data) { 

    var w = 500
    var h = 500
    var padding = 50

    // create svg element to contain everything relate to bar chart
    var svg = d3.select("body")
                .append("svg")
                .attr("id", "svg")
                .attr("width", w)
                .attr("height", h)              
    
    // create legend
    var legend = d3
    .select("body")
    .append("div")
    .attr("id", "legend")
    .append("ul")
    .style("color", "orange")
    .append("li")
    .append("text")
    .html("Riders with doping allegations<br>")
    .style("color", "orange")
    .append("li")
    .style("color", "white")
    .append("text")
    .html("No doping allegations <br>")
    .style("color", "white");     
    
    var div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);   

    var minSecParse = d3.timeParse("%M:%S");
    var timeFormat = d3.timeFormat("%M:%S");
    
    var xScale = d3.scaleLinear()
    .domain([1992, 2017])
    .range([0, w - padding*2])

    var yScale = d3.scaleTime()
    .domain([
    d3.min(data, d => minSecParse(d["Time"])),
    d3.max(data, d => minSecParse(d["Time"]))
    ])
    .range([h, padding*2])

    console.log(minSecParse(data[0].Time))

    var yAxisValues = d3.scaleTime()
    .domain([
    d3.max(data, d => (minSecParse(d["Time"]))),
    d3.min(data, d => (minSecParse(d["Time"])))
    ])
    .range([h, padding*2])

    //create circle
    svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.Year) + 50)
    .attr("cy", d => h - yScale(minSecParse(d["Time"]))+50)
    .attr("r", 5)
    .style("fill", function(d) {
        if (d.Doping) {return "orange"}
        else return "white"
    })
    .on("mouseover", function (event, d) {
        console.log(d); 
        // console.log(d3.pointer(event))
        // var x = d3.pointer(event)[0]
        // var y = d3.pointer(event)[1]
        div.style("opacity", 1)
        div.html(d.Name + " "
        + "(" + d.Nationality + ")" + "<br>" 
        + "Year:" + " " + d.Year + " " 
        + "Time: " + d.Time)
        div.style("left", xScale(d.Year) - 100 + "px")
        div.style("top", h - yScale(minSecParse(d["Time"])) - 500 + "px")
        div.style("color", d.Doping? "orange": "black")
    })
    .on("mouseout", function(event, d) {
        div.style("opacity", 0)
      })

    // create x axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(50, 450)")
    .call(xAxis);

    // create y axis
    // const yAxis = d3.axisLeft(yScale);
    var yAxis = d3.axisLeft(yAxisValues).tickFormat(timeFormat);
    svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(50, -50)")
    .call(yAxis);

}