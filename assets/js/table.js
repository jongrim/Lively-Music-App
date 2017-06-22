'use strict';

var Table = (function() {
  var eventObjects, $tableDiv;

  function init() {
    $tableDiv = $('#overflowContent');
  }

  function showTable() {
    $tableDiv.fadeIn();
  }

  function hideTable() {
    $tableDiv.fadeOut();
  }

  function createHTMLTable() {
    for (var i = 0; i < eventObjects.length; i++) {
      var eName = eventObjects[i].name;
      var eCity = eventObjects[i].venue.city;
      var eVenue = eventObjects[i].venue.name;
      var eDate = moment(eventObjects[i].startDate).format('dddd, MMM Do YYYY');

      $('#overflowContentTable').append(
        '<tr><td>' + eName + '</td><td>' + eVenue + '</td><td>' + eCity + '</td><td>' + eDate + '</td></tr>'
      );
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
  EVT.on('eventResultsReturned', showTable);
  EVT.on('init', init);
})();
