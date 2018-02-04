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
    
	d3.json('/pokemon.json', (error, data) => {

        if(error) {
            console.log("Error reading data file :(");
        } else {
            //console.log("Raw Data: " + data);
            //console.log("Raw Data: " + JSON.stringify(data));
            console.log("Data loaded son!  Proceed with caution...");
        }

        var parseHoursMins = d3.timeParse('%H:%M');

        data.forEach(pokemon => {
                //use regular expression to remove anything that is not a number OR "."
                pokemon.height = parseFloat(pokemon.height.replace("/[^\d\.]/g", ""));  
                pokemon.weight = parseFloat(pokemon.weight.replace("/[^\d\.]/g", ""));  
                if(pokemon.spawn_time !== 'N/A') {
                    pokemon.spawn_time = parseHoursMins(pokemon.spawn_time.toString());    
                    // let totalMinutes;
                    let values = pokemon.spawn_time.toString().split(':');
                    let hoursToMins = (parseInt(values[0])> 0) ? parseInt(values[0])*60 : 0;
                    let minsToMins = parseInt(values[1]);
                    totalMinutes = hoursToMins + minsToMins;
                    pokemon.spawn_time_mins = totalMinutes;

                    // var getMins = d3.time.format('%M');
                    // pokemon.spawn_time_mins = getMins(pokemon.spawn_time);
                    console.log(pokemon.spawn_time_mins);
                }
        });
        
        console.log("Raw Data: " + JSON.stringify(data));

        //Sum all the Heights and weights
        let totalPokemon = 0;
        let totalHeights = 0.0;
        let totalWeights = 0.0;

        let distintWeights = [];

        data.forEach(pokemon => {
            totalHeights += pokemon.height;
            totalWeights += pokemon.weight;
            distintWeights.push(pokemon.weight);
            totalPokemon += 1;
        })

        //Conversions:  (Note: We could have done the conversion when we were originally parsing the values from strings)
        //Reference:
        //https://www.w3schools.com/howto/howto_js_weight_converter.asp

        //Weight Conversion
        let averageWeightKilos = (totalWeights/totalPokemon);
        let averageWeightLbs = (averageWeightKilos*2.2046);
        //console.log("Average Pokemon Weight(kg): " + averageWeightKilos);
        console.log("Average Pokemon Weight(lb): " + averageWeightLbs);

        //Height Conversion
        let averageHeightMeters = (totalHeights/totalPokemon);
        let averageHeightInches = averageHeightMeters*39.37007874;
        //console.log("Average Pokemon Height(m): " + averageHeightMeters);
        console.log("Average Pokemon Height(in): " + averageHeightInches);


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //What is the total egg distance (value on egg property) for all pokemon who have a weakness of 'Psychic'. 
        //'Weaknesses' is a property on each pokemon object that contains a list of strings. 
        //Note: some 'egg' properties say 'Not in Eggs'. consider this value a -1 in your summation.

        let totalEggDistance = 0;
        totalEggDistance = data.reduce((total, pokemon) => {
            
            //Check if has weakness of 'Psychic'
            let valueToIncreaseBy = 0;
            let currentPokemon = pokemon.name;

            // console.log(`Now Checking: ${currentPokemon}!`)
            // console.log(`${total}`);
            if(pokemon.weaknesses.indexOf('Psychic') !== '1') {
                
                if(pokemon.egg === "Not in Eggs") {
                    valueToIncreaseBy = -1;
                    // console.log(`${currentPokemon} has 'Pyschic' as a weakness but NOT IN EGGS.`)
                } else {
                  //parse string
                  let parsedValue = parseFloat(pokemon.egg.replace("/[^\d\.]/g", ""));
                  valueToIncreaseBy = isNaN(parsedValue) ? 0 : parsedValue;
                //   console.log(`${currentPokemon} increases the total by ${valueToIncreaseBy}.`)
                }
            
            } else {
                // console.log(`${currentPokemon} does not have 'Pyschic' as a weakness.`)
            }
            
            return total + valueToIncreaseBy;
        }, 0);

        // console.log(`Total Egg Distance for All Pokemon with 'Psychic' weakness ${totalEggDistance}`);
        //console.log(JSON.stringify(data));

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Determine which type of pokemon has the most weaknesses on average. List the types of pokemon and the number of their weaknesses in a list in descending order. 
        //Note: a pokemon can have more than one type. Because of this the same pokemon can be counted for more than one type. 
        //For example: the first object with id:1 would count as both 'Grass' and 'Poison' type.

        let pokemonTypes = {};
        data.forEach(pokemon => {

            pokemon.weaknesses.forEach(p => {
                //if its the first instance add a new record
                if(Object.keys(pokemonTypes).indexOf(p) === -1) {
                    let newSkill  = {};
                    newSkill.Count = 1;
                    pokemonTypes[p] = newSkill;
                } else {  //not a new instance'
                    pokemonTypes[p].Count =+ (pokemonTypes[p].Count + 1);
                }   
            });
        });

        console.log("Pokemon by Type: ");
        console.log(pokemonTypes);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //break the pokemon down into 5 equal buckets of weight classes and then average teh spawn_time (show in minutes) of each weight class

        // data.forEach(pokemon => {
        //     console.log(pokemon.weight);
        // });

        //Tried to use a scale but failed :(

            //Create scale for time
        // var weightClassScale = d3
            //.quantile()
            //.scaleOrdinal()
            // .scale.threshhold()
            //.scaleQuantize()
            // .domain(distinctWeights
                //d3.extent(data, pokemon => {
                //    return parseFloat(pokemon.egg.replace("/[^\d\.]/g", ""));
                // )
                // })
            // )
            // .range([1,5]);

        // console.log("weightClassScale Domain: " + weightClassScale.domain());
        // console.log("weightClassScale Range: " + weightClassScale.range());

        let arrayPokemon = [];
            data.forEach(pokemon => {
                if(pokemon.spawn_time !== "N/A") {//disregarding pokemon with N/A spawn_times since we cannot average them
                    var newPokemon = {};
                    newPokemon.name = pokemon.name;
                    newPokemon.weight = pokemon.weight;
                    newPokemon.spawn_time_mins = pokemon.spawn_time_mins;
                    arrayPokemon.push(newPokemon);
                //grab weight and calculate bucket
                //var pokemonBucket = weightClassScale(pokemon.weight);
                //console.log(`Name: ${pokemon.name} Weight: ${pokemon.weight} Bucket: ${pokemonBucket}  SpanTime: ${pokemon.spawn_time}`);
                }
            });
     
            console.log(arrayPokemon.length);
            // console.log(JSON.stringify(arrayPokemon));

            //Sort array by weight
            arrayPokemon.sort(function(a,b){
                return a.weight - b.weight;
            });

            let numberOfBuckets = 5;
            let numberOfPokemonPerBucket = (arrayPokemon.length / numberOfBuckets);
            console.log("Number of Pokemon per bucket: " + numberOfPokemonPerBucket);
            let bucketedPokemon = [];
            
            let bucketCount = 1;
            while(arrayPokemon.length > 0) {

                let currentBucket = arrayPokemon.splice(0,numberOfPokemonPerBucket);
                console.log(currentBucket);
                // console.log(currentBucket.lenght);
                
                // var sum = arr.reduce(function(s, d) {
                //     return s + d;
                // }, 0);

                let bucketTotal = currentBucket.reduce((total, currentPokemonInBucket) => {
                    return total + currentPokemonInBucket.spawn_time_mins;
                },0);
                
                let newBucket = {};
                newBucket.Number = bucketCount;
                newBucket.AverageSpawnTime = bucketTotal/numberOfPokemonPerBucket;
                bucketedPokemon.push(newBucket);

                bucketCount++;
            }

            console.log("Average Spawn Time for Bucketed Pokemon")
            console.log(JSON.stringify(bucketedPokemon));
            // arrayPokemon.forEach(d=> {

            // })

            
            // console.log(JSON.stringify(arrayPokemon));

	});
	
	
}

buildChart('#chart-holder');
