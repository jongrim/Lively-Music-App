'use strict';

var GoogleMap = (function() {
  var $mapContent, mapMarkers, map, bounds;

  function init() {
    $mapContent = $('#content');
    $mapContent.height(window.innerHeight / 2);
    mapMarkers = [];
  }

  function processEventResults(json) {
    console.log('Maps got these results', json);
    let events = json._embedded.events;
    let eventObjects = events.map(event => {
      return {
        name: event.name,
        type: event.type,
        url: event.url,
        startDate: event.dates.start.localDate,
        venue: {
          name: event._embedded.venues[0].name,
          url: event._embedded.venues[0].url,
          location: event._embedded.venues[0].location
        }
      };
    });
    console.log(eventObjects);
    deleteMarkers();
    makeEventMarkers(eventObjects);
    setMarkers();
    resizeMap();
  }

  function makeEventMarkers(events) {
    mapMarkers = events
      .filter(event => {
        if (event.venue.location) {
          return event;
        }
      })
      .map(event => {
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            Number(event.venue.location.latitude),
            Number(event.venue.location.longitude)
          )
        });

        let infoWindow = new google.maps.InfoWindow({ content: makeEventInfoWindow(event) });

        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
        return marker;
      });
  }

  function makeEventInfoWindow(event) {
    return `<h5 class='text-center'>${event.name}</h5>`;
  }

  function setMarkers() {
    if (mapMarkers.length < 1) {
      console.error('Nothin in map markers!');
      return;
    }
    mapMarkers.forEach(marker => marker.setMap(map));
  }

  function deleteMarkers() {
    if (mapMarkers.length < 1) {
      return;
    }
    mapMarkers.forEach(marker => marker.setMap(null));
    mapMarkers = [];
  }

  function resizeMap() {
    bounds = new google.maps.LatLngBounds();
    mapMarkers.forEach(marker => bounds.extend(marker.position));
    map.fitBounds(bounds);
  }

  function initMap() {
    // Map options - This is where the map starts
    var options = {
      zoom: 7,

      // This Lat and Long could be set as the intial page Lat and Long location
      center: { lat: 40.7128, lng: -74.0059 }
    };

    // New map
    map = new google.maps.Map(document.getElementById('content'), options);
  }
  EVT.on('init', init);
  EVT.on('eventResultsReturned', processEventResults);

  return {
    initMap: initMap
  };
})();
