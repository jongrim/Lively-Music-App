	//method: display list of concerts for venue, for artists
//parsing JSON data, what’s relevant

var Table = (function () {

	var eventObjects;

	function init() {
		console.log('tables initialized');
	}

	function createHTMLTable() {

		console.log('got here');
		



		for (var i = 0; i < eventObjects.length; i++) {

			var eName = eventObjects[i].name;
			var eCity = eventObjects[i].venue.city;
			var eVenue = eventObjects[i].venue.name;

		  $("#overflowContentTable").append("<tr><td>" + eName + "</td><td>" + eCity + "</td><td>" + eVenue + "</td></tr>");

		}

	}
	

	function processEventResults(json) {
	    console.log('tables got these results', json);

	    var events = json._embedded.events;
	    eventObjects = events.map(event => {
	      return {
	        name: event.name,
	        startDate: event.dates.start.localDate,
	        venue: {
	          name: event._embedded.venues[0].name,
	          city: event._embedded.venues[0].city.name
	        }
	      };
	    });
		createHTMLTable();
	}

EVT.on('eventResultsReturned', processEventResults);
EVT.on('init', init);

})();






