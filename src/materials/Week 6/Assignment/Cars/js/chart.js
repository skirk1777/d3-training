function buildChart(containerId) {
    // size globals
    var width = 960;
    var height = 500;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
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
    
	d3.json('/cars.json', (error, data) => {

        if(error) {
            console.log("Error reading data file :(");
        } else {
            //console.log("Raw Data: " + data);
            //console.log("Data loaded son!  Proceed with caution...");
        }

        //How many makes are considered common (where property make_is_common is 1)?//

        let uniqueCommonMakesArray = [];
        let makesByCountry = {};
        let makesByCountryAndType = {};

        data.forEach(d => {
            if(d.make_is_common === "1") {
                //console.log(d.make_display);
                //if not already in the uniqueCommonMakesArray then get it in there!
                if(uniqueCommonMakesArray.indexOf(d.make_display) === -1) {  ////not in there yet 
                    uniqueCommonMakesArray.push(d.make_display);
                } 
            }

            // How many makes are there per country.
            //Check if country already exists in the object
            if(Object.keys(makesByCountry).indexOf(d.make_country) === -1) {
                makesByCountry[d.make_country] = 1;
                //console.log("Making new country element: " + d.make_country)
            } else {
                //console.log("Incrementing existing country element: " + d.make_country)
                makesByCountry[d.make_country] += 1;
            }


            //Check if country already exists in the object
            //if not, add it
            if(Object.keys(makesByCountryAndType).indexOf(d.make_country) === -1) {
                
                //Make Properties:
                let newCountryObject = {};
                newCountryObject["CommonCount"] = 0;
                newCountryObject["UncommonCount"] = 0;
                makesByCountryAndType[d.make_country] = newCountryObject;

                if(d.make_is_common === "1") {
                    newCountryObject["CommonCount"] = 1;
                } else {
                    newCountryObject["UncommonCount"] = 1;
                }
                //console.log("Making new country element: " + d.make_country)
            } else {
                
                if(d.make_is_common === "1") {
                    makesByCountryAndType[d.make_country]["CommonCount"] += 1;
                } else {
                    makesByCountryAndType[d.make_country]["UncommonCount"] += 1;
                }
                //console.log("Incrementing existing country element: " + d.make_country + "   isCommon:" + d.make_is_common);
            }
        });

        console.log(`There are a total of ${uniqueCommonMakesArray.length} makes considered common in the dataset!`);
        
        console.log("Makes by Country: ");
        console.log(JSON.stringify(makesByCountry));

        console.log("Makes by Country and Type:")
        console.log(JSON.stringify(makesByCountryAndType));

	});
	
	
}

buildChart('#chart-holder');
