'use strict';

var GoogleMap = (function() {
  var $mapContent, $mapContainer, mapMarkers, map, bounds, infoWindow;

  function init() {
    $mapContent = $('#map');
    $mapContainer = $('#content');
    mapMarkers = [];
    $(function() {
      $('#content').resizable({
        maxHeight: window.innerHeight / 10 * 3.5,
        minHeight: 150,
        minWidth: window.innerWidth,
        maxWidth: window.innerWidth,
        ghost: true
      });
    });
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
        image: event.images[2].url,
        venue: {
          name: event._embedded.venues[0].name,
          url: event._embedded.venues[0].url,
          location: event._embedded.venues[0].location
        }
      };
    });
    displayMap();
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

        marker.addListener('click', function() {
          infoWindow.close();
          infoWindow.setContent(makeEventInfoWindow(event));
          infoWindow.open(map, marker);
        });
        return marker;
      });
  }

  function makeEventInfoWindow(event) {
    return (
      `<div class="row infoWindow">` +
      `<div class="col-xs-12">` +
      `<div class="thumbnail">` +
      `<h5 class="text-center" id='eventName'>${event.name}</h5>` +
      `<img id='eventImage' src="${event.image}" alt="Image provided by Ticketmaster">` +
      `<div class="caption">` +
      `<div class="text-center">` +
      `<p id='startDate'><strong>Date:</strong> ${event.startDate}</p>` +
      `<p id='url'><a href="${event.url}">Ticketmaster Link</a></p>` +
      `</div>` +
      `</div>` +
      `</div>` +
      `</div>` +
      `</div>`
    );
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

  function displayMap() {
    if ($('#content:hidden').length === 0) {
      return;
    }
    $mapContainer.fadeIn();
    initMap();
  }

  function hideMap() {
    if ($('#content:hidden').length === 1) {
      return;
    }
    $mapContainer.hide();
  }

  function initMap() {
    // Map options - This is where the map starts
    var options = {
      zoom: 7,

      // This Lat and Long could be set as the intial page Lat and Long location
      center: { lat: 40.7128, lng: -74.0059 }
    };

    // New map
    map = new google.maps.Map(document.getElementById('map'), options);
    infoWindow = new google.maps.InfoWindow({});
  }
  EVT.on('init', init);
  EVT.on('resultsValid', processEventResults);
  EVT.on('resetToInitialView', hideMap);

  return {
    initMap: initMap
  };
})();
