
let RegionDisplayColorMapping = {};
RegionDisplayColorMapping = {
    "West" : "#9A3553",
    "South" : "#AC8F3B",
    "Northeast" : "#353678",
    "Midwest" : "#629A35",
}


function buildChart(containerId) {
    // size globals
    var width = 1000;
    var height = 800;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 100
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    // create svg element
    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // append all of your chart elements to g

    // read in our data
    d3.csv('air_quality_fixed.csv', (error, data) => {
        // handle read errors
        if (error) {
            console.error('failed to read data -- :(');
            return;
        }

        console.log("raw", data);
        
        data.forEach( d=> {
            d.Emissions = +d.Emissions;
        });

        console.log("cleaned", data);
        
        //Scales for our VERTICLE bar chart

        //Emissions
        var y = d3
            .scaleLinear()
            .domain([
                0, d3.max(data, function(d) { return d.Emissions })
            ])
            .range([innerHeight, 0]);

            

        //X-axis: State
        var x = d3
            .scaleBand()
            .domain(data.map(d=> d.State))
            .range([0, innerWidth])
            .padding(0.2);

        console.log("X-Scale:" + x.domain(), x.range());
        console.log("Y-Scale:" + y.domain(), y.range());

        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);
        
        var yAxis = d3.axisLeft(y);

        g
            .append("g")
            .attr("class", "y-axis")
            .call(yAxis);
        
        g
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class","bar")
            .attr("x", d => { return x(d.State)})
            .attr("y", d => { return y(d.Emissions)})
            .attr("width", x.bandwidth())
            .attr("height", d => { return innerHeight - y(d.Emissions) })
            .attr("fill", d => { return RegionDisplayColorMapping[d.Region]} )
            .attr("stroke", "black")
            .attr("stroke-width", ".5px");

        
        //Axis Labels
        //X-Axis
        g
            .append('text')
            .attr("class", "x-axis-header")
            .attr("x", innerWidth/2)
            .attr("y", innerHeight + 30)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .text("State");

            //Y-Axis
        g
            .append("text")
            .attr("class", "y-axis-header")
            .attr("x", -50)
            .attr("y", innerHeight/2)
            .attr("text-anchor","middle")
            .attr("dominant-baseline","")
            .attr('transform', 'rotate(-90,-60,' + innerHeight / 2 + ')')
            .text("Emissions")


            g
            .append('text')
            .attr("id", "graph-title")
            .attr("x", innerWidth/2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .text("Emissions by State");
            

    });

}





buildChart('#chart-holder');


