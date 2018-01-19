function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function getColorByDecade(year) {
    //console.log(year);

    if(year < 1890) {
        console.log("red")
        return "red";
    } else if (year < 1900) {
        return "blue";
    } else if (year < 1910) {
        return "yellow";
    } else if (year < 1920) {
        return "purple";
    } else if (year < 1930) {
        return "orange";
    } else if (year < 1940) {
        return "black";
    } else if (year < 1950) {
        return "green";
    } else if (year < 1960) {
        return "red";
    } else if (year < 1970) {
        return "blue";
    } else if (year < 1980) {
        return "yellow";
    } else if (year < 1990) {
        return "orange";
    } else if (year < 2000) {
        return "black";
    } else if (year < 2010) {
        return "green";
    } else if (year < 2020) {
        return "red";
    } 

    
}

function buildChart(containerId) {
    // size globals
    var width = 1200;
    var height = 1000;

    var margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70
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
    d3.json('climate.json', (error, data) => {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log("raw", data);
        
        data.forEach( d=> {
            d.temp = +d.temp;
            d.decade = parseInt(d.year[1] + d.year[2]); //order matters here; d.year is currently a string
            d.year = +d.year;
        });

        


        console.log("cleaned", data);
        
        //Scales for our horizontal bar chart

        //Year
        var y = d3
            .scaleBand()    
            .domain( data.map( d =>  d.year))
            .range([innerHeight, 0]);

        //Temperature
        var x = d3
            .scaleLinear()    
            .domain([
                    d3.min(data, d => d.temp) - 0.1,
                    d3.max(data, d => d.temp) + 0.1
                    ])
            .range([0, innerWidth])

        
        //Color scale for decades
        var colorScale = d3
            .scaleOrdinal()
            .domain([
                    d3.min(data, d => d.decade),
                    d3.max(data, d => d.decade)
                ])
            .range(["#9B344E","#76276C","#26276C"]);

        console.log("X-Scale:" + x.domain(), x.range());
        console.log("Y-Scale:" + y.domain(), y.range());
        console.log("Color-Scale:" + colorScale.domain(), colorScale.range());

        var xAxis = d3.axisBottom(x)
                        .ticks(15);

        g
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + innerHeight + ")")
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
            .attr("x", d => {
                x(0);
            })
            .attr("y", d => {
                return y(d.year);
            })
            .attr("width", d => x(d.temp))
            
            .attr("height", 5)
            //.attr("style:padding", 2)
            .attr("fill", d => { 
                //return getRandomColor()
                //return getColorByDecade(d.year);
                return colorScale(d.decade);
                })
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
            .text("Temperature");

            //Y-Axis
        g
            .append("text")
            .attr("class", "y-axis-header")
            .attr("x", -50)
            .attr("y", innerHeight/2)
            .attr("text-anchor","middle")
            .attr("dominant-baseline","")
            .attr('transform', 'rotate(-90,-40,' + innerHeight / 2 + ')')
            .text("Year")


            g
            .append('text')
            .attr("id", "graph-title")
            .attr("x", innerWidth/2)
            .attr("y", -27)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .text("Global Temperature by Year");
            
            




            // g
            // .selectAll(".bar")
            // .data(data)
            // .enter()
            // .append("rect")
            // .attr("class","bar")
            // .attr("x", d => {
            //     return x(d.temp);
            // })
            // .attr("y", d => {
            //     return y(d.year);
            // })
            // .attr("width", d => (innerWidth - x(d.temp)))
            // //.attr("transform", translate())
            // .attr("height", 5)
            // .attr("fill", "red")
            // .attr("stroke", "none");
    
        

       



    });

}





buildChart('#chart-holder');


