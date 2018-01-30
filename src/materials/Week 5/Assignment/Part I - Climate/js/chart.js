function buildChart(containerId) {
    // size globals
    var width = 1200;
    var height = 600;

    var margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70
    };

    var tempRangeBuffer = .1;

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
    console.log("hello!");

    d3.json('/climate.json', (error, data) => {

        if(error) {
            console.log("Error reading data :(!!!!!");
        }

        console.log("Raw:");
        console.log(data);

        // coerce data to numeric
        var parseTime = d3.timeParse('%Y');

        data.forEach(d => {
            d.temp = +d.temp;
            d.year = parseTime((+d.year).toString());
        });

        console.log(data);

        //Create scale for time
        var x = d3
            .scaleTime()
            .domain(
                d3.extent(data, d => {
                    return d.year;
                })
            )
            .range([0, innerWidth]);

        console.log("X:    " + x.domain(), x.range());
        
        //Create y-scale
        var y = d3
            .scaleLinear()
            .domain([
                d3.min(data, d => {
                    return d.temp}) - tempRangeBuffer,
                d3.max( data, d=> {
                    return d.temp + tempRangeBuffer;
                })
            ])
            .range([innerHeight, 0]);

        console.log("Y:   " + y.domain(), y.range());

        //create axis
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(5));
        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class','x-axis')
            .attr('transform','translate(0,' + innerHeight + ')')
            .call(xAxis);

        g
            .append('g')
            .attr('class','y-axis')
            .call(yAxis);

        //Create line generator

        var line = d3
            .line()
            .x(d => {
                return x(d.year)
            })
            .y(d => {
                return y(d.temp)
            })
            .curve(d3.curveMonotoneX);

        g
            .append('path')
            .datum(data)
            .attr('class','temp-line')
            .attr('fill','none')
            .attr('stroke','red')
            .attr('stroke-width','2')
            .attr('d',line);
        
        //Points

        g
            .selectAll('temp-point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class','temp-point')
            .attr('fill', 'red')
            .attr('stroke', 'none')
            .attr('cx', d => {
                return x(d.year)
            })
            .attr('cy', d => {
                return y(d.temp)
            })
            .attr('r', '3px')
            

        //axis-labels
        //X- Axis Label
        g   
            .append('text')
            .attr('class','x-axis-label')
            .attr('x', innerWidth/2)
            .attr('y', innerHeight + 25)
            .attr('text-anchor','middle')
            .attr('dominant-baseline','hanging')
            .text('Year');
        //Y- Axis Label
        g
            .append('text')
            .attr('class','y-axis-label')
            .attr('x',10)
            .attr('y', innerHeight/2)
            .attr('text-anchor','middle')
            .attr('dominant-baseline', 'hanging')
            .attr('transform', 'rotate(-90,-40,' + innerHeight / 2 + ')')
            .text('Temperature')


            //Title
            g
            .append('text')
            .attr('class','graph-title')
            .attr('x', innerWidth/2)
            .attr('y', 20)
            .attr('text-anchor','middle')
            .attr('dominant-baseline', 'hanging')
            .text('{Insert Graph Title Here}')



            // .attr('','')












    });
}

buildChart('#chart-holder');

