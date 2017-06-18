'use strict';

var GoogleMap = (function() {
  var $mapContent;

  function init() {
    $mapContent = $('#content');
    $mapContent.height(window.innerHeight / 2);
  }

  function initMap() {
    // Map options - This is where the map starts
    var options = {
      zoom: 7,

      // This Lat and Long could be set as the intial page Lat and Long location
      center: { lat: 40.7128, lng: -74.0059 }
    };

    // New map
    var map = new google.maps.Map(document.getElementById('content'), options);

    // Array of markers
    var markers = [
      {
        coords: { lat: 42.4668, lng: -70.9495 },
        content: '<h2>Artist One</h2>'
      },
      {
        coords: { lat: 42.8584, lng: -70.93 },
        content: '<h2>Artist Two</h2>'
      },
      {
        coords: { lat: 42.7762, lng: -71.0773 },
        content: '<h2>Artist Three</h2>'
      }
    ];

    // Lat Lng adjustments
    var latlngbounds = new google.maps.LatLngBounds();

    // Loop through markers
    for (var i = 0; i < markers.length; i++) {
      // Add marker
      addMarker(markers[i]);

      // Pass on the new lat long to map to extend
      latlngbounds.extend(markers[i].coords);
    }

    // Resize map
    map.fitBounds(latlngbounds);

    // Add Marker Function
    function addMarker(props) {
      var marker = new google.maps.Marker({
        // position:props.coords,
        position: props.coords,

        // console.log(props.coords);
        map: map

        //icon:props.iconImage
      });

      // Check for customicon
      if (props.iconImage) {
        // Set icon image
        marker.setIcon(props.iconImage);
      }

      // Check content - We can add content to the Marker in Here
      if (props.content) {
        var infoWindow = new google.maps.InfoWindow({
          content: props.content
        });

        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
      }
    }
  }
  EVT.on('init', init);

  return {
    initMap: initMap
  };
})();
