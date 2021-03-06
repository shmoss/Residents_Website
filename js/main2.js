/************************************************************
This is a map of where Residents/Fellows have gone since graduating UW Medical Hospital
*************************************************************/

//Set up all global variables
var geoData = 'data/statesSimplified.topojson';
var lakes = 'data/GreatLakes.topojson';
var mapWidth = 2000, mapHeight = 1000
window.onload = initialize();

	function initialize() {
		console.log("initialized")
		setMap()
	};





function zoomed() {
	console.log("zooming now!")
	///called on zoom events
	d3.selectAll(".centroid").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	d3.selectAll(".gratLines").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	d3.selectAll(".countries").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	d3.selectAll(".gratBackground").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	d3.selectAll(".states").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	d3.selectAll(".lakes").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");


};

function setMap() {

	var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 21])
	.on("zoom", zoomed);

	console.log("setting map")
	var map = d3.select("body")
		.append("svg")
		.attr("width", mapWidth)
		.attr("height", mapHeight)
		.attr("class", "map")

	var pageTitle = d3.select("body")
		.append("text")
		.attr("class", "pageTitle")
		.html("UW Hospital Graduates:<br>Where Do They Go?");

	var projection = d3.geo.naturalEarth()
		.scale(410)
		.translate([mapWidth / 2, mapHeight / 2])
		.precision(.1);

	var path = d3.geo.path()
    	.projection(projection);


	var path = d3.geo.path()
    	.projection(projection)
    	.pointRadius(.1);

	//create graticule generator
	var graticule = d3.geo.graticule(); 

	//create graticule background (aka water)
	var gratBackground = map.append("path")
		.datum(graticule.outline)
		.attr("class", "gratBackground")
		.attr("d", path)
		zoom.on('zoom', zoomed)
		map.call(zoom);

	var gratLines = map.selectAll(".gratLines")
		.data(graticule.lines) //
		.enter()
		.append("path") //append one path for each element of the data (in this case, each graticule line)
		.attr("class", "gratLines")
		.attr("d", path) //this path is the variable path defined above. path generator

	var q = d3_queue.queue();
    q
		.defer(d3.json, "data/countries.topojson")
		.defer(d3.json, geoData)
		.defer(d3.json, "data/Info6.topojson")
		.defer(d3.json, lakes)
		.await(callback);

	function callback(error, countries, geoData, centroid, lakes) {
	console.log("callback funtion initialized")

	var countries = map.selectAll(".countries")
			.data(topojson.feature(countries, countries.objects.countries).features) //translates data into an array of geojson features. essentially creates a for-in loop. for element in data, do this. and this is defined by everything below.
			.enter()
			.append("path")
			.attr("class", function(d) {
				return "countries " + d.properties.code3;
			})
			.attr("d", function(d) {
				return path(d);
			})
	console.log(countries)

	var geoData = map.selectAll(".states")
			.data(topojson.feature(geoData, geoData.objects.statesSimplified).features) //translates data into an array of geojson features. essentially creates a for-in loop. for element in data, do this. and this is defined by everything below.
			.enter()
			.append("path")
			.attr("class", function(d) {
				return "states " + d.properties.STATE_NAME;
			})
			.attr("d", function(d) {
				return path(d);
			})

	var centroid = map.selectAll(".centroid")
        .data(centroid.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", 'red')
		.attr("class", function(d){
			return "centroid "+d.properties.info_city;

		})

	var lakes = map.selectAll(".lakes")
			.data(topojson.feature(lakes, lakes.objects.GreatLakes).features) //translates data into an array of geojson features. essentially creates a for-in loop. for element in data, do this. and this is defined by everything below.
			.enter()
			.append("path")
			.attr("class", function(d) {
				return "lakes " + d.properties.name;
			})
			.attr("d", function(d) {
				return path(d);
			})	



	// d3.selectAll(".centroid")
	// 	.attr("height", 900)
	// 	.attr("cx", 900)
	// 	.attr("cy", 900)


      	
	console.log(states)	
    console.log(centroid)
 
}


var timeSlider =  d3.select('#slider7').call(d3.slider().axis(true).min(1970).max(2000).step(1));
 	timeSlider.on("slide", function() {
    	console.log(this.value)
    })


// var svg = d3.select("body")
//   .append("svg")
//   .attr("width", "100%")
//   .attr("height", "100%")
//   .call(d3.behavior.zoom().on("zoom", function () {
//     svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
//   }))
//   .append("g")


	}

