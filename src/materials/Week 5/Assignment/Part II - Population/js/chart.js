function buildChart(containerId) {
    // size globals
    var width = 1200;
    var height = 600;

    var margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 100
    };

    var populationRangeBuffer = 10000;

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

    d3.json('/population.json', (error, data) => {

        if(error) {
            console.log("Error reading data :(!!!!!");
        }

        console.log("Raw:");
        console.log(data);

        // coerce data to numeric
        var parseTime = d3.timeParse('%Y'); //parsing the month out didn't work.....

        data.forEach(d => {
            d.pop = +d.pop;
            d.year = parseTime((+d.year.substr(d.year.length-4)).toString());  //had to do this wierd stuff
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
                    return d.pop}) - populationRangeBuffer,
                d3.max( data, d=> {
                    return d.pop + populationRangeBuffer;
                })
            ])
            .range([innerHeight, 0]);

        console.log("Y:   " + y.domain(), y.range());

        //create axis
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(2));
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
            .x(function(d) {
                return x(d.year)
            })
            .y(function(d) {
                return y(d.pop)
            })
            .curve(d3.curveMonotoneX)
            //TODO: figure this out - to get rid of null 2017 data for both countries
            .defined(d => {
                return !(d.pop === 0)
            });
        

        //var countryArray = ['India', 'China'];  //Hardcoded aka. NOT dynamic
        
        //per the requirements - this needs do be dynamic/able to
        // handle n-number of countries in the data set
        var countryArray = [];
        
        //grab unique country names from data and add to array;   
        data.forEach(d => {
            if(countryArray.indexOf(d.country) === -1) { //if element (country) is not found in the array
                countryArray.push(d.country);    //then add it!
            }
        });

        // console.log("newCountryArray:");
        // console.log(newCountryArray);

        //Mad Props to: https://stackoverflow.com/questions/1484506/random-color-generator
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }

        //var colors = ['green','red'];

        var colors = [];
        for(i = 0; i<= countryArray.length-1; i++){
            var newColor = getRandomColor();
            console.log(newColor);
            colors.push(newColor);
        }

        var colorScale = d3
            .scaleOrdinal()
            .domain(countryArray)
            .range(colors);

        var groups = g
            .selectAll('.countries')
            .data(countryArray)
            .enter()
            .append('g')
            .attr('class','country')

        groups 
            .append('path')
            .datum(function(d) {
                return data.filter(function(r) {
                    return r.country === d;
                });
            })
            .attr('class','pop-line')
            .attr('fill', 'none')
            .attr('stroke', function(d){
                return colorScale(d[0].country);
            })
            .attr('stroke-width', 10)
            .attr('d', line)
        
        
        //Points
        g
            .selectAll('population-point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class','population-point')
            .attr('fill', 'black')
            .attr('stroke', 'none')
            .attr('cx', d => {
                return x(d.year)
            })
            .attr('cy', d => {
                return y(d.pop)
            })
            .attr('r', '1px');
            

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
            .attr('transform', 'rotate(-90,-90,' + innerHeight / 2 + ')')
            .text('Population')


            //Title
            g
            .append('text')
            .attr('class','graph-title')
            .attr('x', innerWidth/2)
            .attr('y', 10)
            .attr('text-anchor','middle')
            .attr('dominant-baseline', 'hanging')
            .text('Annual Population by Country')

            console.log("here");

            //http://www.competa.com/blog/d3-js-part-7-of-9-adding-a-legend-to-explain-the-data/

            var legendRectSize = 20;
            var legendSpacing = 10;
            var height = 10;

            //var color = "red";

            // var color = d3.scale.ordinal()
            // .domain(["1450"])
            // .range(["#1a9850", "#66bd63", "#a6d96a","#d9ef8b","#ffffbf","#fee08b","#fdae61","#f46d43","#d73027"])

            var legend = d3.select('svg')
            .append("g")
            .selectAll("g")
            .data(colorScale.domain())
            .enter()
            .append('g')
              .attr('class', 'legend')
              .attr('transform', function(d, i) {
                var height = legendRectSize;
                var x = 1000;
                var y = i * height + 300;
                return 'translate(' + x + ',' + y + ')';
            })
            // .attr('x',500)
            // .attr('y', 500);

            legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', colorScale)
            .style('stroke', colorScale);

            legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });

    });
     
}

buildChart('#chart-holder');

